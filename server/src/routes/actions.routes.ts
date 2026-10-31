import { Router, Request, Response } from "express";
import { Role } from "@prisma/client";
import { getPrisma } from "../prisma.js";
import { requireAuth, enforcePasswordChange } from "../middleware/auth.middleware.js";

export const ticketActionsRouter = Router();
export const actionsRouter = Router();

function requireAuthenticatedUser(req: Request, res: Response, next: () => void) {
  if (req.user) {
    if (req.user.mustChangePassword) {
      res.status(403).json({
        error: "Password change required before accessing the application",
        mustChangePassword: true,
      });
      return;
    }
    return next();
  }

  res.status(401).json({ error: "Authentication required" });
}

function requireStaffOrAdmin(req: Request, res: Response, next: () => void) {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (req.user.role !== Role.IT_STAFF && req.user.role !== Role.ADMINISTRATOR) {
    res.status(403).json({ error: "Access denied: insufficient permissions" });
    return;
  }
  next();
}

/**
 * GET /api/tickets/:id/actions
 * List Actions Taken for a ticket.
 * - Authenticated users.
 * - Requesters can only access their own tickets (403 if not owned).
 * - IT Staff and Admin can view any ticket.
 */
ticketActionsRouter.get("/:id/actions", requireAuthenticatedUser, async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId) || ticketId <= 0) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, requesterId: true },
    });

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    // Requester must own the ticket
    if (req.user!.role === Role.REQUESTER && ticket.requesterId !== req.user!.id) {
      res.status(403).json({ error: "Access denied: you do not own this ticket" });
      return;
    }

    const actions = await prisma.actionTaken.findMany({
      where: { ticketId },
      include: {
        performedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { actionDateTime: "asc" },
    });

    res.status(200).json(actions);
  } catch (error) {
    console.error("Error retrieving actions taken:", error);
    res.status(500).json({ error: "Failed to retrieve actions taken" });
  }
});

/**
 * POST /api/tickets/:id/actions
 * Create new Action Taken record for a ticket.
 * - Only IT Staff and Administrator allowed (403 for Requesters).
 */
ticketActionsRouter.post("/:id/actions", requireAuthenticatedUser, requireStaffOrAdmin, async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId) || ticketId <= 0) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, createdAt: true },
    });

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    // Verify caller active status
    const caller = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, isActive: true },
    });
    if (!caller || !caller.isActive) {
      res.status(422).json({ error: "Inactive users cannot record actions taken" });
      return;
    }

    const {
      description,
      result,
      followUpRequired,
      followUpNote,
      actionDateTime,
      attachmentNotes,
    } = req.body;

    // Validate description (3–2000 chars)
    if (!description || typeof description !== "string" || description.trim().length < 3 || description.trim().length > 2000) {
      res.status(422).json({
        error: "Validation failed",
        details: ["description: Must be a string between 3 and 2000 characters."],
      });
      return;
    }

    // Validate result (2–1000 chars)
    if (!result || typeof result !== "string" || result.trim().length < 2 || result.trim().length > 1000) {
      res.status(422).json({
        error: "Validation failed",
        details: ["result: Must be a string between 2 and 1000 characters."],
      });
      return;
    }

    const isFollowUp = Boolean(followUpRequired);
    let sanitizedFollowUpNote: string | null = null;

    if (isFollowUp) {
      if (!followUpNote || typeof followUpNote !== "string" || followUpNote.trim().length < 3 || followUpNote.trim().length > 1000) {
        res.status(422).json({
          error: "Validation failed",
          details: ["followUpNote: Mandatory (3-1000 characters) when followUpRequired is true."],
        });
        return;
      }
      sanitizedFollowUpNote = followUpNote.trim();
    }

    // Validate actionDateTime
    let parsedActionDateTime = new Date();
    if (actionDateTime) {
      const parsed = new Date(actionDateTime);
      if (isNaN(parsed.getTime())) {
        res.status(422).json({
          error: "Validation failed",
          details: ["actionDateTime: Must be a valid ISO DateTime string."],
        });
        return;
      }
      // Lower-bound check (BR-05): cannot be earlier than ticket creation date
      if (parsed.getTime() < ticket.createdAt.getTime()) {
        res.status(422).json({
          error: "Validation failed",
          details: ["actionDateTime: Cannot be earlier than ticket creation date."],
        });
        return;
      }
      // Future timestamp check with 60s tolerance for slight clock drift
      if (parsed.getTime() > Date.now() + 60000) {
        res.status(422).json({
          error: "Validation failed",
          details: ["actionDateTime: Cannot be in the future."],
        });
        return;
      }
      parsedActionDateTime = parsed;
    }

    // Validate attachmentNotes (max 500 chars)
    let sanitizedAttachmentNotes: string | null = null;
    if (attachmentNotes) {
      if (typeof attachmentNotes !== "string" || attachmentNotes.trim().length > 500) {
        res.status(422).json({
          error: "Validation failed",
          details: ["attachmentNotes: Must be a string with maximum 500 characters."],
        });
        return;
      }
      sanitizedAttachmentNotes = attachmentNotes.trim();
    }

    // Create ActionTaken and touch ticket updatedAt atomically via $transaction
    let newAction;
    if (typeof prisma.$transaction === "function") {
      [newAction] = await prisma.$transaction([
        prisma.actionTaken.create({
          data: {
            ticketId,
            performedById: caller.id,
            actionDateTime: parsedActionDateTime,
            description: description.trim(),
            result: result.trim(),
            followUpRequired: isFollowUp,
            followUpNote: sanitizedFollowUpNote,
            attachmentNotes: sanitizedAttachmentNotes,
          },
          include: {
            performedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        }),
        prisma.ticket.update({
          where: { id: ticketId },
          data: { updatedAt: new Date() },
        }),
      ]);
    } else {
      newAction = await prisma.actionTaken.create({
        data: {
          ticketId,
          performedById: caller.id,
          actionDateTime: parsedActionDateTime,
          description: description.trim(),
          result: result.trim(),
          followUpRequired: isFollowUp,
          followUpNote: sanitizedFollowUpNote,
          attachmentNotes: sanitizedAttachmentNotes,
        },
        include: {
          performedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { updatedAt: new Date() },
      });
    }

    res.status(201).json(newAction);
  } catch (error) {
    console.error("Error creating action taken:", error);
    res.status(500).json({ error: "Failed to create action taken" });
  }
});

/**
 * PATCH /api/actions/:id
 * Update an existing Action Taken record.
 * - Only IT Staff and Administrator allowed.
 * - Enforces mandatory knownUpdatedAt with 422 if missing.
 * - Enforces optimistic concurrency check with 409 if stale.
 */
actionsRouter.patch("/:id", requireAuthenticatedUser, requireStaffOrAdmin, async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const actionId = parseInt(req.params.id, 10);
    if (isNaN(actionId) || actionId <= 0) {
      res.status(400).json({ error: "Invalid action ID" });
      return;
    }

    // Verify caller active status
    const caller = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, isActive: true },
    });
    if (!caller || !caller.isActive) {
      res.status(422).json({ error: "Inactive users cannot update actions taken" });
      return;
    }

    const { knownUpdatedAt } = req.body;
    if (!knownUpdatedAt || typeof knownUpdatedAt !== "string") {
      res.status(422).json({
        error: "Validation failed: knownUpdatedAt is required",
        details: ["knownUpdatedAt: Field is mandatory to prevent stale updates."],
      });
      return;
    }

    const existingAction = await prisma.actionTaken.findUnique({
      where: { id: actionId },
      include: {
        performedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        ticket: {
          select: { id: true, createdAt: true },
        },
      },
    });

    if (!existingAction) {
      res.status(404).json({ error: "Action Taken record not found" });
      return;
    }

    // Concurrency check
    const clientTimestamp = new Date(knownUpdatedAt).getTime();
    const serverTimestamp = existingAction.updatedAt.getTime();
    if (isNaN(clientTimestamp) || clientTimestamp !== serverTimestamp) {
      res.status(409).json({
        error: "Conflict: The record has been modified by another user. Please refresh and try again.",
        currentUpdatedAt: existingAction.updatedAt.toISOString(),
      });
      return;
    }

    const {
      description,
      result,
      followUpRequired,
      followUpNote,
      attachmentNotes,
      actionDateTime,
    } = req.body;

    const dataToUpdate: any = {};

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length < 3 || description.trim().length > 2000) {
        res.status(422).json({
          error: "Validation failed",
          details: ["description: Must be a string between 3 and 2000 characters."],
        });
        return;
      }
      dataToUpdate.description = description.trim();
    }

    if (result !== undefined) {
      if (typeof result !== "string" || result.trim().length < 2 || result.trim().length > 1000) {
        res.status(422).json({
          error: "Validation failed",
          details: ["result: Must be a string between 2 and 1000 characters."],
        });
        return;
      }
      dataToUpdate.result = result.trim();
    }

    const targetFollowUpRequired = followUpRequired !== undefined
      ? Boolean(followUpRequired)
      : existingAction.followUpRequired;

    if (followUpRequired !== undefined) {
      dataToUpdate.followUpRequired = targetFollowUpRequired;
    }

    if (targetFollowUpRequired) {
      const noteCandidate = followUpNote !== undefined ? followUpNote : existingAction.followUpNote;
      if (!noteCandidate || typeof noteCandidate !== "string" || noteCandidate.trim().length < 3 || noteCandidate.trim().length > 1000) {
        res.status(422).json({
          error: "Validation failed",
          details: ["followUpNote: Mandatory (3-1000 characters) when followUpRequired is true."],
        });
        return;
      }
      dataToUpdate.followUpNote = noteCandidate.trim();
    } else {
      dataToUpdate.followUpNote = null;
    }

    if (actionDateTime !== undefined) {
      const parsed = new Date(actionDateTime);
      if (isNaN(parsed.getTime())) {
        res.status(422).json({
          error: "Validation failed",
          details: ["actionDateTime: Must be a valid ISO DateTime string."],
        });
        return;
      }
      // Lower-bound check (BR-05): cannot be earlier than ticket creation date
      if (parsed.getTime() < existingAction.ticket.createdAt.getTime()) {
        res.status(422).json({
          error: "Validation failed",
          details: ["actionDateTime: Cannot be earlier than ticket creation date."],
        });
        return;
      }
      if (parsed.getTime() > Date.now() + 60000) {
        res.status(422).json({
          error: "Validation failed",
          details: ["actionDateTime: Cannot be in the future."],
        });
        return;
      }
      dataToUpdate.actionDateTime = parsed;
    }

    if (attachmentNotes !== undefined) {
      if (attachmentNotes === null || attachmentNotes === "") {
        dataToUpdate.attachmentNotes = null;
      } else if (typeof attachmentNotes !== "string" || attachmentNotes.trim().length > 500) {
        res.status(422).json({
          error: "Validation failed",
          details: ["attachmentNotes: Must be a string with maximum 500 characters."],
        });
        return;
      } else {
        dataToUpdate.attachmentNotes = attachmentNotes.trim();
      }
    }

    const updatedAction = await prisma.actionTaken.update({
      where: { id: actionId },
      data: dataToUpdate,
      include: {
        performedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    res.status(200).json(updatedAction);
  } catch (error) {
    console.error("Error updating action taken:", error);
    res.status(500).json({ error: "Failed to update action taken" });
  }
});

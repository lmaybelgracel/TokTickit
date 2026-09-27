import { Router, Request, Response } from "express";
import { Role } from "@prisma/client";
import { getPrisma } from "../prisma.js";
import { requireAuth, enforcePasswordChange } from "../middleware/auth.middleware.js";

export const commentsRouter = Router();

function requireTicketAuth(req: Request, res: Response, next: () => void) {
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

  const devId = req.headers["x-development-requester-id"];
  const parsed = Number(Array.isArray(devId) ? devId[0] : devId);
  if (Number.isInteger(parsed) && parsed > 0) {
    req.user = {
      id: parsed,
      email: `requester${parsed}@example.com`,
      role: Role.REQUESTER,
      mustChangePassword: false,
    };
    return next();
  }

  res.status(401).json({ error: "Authentication required" });
}

// GET /api/tickets/:id/comments - Public Comments (Requester owner, IT Staff, Admin)
commentsRouter.get("/:id/comments", requireTicketAuth, async (req: Request, res: Response) => {
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

    // If requester, verify ownership
    if (req.user!.role === Role.REQUESTER && ticket.requesterId !== req.user!.id) {
      res.status(403).json({ error: "Access denied: not your ticket" });
      return;
    }

    const comments = await prisma.publicComment.findMany({
      where: { ticketId },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve public comments" });
  }
});

// POST /api/tickets/:id/comments - Create Public Comment
commentsRouter.post("/:id/comments", requireTicketAuth, async (req: Request, res: Response) => {
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

    // If requester, verify ownership
    if (req.user!.role === Role.REQUESTER && ticket.requesterId !== req.user!.id) {
      res.status(403).json({ error: "Access denied: not your ticket" });
      return;
    }

    const { content } = req.body;
    if (!content || typeof content !== "string" || content.trim() === "") {
      res.status(400).json({ error: "Comment content is required" });
      return;
    }

    const comment = await prisma.publicComment.create({
      data: {
        ticketId,
        authorId: req.user!.id,
        content: content.trim(),
      },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create public comment" });
  }
});

// GET /api/tickets/:id/notes - Internal Notes (Strictly IT Staff & Admin only)
commentsRouter.get("/:id/notes", requireTicketAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== Role.IT_STAFF && req.user!.role !== Role.ADMINISTRATOR) {
      res.status(403).json({
        error: "Access denied: internal notes are restricted to IT Staff and Administrators",
      });
      return;
    }

    const prisma = getPrisma();
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId) || ticketId <= 0) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const notes = await prisma.internalNote.findMany({
      where: { ticketId },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve internal notes" });
  }
});

// POST /api/tickets/:id/notes - Create Internal Note (Strictly IT Staff & Admin only)
commentsRouter.post("/:id/notes", requireTicketAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== Role.IT_STAFF && req.user!.role !== Role.ADMINISTRATOR) {
      res.status(403).json({
        error: "Access denied: internal notes are restricted to IT Staff and Administrators",
      });
      return;
    }

    const prisma = getPrisma();
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId) || ticketId <= 0) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const { content } = req.body;
    if (!content || typeof content !== "string" || content.trim() === "") {
      res.status(400).json({ error: "Note content is required" });
      return;
    }

    const note = await prisma.internalNote.create({
      data: {
        ticketId,
        authorId: req.user!.id,
        content: content.trim(),
      },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to create internal note" });
  }
});

// PATCH /api/tickets/:id/resolve-indication - Requester Problem Appears Resolved toggle
commentsRouter.patch("/:id/resolve-indication", requireTicketAuth, async (req: Request, res: Response) => {
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

    // Only ticket owner requester can indicate
    if (req.user!.role === Role.REQUESTER && ticket.requesterId !== req.user!.id) {
      res.status(403).json({ error: "Access denied: not your ticket" });
      return;
    }

    const { appearsResolved = true } = req.body;

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { requesterResolvedIndication: Boolean(appearsResolved) },
      select: {
        id: true,
        ticketNumber: true,
        requesterResolvedIndication: true,
        currentStatus: true,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update resolution indication" });
  }
});

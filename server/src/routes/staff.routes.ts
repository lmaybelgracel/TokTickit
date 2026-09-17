import { Router, Request, Response } from "express";
import { Role, Priority, TicketStatus, Prisma } from "@prisma/client";
import { getPrisma } from "../prisma.js";
import { requireAuth, enforcePasswordChange, requireRole } from "../middleware/auth.middleware.js";

export const staffRouter = Router();

staffRouter.use(requireAuth);
staffRouter.use(enforcePasswordChange);
staffRouter.use(requireRole(Role.IT_STAFF, Role.ADMINISTRATOR));

// GET /api/staff/tickets - Shared IT Staff Queue
staffRouter.get("/tickets", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const {
      search,
      category,
      status,
      priority,
      itPriority,
      ownerId,
      sort = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.TicketWhereInput = {};

    // Case-insensitive search on ticketNumber or summary
    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { ticketNumber: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }

    // Category filter
    if (category) {
      const catId = parseInt(String(category), 10);
      if (!isNaN(catId) && catId > 0) {
        where.categoryId = catId;
      }
    }

    // Status filter
    if (status && typeof status === "string" && status.trim() !== "") {
      const upperStatus = status.trim().toUpperCase();
      if (Object.values(TicketStatus).includes(upperStatus as TicketStatus)) {
        where.currentStatus = upperStatus as TicketStatus;
      }
    }

    // Priority filter (Requested Priority)
    if (priority && typeof priority === "string" && priority.trim() !== "") {
      const upperPri = priority.trim().toUpperCase();
      if (Object.values(Priority).includes(upperPri as Priority)) {
        where.requestedPriority = upperPri as Priority;
      }
    }

    // IT Priority filter
    if (itPriority && typeof itPriority === "string" && itPriority.trim() !== "") {
      const upperItPri = itPriority.trim().toUpperCase();
      if (Object.values(Priority).includes(upperItPri as Priority)) {
        where.itPriority = upperItPri as Priority;
      }
    }

    // Ownership filter
    if (ownerId !== undefined && ownerId !== null && String(ownerId).trim() !== "") {
      const ownerStr = String(ownerId).trim().toLowerCase();
      if (ownerStr === "unassigned") {
        where.ownerId = null;
      } else if (ownerStr === "me" && req.user) {
        where.ownerId = req.user.id;
      } else {
        const parsedId = parseInt(ownerStr, 10);
        if (!isNaN(parsedId)) {
          where.ownerId = parsedId;
        }
      }
    }

    // Sorting
    const sortField = String(sort).trim();
    const sortOrder: Prisma.SortOrder = String(order).toLowerCase() === "asc" ? "asc" : "desc";
    let orderBy: Prisma.TicketOrderByWithRelationInput = { createdAt: sortOrder };

    if (sortField === "itPriority") {
      orderBy = { itPriority: sortOrder };
    } else if (sortField === "currentStatus") {
      orderBy = { currentStatus: sortOrder };
    } else if (sortField === "ticketNumber") {
      orderBy = { ticketNumber: sortOrder };
    } else if (sortField === "createdAt") {
      orderBy = { createdAt: sortOrder };
    }

    const [total, tickets] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        select: {
          id: true,
          ticketNumber: true,
          summary: true,
          description: true,
          requestedPriority: true,
          itPriority: true,
          currentStatus: true,
          resolutionSummary: true,
          requesterResolvedIndication: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: { id: true, name: true },
          },
          relatedSystem: {
            select: { id: true, name: true },
          },
          requester: {
            select: { id: true, name: true, email: true },
          },
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    res.status(200).json({
      tickets,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve IT staff ticket queue" });
  }
});

// GET /api/staff/users - Active IT Staff and Administrators for assignment
staffRouter.get("/users", async (_req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        role: { in: [Role.IT_STAFF, Role.ADMINISTRATOR] },
      },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve staff roster" });
  }
});

// GET /api/staff/tickets/:id - Detailed Ticket View for Staff
staffRouter.get("/tickets/:id", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId) || ticketId <= 0) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        category: { select: { id: true, name: true, description: true } },
        relatedSystem: { select: { id: true, name: true, category: true } },
        requester: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true, role: true } },
        attachments: {
          where: { isRemoved: false },
          select: { id: true, filename: true, fileSize: true, mimeType: true, isRemoved: true, uploadedAt: true },
        },
        comments: {
          include: {
            author: { select: { id: true, name: true, email: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        notes: {
          include: {
            author: { select: { id: true, name: true, email: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve ticket details" });
  }
});

// PATCH /api/staff/tickets/:id/claim - Claim ownership
staffRouter.patch("/tickets/:id/claim", async (req: Request, res: Response) => {
  try {
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

    const nextStatus = ticket.currentStatus === TicketStatus.NEW ? TicketStatus.OPEN : ticket.currentStatus;

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ownerId: req.user!.id,
        currentStatus: nextStatus,
      },
      include: {
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to claim ticket" });
  }
});

// PATCH /api/staff/tickets/:id/assign - Reassign ticket owner
staffRouter.patch("/tickets/:id/assign", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId) || ticketId <= 0) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const { ownerId } = req.body;
    const parsedOwnerId = parseInt(String(ownerId), 10);
    if (isNaN(parsedOwnerId) || parsedOwnerId <= 0) {
      res.status(400).json({ error: "Valid ownerId is required" });
      return;
    }

    // Verify target user is active IT Staff or Administrator
    const targetUser = await prisma.user.findUnique({
      where: { id: parsedOwnerId },
      select: { id: true, isActive: true, role: true },
    });

    if (!targetUser || !targetUser.isActive || (targetUser.role !== Role.IT_STAFF && targetUser.role !== Role.ADMINISTRATOR)) {
      res.status(400).json({ error: "Target owner must be an active IT Staff or Administrator" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const nextStatus = ticket.currentStatus === TicketStatus.NEW ? TicketStatus.OPEN : ticket.currentStatus;

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ownerId: parsedOwnerId,
        currentStatus: nextStatus,
      },
      include: {
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign ticket" });
  }
});

// PATCH /api/staff/tickets/:id/priority - Update IT Priority
staffRouter.patch("/tickets/:id/priority", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId) || ticketId <= 0) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const { itPriority } = req.body;
    if (!itPriority || typeof itPriority !== "string") {
      res.status(400).json({ error: "itPriority is required" });
      return;
    }

    const upperPri = itPriority.trim().toUpperCase();
    if (!Object.values(Priority).includes(upperPri as Priority)) {
      res.status(400).json({ error: "Invalid IT Priority value" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { itPriority: upperPri as Priority },
      include: {
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update IT Priority" });
  }
});

// BR-19 State Transition Matrix
const ALLOWED_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  NEW: [TicketStatus.OPEN, TicketStatus.CANCELLED],
  OPEN: [TicketStatus.IN_PROGRESS, TicketStatus.WAITING_FOR_REQUESTER, TicketStatus.CANCELLED],
  IN_PROGRESS: [TicketStatus.WAITING_FOR_REQUESTER, TicketStatus.CANCELLED], // RESOLVED requires resolutionSummary via /resolve
  WAITING_FOR_REQUESTER: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED], // RESOLVED requires resolutionSummary via /resolve
  RESOLVED: [TicketStatus.CLOSED, TicketStatus.REOPENED],
  CLOSED: [TicketStatus.REOPENED],
  REOPENED: [TicketStatus.IN_PROGRESS, TicketStatus.WAITING_FOR_REQUESTER, TicketStatus.CANCELLED],
  CANCELLED: [],
};

// PATCH /api/staff/tickets/:id/status - Transition Status per BR-19
staffRouter.patch("/tickets/:id/status", async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const ticketId = parseInt(req.params.id, 10);
    if (isNaN(ticketId) || ticketId <= 0) {
      res.status(400).json({ error: "Invalid ticket ID" });
      return;
    }

    const { status } = req.body;
    if (!status || typeof status !== "string") {
      res.status(400).json({ error: "status is required" });
      return;
    }

    const upperStatus = status.trim().toUpperCase();

    // Guard: Direct transition to RESOLVED via general status endpoint is strictly rejected per BR-20
    if (upperStatus === TicketStatus.RESOLVED) {
      res.status(422).json({
        error: "Direct transition to RESOLVED via general status endpoint is not permitted. Please use PATCH /api/staff/tickets/:id/resolve with resolution summary.",
      });
      return;
    }

    if (!Object.values(TicketStatus).includes(upperStatus as TicketStatus)) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    const allowed = ALLOWED_STATUS_TRANSITIONS[ticket.currentStatus] || [];
    if (!allowed.includes(upperStatus as TicketStatus)) {
      res.status(400).json({
        error: `Invalid status transition from ${ticket.currentStatus} to ${upperStatus}`,
      });
      return;
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { currentStatus: upperStatus as TicketStatus },
      include: {
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update ticket status" });
  }
});

// PATCH /api/staff/tickets/:id/resolve - Resolve with Mandatory Resolution Summary (BR-19, BR-20)
staffRouter.patch("/tickets/:id/resolve", async (req: Request, res: Response) => {
  try {
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

    // Permitted to resolve only from IN_PROGRESS, WAITING_FOR_REQUESTER, or REOPENED
    const permittable: TicketStatus[] = [
      TicketStatus.IN_PROGRESS,
      TicketStatus.WAITING_FOR_REQUESTER,
      TicketStatus.REOPENED,
    ];
    if (!permittable.includes(ticket.currentStatus)) {
      res.status(400).json({
        error: `Cannot resolve ticket from current status: ${ticket.currentStatus}`,
      });
      return;
    }

    const { resolutionSummary } = req.body;
    if (
      !resolutionSummary ||
      typeof resolutionSummary !== "string" ||
      resolutionSummary.trim().length < 3 ||
      resolutionSummary.trim().length > 500
    ) {
      res.status(422).json({
        error: "Resolution summary is required and must be between 3 and 500 characters",
      });
      return;
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        currentStatus: TicketStatus.RESOLVED,
        resolutionSummary: resolutionSummary.trim(),
      },
      include: {
        category: { select: { id: true, name: true } },
        relatedSystem: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true, email: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve ticket" });
  }
});

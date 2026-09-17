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

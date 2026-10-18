import { Router, Request, Response } from "express";
import { getPrisma } from "../prisma.js";
import { requireAuth, enforcePasswordChange, requireRole } from "../middleware/auth.middleware.js";
import { Role, Priority, TicketStatus } from "@prisma/client";

export const dashboardRouter = Router();

// Apply auth and password change enforcement across dashboard routes
dashboardRouter.use(requireAuth);
dashboardRouter.use(enforcePasswordChange);

export const OPEN_STATUSES: TicketStatus[] = [
  TicketStatus.NEW,
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.WAITING_FOR_REQUESTER,
  TicketStatus.REOPENED,
];

export const TERMINAL_STATUSES: TicketStatus[] = [
  TicketStatus.CLOSED,
  TicketStatus.CANCELLED,
];

export const RESOLVED_OR_CLOSED: TicketStatus[] = [
  TicketStatus.RESOLVED,
  TicketStatus.CLOSED,
];

/**
 * 3.1 Requester Dashboard Handler
 * Computes metrics strictly isolated to requesterId = caller.id
 */
export async function handleRequesterDashboard(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const requesterId = req.user!.id;

    // 1. totalOpenTickets: count where requesterId = caller.id and currentStatus in OPEN_STATUSES
    const totalOpenTickets = await prisma.ticket.count({
      where: {
        requesterId,
        currentStatus: { in: OPEN_STATUSES },
      },
    });

    // 2. waitingForRequester: count where requesterId = caller.id and currentStatus = WAITING_FOR_REQUESTER
    const waitingForRequester = await prisma.ticket.count({
      where: {
        requesterId,
        currentStatus: TicketStatus.WAITING_FOR_REQUESTER,
      },
    });

    // 3. resolvedOrClosed: count where requesterId = caller.id and currentStatus in RESOLVED_OR_CLOSED
    const resolvedOrClosed = await prisma.ticket.count({
      where: {
        requesterId,
        currentStatus: { in: RESOLVED_OR_CLOSED },
      },
    });

    // 4. recentTickets / recentlyUpdated: Up to 5 tickets where requesterId = caller.id, sorted by updatedAt DESC
    const recentTickets = await prisma.ticket.findMany({
      where: { requesterId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        ticketNumber: true,
        summary: true,
        currentStatus: true,
        requestedPriority: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    // 5. recentlyResolved: Up to 5 tickets where requesterId = caller.id and currentStatus in RESOLVED_OR_CLOSED, sorted by updatedAt DESC
    const recentlyResolvedRaw = await prisma.ticket.findMany({
      where: {
        requesterId,
        currentStatus: { in: RESOLVED_OR_CLOSED },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        ticketNumber: true,
        summary: true,
        currentStatus: true,
        resolutionSummary: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    const recentlyResolved = recentlyResolvedRaw.map((t) => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      summary: t.summary,
      currentStatus: t.currentStatus,
      resolutionSummary: t.resolutionSummary,
      resolvedAt: t.updatedAt,
      updatedAt: t.updatedAt,
    }));

    res.status(200).json({
      metrics: {
        totalOpenTickets,
        waitingForRequester,
        resolvedOrClosed,
      },
      recentTickets,
      recentlyUpdated: recentTickets,
      recentlyResolved,
    });
  } catch (error) {
    console.error("Failed to fetch requester dashboard:", error);
    res.status(500).json({ error: "Failed to retrieve requester dashboard" });
  }
}

/**
 * 3.2 IT Staff & Administrator Dashboard Handler
 * Computes queue operational metrics and admin stats directly from database
 */
export async function handleStaffDashboard(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const callerId = req.user!.id;
    const isAdmin = req.user!.role === Role.ADMINISTRATOR;

    // 1. unassignedTickets: count where ownerId IS NULL and currentStatus NOT IN (CLOSED, CANCELLED)
    const unassignedTickets = await prisma.ticket.count({
      where: {
        ownerId: null,
        currentStatus: { notIn: TERMINAL_STATUSES },
      },
    });

    // 2. myAssignedTickets: count where ownerId = caller.id and currentStatus NOT IN (CLOSED, CANCELLED)
    const myAssignedTickets = await prisma.ticket.count({
      where: {
        ownerId: callerId,
        currentStatus: { notIn: TERMINAL_STATUSES },
      },
    });

    // 3. myActionsTakenCount: count of ActionTaken records where performedById = caller.id
    const myActionsTakenCount = await prisma.actionTaken.count({
      where: {
        performedById: callerId,
      },
    });

    // 4. urgentTickets / urgentOpenTickets: count where itPriority = URGENT and currentStatus NOT IN (RESOLVED, CLOSED, CANCELLED)
    const urgentTickets = await prisma.ticket.count({
      where: {
        itPriority: Priority.URGENT,
        currentStatus: { notIn: [TicketStatus.RESOLVED, TicketStatus.CLOSED, TicketStatus.CANCELLED] },
      },
    });

    // 5. waitingForRequester: count where currentStatus = WAITING_FOR_REQUESTER
    const waitingForRequester = await prisma.ticket.count({
      where: {
        currentStatus: TicketStatus.WAITING_FOR_REQUESTER,
      },
    });

    // 6. totalActiveTickets: count where currentStatus NOT IN (CLOSED, CANCELLED)
    const totalActiveTickets = await prisma.ticket.count({
      where: {
        currentStatus: { notIn: TERMINAL_STATUSES },
      },
    });

    // 7. statusDistribution: aggregate counts for all statuses
    const statusDistribution: Record<TicketStatus, number> = {
      [TicketStatus.NEW]: 0,
      [TicketStatus.OPEN]: 0,
      [TicketStatus.IN_PROGRESS]: 0,
      [TicketStatus.WAITING_FOR_REQUESTER]: 0,
      [TicketStatus.RESOLVED]: 0,
      [TicketStatus.CLOSED]: 0,
      [TicketStatus.REOPENED]: 0,
      [TicketStatus.CANCELLED]: 0,
    };

    const statusGroups = await prisma.ticket.groupBy({
      by: ["currentStatus"],
      _count: {
        _all: true,
      },
    });

    for (const group of statusGroups) {
      if (group.currentStatus in statusDistribution) {
        statusDistribution[group.currentStatus] = group._count._all;
      }
    }

    // 8. priorityDistribution (BR-17): aggregate counts grouped by itPriority for all ACTIVE tickets
    const priorityDistribution: Record<Priority, number> = {
      [Priority.LOW]: 0,
      [Priority.MEDIUM]: 0,
      [Priority.HIGH]: 0,
      [Priority.URGENT]: 0,
    };

    const priorityGroups = await prisma.ticket.groupBy({
      by: ["itPriority"],
      where: {
        currentStatus: { notIn: TERMINAL_STATUSES },
      },
      _count: {
        _all: true,
      },
    });

    for (const group of priorityGroups) {
      if (group.itPriority in priorityDistribution) {
        priorityDistribution[group.itPriority] = group._count._all;
      }
    }

    // 9. recentQueueActivity / recentQueueTickets: Up to 5 tickets, sorted by updatedAt DESC
    const recentQueueActivity = await prisma.ticket.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        ticketNumber: true,
        summary: true,
        currentStatus: true,
        itPriority: true,
        requestedPriority: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedAt: true,
        createdAt: true,
      },
    });

    // 10. adminStats (included for ADMINISTRATOR, omitted or null for IT_STAFF)
    let adminStats: {
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      roleCounts: Record<Role, number>;
    } | null = null;

    if (isAdmin) {
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({ where: { isActive: true } });
      const inactiveUsers = await prisma.user.count({ where: { isActive: false } });

      const roleCounts: Record<Role, number> = {
        [Role.ADMINISTRATOR]: 0,
        [Role.IT_STAFF]: 0,
        [Role.REQUESTER]: 0,
      };

      const roleGroups = await prisma.user.groupBy({
        by: ["role"],
        _count: {
          _all: true,
        },
      });

      for (const rg of roleGroups) {
        if (rg.role in roleCounts) {
          roleCounts[rg.role] = rg._count._all;
        }
      }

      adminStats = {
        totalUsers,
        activeUsers,
        inactiveUsers,
        roleCounts,
      };
    }

    res.status(200).json({
      metrics: {
        unassignedTickets,
        myAssignedTickets,
        myActionsTakenCount,
        urgentTickets,
        urgentOpenTickets: urgentTickets,
        waitingForRequester,
        totalActiveTickets,
      },
      statusDistribution,
      statusCounts: statusDistribution,
      priorityDistribution,
      priorityCounts: priorityDistribution,
      recentQueueActivity,
      recentQueueTickets: recentQueueActivity,
      adminStats,
    });
  } catch (error) {
    console.error("Failed to fetch staff dashboard:", error);
    res.status(500).json({ error: "Failed to retrieve staff dashboard" });
  }
}

// Router mounts
dashboardRouter.get("/requester", requireRole(Role.REQUESTER), handleRequesterDashboard);
dashboardRouter.get("/staff", requireRole(Role.IT_STAFF, Role.ADMINISTRATOR), handleStaffDashboard);
dashboardRouter.get("/admin", requireRole(Role.ADMINISTRATOR), handleStaffDashboard);

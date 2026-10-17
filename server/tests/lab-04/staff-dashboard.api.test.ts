import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role, Priority, TicketStatus } from "@prisma/client";

describe("Sprint 4 IT Staff & Administrator Dashboard API Suite (Issue 32, API-DASH-02, API-DASH-03, API-DASH-04, AC-05, BR-15, BR-17, BR-18)", () => {
  const staffUser = {
    userId: 12,
    email: "somchai.it@toktickit.com",
    role: Role.IT_STAFF,
    mustChangePassword: false,
  };

  const adminUser = {
    userId: 1,
    email: "admin@toktickit.com",
    role: Role.ADMINISTRATOR,
    mustChangePassword: false,
  };

  const requesterUser = {
    userId: 44,
    email: "clara.requester@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const staffToken = generateToken(staffUser);
  const adminToken = generateToken(adminUser);
  const requesterToken = generateToken(requesterUser);

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      ticket: {
        count: vi.fn(),
        groupBy: vi.fn(),
        findMany: vi.fn(),
      },
      actionTaken: {
        count: vi.fn(),
      },
      user: {
        count: vi.fn(),
        groupBy: vi.fn(),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma);
  });

  describe("Authentication & Role Authorization Guards", () => {
    it("rejects unauthenticated requests with 401 Unauthorized", async () => {
      const res = await request(app).get("/api/dashboard/staff");
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it("rejects REQUESTER role with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/dashboard/staff")
        .set("Authorization", `Bearer ${requesterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/insufficient permissions/i);
    });

    it("rejects staff member requiring password change with 403", async () => {
      const unverifiedToken = generateToken({
        ...staffUser,
        mustChangePassword: true,
      });

      const res = await request(app)
        .get("/api/dashboard/staff")
        .set("Authorization", `Bearer ${unverifiedToken}`);

      expect(res.status).toBe(403);
      expect(res.body.mustChangePassword).toBe(true);
    });
  });

  describe("API-DASH-02: IT Staff Dashboard calculates queue metrics (AC-05, BR-15, BR-17)", () => {
    it("returns authoritative metrics, status and priority distribution for IT Staff caller", async () => {
      // Mock ticket.count calls:
      // 1. unassignedTickets = 4
      // 2. myAssignedTickets = 6
      // 4. urgentTickets = 2
      // 5. waitingForRequester = 5
      // 6. totalActiveTickets = 17
      mockPrisma.ticket.count
        .mockResolvedValueOnce(4)  // unassigned
        .mockResolvedValueOnce(6)  // myAssigned
        .mockResolvedValueOnce(2)  // urgent
        .mockResolvedValueOnce(5)  // waitingForRequester
        .mockResolvedValueOnce(17); // totalActiveTickets

      // 3. actionTaken.count = 8
      mockPrisma.actionTaken.count.mockResolvedValueOnce(8);

      // 7. ticket.groupBy by currentStatus
      mockPrisma.ticket.groupBy
        .mockResolvedValueOnce([
          { currentStatus: TicketStatus.NEW, _count: { _all: 4 } },
          { currentStatus: TicketStatus.OPEN, _count: { _all: 5 } },
          { currentStatus: TicketStatus.IN_PROGRESS, _count: { _all: 6 } },
          { currentStatus: TicketStatus.WAITING_FOR_REQUESTER, _count: { _all: 5 } },
          { currentStatus: TicketStatus.RESOLVED, _count: { _all: 8 } },
          { currentStatus: TicketStatus.CLOSED, _count: { _all: 14 } },
          { currentStatus: TicketStatus.REOPENED, _count: { _all: 1 } },
          { currentStatus: TicketStatus.CANCELLED, _count: { _all: 2 } },
        ])
        // 8. ticket.groupBy by itPriority
        .mockResolvedValueOnce([
          { itPriority: Priority.LOW, _count: { _all: 3 } },
          { itPriority: Priority.MEDIUM, _count: { _all: 7 } },
          { itPriority: Priority.HIGH, _count: { _all: 5 } },
          { itPriority: Priority.URGENT, _count: { _all: 2 } },
        ]);

      // 9. ticket.findMany for recentQueueActivity
      mockPrisma.ticket.findMany.mockResolvedValueOnce([
        {
          id: 145,
          ticketNumber: "TKT-2026-000145",
          summary: "Payroll portal login failing with 500 error",
          currentStatus: TicketStatus.IN_PROGRESS,
          itPriority: Priority.URGENT,
          requestedPriority: Priority.HIGH,
          owner: { id: 12, name: "Somchai Staff" },
          updatedAt: new Date("2026-10-15T11:45:00.000Z"),
          createdAt: new Date("2026-10-15T08:00:00.000Z"),
        },
      ]);

      const res = await request(app)
        .get("/api/dashboard/staff")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);

      // Verify metrics
      expect(res.body.metrics).toEqual({
        unassignedTickets: 4,
        myAssignedTickets: 6,
        myActionsTakenCount: 8,
        urgentTickets: 2,
        urgentOpenTickets: 2,
        waitingForRequester: 5,
        totalActiveTickets: 17,
      });

      // Verify status distribution has all 8 statuses
      expect(res.body.statusDistribution).toEqual({
        NEW: 4,
        OPEN: 5,
        IN_PROGRESS: 6,
        WAITING_FOR_REQUESTER: 5,
        RESOLVED: 8,
        CLOSED: 14,
        REOPENED: 1,
        CANCELLED: 2,
      });

      // Verify priority distribution has all 4 priorities
      expect(res.body.priorityDistribution).toEqual({
        LOW: 3,
        MEDIUM: 7,
        HIGH: 5,
        URGENT: 2,
      });

      // Verify recent activity
      expect(res.body.recentQueueActivity).toHaveLength(1);
      expect(res.body.recentQueueActivity[0].ticketNumber).toBe("TKT-2026-000145");
      expect(res.body.recentQueueActivity[0].owner.name).toBe("Somchai Staff");

      // Verify adminStats is null for IT_STAFF
      expect(res.body.adminStats).toBeNull();
    });

    it("supports direct route alias /api/staff/dashboard", async () => {
      mockPrisma.ticket.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockPrisma.actionTaken.count.mockResolvedValueOnce(0);
      mockPrisma.ticket.groupBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      mockPrisma.ticket.findMany.mockResolvedValueOnce([]);

      const res = await request(app)
        .get("/api/staff/dashboard")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(res.body.metrics.unassignedTickets).toBe(0);
    });
  });

  describe("API-DASH-04: Current-user Actions Taken count calculation (AC-05, BR-17)", () => {
    it("filters actionTaken.count by the authenticated staff member's id", async () => {
      mockPrisma.ticket.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(3);

      mockPrisma.actionTaken.count.mockResolvedValueOnce(15);
      mockPrisma.ticket.groupBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      mockPrisma.ticket.findMany.mockResolvedValueOnce([]);

      const res = await request(app)
        .get("/api/dashboard/staff")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(res.body.metrics.myActionsTakenCount).toBe(15);

      // Verify actionTaken count was queried with performedById = 12
      expect(mockPrisma.actionTaken.count).toHaveBeenCalledWith({
        where: { performedById: 12 },
      });
    });
  });

  describe("API-DASH-03: Administrator Dashboard includes user statistics (AC-05, BR-18)", () => {
    it("populates adminStats with user and role breakdowns when caller is ADMINISTRATOR", async () => {
      mockPrisma.ticket.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(8);

      mockPrisma.actionTaken.count.mockResolvedValueOnce(4);
      mockPrisma.ticket.groupBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
      mockPrisma.ticket.findMany.mockResolvedValueOnce([]);

      // Mock user queries for adminStats:
      mockPrisma.user.count
        .mockResolvedValueOnce(10) // totalUsers
        .mockResolvedValueOnce(9)  // activeUsers
        .mockResolvedValueOnce(1); // inactiveUsers

      mockPrisma.user.groupBy.mockResolvedValueOnce([
        { role: Role.ADMINISTRATOR, _count: { _all: 2 } },
        { role: Role.IT_STAFF, _count: { _all: 3 } },
        { role: Role.REQUESTER, _count: { _all: 5 } },
      ]);

      const res = await request(app)
        .get("/api/dashboard/staff")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.adminStats).toBeDefined();
      expect(res.body.adminStats).toEqual({
        totalUsers: 10,
        activeUsers: 9,
        inactiveUsers: 1,
        roleCounts: {
          ADMINISTRATOR: 2,
          IT_STAFF: 3,
          REQUESTER: 5,
        },
      });
    });

    it("supports dedicated /api/dashboard/admin and /api/admin/dashboard endpoints for Administrator", async () => {
      mockPrisma.ticket.count
        .mockResolvedValue(0);
      mockPrisma.actionTaken.count.mockResolvedValue(0);
      mockPrisma.ticket.groupBy.mockResolvedValue([]);
      mockPrisma.ticket.findMany.mockResolvedValue([]);

      mockPrisma.user.count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(0);

      mockPrisma.user.groupBy.mockResolvedValueOnce([
        { role: Role.ADMINISTRATOR, _count: { _all: 1 } },
        { role: Role.IT_STAFF, _count: { _all: 2 } },
        { role: Role.REQUESTER, _count: { _all: 2 } },
      ]);

      const res = await request(app)
        .get("/api/dashboard/admin")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.adminStats.totalUsers).toBe(5);

      // Verify IT_STAFF calling /api/dashboard/admin is rejected with 403
      const staffForbiddenRes = await request(app)
        .get("/api/dashboard/admin")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(staffForbiddenRes.status).toBe(403);
    });
  });
});

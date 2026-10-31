import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role, Priority, TicketStatus } from "@prisma/client";

describe("Sprint 4 Requester Dashboard API Suite (Issue 32, API-DASH-01, AC-04, BR-15, BR-16)", () => {
  const requesterUser = {
    userId: 25,
    email: "sarah.requester@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const otherRequesterUser = {
    userId: 99,
    email: "bob.requester@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const staffUser = {
    userId: 10,
    email: "somchai.it@toktickit.com",
    role: Role.IT_STAFF,
    mustChangePassword: false,
  };

  const requesterToken = generateToken(requesterUser);
  const otherRequesterToken = generateToken(otherRequesterUser);
  const staffToken = generateToken(staffUser);

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      ticket: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma);
  });

  describe("Authentication & Role Authorization Guards", () => {
    it("rejects unauthenticated request with 401 Unauthorized", async () => {
      const res = await request(app).get("/api/dashboard/requester");
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it("rejects non-requester (IT_STAFF) role with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/dashboard/requester")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/insufficient permissions/i);
    });

    it("rejects requester requiring password change (mustChangePassword: true) with 403 Forbidden on /api/dashboard/requester", async () => {
      const unverifiedToken = generateToken({
        ...requesterUser,
        mustChangePassword: true,
      });

      const res = await request(app)
        .get("/api/dashboard/requester")
        .set("Authorization", `Bearer ${unverifiedToken}`);

      expect(res.status).toBe(403);
      expect(res.body.mustChangePassword).toBe(true);
      expect(res.body.error).toMatch(/password change required/i);
    });

    it("rejects requester requiring password change (mustChangePassword: true) with 403 Forbidden on /api/requester/dashboard", async () => {
      const unverifiedToken = generateToken({
        ...requesterUser,
        mustChangePassword: true,
      });

      const res = await request(app)
        .get("/api/requester/dashboard")
        .set("Authorization", `Bearer ${unverifiedToken}`);

      expect(res.status).toBe(403);
      expect(res.body.mustChangePassword).toBe(true);
      expect(res.body.error).toMatch(/password change required/i);
    });
  });

  describe("API-DASH-01: Requester Dashboard isolates owned tickets and computes dynamic metrics (AC-04, BR-15, BR-16)", () => {
    it("returns accurate metrics and ticket arrays for the calling requester", async () => {
      // Mock counts for caller: totalOpenTickets=3, waitingForRequester=1, resolvedOrClosed=4
      mockPrisma.ticket.count
        .mockResolvedValueOnce(3) // totalOpenTickets
        .mockResolvedValueOnce(1) // waitingForRequester
        .mockResolvedValueOnce(4); // resolvedOrClosed

      const mockRecentTickets = [
        {
          id: 101,
          ticketNumber: "TKT-2026-000101",
          summary: "Need VPN client reinstalled",
          currentStatus: TicketStatus.WAITING_FOR_REQUESTER,
          requestedPriority: Priority.HIGH,
          updatedAt: new Date("2026-10-16T10:00:00.000Z"),
          createdAt: new Date("2026-10-15T08:00:00.000Z"),
        },
        {
          id: 102,
          ticketNumber: "TKT-2026-000102",
          summary: "Monitor color distortion",
          currentStatus: TicketStatus.IN_PROGRESS,
          requestedPriority: Priority.MEDIUM,
          updatedAt: new Date("2026-10-16T09:00:00.000Z"),
          createdAt: new Date("2026-10-15T09:00:00.000Z"),
        },
      ];

      const mockRecentlyResolved = [
        {
          id: 95,
          ticketNumber: "TKT-2026-000095",
          summary: "Keyboard replacement",
          currentStatus: TicketStatus.RESOLVED,
          resolutionSummary: "New mechanical keyboard delivered and verified.",
          updatedAt: new Date("2026-10-14T14:00:00.000Z"),
          createdAt: new Date("2026-10-13T10:00:00.000Z"),
        },
      ];

      mockPrisma.ticket.findMany
        .mockResolvedValueOnce(mockRecentTickets)
        .mockResolvedValueOnce(mockRecentlyResolved);

      const res = await request(app)
        .get("/api/dashboard/requester")
        .set("Authorization", `Bearer ${requesterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.metrics).toEqual({
        totalOpenTickets: 3,
        waitingForRequester: 1,
        resolvedOrClosed: 4,
      });

      expect(res.body.recentTickets).toHaveLength(2);
      expect(res.body.recentTickets[0].ticketNumber).toBe("TKT-2026-000101");
      expect(res.body.recentTickets[0].currentStatus).toBe("WAITING_FOR_REQUESTER");

      expect(res.body.recentlyResolved).toHaveLength(1);
      expect(res.body.recentlyResolved[0].ticketNumber).toBe("TKT-2026-000095");
      expect(res.body.recentlyResolved[0].resolutionSummary).toBe(
        "New mechanical keyboard delivered and verified."
      );
      expect(res.body.recentlyResolved[0].resolvedAt).toBeDefined();

      // Verify Prisma query isolation: all queries MUST filter by requesterId: 25
      expect(mockPrisma.ticket.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ requesterId: 25 }),
        })
      );
      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ requesterId: 25 }),
        })
      );
    });

    it("supports direct route alias /api/requester/dashboard", async () => {
      mockPrisma.ticket.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockPrisma.ticket.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const res = await request(app)
        .get("/api/requester/dashboard")
        .set("Authorization", `Bearer ${requesterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.metrics).toEqual({
        totalOpenTickets: 0,
        waitingForRequester: 0,
        resolvedOrClosed: 0,
      });
      expect(res.body.recentTickets).toEqual([]);
      expect(res.body.recentlyResolved).toEqual([]);
    });

    it("strictly isolates queries between different requesters", async () => {
      mockPrisma.ticket.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      mockPrisma.ticket.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await request(app)
        .get("/api/dashboard/requester")
        .set("Authorization", `Bearer ${otherRequesterToken}`);

      expect(mockPrisma.ticket.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ requesterId: 99 }),
        })
      );
      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ requesterId: 99 }),
        })
      );
    });
  });

  describe("Requester Ticket Drill-Down API Parity (AC-11, BR-16)", () => {
    it("supports GET /api/tickets?status=RESOLVED_OR_CLOSED to query combined resolved and closed tickets matching dashboard count", async () => {
      let capturedWhere: any = null;
      mockPrisma.requesterUser = {
        findUnique: vi.fn().mockResolvedValue({ id: 25, name: "Sarah", isActive: true }),
      };
      mockPrisma.ticket.count = vi.fn().mockImplementation(({ where }) => {
        capturedWhere = where;
        return Promise.resolve(2);
      });
      mockPrisma.ticket.findMany = vi.fn().mockImplementation(({ where }) => {
        capturedWhere = where;
        return Promise.resolve([
          { id: 101, ticketNumber: "TKT-001", currentStatus: TicketStatus.RESOLVED },
          { id: 102, ticketNumber: "TKT-002", currentStatus: TicketStatus.CLOSED },
        ]);
      });

      const res = await request(app)
        .get("/api/tickets?status=RESOLVED_OR_CLOSED")
        .set("X-Development-Requester-Id", "25");

      expect(res.status).toBe(200);
      expect(capturedWhere).toBeDefined();
      expect(capturedWhere.currentStatus).toEqual({
        in: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
      });
      expect(res.body.data).toHaveLength(2);
    });
  });
});

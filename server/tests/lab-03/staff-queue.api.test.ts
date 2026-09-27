import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role, Priority, TicketStatus } from "@prisma/client";

describe("IT Staff Ticket Queue API Suite (Sprint 3 - Issue 20)", () => {
  const staffUser = {
    userId: 10,
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
    userId: 20,
    email: "alice@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const mustChangePasswordStaff = {
    userId: 11,
    email: "new.staff@toktickit.com",
    role: Role.IT_STAFF,
    mustChangePassword: true,
  };

  const staffToken = generateToken(staffUser);
  const adminToken = generateToken(adminUser);
  const requesterToken = generateToken(requesterUser);
  const mustChangeToken = generateToken(mustChangePasswordStaff);

  const sampleTickets = [
    {
      id: 1,
      ticketNumber: "TCK-2026-0001",
      summary: "VPN connection dropping repeatedly",
      description: "Cannot maintain tunnel connection for more than 5 minutes.",
      requestedPriority: Priority.HIGH,
      itPriority: Priority.URGENT,
      currentStatus: TicketStatus.OPEN,
      resolutionSummary: null,
      requesterResolvedIndication: false,
      createdAt: new Date("2026-09-01T10:00:00Z"),
      updatedAt: new Date("2026-09-01T10:30:00Z"),
      category: { id: 1, name: "Network & Connectivity" },
      relatedSystem: { id: 1, name: "GlobalProtect VPN" },
      requester: { id: 20, name: "Alice Smith", email: "alice@example.com" },
      owner: { id: 10, name: "Somchai Jaidee", email: "somchai.it@toktickit.com" },
    },
    {
      id: 2,
      ticketNumber: "TCK-2026-0002",
      summary: "Monitor display flickers in finance room",
      description: "External monitor flashes black intermittently.",
      requestedPriority: Priority.MEDIUM,
      itPriority: Priority.LOW,
      currentStatus: TicketStatus.NEW,
      resolutionSummary: null,
      requesterResolvedIndication: false,
      createdAt: new Date("2026-09-02T08:00:00Z"),
      updatedAt: new Date("2026-09-02T08:00:00Z"),
      category: { id: 2, name: "Hardware & Devices" },
      relatedSystem: { id: 2, name: "Dell Display Monitor" },
      requester: { id: 21, name: "Bob Johnson", email: "bob@example.com" },
      owner: null,
    },
  ];

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      ticket: {
        findMany: vi.fn().mockResolvedValue(sampleTickets),
        count: vi.fn().mockResolvedValue(2),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma);
  });

  describe("Security & Authorization Guards", () => {
    it("rejects unauthenticated requests with 401 Unauthorized", async () => {
      const res = await request(app).get("/api/staff/tickets");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Authentication required");
    });

    it("rejects REQUESTER role with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/staff/tickets")
        .set("Authorization", `Bearer ${requesterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Access denied: insufficient permissions");
    });

    it("rejects staff with mustChangePassword = true with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/staff/tickets")
        .set("Authorization", `Bearer ${mustChangeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.mustChangePassword).toBe(true);
    });

    it("allows IT_STAFF to access queue with 200 OK", async () => {
      const res = await request(app)
        .get("/api/staff/tickets")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tickets).toHaveLength(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("allows ADMINISTRATOR to access queue with 200 OK", async () => {
      const res = await request(app)
        .get("/api/staff/tickets")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tickets).toHaveLength(2);
    });
  });

  describe("Queue Retrieval & Data Structure (AC-05, QUEUE-01)", () => {
    it("returns shared queue containing tickets across all Requesters", async () => {
      const res = await request(app)
        .get("/api/staff/tickets")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(res.body.tickets).toHaveLength(2);
      expect(res.body.pagination).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const firstTicket = res.body.tickets[0];
      expect(firstTicket.ticketNumber).toBe("TCK-2026-0001");
      expect(firstTicket.category.name).toBe("Network & Connectivity");
      expect(firstTicket.requester.name).toBe("Alice Smith");
      expect(firstTicket.owner.name).toBe("Somchai Jaidee");
      expect(firstTicket.itPriority).toBe("URGENT");
    });
  });

  describe("Search & Filtering (FR-11, QUEUE-02)", () => {
    it("passes search query for ticket number or summary to prisma", async () => {
      await request(app)
        .get("/api/staff/tickets?search=VPN")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { ticketNumber: { contains: "VPN", mode: "insensitive" } },
              { summary: { contains: "VPN", mode: "insensitive" } },
            ],
          }),
        })
      );
    });

    it("filters by category ID", async () => {
      await request(app)
        .get("/api/staff/tickets?category=2")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: 2,
          }),
        })
      );
    });

    it("filters by status", async () => {
      await request(app)
        .get("/api/staff/tickets?status=OPEN")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            currentStatus: TicketStatus.OPEN,
          }),
        })
      );
    });

    it("filters by requested priority and itPriority", async () => {
      await request(app)
        .get("/api/staff/tickets?priority=HIGH&itPriority=URGENT")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            requestedPriority: Priority.HIGH,
            itPriority: Priority.URGENT,
          }),
        })
      );
    });

    it("filters unassigned tickets with ownerId=unassigned", async () => {
      await request(app)
        .get("/api/staff/tickets?ownerId=unassigned")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            ownerId: null,
          }),
        })
      );
    });

    it("filters assigned to current user with ownerId=me", async () => {
      await request(app)
        .get("/api/staff/tickets?ownerId=me")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            ownerId: staffUser.userId,
          }),
        })
      );
    });

    it("filters by specific numeric owner ID", async () => {
      await request(app)
        .get("/api/staff/tickets?ownerId=4")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            ownerId: 4,
          }),
        })
      );
    });
  });

  describe("Sorting & Pagination", () => {
    it("sorts by itPriority in ascending order", async () => {
      await request(app)
        .get("/api/staff/tickets?sort=itPriority&order=asc")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { itPriority: "asc" },
        })
      );
    });

    it("paginates using page and limit query parameters", async () => {
      mockPrisma.ticket.count.mockResolvedValue(25);

      const res = await request(app)
        .get("/api/staff/tickets?page=2&limit=10")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );

      expect(res.body.pagination).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      });
    });
  });

  describe("Error Handling", () => {
    it("returns 500 when database throws an exception", async () => {
      mockPrisma.ticket.findMany.mockRejectedValue(new Error("Database connection failure"));

      const res = await request(app)
        .get("/api/staff/tickets")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to retrieve IT staff ticket queue");
    });
  });
});

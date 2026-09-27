import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role, Priority, TicketStatus } from "@prisma/client";

describe("IT Staff Ticket Detail & Operations API Suite (Sprint 3 - Issue 21)", () => {
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

  const staffToken = generateToken(staffUser);
  const adminToken = generateToken(adminUser);
  const requesterToken = generateToken(requesterUser);

  const mockTicket = {
    id: 101,
    ticketNumber: "TCK-2026-000101",
    summary: "Monitor display flickers intermittently",
    description: "External Dell monitor flashes black every few minutes.",
    requestedPriority: Priority.MEDIUM,
    itPriority: Priority.MEDIUM,
    currentStatus: TicketStatus.NEW,
    resolutionSummary: null,
    requesterResolvedIndication: false,
    requesterId: 20,
    ownerId: null,
    categoryId: 1,
    relatedSystemId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: 1, name: "Hardware" },
    relatedSystem: { id: 1, name: "Dell Monitor" },
    requester: { id: 20, name: "Alice Smith", email: "alice@example.com" },
    owner: null,
    attachments: [],
    comments: [],
    notes: [],
  };

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      ticket: {
        findUnique: vi.fn().mockResolvedValue({ ...mockTicket }),
        update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ ...mockTicket, ...data })),
      },
      user: {
        findUnique: vi.fn(),
        findMany: vi.fn().mockResolvedValue([
          { id: 10, name: "Somchai Jaidee", email: "somchai.it@toktickit.com", role: Role.IT_STAFF },
          { id: 1, name: "System Admin", email: "admin@toktickit.com", role: Role.ADMINISTRATOR },
        ]),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma);
  });

  describe("GET /api/staff/tickets/:id - Ticket Detail View", () => {
    it("returns ticket detail with comments and internal notes for IT Staff", async () => {
      const res = await request(app)
        .get("/api/staff/tickets/101")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ticketNumber).toBe("TCK-2026-000101");
      expect(res.body.category.name).toBe("Hardware");
    });

    it("rejects non-staff (Requester) with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/staff/tickets/101")
        .set("Authorization", `Bearer ${requesterToken}`);

      expect(res.status).toBe(403);
    });

    it("returns 404 if ticket not found", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/staff/tickets/999")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/staff/users - Staff Roster for Assignment", () => {
    it("returns active IT Staff and Admin users", async () => {
      const res = await request(app)
        .get("/api/staff/users")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe("Somchai Jaidee");
    });
  });

  describe("PATCH /api/staff/tickets/:id/claim - Claim Ownership (STAFF-01)", () => {
    it("claims unassigned ticket, sets ownerId to caller, and transitions NEW to OPEN", async () => {
      const res = await request(app)
        .patch("/api/staff/tickets/101/claim")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 101 },
          data: {
            ownerId: staffUser.userId,
            currentStatus: TicketStatus.OPEN,
          },
        })
      );
    });

    it("claims ticket already in IN_PROGRESS and retains currentStatus", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.IN_PROGRESS,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/claim")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            ownerId: staffUser.userId,
            currentStatus: TicketStatus.IN_PROGRESS,
          },
        })
      );
    });
  });

  describe("PATCH /api/staff/tickets/:id/assign - Reassign Owner", () => {
    it("assigns ticket to active IT Staff user", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 12,
        isActive: true,
        role: Role.IT_STAFF,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/assign")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ ownerId: 12 });

      expect(res.status).toBe(200);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 101 },
          data: {
            ownerId: 12,
            currentStatus: TicketStatus.OPEN,
          },
        })
      );
    });

    it("rejects assigning to an inactive user or non-staff role with 400 Bad Request", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 20,
        isActive: true,
        role: Role.REQUESTER,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/assign")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ ownerId: 20 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Target owner must be an active IT Staff or Administrator");
    });
  });

  describe("PATCH /api/staff/tickets/:id/priority - Update IT Priority (STAFF-02)", () => {
    it("updates IT Priority to HIGH", async () => {
      const res = await request(app)
        .patch("/api/staff/tickets/101/priority")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ itPriority: "HIGH" });

      expect(res.status).toBe(200);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { itPriority: Priority.HIGH },
        })
      );
    });

    it("rejects invalid IT Priority string with 400 Bad Request", async () => {
      const res = await request(app)
        .patch("/api/staff/tickets/101/priority")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ itPriority: "SUPER_URGENT" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid IT Priority value");
    });
  });

  describe("PATCH /api/staff/tickets/:id/status - Status Transitions & BR-19 Matrix (STAFF-04, STAFF-05)", () => {
    it("allows valid transition from OPEN to IN_PROGRESS", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.OPEN,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/status")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ status: "IN_PROGRESS" });

      expect(res.status).toBe(200);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { currentStatus: TicketStatus.IN_PROGRESS },
        })
      );
    });

    it("rejects invalid transition (e.g. from OPEN to CLOSED) with 400 Bad Request per BR-19", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.OPEN,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/status")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ status: "CLOSED" });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid status transition from OPEN to CLOSED");
    });

    it("strictly rejects direct transition to RESOLVED via status endpoint with 422 Unprocessable Entity", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.IN_PROGRESS,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/status")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ status: "RESOLVED" });

      expect(res.status).toBe(422);
      expect(res.body.error).toContain("Direct transition to RESOLVED via general status endpoint is not permitted");
    });
  });

  describe("PATCH /api/staff/tickets/:id/resolve - Resolve with Mandatory Summary (STAFF-03, STAFF-05, BR-20)", () => {
    it("successfully resolves ticket with valid resolutionSummary (>=3 characters)", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.IN_PROGRESS,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/resolve")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          resolutionSummary: "Replaced faulty HDMI display cable; monitor now runs steadily without flicker.",
        });

      expect(res.status).toBe(200);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            currentStatus: TicketStatus.RESOLVED,
            resolutionSummary: "Replaced faulty HDMI display cable; monitor now runs steadily without flicker.",
          },
        })
      );
    });

    it("rejects resolve request when resolutionSummary is missing or <3 chars with 422 Unprocessable Entity", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.IN_PROGRESS,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/resolve")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ resolutionSummary: "ok" });

      expect(res.status).toBe(422);
      expect(res.body.error).toContain("Resolution summary is required and must be between 3 and 500 characters");
    });

    it("rejects resolving a ticket from non-permittable status (e.g. NEW or OPEN) with 400 Bad Request", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.OPEN,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/101/resolve")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          resolutionSummary: "Solved properly and completely.",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Cannot resolve ticket from current status: OPEN");
    });
  });
});

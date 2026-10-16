import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role, Priority, TicketStatus } from "@prisma/client";

describe("Sprint 4 Ticket Workflow, Resolution Gate & Concurrency API Suite (Issue 31)", () => {
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

  const initialUpdatedAt = new Date("2026-10-15T10:00:00.000Z");

  const mockTicket = {
    id: 142,
    ticketNumber: "TKT-2026-000142",
    summary: "Office Wi-Fi disconnection issues on 3rd floor",
    description: "Laptops lose connection randomly during peak hours.",
    requestedPriority: Priority.HIGH,
    itPriority: Priority.HIGH,
    currentStatus: TicketStatus.IN_PROGRESS,
    resolutionSummary: null,
    requesterResolvedIndication: false,
    requesterId: 20,
    ownerId: 10,
    categoryId: 1,
    relatedSystemId: 1,
    createdAt: new Date("2026-10-15T09:00:00.000Z"),
    updatedAt: initialUpdatedAt,
    category: { id: 1, name: "Network" },
    relatedSystem: { id: 1, name: "Aruba AP" },
    requester: { id: 20, name: "Alice Smith", email: "alice@example.com" },
    owner: { id: 10, name: "Somchai Staff", email: "somchai.it@toktickit.com" },
  };

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      ticket: {
        findUnique: vi.fn(),
        update: vi.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            ...mockTicket,
            ...data,
            updatedAt: new Date("2026-10-15T11:00:00.000Z"),
          })
        ),
      },
      user: {
        findUnique: vi.fn(),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma);
  });

  describe("API-WORK-01: Formal Ticket Resolution via Resolve Endpoint (AC-06, BR-11)", () => {
    it("successfully transitions ticket to RESOLVED when resolutionSummary is valid and knownUpdatedAt matches", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.IN_PROGRESS,
        updatedAt: initialUpdatedAt,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/142/resolve")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          resolutionSummary: "Adjusted transmit power and channel allocation on AP-301 to resolve 5GHz interference.",
          knownUpdatedAt: initialUpdatedAt.toISOString(),
        });

      expect(res.status).toBe(200);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 142 },
          data: {
            currentStatus: TicketStatus.RESOLVED,
            resolutionSummary: "Adjusted transmit power and channel allocation on AP-301 to resolve 5GHz interference.",
          },
        })
      );
    });

    it("rejects resolution when resolutionSummary is shorter than 3 characters with 422 Unprocessable Entity", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.IN_PROGRESS,
        updatedAt: initialUpdatedAt,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/142/resolve")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          resolutionSummary: "ok",
          knownUpdatedAt: initialUpdatedAt.toISOString(),
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toContain("Resolution summary is required and must be between 3 and 500 characters");
    });
  });

  describe("API-WORK-02: Direct Transition to RESOLVED via General Status Endpoint (AC-07, BR-11)", () => {
    it("strictly rejects transitioning to RESOLVED via /status endpoint with 422 Unprocessable Entity", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.IN_PROGRESS,
        updatedAt: initialUpdatedAt,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/142/status")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          currentStatus: "RESOLVED",
          knownUpdatedAt: initialUpdatedAt.toISOString(),
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toContain("Direct transition to RESOLVED via general status endpoint is not permitted");
    });

    it("strictly rejects transitioning to RESOLVED using status alias field with 422", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        currentStatus: TicketStatus.IN_PROGRESS,
        updatedAt: initialUpdatedAt,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/142/status")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          status: "RESOLVED",
          knownUpdatedAt: initialUpdatedAt.toISOString(),
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toContain("Direct transition to RESOLVED via general status endpoint is not permitted");
    });
  });

  describe("API-WORK-03: Optimistic Concurrency & Stale Update Detection (AC-08, BR-13)", () => {
    it("returns 409 Conflict when knownUpdatedAt on status mutation is stale", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        updatedAt: new Date("2026-10-15T12:00:00.000Z"),
      });

      const res = await request(app)
        .patch("/api/staff/tickets/142/status")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          currentStatus: "WAITING_FOR_REQUESTER",
          knownUpdatedAt: "2026-10-15T10:00:00.000Z",
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain("Conflict: The record has been modified by another user");
      expect(res.body.currentUpdatedAt).toBe("2026-10-15T12:00:00.000Z");
    });

    it("returns 409 Conflict when knownUpdatedAt on resolve mutation is stale", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        updatedAt: new Date("2026-10-15T12:00:00.000Z"),
      });

      const res = await request(app)
        .patch("/api/staff/tickets/142/resolve")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          resolutionSummary: "Verified AP configuration and restarted interface.",
          knownUpdatedAt: "2026-10-15T10:00:00.000Z",
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain("Conflict: The record has been modified by another user");
      expect(res.body.currentUpdatedAt).toBe("2026-10-15T12:00:00.000Z");
    });
  });

  describe("API-WORK-04: Inactive User Assignment Guard (AC-09, BR-14)", () => {
    it("rejects assigning ticket to an inactive user with 422 Unprocessable Entity", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 15,
        name: "Inactive Staff",
        email: "inactive.staff@toktickit.com",
        isActive: false,
        role: Role.IT_STAFF,
      });

      const res = await request(app)
        .patch("/api/staff/tickets/142/assign")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ ownerId: 15 });

      expect(res.status).toBe(422);
      expect(res.body.error).toContain("Cannot assign ticket to an inactive user (BR-14)");
    });
  });

  describe("API-WORK-05: Requester Problem Resolution Indication (AC-10, BR-12)", () => {
    it("toggles requesterResolvedIndication to true while leaving currentStatus untouched", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        id: 142,
        requesterId: 20,
        currentStatus: TicketStatus.IN_PROGRESS,
      });

      const res = await request(app)
        .patch("/api/tickets/142/resolve-indication")
        .set("Authorization", `Bearer ${requesterToken}`)
        .send({ indicated: true });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.requesterResolvedIndication).toBe(true);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 142 },
          data: { requesterResolvedIndication: true },
        })
      );
    });

    it("rejects resolve indication from a requester who does not own the ticket with 403 Forbidden", async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({
        id: 142,
        requesterId: 99, // Owned by another user
        currentStatus: TicketStatus.IN_PROGRESS,
      });

      const res = await request(app)
        .patch("/api/tickets/142/resolve-indication")
        .set("Authorization", `Bearer ${requesterToken}`)
        .send({ indicated: true });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain("Access denied: not your ticket");
    });
  });

  describe("API-WORK-06: Mandatory knownUpdatedAt Validation (AC-08, BR-13)", () => {
    it("rejects status mutation without knownUpdatedAt with 422 Unprocessable Entity", async () => {
      const res = await request(app)
        .patch("/api/staff/tickets/142/status")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          currentStatus: "WAITING_FOR_REQUESTER",
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toBe("Validation failed: knownUpdatedAt is required");
      expect(res.body.details).toContain("knownUpdatedAt: Field is mandatory to prevent stale updates.");
    });

    it("rejects resolve mutation without knownUpdatedAt with 422 Unprocessable Entity", async () => {
      const res = await request(app)
        .patch("/api/staff/tickets/142/resolve")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          resolutionSummary: "Resolved through router firmware upgrade and verification.",
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toBe("Validation failed: knownUpdatedAt is required");
      expect(res.body.details).toContain("knownUpdatedAt: Field is mandatory to prevent stale updates.");
    });
  });
});

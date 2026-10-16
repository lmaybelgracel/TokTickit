import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role } from "@prisma/client";

describe("Actions Taken API Suite (Sprint 4 - Issue 29)", () => {
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

  const ownerRequester = {
    userId: 20,
    email: "alice@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const otherRequester = {
    userId: 21,
    email: "bob@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const staffToken = generateToken(staffUser);
  const adminToken = generateToken(adminUser);
  const ownerToken = generateToken(ownerRequester);
  const otherRequesterToken = generateToken(otherRequester);

  const sampleTicket = {
    id: 101,
    ticketNumber: "TCK-2026-000101",
    requesterId: 20,
    currentStatus: "IN_PROGRESS",
    updatedAt: new Date("2026-10-15T10:00:00.000Z"),
  };

  const sampleAction = {
    id: 501,
    ticketId: 101,
    performedById: 10,
    actionDateTime: new Date("2026-10-15T11:00:00.000Z"),
    description: "Replaced faulty HDMI cable with high-speed shielded cable.",
    result: "Display output restored without flicker.",
    followUpRequired: false,
    followUpNote: null,
    attachmentNotes: "Tested with 1080p 60Hz resolution.",
    createdAt: new Date("2026-10-15T11:05:00.000Z"),
    updatedAt: new Date("2026-10-15T11:05:00.000Z"),
    performedBy: {
      id: 10,
      name: "Somchai Jaidee",
      email: "somchai.it@toktickit.com",
      role: Role.IT_STAFF,
    },
  };

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      ticket: {
        findUnique: vi.fn().mockImplementation(({ where }: { where: { id: number } }) => {
          if (where.id === 101) {
            return Promise.resolve({ ...sampleTicket });
          }
          return Promise.resolve(null);
        }),
        update: vi.fn().mockImplementation(({ where, data }: any) =>
          Promise.resolve({ ...sampleTicket, ...data, updatedAt: new Date() })
        ),
      },
      user: {
        findUnique: vi.fn().mockImplementation(({ where }: { where: { id: number } }) => {
          if (where.id === 10) {
            return Promise.resolve({ id: 10, email: "somchai.it@toktickit.com", isActive: true });
          }
          if (where.id === 1) {
            return Promise.resolve({ id: 1, email: "admin@toktickit.com", isActive: true });
          }
          if (where.id === 99) {
            return Promise.resolve({ id: 99, email: "inactive@toktickit.com", isActive: false });
          }
          return Promise.resolve(null);
        }),
      },
      actionTaken: {
        findMany: vi.fn().mockResolvedValue([{ ...sampleAction }]),
        findUnique: vi.fn().mockImplementation(({ where }: { where: { id: number } }) => {
          if (where.id === 501) {
            return Promise.resolve({ ...sampleAction });
          }
          return Promise.resolve(null);
        }),
        create: vi.fn().mockImplementation(({ data }: any) =>
          Promise.resolve({
            id: 502,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            performedBy: {
              id: data.performedById,
              name: "Somchai Jaidee",
              email: "somchai.it@toktickit.com",
              role: Role.IT_STAFF,
            },
          })
        ),
        update: vi.fn().mockImplementation(({ where, data }: any) =>
          Promise.resolve({
            ...sampleAction,
            ...data,
            updatedAt: new Date("2026-10-15T12:00:00.000Z"),
          })
        ),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma);
  });

  describe("API-ACT-01: Create Action Taken by IT Staff with valid data", () => {
    it("should return 201 Created and auto-stamp performedById from JWT", async () => {
      const response = await request(app)
        .post("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          description: "Installed firmware update v2.4 on projector.",
          result: "Audio sync issue completely resolved.",
          followUpRequired: false,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id", 502);
      expect(response.body.performedById).toBe(10);
      expect(response.body.description).toBe("Installed firmware update v2.4 on projector.");
      expect(response.body.result).toBe("Audio sync issue completely resolved.");
      expect(mockPrisma.actionTaken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ticketId: 101,
            performedById: 10,
            description: "Installed firmware update v2.4 on projector.",
            result: "Audio sync issue completely resolved.",
            followUpRequired: false,
          }),
        })
      );
      // Touches ticket updatedAt
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 101 },
          data: expect.objectContaining({ updatedAt: expect.any(Date) }),
        })
      );
    });
  });

  describe("API-ACT-02: Requester attempting to create Action Taken", () => {
    it("should return 403 Forbidden when Requester attempts creation", async () => {
      const response = await request(app)
        .post("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({
          description: "Requester trying to record action.",
          result: "Should not be permitted.",
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
      expect(mockPrisma.actionTaken.create).not.toHaveBeenCalled();
    });
  });

  describe("API-ACT-03: Create Action Taken with followUpRequired=true but missing note", () => {
    it("should return 422 Unprocessable Entity when followUpNote is omitted", async () => {
      const response = await request(app)
        .post("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          description: "Replaced power supply temporarily.",
          result: "Machine boots, permanent replacement pending.",
          followUpRequired: true,
          // followUpNote intentionally missing
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty("details");
      expect(response.body.details[0]).toContain("followUpNote");
      expect(mockPrisma.actionTaken.create).not.toHaveBeenCalled();
    });

    it("should accept when followUpNote is provided with followUpRequired=true", async () => {
      const response = await request(app)
        .post("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          description: "Replaced power supply temporarily.",
          result: "Machine boots, permanent replacement pending.",
          followUpRequired: true,
          followUpNote: "Order OEM power supply part #PSU-9923.",
        });

      expect(response.status).toBe(201);
      expect(response.body.followUpRequired).toBe(true);
      expect(response.body.followUpNote).toBe("Order OEM power supply part #PSU-9923.");
    });
  });

  describe("API-ACT-04: Fetch Actions Taken for owned ticket as Requester", () => {
    it("should return 200 OK and list of actions for ticket owner", async () => {
      const response = await request(app)
        .get("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(501);
      expect(response.body[0].performedBy).toBeDefined();
      expect(response.body[0].performedBy.name).toBe("Somchai Jaidee");
    });

    it("should allow IT Staff and Admin to fetch actions for any ticket", async () => {
      const response = await request(app)
        .get("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("API-ACT-05: Fetch Actions Taken for unowned ticket as Requester", () => {
    it("should return 403 Forbidden when Requester does not own the ticket", async () => {
      const response = await request(app)
        .get("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${otherRequesterToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("Access denied: you do not own this ticket");
    });
  });

  describe("API-ACT-06: Update existing Action Taken by IT Staff", () => {
    it("should return 200 OK when knownUpdatedAt matches", async () => {
      const response = await request(app)
        .patch("/api/actions/501")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          knownUpdatedAt: "2026-10-15T11:05:00.000Z",
          result: "Display output restored and tested for 2 hours without flicker.",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe("Display output restored and tested for 2 hours without flicker.");
      expect(mockPrisma.actionTaken.update).toHaveBeenCalled();
    });

    it("should return 422 Unprocessable Entity when knownUpdatedAt is missing", async () => {
      const response = await request(app)
        .patch("/api/actions/501")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          result: "Attempt update without concurrency token.",
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("knownUpdatedAt is required");
      expect(mockPrisma.actionTaken.update).not.toHaveBeenCalled();
    });

    it("should return 409 Conflict when knownUpdatedAt timestamp does not match", async () => {
      const response = await request(app)
        .patch("/api/actions/501")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          knownUpdatedAt: "2026-10-14T09:00:00.000Z", // Stale timestamp
          result: "Stale update attempt.",
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("Conflict");
      expect(response.body).toHaveProperty("currentUpdatedAt");
      expect(mockPrisma.actionTaken.update).not.toHaveBeenCalled();
    });

    it("should return 403 Forbidden when Requester attempts to update Action Taken", async () => {
      const response = await request(app)
        .patch("/api/actions/501")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({
          knownUpdatedAt: "2026-10-15T11:05:00.000Z",
          result: "Requester edit attempt.",
        });

      expect(response.status).toBe(403);
      expect(mockPrisma.actionTaken.update).not.toHaveBeenCalled();
    });
  });

  describe("Validation & Security Edge Cases", () => {
    it("should return 401 Unauthorized when no authentication token is provided", async () => {
      const response = await request(app)
        .get("/api/tickets/101/actions");

      expect(response.status).toBe(401);
    });

    it("should return 404 Not Found for non-existent ticket", async () => {
      const response = await request(app)
        .get("/api/tickets/999/actions")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(response.status).toBe(404);
    });

    it("should return 422 when actionDateTime is in the future", async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const response = await request(app)
        .post("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          description: "Future inspection.",
          result: "Done in future.",
          actionDateTime: futureDate,
        });

      expect(response.status).toBe(422);
      expect(response.body.details[0]).toContain("Cannot be in the future");
    });

    it("should return 422 when an inactive staff user attempts to record an action", async () => {
      const inactiveStaff = {
        userId: 99,
        email: "inactive@toktickit.com",
        role: Role.IT_STAFF,
        mustChangePassword: false,
      };
      const inactiveToken = generateToken(inactiveStaff);

      const response = await request(app)
        .post("/api/tickets/101/actions")
        .set("Authorization", `Bearer ${inactiveToken}`)
        .send({
          description: "Inactive staff action attempt.",
          result: "Failed.",
        });

      expect(response.status).toBe(422);
      expect(response.body.error).toContain("Inactive users cannot record actions taken");
    });
  });
});

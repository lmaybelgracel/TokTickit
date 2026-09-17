import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role } from "@prisma/client";

describe("Security & Role-Based Authorization API Suite (Sprint 3 - Issue 23)", () => {
  const adminUser = {
    userId: 1,
    email: "admin@toktickit.com",
    role: Role.ADMINISTRATOR,
    mustChangePassword: false,
  };

  const staffUser = {
    userId: 2,
    email: "staff@toktickit.com",
    role: Role.IT_STAFF,
    mustChangePassword: false,
  };

  const ownerRequester = {
    userId: 10,
    email: "owner@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const otherRequester = {
    userId: 11,
    email: "other@example.com",
    role: Role.REQUESTER,
    mustChangePassword: false,
  };

  const mustChangeRequester = {
    userId: 12,
    email: "mustchange@example.com",
    role: Role.REQUESTER,
    mustChangePassword: true,
  };

  const adminToken = generateToken(adminUser);
  const staffToken = generateToken(staffUser);
  const ownerToken = generateToken(ownerRequester);
  const otherRequesterToken = generateToken(otherRequester);
  const mustChangeToken = generateToken(mustChangeRequester);

  const sampleTicket = {
    id: 101,
    ticketNumber: "TKT-2026-000101",
    requesterId: 10,
    currentStatus: "OPEN",
    itPriority: "MEDIUM",
    requesterResolvedIndication: false,
  };

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      ticket: {
        findUnique: vi.fn().mockResolvedValue({ ...sampleTicket }),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
      internalNote: {
        findMany: vi.fn().mockResolvedValue([
          { id: 1, ticketId: 101, authorId: 2, content: "Secret diagnostics note", createdAt: new Date() },
        ]),
        create: vi.fn(),
      },
      publicComment: {
        findMany: vi.fn().mockResolvedValue([]),
        create: vi.fn(),
      },
      user: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn(),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma as any);
  });

  describe("SEC-01: Requester Cross-Ticket Isolation", () => {
    it("rejects requester accessing another requester's ticket details with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/tickets/101")
        .set("Authorization", `Bearer ${otherRequesterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it("rejects requester attempting to comment on another requester's ticket with 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/tickets/101/comments")
        .set("Authorization", `Bearer ${otherRequesterToken}`)
        .send({ content: "Cross-ticket unauthorized comment" });

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it("rejects requester attempting to toggle resolve indication on another requester's ticket with 403 Forbidden", async () => {
      const res = await request(app)
        .patch("/api/tickets/101/resolve-indication")
        .set("Authorization", `Bearer ${otherRequesterToken}`)
        .send({ indicated: true });

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("SEC-02 & SEC-04: Internal Notes Privacy Protection", () => {
    it("SEC-04: rejects requester attempting GET /api/tickets/:id/notes with 403 Forbidden without leaking content", async () => {
      const res = await request(app)
        .get("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
      expect(res.text).not.toContain("Secret diagnostics note");
      expect(mockPrisma.internalNote.findMany).not.toHaveBeenCalled();
    });

    it("SEC-02: rejects requester attempting POST /api/tickets/:id/notes with 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ content: "Unauthorized attempt to create internal note" });

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
      expect(mockPrisma.internalNote.create).not.toHaveBeenCalled();
    });

    it("allows IT Staff and Administrator to access internal notes", async () => {
      const staffRes = await request(app)
        .get("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(staffRes.status).toBe(200);
      expect(Array.isArray(staffRes.body)).toBe(true);

      const adminRes = await request(app)
        .get("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(adminRes.status).toBe(200);
      expect(Array.isArray(adminRes.body)).toBe(true);
    });
  });

  describe("SEC-03: Administrator Endpoint Role Guards", () => {
    it("rejects Requester accessing GET /api/admin/users with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it("rejects IT Staff accessing GET /api/admin/users with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it("rejects IT Staff accessing POST /api/admin/users with 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          fullName: "New User",
          email: "new@example.com",
          role: "REQUESTER",
          password: "Password123!",
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it("rejects IT Staff accessing PATCH /api/admin/users/:id with 403 Forbidden", async () => {
      const res = await request(app)
        .patch("/api/admin/users/10")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ fullName: "Tampered Name" });

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it("rejects IT Staff accessing POST /api/admin/users/:id/reset-password with 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/admin/users/10/reset-password")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ newPassword: "Password123!" });

      expect(res.status).toBe(403);
      expect(res.body.error).toBeDefined();
    });

    it("allows Administrator to access GET /api/admin/users with 200 OK", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("SEC-AUTH & SEC-ENFORCE-PWD: Authentication & Password Change Enforcement", () => {
    it("rejects unauthenticated requests without Bearer token with 401 Unauthorized", async () => {
      const res1 = await request(app).get("/api/admin/users");
      expect(res1.status).toBe(401);

      const res2 = await request(app).get("/api/staff/queue");
      expect(res2.status).toBe(401);

      const res3 = await request(app).get("/api/tickets/101/notes");
      expect(res3.status).toBe(401);
    });

    it("rejects requests with invalid or malformed tokens with 401 Unauthorized", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", "Bearer invalid-tampered-token");

      expect(res.status).toBe(401);
    });

    it("blocks users with mustChangePassword = true from accessing normal resources with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${mustChangeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.mustChangePassword).toBe(true);
    });
  });
});

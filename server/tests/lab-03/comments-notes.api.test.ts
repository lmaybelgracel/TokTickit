import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";
import { generateToken } from "../../src/utils/auth.js";
import { Role } from "@prisma/client";

describe("Comments & Internal Notes API Suite (Sprint 3 - Issue 21)", () => {
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
    requesterResolvedIndication: false,
  };

  let mockPrisma: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockPrisma = {
      ticket: {
        findUnique: vi.fn().mockResolvedValue({ ...sampleTicket }),
        update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ ...sampleTicket, ...data })),
      },
      publicComment: {
        create: vi.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 1,
            ...data,
            createdAt: new Date(),
            author: { id: data.authorId, name: "Author Name", email: "author@example.com", role: Role.REQUESTER },
          })
        ),
        findMany: vi.fn().mockResolvedValue([
          {
            id: 1,
            ticketId: 101,
            authorId: 20,
            content: "Please inspect HDMI port.",
            createdAt: new Date(),
            author: { id: 20, name: "Alice Smith", email: "alice@example.com", role: Role.REQUESTER },
          },
        ]),
      },
      internalNote: {
        create: vi.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 1,
            ...data,
            createdAt: new Date(),
            author: { id: data.authorId, name: "Staff Name", email: "staff@toktickit.com", role: Role.IT_STAFF },
          })
        ),
        findMany: vi.fn().mockResolvedValue([
          {
            id: 1,
            ticketId: 101,
            authorId: 10,
            content: "Customer port shows physical pin distortion.",
            createdAt: new Date(),
            author: { id: 10, name: "Somchai Jaidee", email: "somchai.it@toktickit.com", role: Role.IT_STAFF },
          },
        ]),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma);
  });

  describe("Public Comments (COMM-01)", () => {
    it("allows ticket owner requester to post a public comment", async () => {
      const res = await request(app)
        .post("/api/tickets/101/comments")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ content: "Replaced the cable, still black screen." });

      expect(res.status).toBe(201);
      expect(mockPrisma.publicComment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ticketId: 101,
            authorId: 20,
            content: "Replaced the cable, still black screen.",
          }),
        })
      );
    });

    it("allows IT Staff to post a public comment", async () => {
      const res = await request(app)
        .post("/api/tickets/101/comments")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ content: "We will dispatch a replacement monitor shortly." });

      expect(res.status).toBe(201);
    });

    it("rejects non-owner requester attempting to post comment with 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/tickets/101/comments")
        .set("Authorization", `Bearer ${otherRequesterToken}`)
        .send({ content: "Unauthorized comment attempt." });

      expect(res.status).toBe(403);
    });

    it("rejects empty comment with 400 Bad Request", async () => {
      const res = await request(app)
        .post("/api/tickets/101/comments")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ content: "   " });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Comment content is required");
    });

    it("returns public comments list for ticket owner", async () => {
      const res = await request(app)
        .get("/api/tickets/101/comments")
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe("Internal Notes (COMM-02, SEC-NOTE, BR-13 Confidentiality)", () => {
    it("allows IT Staff to post internal note", async () => {
      const res = await request(app)
        .post("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({ content: "Vendor RMA submitted for mainboard replacement." });

      expect(res.status).toBe(201);
      expect(mockPrisma.internalNote.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ticketId: 101,
            authorId: 10,
            content: "Vendor RMA submitted for mainboard replacement.",
          }),
        })
      );
    });

    it("allows Administrator to post internal note", async () => {
      const res = await request(app)
        .post("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ content: "Approved emergency hardware procurement." });

      expect(res.status).toBe(201);
    });

    it("STRICTLY REJECTS Requester attempting to post internal note with 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ content: "Requester trying to sneak internal note." });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain("Access denied: internal notes are restricted to IT Staff and Administrators");
    });

    it("STRICTLY REJECTS Requester attempting to view internal notes with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toContain("Access denied: internal notes are restricted to IT Staff and Administrators");
    });

    it("allows IT Staff to view internal notes", async () => {
      const res = await request(app)
        .get("/api/tickets/101/notes")
        .set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].content).toContain("physical pin distortion");
    });
  });

  describe("Requester Problem Appears Resolved Indication (RESOLVE-IND)", () => {
    it("allows ticket owner requester to toggle problem appears resolved", async () => {
      const res = await request(app)
        .patch("/api/tickets/101/resolve-indication")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ appearsResolved: true });

      expect(res.status).toBe(200);
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 101 },
          data: { requesterResolvedIndication: true },
        })
      );
    });

    it("rejects non-owner requester attempting to indicate resolved with 403 Forbidden", async () => {
      const res = await request(app)
        .patch("/api/tickets/101/resolve-indication")
        .set("Authorization", `Bearer ${otherRequesterToken}`)
        .send({ appearsResolved: true });

      expect(res.status).toBe(403);
    });
  });
});

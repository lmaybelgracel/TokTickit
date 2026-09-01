import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";

describe("POST /api/tickets — Create Ticket API Tests (Issue 10)", () => {
  const activeUser = { id: 1, name: "Alice", isActive: true };
  const inactiveUser = { id: 2, name: "Bob", isActive: false };

  const validCategory = { id: 1, name: "Hardware", isActive: true };
  const validRelatedSystem = { id: 1, name: "Laptop", isActive: true };

  beforeEach(() => {
    const mockPrisma = {
      requesterUser: {
        findUnique: vi.fn().mockImplementation(({ where }) => {
          if (where.id === 1) return Promise.resolve(activeUser);
          if (where.id === 2) return Promise.resolve(inactiveUser);
          return Promise.resolve(null);
        }),
      },
      category: {
        findUnique: vi.fn().mockImplementation(({ where }) => {
          if (where.id === 1) return Promise.resolve(validCategory);
          return Promise.resolve(null);
        }),
      },
      relatedSystem: {
        findUnique: vi.fn().mockImplementation(({ where }) => {
          if (where.id === 1) return Promise.resolve(validRelatedSystem);
          return Promise.resolve(null);
        }),
      },
      ticket: {
        create: vi.fn().mockImplementation(({ data }) => {
          return Promise.resolve({
            id: 101,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma as any);
  });

  it("API-01 & API-02: should create ticket successfully with HTTP 201, TKT number, and NEW status", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("X-Development-Requester-Id", "1")
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "MEDIUM",
        summary: "Laptop battery drains fast",
        description: "The laptop battery drains in less than 30 minutes after standard update.",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", 101);
    expect(res.body).toHaveProperty("ticketNumber");
    expect(res.body.ticketNumber).toMatch(/^TKT-\d{4}-\d{6}$/);
    expect(res.body).toHaveProperty("currentStatus", "NEW");
    expect(res.body).toHaveProperty("summary", "Laptop battery drains fast");
  });

  it("API-03: should return 400 Bad Request for short summary or description", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("X-Development-Requester-Id", "1")
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "MEDIUM",
        summary: "Bad",
        description: "Short",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty("code", "VALIDATION_ERROR");
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "summary" }),
        expect.objectContaining({ field: "description" }),
      ])
    );
  });

  it("should return 400 Bad Request when header is missing", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "MEDIUM",
        summary: "Valid Summary Here",
        description: "Valid Description Here with enough length",
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return 422 Unprocessable Entity when requester is inactive", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("X-Development-Requester-Id", "2")
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "MEDIUM",
        summary: "Valid Summary Here",
        description: "Valid Description Here with enough length",
      });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("INACTIVE_REQUESTER");
  });
});

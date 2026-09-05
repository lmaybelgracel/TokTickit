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

describe("POST /api/tickets — initial attachment transaction", () => {
  const ticketCreate = vi.fn();
  const attachmentCreateMany = vi.fn();
  const transaction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    ticketCreate.mockResolvedValue({ id: 101, ticketNumber: "TKT-2026-000101" });
    attachmentCreateMany.mockRejectedValue(new Error("metadata write failed"));
    transaction.mockImplementation(async (callback: (client: any) => Promise<unknown>) => callback({
      ticket: { create: ticketCreate },
      attachment: { createMany: attachmentCreateMany },
    }));
    vi.spyOn(prismaModule, "getPrisma").mockReturnValue({
      requesterUser: { findUnique: vi.fn().mockResolvedValue({ id: 1, isActive: true }) },
      category: { findUnique: vi.fn().mockResolvedValue({ id: 1, isActive: true }) },
      relatedSystem: { findUnique: vi.fn().mockResolvedValue({ id: 1, isActive: true }) },
      ticket: { create: ticketCreate },
      $transaction: transaction,
    } as any);
  });

  it("API-10: returns a safe error when initial attachment metadata makes the transaction fail", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("X-Development-Requester-Id", "1")
      .field("categoryId", "1")
      .field("relatedSystemId", "1")
      .field("requestedPriority", "MEDIUM")
      .field("summary", "Laptop battery drains fast")
      .field("description", "The battery drains within thirty minutes after an update.")
      .attach("attachments", Buffer.from("png"), { filename: "proof.png", contentType: "image/png" });

    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe("SERVER_ERROR");
    expect(transaction).toHaveBeenCalledOnce();
    expect(attachmentCreateMany).toHaveBeenCalledOnce();
  });

  it("API-07: rejects an unsupported initial attachment before creating a ticket", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("X-Development-Requester-Id", "1")
      .field("categoryId", "1")
      .field("relatedSystemId", "1")
      .field("requestedPriority", "MEDIUM")
      .field("summary", "Laptop battery drains fast")
      .field("description", "The battery drains within thirty minutes after an update.")
      .attach("attachments", Buffer.from("text"), { filename: "notes.txt", contentType: "text/plain" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("UNSUPPORTED_FILE_TYPE");
    expect(ticketCreate).not.toHaveBeenCalled();
  });
});

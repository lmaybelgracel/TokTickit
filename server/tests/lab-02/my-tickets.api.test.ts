import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";

describe("GET /api/tickets — My Tickets API Tests (Issue 11)", () => {
  const activeUser1 = { id: 1, name: "Alice", isActive: true };
  const activeUser2 = { id: 2, name: "Bob", isActive: true };
  const inactiveUser = { id: 3, name: "Charlie", isActive: false };

  const mockTickets = [
    {
      id: 101,
      ticketNumber: "TKT-2026-000001",
      summary: "Laptop battery issue",
      description: "Battery drains fast",
      requestedPriority: "HIGH",
      currentStatus: "NEW",
      requesterId: 1,
      categoryId: 1,
      relatedSystemId: 1,
      createdAt: new Date("2026-09-01T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-09-01T10:00:00Z").toISOString(),
      category: { id: 1, name: "Hardware" },
      relatedSystem: { id: 1, name: "Laptop" },
    },
    {
      id: 102,
      ticketNumber: "TKT-2026-000002",
      summary: "VPN connection drops",
      description: "Cannot connect to campus VPN",
      requestedPriority: "MEDIUM",
      currentStatus: "NEW",
      requesterId: 1,
      categoryId: 2,
      relatedSystemId: 2,
      createdAt: new Date("2026-09-01T11:00:00Z").toISOString(),
      updatedAt: new Date("2026-09-01T11:00:00Z").toISOString(),
      category: { id: 2, name: "Network" },
      relatedSystem: { id: 2, name: "VPN" },
    },
  ];

  beforeEach(() => {
    const mockPrisma = {
      requesterUser: {
        findUnique: vi.fn().mockImplementation(({ where }) => {
          if (where.id === 1) return Promise.resolve(activeUser1);
          if (where.id === 2) return Promise.resolve(activeUser2);
          if (where.id === 3) return Promise.resolve(inactiveUser);
          return Promise.resolve(null);
        }),
      },
      ticket: {
        count: vi.fn().mockImplementation(({ where }) => {
          if (where.requesterId === 2) return Promise.resolve(0);
          return Promise.resolve(mockTickets.length);
        }),
        findMany: vi.fn().mockImplementation(({ where }) => {
          if (where.requesterId === 2) return Promise.resolve([]);
          if (where.search || where.OR) {
            return Promise.resolve([mockTickets[0]]);
          }
          return Promise.resolve(mockTickets);
        }),
      },
    };

    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma as any);
  });

  it("API-05: should return 200 OK and paginated ticket list for active Requester 1", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("X-Development-Requester-Id", "1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination).toEqual({
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    });
  });

  it("should isolate data and return 0 tickets when active Requester 2 queries tickets", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("X-Development-Requester-Id", "2");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.totalItems).toBe(0);
  });

  it("should return 400 Bad Request when header is missing", async () => {
    const res = await request(app).get("/api/tickets");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should return 422 Unprocessable Entity when requester is inactive", async () => {
    const res = await request(app)
      .get("/api/tickets")
      .set("X-Development-Requester-Id", "3");

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("INACTIVE_REQUESTER");
  });

  it.each([
    "category=abc",
    "priority=URGENT",
    "status=INVALID",
    "sort=summary:desc",
    "page=0",
    "pageSize=7",
  ])("should return 400 for invalid query: %s", async (query) => {
    const res = await request(app)
      .get(`/api/tickets?${query}`)
      .set("X-Development-Requester-Id", "1");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_QUERY");
  });
});

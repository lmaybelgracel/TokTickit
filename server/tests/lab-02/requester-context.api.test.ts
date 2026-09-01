import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";

describe("GET /api/requesters — Development Requester API Tests (Issue 9)", () => {
  const mockRequesters = [
    {
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      department: "IT",
      isActive: true,
    },
    {
      id: 2,
      name: "Bob Jones",
      email: "bob@example.com",
      department: "Finance",
      isActive: true,
    },
  ];

  beforeEach(() => {
    const mockPrisma = {
      requesterUser: {
        findMany: vi.fn().mockImplementation(({ where }) => {
          if (where?.isActive === true) {
            return Promise.resolve(mockRequesters);
          }
          return Promise.resolve([
            ...mockRequesters,
            {
              id: 3,
              name: "Charlie Inactive",
              email: "charlie@example.com",
              department: "HR",
              isActive: false,
            },
          ]);
        }),
      },
    };
    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma as any);
  });

  it("should return HTTP 200 and an array of active Development Requesters", async () => {
    const res = await request(app).get("/api/requesters");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const requester = res.body[0];
      expect(requester).toHaveProperty("id");
      expect(requester).toHaveProperty("name");
      expect(requester).toHaveProperty("email");
      expect(requester).toHaveProperty("department");
      expect(requester).toHaveProperty("isActive", true);
    }
  });

  it("should exclude inactive Development Requesters from the returned list", async () => {
    const res = await request(app).get("/api/requesters");

    expect(res.status).toBe(200);
    const inactiveUsers = res.body.filter((r: any) => r.isActive === false);
    expect(inactiveUsers.length).toBe(0);
  });
});


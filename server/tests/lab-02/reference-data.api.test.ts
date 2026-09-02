import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";

describe("Reference Data APIs — Issue 10", () => {
  const mockCategories = [
    { id: 1, name: "Account and Access", description: "Login, passwords", isActive: true },
    { id: 2, name: "Hardware", description: "Laptops, monitors", isActive: true },
  ];

  const mockRelatedSystems = [
    { id: 1, name: "Email", category: "Account and Access", isActive: true },
    { id: 2, name: "Campus Wi-Fi", category: "Network", isActive: true },
  ];

  beforeEach(() => {
    const mockPrisma = {
      category: {
        findMany: vi.fn().mockResolvedValue(mockCategories),
      },
      relatedSystem: {
        findMany: vi.fn().mockResolvedValue(mockRelatedSystems),
      },
    };
    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mockPrisma as any);
  });

  it("GET /api/categories — should return HTTP 200 and list of active categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("name", "Account and Access");
  });

  it("GET /api/related-systems — should return HTTP 200 and list of active related systems", async () => {
    const res = await request(app).get("/api/related-systems");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("name", "Email");
  });
});

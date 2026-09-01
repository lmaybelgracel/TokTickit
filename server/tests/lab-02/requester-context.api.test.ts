import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("GET /api/requesters — Development Requester API Tests (Issue 9)", () => {
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

import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("GET /api/health", () => {
  it("returns 200 with status ok and the service name", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", service: "TokTickIT API" });
  });

  it("validates that response body strictly contains status and service fields", async () => {
    const res = await request(app).get("/api/health");
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("service", "TokTickIT API");
    expect(res.body.status).not.toBe("error");
  });

  it("returns 404 for invalid API routes to ensure safe error handling", async () => {
    const res = await request(app).get("/api/unknown-health-route");
    expect(res.status).toBe(404);
  });

  it("returns 500 with internal server error response when backend/DB fails", async () => {
    const res = await request(app).get("/api/health?simulate_error=true");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
  });
});

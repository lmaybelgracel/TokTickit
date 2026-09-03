import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";

describe("Ticket detail API", () => {
  const ticket = { id: 101, requesterId: 1, ticketNumber: "TKT-2026-000101", attachments: [] };
  const mock = { ticket: { findUnique: vi.fn() } };

  beforeEach(() => {
    vi.clearAllMocks();
    mock.ticket.findUnique.mockResolvedValue(ticket);
    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mock as any);
  });

  it("API-06: returns an owned ticket and blocks a different requester", async () => {
    expect((await request(app).get("/api/tickets/101").set("X-Development-Requester-Id", "1")).status).toBe(200);
    const forbidden = await request(app).get("/api/tickets/101").set("X-Development-Requester-Id", "2");
    expect(forbidden.status).toBe(403);
    expect(forbidden.body.error.code).toBe("FORBIDDEN_ACCESS");
  });
});

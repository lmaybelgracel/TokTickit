import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";

describe("Issue 12 — Ticket detail and attachments", () => {
  const ticket = { id: 101, requesterId: 1, ticketNumber: "TKT-2026-000101", attachments: [], requester: { id: 1, name: "Alice", email: "a@test" }, category: { id: 1, name: "Hardware" }, relatedSystem: { id: 1, name: "Laptop" } };
  const active = { id: 501, ticketId: 101, filename: "proof.png", storedPath: "missing-test-file", fileSize: 3, mimeType: "image/png", isRemoved: false, removedAt: null, removalReason: null, uploadedAt: new Date(), ticket: { requesterId: 1 } };
  const removed = { ...active, id: 502, isRemoved: true, removedAt: new Date(), removalReason: "Old file" };
  const mock = { requesterUser: { findUnique: vi.fn() }, ticket: { findUnique: vi.fn() }, attachment: { findUnique: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn() } };

  beforeEach(() => { vi.clearAllMocks(); mock.requesterUser.findUnique.mockResolvedValue({ isActive: true }); mock.ticket.findUnique.mockResolvedValue(ticket); mock.attachment.findUnique.mockResolvedValue(active); mock.attachment.count.mockResolvedValue(0); mock.attachment.update.mockImplementation(async ({ data }: any) => ({ ...active, ...data })); vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mock as any); });

  it("returns owned ticket detail and blocks another requester", async () => {
    expect((await request(app).get("/api/tickets/101").set("X-Development-Requester-Id", "1")).status).toBe(200);
    const forbidden = await request(app).get("/api/tickets/101").set("X-Development-Requester-Id", "2");
    expect(forbidden.status).toBe(403); expect(forbidden.body.error.code).toBe("FORBIDDEN_ACCESS");
  });

  it("rejects a sixth active attachment", async () => {
    mock.attachment.count.mockResolvedValue(5);
    const response = await request(app).post("/api/tickets/101/attachments").set("X-Development-Requester-Id", "1").attach("file", Buffer.from("png"), { filename: "proof.png", contentType: "image/png" });
    expect(response.status).toBe(400); expect(response.body.error.code).toBe("ATTACHMENT_LIMIT");
  });

  it("rejects attachment uploads for an inactive requester", async () => {
    mock.requesterUser.findUnique.mockResolvedValue({ isActive: false });
    const response = await request(app).post("/api/tickets/101/attachments").set("X-Development-Requester-Id", "1").attach("file", Buffer.from("png"), { filename: "proof.png", contentType: "image/png" });
    expect(response.status).toBe(422); expect(response.body.error.code).toBe("INACTIVE_REQUESTER");
  });

  it("validates removal reason and soft-removes an owned attachment", async () => {
    expect((await request(app).delete("/api/attachments/501").set("X-Development-Requester-Id", "1").send({ removalReason: "x" })).status).toBe(400);
    const response = await request(app).delete("/api/attachments/501").set("X-Development-Requester-Id", "1").send({ removalReason: "Outdated screenshot" });
    expect(response.status).toBe(200); expect(mock.attachment.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ isRemoved: true, removalReason: "Outdated screenshot" }) }));
  });

  it("returns 410 when downloading a removed attachment", async () => {
    mock.attachment.findUnique.mockResolvedValue(removed);
    const response = await request(app).get("/api/attachments/502/download").set("X-Development-Requester-Id", "1");
    expect(response.status).toBe(410); expect(response.body.error.code).toBe("ATTACHMENT_REMOVED");
  });
});

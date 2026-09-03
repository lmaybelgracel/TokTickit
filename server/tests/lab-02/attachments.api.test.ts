import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import * as prismaModule from "../../src/prisma.js";

describe("Attachment lifecycle API", () => {
  const ticket = { id: 101, requesterId: 1 };
  const active = { id: 501, ticketId: 101, filename: "proof.png", storedPath: "missing-test-file", fileSize: 3, mimeType: "image/png", isRemoved: false, removedAt: null, removalReason: null, uploadedAt: new Date(), ticket: { requesterId: 1 } };
  const removed = { ...active, id: 502, isRemoved: true, removedAt: new Date(), removalReason: "Old file" };
  const mock = { requesterUser: { findUnique: vi.fn() }, ticket: { findUnique: vi.fn() }, attachment: { findUnique: vi.fn(), count: vi.fn(), create: vi.fn(), update: vi.fn() } };

  beforeEach(() => {
    vi.clearAllMocks();
    mock.requesterUser.findUnique.mockResolvedValue({ isActive: true });
    mock.ticket.findUnique.mockResolvedValue(ticket);
    mock.attachment.findUnique.mockResolvedValue(active);
    mock.attachment.count.mockResolvedValue(0);
    mock.attachment.update.mockImplementation(async ({ data }: any) => ({ ...active, ...data }));
    vi.spyOn(prismaModule, "getPrisma").mockReturnValue(mock as any);
  });

  it("API-07: rejects a sixth active attachment", async () => {
    mock.attachment.count.mockResolvedValue(5);
    const response = await request(app).post("/api/tickets/101/attachments").set("X-Development-Requester-Id", "1").attach("file", Buffer.from("png"), { filename: "proof.png", contentType: "image/png" });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("ATTACHMENT_LIMIT");
  });

  it("API-07: rejects an attachment larger than 5 MB", async () => {
    const response = await request(app)
      .post("/api/tickets/101/attachments")
      .set("X-Development-Requester-Id", "1")
      .attach("file", Buffer.alloc(5 * 1024 * 1024 + 1), { filename: "large.png", contentType: "image/png" });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("FILE_TOO_LARGE");
    expect(mock.attachment.create).not.toHaveBeenCalled();
  });

  it("rejects uploads for an inactive requester", async () => {
    mock.requesterUser.findUnique.mockResolvedValue({ isActive: false });
    const response = await request(app).post("/api/tickets/101/attachments").set("X-Development-Requester-Id", "1").attach("file", Buffer.from("png"), { filename: "proof.png", contentType: "image/png" });
    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe("INACTIVE_REQUESTER");
  });

  it("API-08: validates the reason and soft-removes an owned attachment", async () => {
    expect((await request(app).delete("/api/attachments/501").set("X-Development-Requester-Id", "1").send({ removalReason: "x" })).status).toBe(400);
    const response = await request(app).delete("/api/attachments/501").set("X-Development-Requester-Id", "1").send({ removalReason: "Outdated screenshot" });
    expect(response.status).toBe(200);
    expect(mock.attachment.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ isRemoved: true, removalReason: "Outdated screenshot" }) }));
  });

  it("API-09: returns 410 when downloading a removed attachment", async () => {
    mock.attachment.findUnique.mockResolvedValue(removed);
    const response = await request(app).get("/api/attachments/502/download").set("X-Development-Requester-Id", "1");
    expect(response.status).toBe(410);
    expect(response.body.error.code).toBe("ATTACHMENT_REMOVED");
  });
});

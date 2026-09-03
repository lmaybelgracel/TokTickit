import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TicketDetail } from "../../components/TicketDetail";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual<typeof import("../../api")>("../../api");
  return { ...actual, fetchTicketDetail: vi.fn(), removeAttachment: vi.fn(), uploadAttachment: vi.fn(), downloadAttachment: vi.fn() };
});

describe("Attachment Section", () => {
  const requester = { id: 1, name: "Alice", email: "alice@test", department: "IT", isActive: true };
  const ticket = { id: 101, ticketNumber: "TKT-2026-000101", summary: "Laptop issue", description: "Battery drains very quickly", requestedPriority: "HIGH" as const, currentStatus: "NEW", requesterId: 1, categoryId: 1, relatedSystemId: 1, createdAt: "2026-09-01T10:00:00Z", updatedAt: "2026-09-01T10:00:00Z", attachments: [] };
  beforeEach(() => { vi.mocked(api.fetchTicketDetail).mockResolvedValue({ ...ticket, attachments: [] }); });

  it("rejects an unsupported file before calling the upload API", async () => {
    render(<TicketDetail activeRequester={requester} ticketId={101} onBack={vi.fn()} />);
    const input = await screen.findByLabelText("Upload attachment");
    fireEvent.change(input, { target: { files: [new File(["bad"], "notes.txt", { type: "text/plain" })] } });
    expect(await screen.findByRole("alert")).toHaveTextContent("Only JPG, PNG, WEBP, and PDF files are allowed.");
    expect(api.uploadAttachment).not.toHaveBeenCalled();
  });
});

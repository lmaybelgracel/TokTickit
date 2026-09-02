import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TicketDetail } from "../../components/TicketDetail";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual<typeof import("../../api")>("../../api");
  return { ...actual, fetchTicketDetail: vi.fn(), removeAttachment: vi.fn(), uploadAttachment: vi.fn(), downloadAttachment: vi.fn() };
});

describe("TicketDetail — Issue 12", () => {
  const requester = { id: 1, name: "Alice", email: "alice@test", department: "IT", isActive: true };
  const ticket = { id: 101, ticketNumber: "TKT-2026-000101", summary: "Laptop issue", description: "Battery drains very quickly", requestedPriority: "HIGH" as const, currentStatus: "NEW", requesterId: 1, categoryId: 1, relatedSystemId: 1, createdAt: "2026-09-01T10:00:00Z", updatedAt: "2026-09-01T10:00:00Z", category: { id: 1, name: "Hardware" }, relatedSystem: { id: 1, name: "Laptop" }, attachments: [{ id: 501, ticketId: 101, filename: "old.png", fileSize: 1024, mimeType: "image/png", isRemoved: true, uploadedAt: "2026-09-01T10:00:00Z", removedAt: "2026-09-01T11:00:00Z", removalReason: "Outdated screenshot" }] };

  beforeEach(() => { vi.mocked(api.fetchTicketDetail).mockResolvedValue(ticket); });

  it("renders read-only detail and removed attachment metadata without an active download", async () => {
    render(<TicketDetail activeRequester={requester} ticketId={101} onBack={vi.fn()} />);
    expect(await screen.findByText("TKT-2026-000101")).toBeInTheDocument();
    expect(screen.getByText("Outdated screenshot")).toBeInTheDocument();
    expect(screen.getByTitle("File removed - download unavailable")).toBeDisabled();
  });

  it("requires at least three characters before confirming removal", async () => {
    vi.mocked(api.fetchTicketDetail).mockResolvedValue({ ...ticket, attachments: [{ ...ticket.attachments[0], isRemoved: false, removedAt: null, removalReason: null }] });
    render(<TicketDetail activeRequester={requester} ticketId={101} onBack={vi.fn()} />);
    fireEvent.click(await screen.findByRole("button", { name: "Soft Remove" }));
    const confirm = screen.getByRole("button", { name: "Confirm removal" });
    expect(confirm).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Old" } });
    await waitFor(() => expect(confirm).toBeEnabled());
  });
});

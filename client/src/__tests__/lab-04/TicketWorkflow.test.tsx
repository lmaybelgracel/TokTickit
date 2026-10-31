import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { StaffTicketDetail } from "../../components/StaffTicketDetail";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    fetchStaffTicketDetail: vi.fn(),
    fetchStaffUsers: vi.fn(),
    claimTicket: vi.fn(),
    assignTicket: vi.fn(),
    updateItPriority: vi.fn(),
    updateTicketStatus: vi.fn(),
    resolveTicket: vi.fn(),
    addTicketComment: vi.fn(),
    addTicketNote: vi.fn(),
    fetchTicketActions: vi.fn().mockResolvedValue([]),
  };
});

describe("Ticket Workflow, Resolution Gate & Concurrency UI Suite (Issue 31 - UI-WORK-01)", () => {
  const sampleTicket: any = {
    id: 142,
    ticketNumber: "TKT-2026-000142",
    summary: "Wi-Fi disconnections on 3rd floor",
    description: "Laptops lose connection randomly during peak hours.",
    requestedPriority: "HIGH",
    itPriority: "HIGH",
    currentStatus: "IN_PROGRESS",
    requesterId: 20,
    categoryId: 1,
    relatedSystemId: 1,
    ownerId: 10,
    resolutionSummary: null,
    resolvedAt: null,
    requesterResolvedIndication: false,
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-10-15T10:00:00.000Z",
    category: { id: 1, name: "Network" },
    relatedSystem: { id: 1, name: "Aruba AP" },
    requester: { id: 20, name: "Alice Smith", email: "alice@example.com" },
    owner: { id: 10, name: "Somchai Staff", email: "somchai@toktickit.com", role: "IT_STAFF" },
    attachments: [],
    comments: [],
    notes: [],
  };

  const sampleStaffUsers: api.StaffUser[] = [
    { id: 10, name: "Somchai Staff", email: "somchai@toktickit.com", role: "IT_STAFF" },
    { id: 11, name: "Suda Admin", email: "admin@toktickit.com", role: "ADMINISTRATOR" },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(api.fetchStaffTicketDetail).mockResolvedValue(sampleTicket);
    vi.mocked(api.fetchStaffUsers).mockResolvedValue(sampleStaffUsers);
    vi.mocked(api.fetchTicketActions).mockResolvedValue([]);
  });

  describe("UI-WORK-01: Problem Appears Resolved Advisory Banner (AC-10, BR-12)", () => {
    it("renders the advisory banner when requesterResolvedIndication is true without modifying currentStatus badge", async () => {
      vi.mocked(api.fetchStaffTicketDetail).mockResolvedValue({
        ...sampleTicket,
        currentStatus: "IN_PROGRESS",
        requesterResolvedIndication: true,
      });

      render(<StaffTicketDetail ticketId={142} onBack={vi.fn()} />);

      // The advisory banner must be visible
      const banner = await screen.findByText(/The requester has indicated that their problem appears resolved/i);
      expect(banner).toBeInTheDocument();

      // The status badge MUST still display IN PROGRESS (not RESOLVED) per BR-12
      const statusBadge = screen.getByText("IN PROGRESS");
      expect(statusBadge).toBeInTheDocument();
      expect(screen.queryByText(/^RESOLVED$/)).not.toBeInTheDocument();
    });

    it("does not render the advisory banner when requesterResolvedIndication is false", async () => {
      vi.mocked(api.fetchStaffTicketDetail).mockResolvedValue({
        ...sampleTicket,
        currentStatus: "IN_PROGRESS",
        requesterResolvedIndication: false,
      });

      render(<StaffTicketDetail ticketId={142} onBack={vi.fn()} />);

      await screen.findByText("TKT-2026-000142");
      expect(
        screen.queryByText(/The requester has indicated that their problem appears resolved/i)
      ).not.toBeInTheDocument();
    });
  });

  describe("Formal Resolution Workflow & Validation (AC-06, BR-11, BR-20)", () => {
    it("opens resolve modal, validates summary length, and submits with knownUpdatedAt", async () => {
      vi.mocked(api.resolveTicket).mockResolvedValue({
        ...sampleTicket,
        currentStatus: "RESOLVED",
        resolutionSummary: "Adjusted AP transmit power and tested packet throughput.",
        updatedAt: "2026-10-15T11:00:00.000Z",
      });

      render(<StaffTicketDetail ticketId={142} onBack={vi.fn()} />);

      const resolveBtn = await screen.findByRole("button", { name: /Resolve Ticket/i });
      fireEvent.click(resolveBtn);

      // Verify modal opened
      expect(await screen.findByText(/Resolve Ticket: TKT-2026-000142/i)).toBeInTheDocument();

      const textarea = screen.getByPlaceholderText(/Describe how the problem was resolved/i);
      const confirmBtn = screen.getByRole("button", { name: /Confirm & Resolve/i });

      // Initially disabled when empty
      expect(confirmBtn).toBeDisabled();

      // Typing too short (< 3 chars)
      fireEvent.change(textarea, { target: { value: "ok" } });
      expect(confirmBtn).toBeDisabled();

      // Valid resolution summary (>= 3 chars)
      fireEvent.change(textarea, {
        target: { value: "Adjusted AP transmit power and tested packet throughput." },
      });
      expect(confirmBtn).not.toBeDisabled();

      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(api.resolveTicket).toHaveBeenCalledWith(
          142,
          "Adjusted AP transmit power and tested packet throughput.",
          null,
          sampleTicket.updatedAt
        );
      });

      // Verify success notification displayed
      expect(
        await screen.findByText(/Ticket has been resolved with resolution summary recorded/i)
      ).toBeInTheDocument();
    });

    it("closes the resolve modal when Escape key is pressed (WCAG 2.1 AA)", async () => {
      render(<StaffTicketDetail ticketId={142} onBack={vi.fn()} />);

      const resolveBtn = await screen.findByRole("button", { name: /Resolve Ticket/i });
      fireEvent.click(resolveBtn);

      expect(await screen.findByText(/Resolve Ticket: TKT-2026-000142/i)).toBeInTheDocument();

      // Press Escape key
      fireEvent.keyDown(window, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByText(/Resolve Ticket: TKT-2026-000142/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Concurrency Conflict Handling in UI (AC-08, BR-13)", () => {
    it("displays conflict error and refreshes ticket data when 409 Conflict occurs during status transition", async () => {
      const conflictError: any = new Error("Conflict error");
      conflictError.status = 409;
      vi.mocked(api.updateTicketStatus).mockRejectedValueOnce(conflictError);

      render(<StaffTicketDetail ticketId={142} onBack={vi.fn()} />);

      const statusSelect = await screen.findByLabelText(/Next Status/i);
      fireEvent.change(statusSelect, { target: { value: "WAITING_FOR_REQUESTER" } });

      await waitFor(() => {
        expect(
          screen.getByText(/Conflict: This ticket was modified by another user. Refreshing latest data.../i)
        ).toBeInTheDocument();
      });

      // Verifies that fetchStaffTicketDetail was called again to refresh latest data
      expect(api.fetchStaffTicketDetail).toHaveBeenCalledTimes(2);
    });

    it("displays conflict error in resolve modal when 409 Conflict occurs during resolution", async () => {
      const conflictError: any = new Error("Conflict error");
      conflictError.status = 409;
      vi.mocked(api.resolveTicket).mockRejectedValueOnce(conflictError);

      render(<StaffTicketDetail ticketId={142} onBack={vi.fn()} />);

      const resolveBtn = await screen.findByRole("button", { name: /Resolve Ticket/i });
      fireEvent.click(resolveBtn);

      const textarea = await screen.findByPlaceholderText(/Describe how the problem was resolved/i);
      fireEvent.change(textarea, { target: { value: "Resolution notes for testing conflict." } });

      const confirmBtn = screen.getByRole("button", { name: /Confirm & Resolve/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Conflict: This ticket was modified by another user. Refreshing latest data.../i)
        ).toBeInTheDocument();
      });
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { StaffTicketQueue } from "../../components/StaffTicketQueue";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    fetchCategories: vi.fn(),
    fetchStaffTickets: vi.fn(),
  };
});

describe("IT Staff Ticket Queue Component Tests (Sprint 3 - Issue 20)", () => {
  const sampleCategories = [
    { id: 1, name: "Network & Connectivity" },
    { id: 2, name: "Hardware & Devices" },
  ];

  const sampleTickets: api.Ticket[] = [
    {
      id: 101,
      ticketNumber: "TCK-2026-0001",
      summary: "VPN connection dropping repeatedly",
      description: "Tunnel disconnects after 5 minutes.",
      requestedPriority: "HIGH",
      itPriority: "URGENT",
      currentStatus: "OPEN",
      requesterId: 20,
      categoryId: 1,
      relatedSystemId: 1,
      createdAt: "2026-09-01T10:00:00Z",
      updatedAt: "2026-09-01T10:30:00Z",
      category: { id: 1, name: "Network & Connectivity" },
      relatedSystem: { id: 1, name: "GlobalProtect VPN" },
      requester: { id: 20, name: "Alice Smith", email: "alice@example.com" },
      owner: { id: 10, name: "Somchai Jaidee", email: "somchai.it@toktickit.com" },
    },
    {
      id: 102,
      ticketNumber: "TCK-2026-0002",
      summary: "Second monitor flickers",
      description: "Screen flashes black intermittently.",
      requestedPriority: "MEDIUM",
      itPriority: "LOW",
      currentStatus: "NEW",
      requesterId: 21,
      categoryId: 2,
      relatedSystemId: 2,
      createdAt: "2026-09-02T08:00:00Z",
      updatedAt: "2026-09-02T08:00:00Z",
      category: { id: 2, name: "Hardware & Devices" },
      relatedSystem: { id: 2, name: "Dell Monitor" },
      requester: { id: 21, name: "Bob Johnson", email: "bob@example.com" },
      owner: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchCategories as any).mockResolvedValue(sampleCategories);
    (api.fetchStaffTickets as any).mockResolvedValue({
      tickets: sampleTickets,
      pagination: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it("UI-QUEUE-01: renders staff queue heading, search input, filters, table headers, and ticket badges", async () => {
    render(<StaffTicketQueue />);

    expect(screen.getByText("IT Staff Ticket Queue")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by Ticket No or Summary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by requested priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by IT priority/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText("TCK-2026-0001")[0]).toBeInTheDocument();
      expect(screen.getAllByText("TCK-2026-0002")[0]).toBeInTheDocument();
    });

    // Priority badges
    expect(screen.getAllByText("URGENT")[0]).toBeInTheDocument();
    expect(screen.getAllByText("LOW")[0]).toBeInTheDocument();

    // Status badges
    expect(screen.getAllByText("OPEN")[0]).toBeInTheDocument();
    expect(screen.getAllByText("NEW")[0]).toBeInTheDocument();

    // Owner badges
    expect(screen.getAllByText("Somchai Jaidee")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Unassigned")[0]).toBeInTheDocument();
  });

  it("UI-QUEUE-02: debounces search input and triggers fetchStaffTickets with search parameter", async () => {
    render(<StaffTicketQueue />);

    const searchInput = screen.getByPlaceholderText(/Search by Ticket No or Summary/i);
    fireEvent.change(searchInput, { target: { value: "VPN" } });

    await waitFor(
      () => {
        expect(api.fetchStaffTickets).toHaveBeenCalledWith(
          expect.objectContaining({
            search: "VPN",
          })
        );
      },
      { timeout: 1000 }
    );
  });

  it("UI-QUEUE-03: filtering by category, status, and IT priority updates query", async () => {
    render(<StaffTicketQueue />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Filter by category/i)).toBeInTheDocument();
    });

    const categorySelect = screen.getByLabelText(/Filter by category/i);
    fireEvent.change(categorySelect, { target: { value: "1" } });

    const statusSelect = screen.getByLabelText(/Filter by status/i);
    fireEvent.change(statusSelect, { target: { value: "OPEN" } });

    const itPriSelect = screen.getByLabelText(/Filter by IT priority/i);
    fireEvent.change(itPriSelect, { target: { value: "URGENT" } });

    await waitFor(() => {
      expect(api.fetchStaffTickets).toHaveBeenCalledWith(
        expect.objectContaining({
          category: "1",
          status: "OPEN",
          itPriority: "URGENT",
        })
      );
    });
  });

  it("UI-QUEUE-04: ownership toggle between Unassigned, Assigned to Me, and All updates query", async () => {
    render(<StaffTicketQueue />);

    const unassignedBtn = screen.getByRole("button", { name: "Unassigned" });
    fireEvent.click(unassignedBtn);

    await waitFor(() => {
      expect(api.fetchStaffTickets).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId: "unassigned",
        })
      );
    });

    const meBtn = screen.getByRole("button", { name: "Assigned to Me" });
    fireEvent.click(meBtn);

    await waitFor(() => {
      expect(api.fetchStaffTickets).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId: "me",
        })
      );
    });
  });

  it("UI-QUEUE-05: clicking Clear Filters resets all filters and reloads tickets", async () => {
    render(<StaffTicketQueue />);

    const searchInput = screen.getByPlaceholderText(/Search by Ticket No or Summary/i);
    fireEvent.change(searchInput, { target: { value: "Something" } });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Clear Filters/i })).toBeInTheDocument();
    });

    const clearBtn = screen.getByRole("button", { name: /Clear Filters/i });
    fireEvent.click(clearBtn);

    expect(searchInput).toHaveValue("");
    await waitFor(() => {
      expect(api.fetchStaffTickets).toHaveBeenCalledWith(
        expect.objectContaining({
          search: undefined,
          ownerId: undefined,
        })
      );
    });
  });

  it("UI-QUEUE-06: displays clear empty state when no tickets match filters", async () => {
    (api.fetchStaffTickets as any).mockResolvedValue({
      tickets: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });

    render(<StaffTicketQueue />);

    await waitFor(() => {
      expect(screen.getAllByText("No tickets match your filters")[0]).toBeInTheDocument();
    });
  });

  it("UI-QUEUE-07: clicking a ticket number invokes onSelectTicket callback", async () => {
    const onSelectTicketMock = vi.fn();
    render(<StaffTicketQueue onSelectTicket={onSelectTicketMock} />);

    await waitFor(() => {
      expect(screen.getAllByText("TCK-2026-0001")[0]).toBeInTheDocument();
    });

    const ticketLink = screen.getAllByText("TCK-2026-0001")[0];
    fireEvent.click(ticketLink);

    expect(onSelectTicketMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 101,
        ticketNumber: "TCK-2026-0001",
      })
    );
  });
});

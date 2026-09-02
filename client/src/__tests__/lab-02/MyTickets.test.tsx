import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MyTickets } from "../../components/MyTickets";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    fetchCategories: vi.fn(),
    fetchMyTickets: vi.fn(),
  };
});

describe("MyTickets Component (Issue 11)", () => {
  const mockRequester = {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    department: "IT",
    isActive: true,
  };

  const mockCategories = [
    { id: 1, name: "Hardware", description: "Hardware issues" },
    { id: 2, name: "Software", description: "Software issues" },
  ];

  const mockTickets = [
    {
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Laptop screen flickering",
      description: "Screen flickers on high brightness",
      requestedPriority: "HIGH" as const,
      currentStatus: "NEW",
      requesterId: 1,
      categoryId: 1,
      relatedSystemId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: { id: 1, name: "Hardware" },
      relatedSystem: { id: 1, name: "Laptop" },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchCategories as any).mockResolvedValue(mockCategories);
    (api.fetchMyTickets as any).mockResolvedValue({
      data: mockTickets,
      pagination: {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
      },
    });
  });

  it("renders list of user-owned tickets with badges and search control", async () => {
    const onSelectTicket = vi.fn();
    render(
      <MyTickets
        activeRequester={mockRequester}
        onNavigateCreate={vi.fn()}
        onSelectTicket={onSelectTicket}
      />
    );

    expect(screen.getByText("My Tickets")).toBeInTheDocument();
    expect((await screen.findAllByText("TKT-2026-000101")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Laptop screen flickering").length).toBeGreaterThan(0);
    expect(screen.getAllByText("HIGH").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NEW").length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Search by ticket number or summary/i)).toBeInTheDocument();
    expect(document.querySelector(".my-tickets__cards")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /View detail/i })[0]);
    expect(onSelectTicket).toHaveBeenCalledWith(mockTickets[0]);
  });

  it("UI-04: displays clear no-results state and Clear Filters button when 0 tickets match search", async () => {
    (api.fetchMyTickets as any).mockResolvedValue({
      data: [],
      pagination: {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
      },
    });

    render(
      <MyTickets
        activeRequester={mockRequester}
        onNavigateCreate={vi.fn()}
      />
    );

    await screen.findByText("My Tickets");

    const searchInput = screen.getByPlaceholderText(/Search by ticket number or summary/i);
    fireEvent.change(searchInput, { target: { value: "NonExistentTicketQuery" } });

    expect(await screen.findByText("No Tickets Found")).toBeInTheDocument();
    expect(
      screen.getByText("No tickets match your search and filter criteria.")
    ).toBeInTheDocument();

    const clearFiltersBtns = screen.getAllByRole("button", { name: /Clear Filters/i });
    expect(clearFiltersBtns.length).toBeGreaterThan(0);

    fireEvent.click(clearFiltersBtns[0]);
    await waitFor(() => expect(searchInput).toHaveValue(""));
  });
});

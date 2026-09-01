import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateTicket } from "../../components/CreateTicket";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    fetchCategories: vi.fn(),
    fetchRelatedSystems: vi.fn(),
    createTicket: vi.fn(),
  };
});

describe("CreateTicket Component (Issue 10)", () => {
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

  const mockRelatedSystems = [
    { id: 1, name: "Laptop", category: "Hardware" },
    { id: 2, name: "Email", category: "Software" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchCategories as any).mockResolvedValue(mockCategories);
    (api.fetchRelatedSystems as any).mockResolvedValue(mockRelatedSystems);
  });

  it("renders system generated read-only header info and active requester name", async () => {
    render(
      <CreateTicket
        activeRequester={mockRequester}
        onSuccess={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(await screen.findByText("Create Support Ticket")).toBeInTheDocument();
    expect(screen.getByText(/Alice Smith \(IT\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Auto-generated \(TKT-2026-XXXXXX\)/i)).toBeInTheDocument();
  });

  it("UI-03: displays field-level validation errors and preserves input values on client validation failure", async () => {
    render(
      <CreateTicket
        activeRequester={mockRequester}
        onSuccess={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    await screen.findByText("Create Support Ticket");

    const summaryInput = screen.getByLabelText(/Summary/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/Description/i) as HTMLTextAreaElement;

    // Fill invalid short values
    fireEvent.change(summaryInput, { target: { value: "Bad" } });
    fireEvent.change(descriptionInput, { target: { value: "Short" } });

    const submitBtn = screen.getByRole("button", { name: /Submit Ticket/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Summary must be between 5 and 150 characters.")).toBeInTheDocument();
    expect(screen.getByText("Description must be between 10 and 2000 characters.")).toBeInTheDocument();

    // Verify form input values are preserved
    expect(summaryInput.value).toBe("Bad");
    expect(descriptionInput.value).toBe("Short");
    expect(api.createTicket).not.toHaveBeenCalled();
  });

  it("submits form data successfully when inputs are valid", async () => {
    const mockSuccessTicket = {
      id: 101,
      ticketNumber: "TKT-2026-001234",
      summary: "Laptop battery drains quickly",
      description: "My laptop battery drains in 30 minutes.",
      requestedPriority: "MEDIUM" as const,
      currentStatus: "NEW",
      requesterId: 1,
      categoryId: 1,
      relatedSystemId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (api.createTicket as any).mockResolvedValue(mockSuccessTicket);

    const handleSuccess = vi.fn();

    render(
      <CreateTicket
        activeRequester={mockRequester}
        onSuccess={handleSuccess}
        onCancel={vi.fn()}
      />
    );

    await screen.findByText("Create Support Ticket");

    const summaryInput = screen.getByLabelText(/Summary/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    fireEvent.change(summaryInput, { target: { value: "Laptop battery drains quickly" } });
    fireEvent.change(descriptionInput, { target: { value: "My laptop battery drains in 30 minutes after update." } });

    const submitBtn = screen.getByRole("button", { name: /Submit Ticket/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.createTicket).toHaveBeenCalledWith(1, {
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "MEDIUM",
        summary: "Laptop battery drains quickly",
        description: "My laptop battery drains in 30 minutes after update.",
      });
      expect(handleSuccess).toHaveBeenCalledWith(mockSuccessTicket);
    });
  });
});

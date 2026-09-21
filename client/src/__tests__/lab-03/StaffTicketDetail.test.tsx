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
  };
});

describe("StaffTicketDetail Component Tests (Sprint 3 - Issue 21)", () => {
  const sampleStaffUsers: api.StaffUser[] = [
    { id: 10, name: "Somchai Staff", email: "somchai@toktickit.com", role: "IT_STAFF" },
    { id: 11, name: "Admin Suda", email: "admin@toktickit.com", role: "ADMINISTRATOR" },
  ];

  const sampleTicket: any = {
    id: 101,
    ticketNumber: "TCK-2026-0001",
    summary: "VPN connectivity issues",
    description: "Cannot connect to company VPN from remote site.",
    requestedPriority: "HIGH",
    itPriority: "NORMAL",
    currentStatus: "OPEN",
    requesterId: 20,
    categoryId: 1,
    relatedSystemId: 1,
    ownerId: null,
    resolutionSummary: null,
    resolvedAt: null,
    requesterIndicatedResolved: false,
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-01T10:30:00Z",
    category: { id: 1, name: "Network & Connectivity" },
    relatedSystem: { id: 1, name: "GlobalProtect VPN" },
    requester: { id: 20, name: "Alice Smith", email: "alice@example.com" },
    owner: null,
    attachments: [],
    comments: [
      {
        id: 1,
        ticketId: 101,
        authorId: 20,
        author: { id: 20, name: "Alice Smith", email: "alice@example.com", role: "REQUESTER" },
        content: "Please check soon, unable to access staging server.",
        createdAt: "2026-09-01T10:15:00Z",
      },
    ],
    notes: [
      {
        id: 1,
        ticketId: 101,
        authorId: 10,
        author: { id: 10, name: "Somchai Staff", email: "somchai@toktickit.com", role: "IT_STAFF" },
        content: "Checked firewall logs, Gateway B was rebooted.",
        createdAt: "2026-09-01T10:25:00Z",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchStaffTicketDetail).mockResolvedValue(sampleTicket);
    vi.mocked(api.fetchStaffUsers).mockResolvedValue(sampleStaffUsers);
  });

  it("renders ticket detail heading, requester, and attributes correctly", async () => {
    render(<StaffTicketDetail ticketId={101} onBack={vi.fn()} />);

    expect(await screen.findByText("TCK-2026-0001")).toBeInTheDocument();
    expect(screen.getByText("VPN connectivity issues")).toBeInTheDocument();
    expect(screen.getAllByText("Alice Smith").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Cannot connect to company VPN from remote site.")).toBeInTheDocument();
    expect(screen.getByText("Network & Connectivity")).toBeInTheDocument();
    expect(screen.getByText("GlobalProtect VPN")).toBeInTheDocument();
  });

  it("claims ticket ownership when unassigned", async () => {
    vi.mocked(api.claimTicket).mockResolvedValue({
      ...sampleTicket,
      ownerId: 10,
      owner: { id: 10, name: "Somchai Staff", email: "somchai@toktickit.com" },
      currentStatus: "IN_PROGRESS",
    });

    render(<StaffTicketDetail ticketId={101} onBack={vi.fn()} />);

    const claimBtn = await screen.findByRole("button", { name: /Claim Ticket/i });
    expect(claimBtn).toBeInTheDocument();

    fireEvent.click(claimBtn);

    await waitFor(() => {
      expect(api.claimTicket).toHaveBeenCalledWith(101);
    });
  });

  it("updates IT Priority via select dropdown", async () => {
    vi.mocked(api.updateItPriority).mockResolvedValue({
      ...sampleTicket,
      itPriority: "URGENT",
    });

    render(<StaffTicketDetail ticketId={101} onBack={vi.fn()} />);

    await screen.findByText("TCK-2026-0001");
    const prioritySelect = screen.getByLabelText(/IT Priority/i);
    expect(prioritySelect).toBeInTheDocument();

    fireEvent.change(prioritySelect, { target: { value: "URGENT" } });

    await waitFor(() => {
      expect(api.updateItPriority).toHaveBeenCalledWith(101, "URGENT");
    });
  });

  it("updates ticket status per allowed transitions", async () => {
    vi.mocked(api.updateTicketStatus).mockResolvedValue({
      ...sampleTicket,
      currentStatus: "IN_PROGRESS",
    });

    render(<StaffTicketDetail ticketId={101} onBack={vi.fn()} />);

    await screen.findByText("TCK-2026-0001");
    const statusSelect = screen.getByLabelText(/Next Status/i);
    expect(statusSelect).toBeInTheDocument();

    fireEvent.change(statusSelect, { target: { value: "IN_PROGRESS" } });

    await waitFor(() => {
      expect(api.updateTicketStatus).toHaveBeenCalledWith(101, "IN_PROGRESS");
    });
  });

  it("enforces resolution summary requirement in resolve modal (BR-20)", async () => {
    vi.mocked(api.fetchStaffTicketDetail).mockResolvedValue({
      ...sampleTicket,
      currentStatus: "IN_PROGRESS",
    });
    vi.mocked(api.resolveTicket).mockResolvedValue({
      ...sampleTicket,
      currentStatus: "RESOLVED",
      resolutionSummary: "Fixed firewall routing rule on Gateway B.",
      resolvedAt: "2026-09-01T11:00:00Z",
    });

    render(<StaffTicketDetail ticketId={101} onBack={vi.fn()} />);

    const resolveBtn = await screen.findByRole("button", { name: /Resolve Ticket/i });
    fireEvent.click(resolveBtn);

    // Modal opens
    expect(await screen.findByText(/Resolve Ticket: TCK-2026-0001/i)).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/Describe how the problem was resolved/i);
    const confirmBtn = screen.getByRole("button", { name: /Confirm & Resolve/i });

    // Disabled initially
    expect(confirmBtn).toBeDisabled();

    fireEvent.change(textarea, { target: { value: "Fixed firewall routing rule on Gateway B." } });
    expect(confirmBtn).not.toBeDisabled();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(api.resolveTicket).toHaveBeenCalledWith(101, "Fixed firewall routing rule on Gateway B.");
    });
  });

  it("switches between Public Comments and Internal Notes tabs (BR-13)", async () => {
    render(<StaffTicketDetail ticketId={101} onBack={vi.fn()} />);

    // Public comments visible initially
    expect(await screen.findByText("Please check soon, unable to access staging server.")).toBeInTheDocument();

    // Click Internal Notes tab
    const notesTab = screen.getByRole("tab", { name: /Internal Notes/i });
    fireEvent.click(notesTab);

    // Confidentiality banner and note content visible
    expect(screen.getByText(/Private: Visible only to IT Staff & Administrator/i)).toBeInTheDocument();
    expect(screen.getByText("Checked firewall logs, Gateway B was rebooted.")).toBeInTheDocument();
  });

  it("posts a new public comment", async () => {
    const newComment: api.PublicComment = {
      id: 2,
      ticketId: 101,
      authorId: 10,
      author: { id: 10, name: "Somchai Staff", email: "somchai@toktickit.com", role: "IT_STAFF" },
      content: "We are currently investigating the issue.",
      createdAt: "2026-09-01T10:30:00Z",
    };
    vi.mocked(api.addTicketComment).mockResolvedValue(newComment);

    render(<StaffTicketDetail ticketId={101} onBack={vi.fn()} />);

    const textarea = await screen.findByPlaceholderText(/Write a public comment for the requester/i);
    const postBtn = screen.getByRole("button", { name: /Post Public Comment/i });

    fireEvent.change(textarea, { target: { value: "We are currently investigating the issue." } });
    fireEvent.click(postBtn);

    await waitFor(() => {
      expect(api.addTicketComment).toHaveBeenCalledWith(101, "We are currently investigating the issue.");
      expect(screen.getByText("We are currently investigating the issue.")).toBeInTheDocument();
    });
  });

  it("posts a new internal note", async () => {
    const newNote: api.InternalNote = {
      id: 2,
      ticketId: 101,
      authorId: 10,
      author: { id: 10, name: "Somchai Staff", email: "somchai@toktickit.com", role: "IT_STAFF" },
      content: "Gateway B interface was restarted.",
      createdAt: "2026-09-01T10:35:00Z",
    };
    vi.mocked(api.addTicketNote).mockResolvedValue(newNote);

    render(<StaffTicketDetail ticketId={101} onBack={vi.fn()} />);

    // Switch to notes tab
    const notesTab = await screen.findByRole("tab", { name: /Internal Notes/i });
    fireEvent.click(notesTab);

    const textarea = await screen.findByPlaceholderText(/Write a private internal note for IT Staff/i);
    const postBtn = screen.getByRole("button", { name: /Add Internal Note/i });

    fireEvent.change(textarea, { target: { value: "Gateway B interface was restarted." } });
    fireEvent.click(postBtn);

    await waitFor(() => {
      expect(api.addTicketNote).toHaveBeenCalledWith(101, "Gateway B interface was restarted.");
      expect(screen.getByText("Gateway B interface was restarted.")).toBeInTheDocument();
    });
  });
});

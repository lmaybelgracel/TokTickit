import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ActionsTakenSection } from "../../components/ActionsTakenSection";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    fetchTicketActions: vi.fn(),
    createTicketAction: vi.fn(),
    updateTicketAction: vi.fn(),
    fetchCurrentUser: vi.fn(),
  };
});

describe("ActionsTaken Component Tests (Sprint 4 - Issue 30)", () => {
  const sampleActions: api.ActionTaken[] = [
    {
      id: 1,
      ticketId: 101,
      performedById: 10,
      actionDateTime: "2026-10-15T09:30:00Z",
      description: "Inspected network wall jack in Room 402.",
      result: "Detected loose RJ-45 keystone connector.",
      followUpRequired: false,
      followUpNote: null,
      attachmentNotes: null,
      createdAt: "2026-10-15T09:35:00Z",
      updatedAt: "2026-10-15T09:35:00Z",
      performedBy: {
        id: 10,
        name: "Somchai Staff",
        email: "somchai@toktickit.com",
        role: "IT_STAFF",
      },
    },
    {
      id: 2,
      ticketId: 101,
      performedById: 11,
      actionDateTime: "2026-10-15T11:00:00Z",
      description: "Re-punched Cat6 cable and tested continuity.",
      result: "Gigabit link established at 1000 Mbps.",
      followUpRequired: true,
      followUpNote: "Verify with user Alice if connection stays stable until end of day.",
      attachmentNotes: "Fluke cable tester report saved in logs.",
      createdAt: "2026-10-15T11:05:00Z",
      updatedAt: "2026-10-15T11:05:00Z",
      performedBy: {
        id: 11,
        name: "Suda Admin",
        email: "admin@toktickit.com",
        role: "ADMINISTRATOR",
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchTicketActions).mockResolvedValue(sampleActions);
  });

  describe("UI-ACT-01: Form validates required follow-up note", () => {
    it("shows error message and disables submit when follow-up is checked but note is empty", async () => {
      render(
        <ActionsTakenSection
          ticketId={101}
          ticketCreatedAt="2026-10-15T09:00:00Z"
          isStaffOrAdmin={true}
        />
      );

      // Click "+ Record Action Taken" to open modal
      const recordBtn = await screen.findByTestId("btn-record-action");
      fireEvent.click(recordBtn);

      // Modal appears
      expect(screen.getByText("Record Action Taken")).toBeInTheDocument();

      // Fill in valid description and result
      const descInput = screen.getByLabelText(/Action Description/i);
      const resultInput = screen.getByLabelText(/^Result/i);
      fireEvent.change(descInput, { target: { value: "Configured static IP on workstation." } });
      fireEvent.change(resultInput, { target: { value: "Workstation can now reach gateway." } });

      // Initially without follow-up, submit button is enabled
      const submitBtn = screen.getByTestId("btn-save-action");
      expect(submitBtn).not.toBeDisabled();

      // Check the follow-up toggle
      const followUpToggle = screen.getByLabelText(/Follow-up Required/i);
      fireEvent.click(followUpToggle);

      // Follow-up note field should appear
      const followUpNoteInput = await screen.findByLabelText(/Follow-up Note/i);
      expect(followUpNoteInput).toBeInTheDocument();

      // Notice error message and submit button disabled
      const errorMsg = screen.getByTestId("followup-error-msg");
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg.textContent).toContain("Follow-up note is required when follow-up is requested");
      expect(submitBtn).toBeDisabled();

      // Fill in valid follow-up note
      fireEvent.change(followUpNoteInput, { target: { value: "Check DHCP reservations tomorrow morning." } });

      // Error message should disappear and submit button becomes enabled
      expect(screen.queryByTestId("followup-error-msg")).not.toBeInTheDocument();
      expect(submitBtn).not.toBeDisabled();
    });
  });

  describe("UI-ACT-02: Actions Taken table renders chronological items", () => {
    it("renders table with chronological items, performer, description, result, and badges", async () => {
      render(
        <ActionsTakenSection
          ticketId={101}
          ticketCreatedAt="2026-10-15T09:00:00Z"
          isStaffOrAdmin={true}
        />
      );

      // Section header with count badge
      expect(await screen.findByText(/Actions Taken \(ประวัติการปฏิบัติงาน\)/i)).toBeInTheDocument();
      expect(screen.getByTestId("actions-count-badge")).toHaveTextContent("[ 2 ]");

      // Verify table is rendered
      const table = screen.getByTestId("actions-table");
      expect(table).toBeInTheDocument();

      // Verify first action items (performer, description, result)
      expect(screen.getByText("Somchai Staff")).toBeInTheDocument();
      expect(screen.getByText("Inspected network wall jack in Room 402.")).toBeInTheDocument();
      expect(screen.getByText("Detected loose RJ-45 keystone connector.")).toBeInTheDocument();

      // Verify second action items
      expect(screen.getByText("Suda Admin")).toBeInTheDocument();
      expect(screen.getByText("Re-punched Cat6 cable and tested continuity.")).toBeInTheDocument();
      expect(screen.getByText("Gigabit link established at 1000 Mbps.")).toBeInTheDocument();

      // Verify follow-up banner
      const followUpBanner = screen.getByTestId("followup-banner");
      expect(followUpBanner).toBeInTheDocument();
      expect(followUpBanner).toHaveTextContent("Follow-up Required (ต้องติดตามงานต่อ)");
      expect(followUpBanner).toHaveTextContent("Verify with user Alice if connection stays stable until end of day.");

      // Verify attachment notes
      expect(screen.getByText(/Notes on files: Fluke cable tester report saved in logs./i)).toBeInTheDocument();
    });
  });

  describe("UI-ACT-03: Requester view hides action creation controls", () => {
    it("does not render '+ Record Action Taken' button or Edit buttons when isStaffOrAdmin is false", async () => {
      render(
        <ActionsTakenSection
          ticketId={101}
          ticketCreatedAt="2026-10-15T09:00:00Z"
          isStaffOrAdmin={false}
        />
      );

      // Table and items render for requester
      expect(await screen.findByText(/Actions Taken \(ประวัติการปฏิบัติงาน\)/i)).toBeInTheDocument();
      expect(screen.getByText("Inspected network wall jack in Room 402.")).toBeInTheDocument();

      // Record button must NOT be in DOM
      expect(screen.queryByTestId("btn-record-action")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /\+ Record Action Taken/i })).not.toBeInTheDocument();

      // Edit buttons must NOT be in DOM
      expect(screen.queryByTestId("btn-edit-action-1")).not.toBeInTheDocument();
      expect(screen.queryByTestId("btn-edit-action-2")).not.toBeInTheDocument();
    });
  });

  describe("Action Creation and Concurrency Handling", () => {
    it("submits new action successfully", async () => {
      vi.mocked(api.createTicketAction).mockResolvedValue({
        id: 3,
        ticketId: 101,
        performedById: 10,
        actionDateTime: "2026-10-15T12:00:00Z",
        description: "Replaced wall plate and secured faceplate screws.",
        result: "Hardware firmly installed.",
        followUpRequired: false,
        followUpNote: null,
        attachmentNotes: null,
        createdAt: "2026-10-15T12:05:00Z",
        updatedAt: "2026-10-15T12:05:00Z",
        performedBy: {
          id: 10,
          name: "Somchai Staff",
          email: "somchai@toktickit.com",
          role: "IT_STAFF",
        },
      });

      render(
        <ActionsTakenSection
          ticketId={101}
          ticketCreatedAt="2026-10-15T09:00:00Z"
          isStaffOrAdmin={true}
        />
      );

      const recordBtn = await screen.findByTestId("btn-record-action");
      fireEvent.click(recordBtn);

      fireEvent.change(screen.getByLabelText(/Action Description/i), {
        target: { value: "Replaced wall plate and secured faceplate screws." },
      });
      fireEvent.change(screen.getByLabelText(/^Result/i), {
        target: { value: "Hardware firmly installed." },
      });

      const submitBtn = screen.getByTestId("btn-save-action");
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.createTicketAction).toHaveBeenCalledWith(
          101,
          expect.objectContaining({
            description: "Replaced wall plate and secured faceplate screws.",
            result: "Hardware firmly installed.",
            followUpRequired: false,
          }),
          null
        );
      });
    });

    it("displays conflict error when updating a stale action record (409 Conflict)", async () => {
      const conflictError = new Error("Conflict: The record has been modified by another user.");
      (conflictError as any).status = 409;
      vi.mocked(api.updateTicketAction).mockRejectedValue(conflictError);

      render(
        <ActionsTakenSection
          ticketId={101}
          ticketCreatedAt="2026-10-15T09:00:00Z"
          isStaffOrAdmin={true}
        />
      );

      const editBtn = await screen.findByTestId("btn-edit-action-1");
      fireEvent.click(editBtn);

      expect(screen.getByText("Edit Action Taken")).toBeInTheDocument();

      const submitBtn = screen.getByTestId("btn-save-action");
      fireEvent.click(submitBtn);

      expect(
        await screen.findByText(/Conflict: The record has been modified by another user/i)
      ).toBeInTheDocument();
    });

    it("displays empty state when no actions taken exist", async () => {
      vi.mocked(api.fetchTicketActions).mockResolvedValue([]);

      render(
        <ActionsTakenSection
          ticketId={101}
          ticketCreatedAt="2026-10-15T09:00:00Z"
          isStaffOrAdmin={true}
        />
      );

      expect(await screen.findByTestId("actions-empty-state")).toHaveTextContent(
        "No actions taken recorded yet."
      );
      expect(screen.queryByTestId("actions-table")).not.toBeInTheDocument();
    });
  });
});

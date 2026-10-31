import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import React from "react";
import { RequesterDashboard } from "../../components/RequesterDashboard";
import * as api from "../../api";
import * as authContext from "../../context/AuthContext";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    fetchRequesterDashboard: vi.fn(),
  };
});

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Requester Dashboard Component Tests (Sprint 4 - Issue 34, UI-DASH-01, AC-04)", () => {
  const mockRequesterUser: api.User = {
    id: 25,
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    role: "REQUESTER",
    isActive: true,
    mustChangePassword: false,
  };

  const mockDashboardData: api.RequesterDashboardData = {
    metrics: {
      totalOpenTickets: 3,
      waitingForRequester: 1,
      resolvedOrClosed: 4,
    },
    recentTickets: [
      {
        id: 101,
        ticketNumber: "TKT-2026-000101",
        summary: "Need VPN client reinstalled",
        currentStatus: "WAITING_FOR_REQUESTER",
        requestedPriority: "HIGH",
        updatedAt: "2026-10-16T10:00:00.000Z",
        createdAt: "2026-10-15T08:00:00.000Z",
      },
      {
        id: 102,
        ticketNumber: "TKT-2026-000102",
        summary: "Monitor color distortion",
        currentStatus: "IN_PROGRESS",
        requestedPriority: "URGENT",
        updatedAt: "2026-10-16T09:00:00.000Z",
        createdAt: "2026-10-15T09:00:00.000Z",
      },
      {
        id: 103,
        ticketNumber: "TKT-2026-000103",
        summary: "Access request for GitLab repo",
        currentStatus: "NEW",
        requestedPriority: "LOW",
        updatedAt: "2026-10-15T14:00:00.000Z",
        createdAt: "2026-10-15T14:00:00.000Z",
      },
    ],
    recentlyResolved: [
      {
        id: 95,
        ticketNumber: "TKT-2026-000095",
        summary: "Keyboard replacement",
        currentStatus: "RESOLVED",
        resolutionSummary: "New mechanical keyboard delivered and verified.",
        updatedAt: "2026-10-14T14:00:00.000Z",
        createdAt: "2026-10-13T10:00:00.000Z",
        resolvedAt: "2026-10-14T14:00:00.000Z",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: mockRequesterUser,
      token: "fake-jwt",
      login: vi.fn(),
      logout: vi.fn(),
      updatePassword: vi.fn(),
      isLoading: false,
      error: null,
      clearError: vi.fn(),
    });
    vi.mocked(api.fetchRequesterDashboard).mockResolvedValue(mockDashboardData);
  });

  describe("UI-DASH-01: Welcome Overview Banner", () => {
    it("renders welcome banner with requester name, caption, and email", async () => {
      render(<RequesterDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("welcome-banner")).toBeInTheDocument();
      });

      expect(screen.getByText(/welcome, sarah connor!/i)).toBeInTheDocument();
      expect(
        screen.getByText(/track your active service requests and recent updates/i)
      ).toBeInTheDocument();
      expect(screen.getByText("sarah.connor@example.com")).toBeInTheDocument();
    });

    it("triggers dashboard refresh when clicking Refresh button", async () => {
      render(<RequesterDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("btn-refresh-dashboard")).toBeInTheDocument();
      });

      expect(api.fetchRequesterDashboard).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByTestId("btn-refresh-dashboard"));
      await waitFor(() => {
        expect(api.fetchRequesterDashboard).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("UI-DASH-01: Personal Metric Cards Grid (AC-04)", () => {
    it("renders 3 personal metric cards with correct values and subtitles", async () => {
      render(<RequesterDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-open-tickets")).toBeInTheDocument();
      });

      // Card 1: Total Open Tickets
      const openCard = screen.getByTestId("metric-open-tickets");
      expect(openCard).toHaveTextContent("3");
      expect(openCard).toHaveTextContent(/total open tickets/i);
      expect(openCard).toHaveTextContent(/active tickets in progress/i);

      // Card 2: Action Required
      const actionCard = screen.getByTestId("metric-action-required");
      expect(actionCard).toHaveTextContent("1");
      expect(actionCard).toHaveTextContent(/action required/i);
      expect(actionCard).toHaveTextContent(/waiting for your response/i);

      // Card 3: Resolved / Closed
      const resolvedCard = screen.getByTestId("metric-resolved-tickets");
      expect(resolvedCard).toHaveTextContent("4");
      expect(resolvedCard).toHaveTextContent(/resolved \/ closed/i);
      expect(resolvedCard).toHaveTextContent(/completed support requests/i);
    });

    it("applies amber alert styling to Action Required card when count > 0", async () => {
      render(<RequesterDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-action-required")).toBeInTheDocument();
      });

      const actionCard = screen.getByTestId("metric-action-required");
      expect(actionCard).toHaveClass("is-alert");
    });

    it("does not apply alert styling when Action Required is 0", async () => {
      vi.mocked(api.fetchRequesterDashboard).mockResolvedValue({
        ...mockDashboardData,
        metrics: {
          ...mockDashboardData.metrics,
          waitingForRequester: 0,
        },
      });

      render(<RequesterDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-action-required")).toBeInTheDocument();
      });

      const actionCard = screen.getByTestId("metric-action-required");
      expect(actionCard).not.toHaveClass("is-alert");
      expect(actionCard).toHaveTextContent(/no pending replies needed/i);
    });
  });

  describe("UI-DASH-01: Interactive Drill-Down Navigation", () => {
    it("calls onNavigateMyTickets('open') when clicking Total Open Tickets card", async () => {
      const handleNavigate = vi.fn();
      render(<RequesterDashboard onNavigateMyTickets={handleNavigate} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-open-tickets")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("metric-open-tickets"));
      expect(handleNavigate).toHaveBeenCalledWith("open");
    });

    it("calls onNavigateMyTickets('waiting') when clicking Action Required card", async () => {
      const handleNavigate = vi.fn();
      render(<RequesterDashboard onNavigateMyTickets={handleNavigate} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-action-required")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("metric-action-required"));
      expect(handleNavigate).toHaveBeenCalledWith("waiting");
    });

    it("calls onNavigateMyTickets('resolved') when clicking Resolved / Closed card", async () => {
      const handleNavigate = vi.fn();
      render(<RequesterDashboard onNavigateMyTickets={handleNavigate} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-resolved-tickets")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("metric-resolved-tickets"));
      expect(handleNavigate).toHaveBeenCalledWith("resolved_or_closed");
    });

    it("supports keyboard Enter and Space navigation on metric cards", async () => {
      const handleNavigate = vi.fn();
      render(<RequesterDashboard onNavigateMyTickets={handleNavigate} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-open-tickets")).toBeInTheDocument();
      });

      const openCard = screen.getByTestId("metric-open-tickets");
      fireEvent.keyDown(openCard, { key: "Enter" });
      expect(handleNavigate).toHaveBeenCalledWith("open");

      fireEvent.keyDown(openCard, { key: " " });
      expect(handleNavigate).toHaveBeenCalledWith("open");
    });
  });

  describe("UI-DASH-01: Quick Actions Toolbar", () => {
    it("triggers onCreateTicket when clicking + Create New Ticket", async () => {
      const handleCreate = vi.fn();
      render(<RequesterDashboard onCreateTicket={handleCreate} />);

      await waitFor(() => {
        expect(screen.getByTestId("btn-create-ticket")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("btn-create-ticket"));
      expect(handleCreate).toHaveBeenCalledTimes(1);
    });

    it("triggers onNavigateMyTickets without filter when clicking View All My Tickets", async () => {
      const handleNavigate = vi.fn();
      render(<RequesterDashboard onNavigateMyTickets={handleNavigate} />);

      await waitFor(() => {
        expect(screen.getByTestId("btn-view-all-tickets")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("btn-view-all-tickets"));
      expect(handleNavigate).toHaveBeenCalledWith();
    });
  });

  describe("UI-DASH-01: Recent Ticket Progress List", () => {
    it("renders table with recent tickets showing number, summary, priority, and status badges", async () => {
      render(<RequesterDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("recent-tickets-section")).toBeInTheDocument();
      });

      expect(screen.getByText("TKT-2026-000101")).toBeInTheDocument();
      expect(screen.getByText("Need VPN client reinstalled")).toBeInTheDocument();
      expect(screen.getByText("WAITING FOR REQUESTER")).toBeInTheDocument();
      expect(screen.getByText("HIGH")).toBeInTheDocument();

      expect(screen.getByText("TKT-2026-000102")).toBeInTheDocument();
      expect(screen.getByText("Monitor color distortion")).toBeInTheDocument();
      expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
      expect(screen.getByText("URGENT")).toBeInTheDocument();
    });

    it("triggers onSelectTicket when clicking View Details button on a ticket row", async () => {
      const handleSelect = vi.fn();
      render(<RequesterDashboard onSelectTicket={handleSelect} />);

      await waitFor(() => {
        expect(screen.getByTestId("btn-view-detail-101")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("btn-view-detail-101"));
      expect(handleSelect).toHaveBeenCalledWith(101);
    });
  });

  describe("UI-DASH-01: Empty State Handling", () => {
    it("renders calming empty state with CTA button when user has 0 tickets", async () => {
      vi.mocked(api.fetchRequesterDashboard).mockResolvedValue({
        metrics: {
          totalOpenTickets: 0,
          waitingForRequester: 0,
          resolvedOrClosed: 0,
        },
        recentTickets: [],
        recentlyResolved: [],
      });

      const handleCreate = vi.fn();
      render(<RequesterDashboard onCreateTicket={handleCreate} />);

      await waitFor(() => {
        expect(screen.getByTestId("requester-dashboard-empty")).toBeInTheDocument();
      });

      expect(screen.getByText(/you have no active tickets/i)).toBeInTheDocument();
      expect(
        screen.getByText(/everything is running smoothly!/i)
      ).toBeInTheDocument();

      const ctaBtn = screen.getByTestId("btn-create-first-ticket");
      expect(ctaBtn).toBeInTheDocument();

      fireEvent.click(ctaBtn);
      expect(handleCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading & Error States", () => {
    it("displays loading indicator while fetching dashboard data", () => {
      vi.mocked(api.fetchRequesterDashboard).mockReturnValue(new Promise(() => {}));

      render(<RequesterDashboard />);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText(/loading your support dashboard/i)).toBeInTheDocument();
    });

    it("displays error box and retries upon clicking Retry button", async () => {
      vi.mocked(api.fetchRequesterDashboard).mockRejectedValueOnce(
        new Error("Network connection error")
      );

      render(<RequesterDashboard />);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      expect(screen.getByText("Network connection error")).toBeInTheDocument();

      // Setup recovery on retry
      vi.mocked(api.fetchRequesterDashboard).mockResolvedValueOnce(mockDashboardData);

      fireEvent.click(screen.getByRole("button", { name: /retry/i }));

      await waitFor(() => {
        expect(screen.getByTestId("welcome-banner")).toBeInTheDocument();
      });
    });
  });
});

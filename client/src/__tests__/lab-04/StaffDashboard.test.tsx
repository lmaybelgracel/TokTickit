import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import React from "react";
import { StaffDashboard } from "../../components/StaffDashboard";
import * as api from "../../api";
import * as authContext from "../../context/AuthContext";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    fetchStaffDashboard: vi.fn(),
  };
});

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Staff & Administrator Dashboard Component Tests (Sprint 4 - Issue 33)", () => {
  const mockStaffUser: api.User = {
    id: 10,
    name: "Somchai Staff",
    email: "somchai@toktickit.com",
    role: "IT_STAFF",
    isActive: true,
    mustChangePassword: false,
  };

  const mockAdminUser: api.User = {
    id: 1,
    name: "Suda Administrator",
    email: "admin@toktickit.com",
    role: "ADMINISTRATOR",
    isActive: true,
    mustChangePassword: false,
  };

  const mockDashboardData: api.StaffDashboardData = {
    metrics: {
      unassignedTickets: 4,
      myActiveTickets: 3,
      myAssignedTickets: 3,
      myActionsTakenCount: 7,
      urgentTickets: 2,
      waitingForRequester: 1,
      totalActiveTickets: 9,
    },
    statusDistribution: {
      NEW: 2,
      OPEN: 3,
      ASSIGNED: 2,
      WORK_IN_PROGRESS: 1,
      PENDING_CUSTOMER: 0,
      WAITING_FOR_REQUESTER: 1,
      RESOLVED: 5,
      CLOSED: 12,
    },
    priorityDistribution: {
      URGENT: 2,
      HIGH: 3,
      MEDIUM: 4,
      LOW: 0,
    },
    recentTickets: [
      {
        id: 101,
        ticketNumber: "TCK-2026-0001",
        summary: "VPN gateway failing under load",
        currentStatus: "OPEN",
        itPriority: "URGENT",
        requestedPriority: "HIGH",
        createdAt: "2026-10-18T08:30:00Z",
        category: { id: 1, name: "Network & Connectivity" },
        requester: { id: 20, name: "Alice Requester", email: "alice@example.com" },
        owner: { id: 10, name: "Somchai Staff", email: "somchai@toktickit.com" },
      },
      {
        id: 102,
        ticketNumber: "TCK-2026-0002",
        summary: "New laptop provisioning setup",
        currentStatus: "NEW",
        itPriority: "MEDIUM",
        requestedPriority: "NORMAL",
        createdAt: "2026-10-18T09:15:00Z",
        category: { id: 2, name: "Hardware & Devices" },
        requester: { id: 21, name: "Bob Worker", email: "bob@example.com" },
        owner: null,
      },
    ],
    adminStats: {
      totalUsers: 25,
      activeUsers: 23,
      inactiveUsers: 2,
      roleCounts: {
        ADMINISTRATOR: 2,
        IT_STAFF: 6,
        REQUESTER: 17,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: mockStaffUser,
      token: "fake-jwt",
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      refreshUser: vi.fn(),
    });
    vi.mocked(api.fetchStaffDashboard).mockResolvedValue(mockDashboardData);
  });

  describe("UI-DASH-02: Dashboard Metrics & Operational Layout", () => {
    it("renders welcome banner with staff name, role badge, and quick action buttons", async () => {
      render(<StaffDashboard onCreateTicket={vi.fn()} />);

      expect(screen.getByText(/loading operational dashboard/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(/welcome back, somchai staff/i)).toBeInTheDocument();
      });

      expect(screen.getByText("IT Staff")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /view full ticket queue/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create new ticket/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument();
    });

    it("renders all 5 operational metric cards with correct values and titles", async () => {
      render(<StaffDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-unassigned")).toBeInTheDocument();
      });

      // 1. Unassigned Tickets
      const unassignedCard = screen.getByTestId("metric-unassigned");
      expect(unassignedCard).toHaveTextContent("4");
      expect(unassignedCard).toHaveTextContent(/unassigned tickets/i);

      // 2. My Active Tickets
      const myActiveCard = screen.getByTestId("metric-my-active");
      expect(myActiveCard).toHaveTextContent("3");
      expect(myActiveCard).toHaveTextContent(/my active tickets/i);

      // 3. My Actions Recorded (AC-05, BR-17)
      const actionsCard = screen.getByTestId("metric-my-actions");
      expect(actionsCard).toHaveTextContent("7");
      expect(actionsCard).toHaveTextContent(/my actions recorded/i);

      // 4. Urgent Tickets
      const urgentCard = screen.getByTestId("metric-urgent");
      expect(urgentCard).toHaveTextContent("2");
      expect(urgentCard).toHaveTextContent(/urgent tickets/i);

      // 5. Waiting for Requester
      const waitingCard = screen.getByTestId("metric-waiting");
      expect(waitingCard).toHaveTextContent("1");
      expect(waitingCard).toHaveTextContent(/waiting for requester/i);
    });

    it("renders status and priority breakdown pills with count badges", async () => {
      render(<StaffDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("status-pill-NEW")).toBeInTheDocument();
      });

      // Status pills
      expect(screen.getByTestId("status-pill-NEW")).toHaveTextContent("2");
      expect(screen.getByTestId("status-pill-OPEN")).toHaveTextContent("3");
      expect(screen.getByTestId("status-pill-RESOLVED")).toHaveTextContent("5");

      // Priority pills
      expect(screen.getByTestId("priority-pill-URGENT")).toHaveTextContent("2");
      expect(screen.getByTestId("priority-pill-HIGH")).toHaveTextContent("3");
      expect(screen.getByTestId("priority-pill-MEDIUM")).toHaveTextContent("4");
      expect(screen.getByTestId("priority-pill-LOW")).toHaveTextContent("0");
    });

    it("renders recent queue activity table with tickets and formatted metadata", async () => {
      render(<StaffDashboard />);

      await waitFor(() => {
        expect(screen.getByText("TCK-2026-0001")).toBeInTheDocument();
      });

      expect(screen.getByText("VPN gateway failing under load")).toBeInTheDocument();
      expect(screen.getByText("TCK-2026-0002")).toBeInTheDocument();
      expect(screen.getByText("New laptop provisioning setup")).toBeInTheDocument();
      expect(screen.getByText("Somchai Staff")).toBeInTheDocument();
      expect(screen.getByText("Unassigned")).toBeInTheDocument();
    });
  });

  describe("UI-DASH-03: Interactive 1-Click Drill-Down Navigation", () => {
    it("triggers onDrillDown with unassigned filter when clicking Unassigned Tickets card", async () => {
      const handleDrillDown = vi.fn();
      render(<StaffDashboard onDrillDown={handleDrillDown} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-unassigned")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("metric-unassigned"));
      expect(handleDrillDown).toHaveBeenCalledTimes(1);
      expect(handleDrillDown).toHaveBeenCalledWith({ ownerFilter: "unassigned" });
    });

    it("triggers onDrillDown with me filter when clicking My Active Tickets card", async () => {
      const handleDrillDown = vi.fn();
      render(<StaffDashboard onDrillDown={handleDrillDown} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-my-active")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("metric-my-active"));
      expect(handleDrillDown).toHaveBeenCalledTimes(1);
      expect(handleDrillDown).toHaveBeenCalledWith({ ownerFilter: "me" });
    });

    it("triggers onDrillDown with itPriority: URGENT when clicking Urgent Tickets card", async () => {
      const handleDrillDown = vi.fn();
      render(<StaffDashboard onDrillDown={handleDrillDown} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-urgent")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("metric-urgent"));
      expect(handleDrillDown).toHaveBeenCalledTimes(1);
      expect(handleDrillDown).toHaveBeenCalledWith({ itPriority: "URGENT" });
    });

    it("triggers onDrillDown with status: WAITING_FOR_REQUESTER when clicking Waiting for Requester card", async () => {
      const handleDrillDown = vi.fn();
      render(<StaffDashboard onDrillDown={handleDrillDown} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-waiting")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("metric-waiting"));
      expect(handleDrillDown).toHaveBeenCalledTimes(1);
      expect(handleDrillDown).toHaveBeenCalledWith({ status: "WAITING_FOR_REQUESTER" });
    });

    it("triggers onDrillDown with status when clicking status pill in breakdown matrix", async () => {
      const handleDrillDown = vi.fn();
      render(<StaffDashboard onDrillDown={handleDrillDown} />);

      await waitFor(() => {
        expect(screen.getByTestId("status-pill-OPEN")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("status-pill-OPEN"));
      expect(handleDrillDown).toHaveBeenCalledWith({ status: "OPEN" });
    });

    it("triggers onDrillDown with itPriority when clicking priority pill in breakdown matrix", async () => {
      const handleDrillDown = vi.fn();
      render(<StaffDashboard onDrillDown={handleDrillDown} />);

      await waitFor(() => {
        expect(screen.getByTestId("priority-pill-HIGH")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("priority-pill-HIGH"));
      expect(handleDrillDown).toHaveBeenCalledWith({ itPriority: "HIGH" });
    });

    it("triggers onDrillDown with empty object when clicking View Full Queue quick action", async () => {
      const handleDrillDown = vi.fn();
      render(<StaffDashboard onDrillDown={handleDrillDown} />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /view full ticket queue/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /view full ticket queue/i }));
      expect(handleDrillDown).toHaveBeenCalledWith({});
    });

    it("triggers onCreateTicket callback when clicking New Ticket quick action", async () => {
      const handleCreate = vi.fn();
      render(<StaffDashboard onCreateTicket={handleCreate} />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /create new ticket/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /create new ticket/i }));
      expect(handleCreate).toHaveBeenCalledTimes(1);
    });

    it("triggers onSelectTicket callback when clicking a ticket row in recent table", async () => {
      const handleSelect = vi.fn();
      render(<StaffDashboard onSelectTicket={handleSelect} />);

      await waitFor(() => {
        expect(screen.getByTestId("recent-row-101")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("recent-row-101"));
      expect(handleSelect).toHaveBeenCalledWith(101);
    });
  });

  describe("UI-DASH-04: Actions Taken Operational Integration (AC-05, BR-17)", () => {
    it("displays My Actions Recorded card with value 7 and navigates to my queue on click", async () => {
      const handleDrillDown = vi.fn();
      render(<StaffDashboard onDrillDown={handleDrillDown} />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-my-actions")).toBeInTheDocument();
      });

      const card = screen.getByTestId("metric-my-actions");
      expect(card).toHaveTextContent("7");
      expect(card).toHaveTextContent(/actions taken performed by you/i);

      fireEvent.click(card);
      expect(handleDrillDown).toHaveBeenCalledWith({ ownerFilter: "me" });
    });
  });

  describe("Administrator User Statistics Grid", () => {
    it("renders admin user statistics grid when user has ADMINISTRATOR role", async () => {
      vi.mocked(authContext.useAuth).mockReturnValue({
        user: mockAdminUser,
        token: "fake-jwt",
        login: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
        refreshUser: vi.fn(),
      });

      render(<StaffDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("admin-stats-grid")).toBeInTheDocument();
      });

      const grid = screen.getByTestId("admin-stats-grid");
      expect(within(grid).getByText("Total Users")).toBeInTheDocument();
      expect(within(grid).getByText("25")).toBeInTheDocument();
      expect(within(grid).getByText("Active Accounts")).toBeInTheDocument();
      expect(within(grid).getByText("23")).toBeInTheDocument();
      expect(within(grid).getByText("Inactive Accounts")).toBeInTheDocument();
      expect(within(grid).getAllByText("2")).toHaveLength(2);
      expect(within(grid).getByText("IT Staff Members")).toBeInTheDocument();
      expect(within(grid).getByText("6")).toBeInTheDocument();
    });

    it("does not render admin user statistics grid when user is IT_STAFF", async () => {
      render(<StaffDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("metric-unassigned")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("admin-stats-grid")).not.toBeInTheDocument();
    });
  });

  describe("Error and Refresh Handling", () => {
    it("displays error banner and retry button when API call fails", async () => {
      vi.mocked(api.fetchStaffDashboard).mockRejectedValueOnce(
        new Error("Network timeout connecting to server")
      );

      render(<StaffDashboard />);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      expect(screen.getByText(/network timeout connecting to server/i)).toBeInTheDocument();
      const retryBtn = screen.getByRole("button", { name: /retry/i });
      expect(retryBtn).toBeInTheDocument();

      vi.mocked(api.fetchStaffDashboard).mockResolvedValueOnce(mockDashboardData);
      fireEvent.click(retryBtn);

      await waitFor(() => {
        expect(screen.getByTestId("metric-unassigned")).toBeInTheDocument();
      });
    });

    it("refreshes dashboard metrics when clicking refresh button", async () => {
      render(<StaffDashboard />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument();
      });

      expect(api.fetchStaffDashboard).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole("button", { name: /refresh/i }));

      await waitFor(() => {
        expect(api.fetchStaffDashboard).toHaveBeenCalledTimes(2);
      });
    });
  });
});

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchStaffDashboard,
  StaffDashboardData,
  StaffDashboardTicket,
} from "../api";
import "./StaffDashboard.css";

export interface DrillDownFilter {
  ownerFilter?: string; // "unassigned" | "me" | "all"
  status?: string;
  itPriority?: string;
  search?: string;
  filter?: string;
}

export interface StaffDashboardProps {
  onDrillDown?: (filter: DrillDownFilter) => void;
  onSelectTicket?: (ticketId: number) => void;
  onCreateTicket?: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  onDrillDown,
  onSelectTicket,
  onCreateTicket,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const result = await fetchStaffDashboard();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Color helpers conforming to Zen Green UI Spec
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "NEW":
        return { backgroundColor: "#F1F5F9", color: "#475569" };
      case "OPEN":
        return { backgroundColor: "#E0F2FE", color: "#0369A1" };
      case "IN_PROGRESS":
        return { backgroundColor: "#FEF3C7", color: "#B45309" };
      case "WAITING_FOR_REQUESTER":
        return { backgroundColor: "#FFFBEB", color: "#92400E" };
      case "RESOLVED":
        return { backgroundColor: "#DEF7EC", color: "#03543F" };
      case "CLOSED":
        return { backgroundColor: "#F3F4F6", color: "#374151" };
      case "REOPENED":
        return { backgroundColor: "#FEE2E2", color: "#991B1B" };
      case "CANCELLED":
        return { backgroundColor: "#FDE8E8", color: "#9B1C1C" };
      default:
        return { backgroundColor: "#F1F5F9", color: "#475569" };
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "LOW":
        return { backgroundColor: "#F1F5F9", color: "#475569" };
      case "MEDIUM":
        return { backgroundColor: "#E0F2FE", color: "#0369A1" };
      case "HIGH":
        return { backgroundColor: "#FEF3C7", color: "#B45309" };
      case "URGENT":
        return { backgroundColor: "#FDE8E8", color: "#991B1B" };
      default:
        return { backgroundColor: "#F1F5F9", color: "#475569" };
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="staff-dashboard">
        <div className="dashboard-loading" role="status" aria-live="polite">
          <div className="dashboard-spinner" />
          <span>Loading operational dashboard metrics...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="staff-dashboard">
        <div className="dashboard-error-banner" role="alert">
          <div>
            <strong>Error:</strong> {error || "Unable to display dashboard data"}
          </div>
          <button
            className="refresh-btn"
            onClick={() => loadDashboard()}
            style={{ background: "#DC2626" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const metrics = data.metrics || {
    unassignedTickets: 0,
    myAssignedTickets: 0,
    myActionsTakenCount: 0,
    urgentTickets: 0,
    waitingForRequester: 0,
    totalActiveTickets: 0,
  };

  const statusDistribution = data.statusDistribution || data.statusCounts || {};
  const priorityDistribution = data.priorityDistribution || data.priorityCounts || {};
  const recentTickets: StaffDashboardTicket[] =
    data.recentQueueActivity || data.recentQueueTickets || [];
  const adminStats = data.adminStats;

  return (
    <div className="staff-dashboard">
      {/* 1. Welcome Banner */}
      <section className="dashboard-welcome-banner" aria-label="Welcome Overview">
        <div className="welcome-info">
          <h1 className="welcome-title">
            Welcome back, {user?.name || "IT Staff"}
          </h1>
          <div className="welcome-subtitle">
            <span className="welcome-badge">
              {user?.role === "ADMINISTRATOR" ? "Administrator" : "IT Staff"}
            </span>
            <span>
              Operations Dashboard • {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="welcome-actions">
          <button
            className="refresh-btn"
            onClick={() => loadDashboard(true)}
            disabled={isRefreshing}
            aria-label="Refresh Dashboard Metrics"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isRefreshing ? "rotate(360deg)" : "none",
                transition: "transform 0.6s ease",
              }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh Metrics"}
          </button>
        </div>
      </section>

      {/* Quick Action Toolbar */}
      <nav className="dashboard-quick-actions" aria-label="Quick Actions">
        <button
          className="quick-action-btn quick-action-btn--primary"
          onClick={() => onDrillDown?.({})}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          View Full Ticket Queue
        </button>

        {onCreateTicket && (
          <button
            className="quick-action-btn quick-action-btn--secondary"
            onClick={onCreateTicket}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Ticket
          </button>
        )}

        <button
          className="quick-action-btn quick-action-btn--outline"
          onClick={() => onDrillDown?.({ search: "" })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search Queue
        </button>
      </nav>

      {/* 2. Operational Metric Cards Grid */}
      <section className="dashboard-metrics-grid" aria-label="Operational Metrics Summary">
        {/* Card 1: Unassigned Tickets */}
        <div
          className="metric-card metric-card--unassigned"
          data-testid="metric-unassigned"
          role="button"
          tabIndex={0}
          onClick={() => onDrillDown?.({ ownerFilter: "unassigned" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDrillDown?.({ ownerFilter: "unassigned" });
            }
          }}
          aria-label={`Unassigned Tickets: ${metrics.unassignedTickets}. Click to filter queue.`}
        >
          <div className="metric-card-indicator" />
          <div className="metric-card-header">
            <span className="metric-card-title">Unassigned Tickets</span>
            <span className="metric-card-badge metric-card-badge--normal">Queue</span>
          </div>
          <div className="metric-card-value">{metrics.unassignedTickets}</div>
          <div className="metric-card-subtitle">Tickets awaiting owner assignment</div>
          <div className="metric-card-footer">
            <span>Filter Unassigned</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Card 2: My Assigned Tickets */}
        <div
          className="metric-card metric-card--mine"
          data-testid="metric-my-active"
          role="button"
          tabIndex={0}
          onClick={() => onDrillDown?.({ ownerFilter: "me" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDrillDown?.({ ownerFilter: "me" });
            }
          }}
          aria-label={`My Active Tickets: ${metrics.myAssignedTickets}. Click to view your tickets.`}
        >
          <div className="metric-card-indicator" />
          <div className="metric-card-header">
            <span className="metric-card-title">My Active Tickets</span>
            <span className="metric-card-badge metric-card-badge--normal">Assigned</span>
          </div>
          <div className="metric-card-value">{metrics.myAssignedTickets}</div>
          <div className="metric-card-subtitle">Tickets you are actively coordinating</div>
          <div className="metric-card-footer">
            <span>View My Tickets</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Card 3: My Actions Recorded */}
        <div
          className="metric-card metric-card--actions"
          data-testid="metric-my-actions"
          role="button"
          tabIndex={0}
          onClick={() => onDrillDown?.({ ownerFilter: "me" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDrillDown?.({ ownerFilter: "me" });
            }
          }}
          aria-label={`My Actions Recorded: ${metrics.myActionsTakenCount}. Click to view actions history.`}
        >
          <div className="metric-card-indicator" />
          <div className="metric-card-header">
            <span className="metric-card-title">My Actions Recorded</span>
            <span className="metric-card-badge metric-card-badge--normal">Sprint 4</span>
          </div>
          <div className="metric-card-value">{metrics.myActionsTakenCount}</div>
          <div className="metric-card-subtitle">Actions Taken performed by you</div>
          <div className="metric-card-footer">
            <span>View My Actions</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Card 4: Urgent Tickets */}
        <div
          className="metric-card metric-card--urgent"
          data-testid="metric-urgent"
          role="button"
          tabIndex={0}
          onClick={() => onDrillDown?.({ itPriority: "URGENT" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDrillDown?.({ itPriority: "URGENT" });
            }
          }}
          aria-label={`Urgent Tickets: ${metrics.urgentTickets}. Click to filter urgent tickets.`}
        >
          <div className="metric-card-indicator" />
          <div className="metric-card-header">
            <span className="metric-card-title">Urgent Tickets</span>
            <span className="metric-card-badge metric-card-badge--urgent">Critical</span>
          </div>
          <div className="metric-card-value">{metrics.urgentTickets}</div>
          <div className="metric-card-subtitle">Requiring immediate IT staff response</div>
          <div className="metric-card-footer" style={{ color: "#DC2626" }}>
            <span>Filter Urgent</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Card 5: Waiting for Requester */}
        <div
          className="metric-card metric-card--waiting"
          data-testid="metric-waiting"
          role="button"
          tabIndex={0}
          onClick={() => onDrillDown?.({ status: "WAITING_FOR_REQUESTER" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDrillDown?.({ status: "WAITING_FOR_REQUESTER" });
            }
          }}
          aria-label={`Waiting for Requester: ${metrics.waitingForRequester}. Click to filter pending user response.`}
        >
          <div className="metric-card-indicator" />
          <div className="metric-card-header">
            <span className="metric-card-title">Waiting for Requester</span>
            <span className="metric-card-badge metric-card-badge--waiting">Attention</span>
          </div>
          <div className="metric-card-value">{metrics.waitingForRequester}</div>
          <div className="metric-card-subtitle">Pending user feedback or verification</div>
          <div className="metric-card-footer" style={{ color: "#D97706" }}>
            <span>Filter Pending</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </section>

      {/* 3. Status & Priority Distribution Matrix */}
      <section className="dashboard-distribution-section" aria-label="Status and Priority Distribution">
        <div className="section-header">
          <h2 className="section-title">Queue Breakdown & Distribution</h2>
          <span style={{ fontSize: "13px", color: "#64748B" }}>
            Total Active Tickets: <strong>{metrics.totalActiveTickets}</strong>
          </span>
        </div>

        <div className="distribution-grid">
          {/* Status Distribution */}
          <div>
            <h3 className="distribution-col-title">By Ticket Status</h3>
            <div className="distribution-pills">
              {Object.entries(statusDistribution).map(([statusKey, count]) => {
                const style = getStatusBadgeStyle(statusKey);
                return (
                  <button
                    key={statusKey}
                    data-testid={`status-pill-${statusKey}`}
                    className="distribution-pill"
                    style={{ ...style, border: `1px solid ${style.color}33` }}
                    onClick={() => onDrillDown?.({ status: statusKey })}
                    title={`Filter by ${statusKey}: ${count} tickets`}
                  >
                    <span>{statusKey.replace(/_/g, " ")}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Distribution */}
          <div>
            <h3 className="distribution-col-title">By IT Priority (Active)</h3>
            <div className="distribution-pills">
              {Object.entries(priorityDistribution).map(([priorityKey, count]) => {
                const style = getPriorityBadgeStyle(priorityKey);
                return (
                  <button
                    key={priorityKey}
                    data-testid={`priority-pill-${priorityKey}`}
                    className="distribution-pill"
                    style={{ ...style, border: `1px solid ${style.color}33` }}
                    onClick={() => onDrillDown?.({ itPriority: priorityKey })}
                    title={`Filter by IT Priority ${priorityKey}: ${count} tickets`}
                  >
                    <span>{priorityKey}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recent Queue Activity Panel */}
      <section className="dashboard-recent-section" aria-label="Recent Queue Activity">
        <div className="section-header">
          <h2 className="section-title">Recent Queue Activity (กิจกรรมคิวตั๋วล่าสุด)</h2>
          <button
            className="quick-action-btn quick-action-btn--outline"
            style={{ padding: "4px 10px", fontSize: "12px" }}
            onClick={() => onDrillDown?.({})}
          >
            View All
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 20px", color: "#64748B" }}>
            No recent queue activity found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="recent-table" aria-label="Recent Tickets Table">
              <thead>
                <tr>
                  <th scope="col">Ticket Number</th>
                  <th scope="col">Summary</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => {
                  const statusStyle = getStatusBadgeStyle(ticket.currentStatus);
                  const priorityStyle = getPriorityBadgeStyle(ticket.itPriority);

                  return (
                    <tr
                      key={ticket.id}
                      data-testid={`recent-row-${ticket.id}`}
                      className="recent-table-row"
                      onClick={() => onSelectTicket?.(ticket.id)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectTicket?.(ticket.id);
                        }
                      }}
                      aria-label={`Open ticket ${ticket.ticketNumber}: ${ticket.summary}`}
                    >
                      <td className="ticket-number-cell">{ticket.ticketNumber}</td>
                      <td className="summary-cell" title={ticket.summary}>
                        {ticket.summary}
                      </td>
                      <td>
                        <span className="priority-badge" style={priorityStyle}>
                          {ticket.itPriority}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge" style={statusStyle}>
                          {ticket.currentStatus.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>
                        <span className="owner-cell">
                          {ticket.owner ? (
                            ticket.owner.name
                          ) : (
                            <span className="unassigned-badge">Unassigned</span>
                          )}
                        </span>
                      </td>
                      <td style={{ color: "#64748B", fontSize: "12px" }}>
                        {formatDate(ticket.updatedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 5. Administrator User Statistics (Included only for Administrator) */}
      {user?.role === "ADMINISTRATOR" && adminStats && (
        <section className="dashboard-admin-section" aria-label="Administrator User Statistics">
          <div className="section-header">
            <h2 className="section-title">System User Accounts (Admin Overview)</h2>
            <span style={{ fontSize: "13px", color: "#64748B" }}>
              Total Registered: <strong>{adminStats.totalUsers}</strong>
            </span>
          </div>

          <div className="admin-stats-grid" data-testid="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Users</span>
              <span className="admin-stat-value">{adminStats.totalUsers}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Active Accounts</span>
              <span className="admin-stat-value" style={{ color: "#006B3C" }}>
                {adminStats.activeUsers}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Inactive Accounts</span>
              <span className="admin-stat-value" style={{ color: "#DC2626" }}>
                {adminStats.inactiveUsers}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Administrators</span>
              <span className="admin-stat-value">
                {adminStats.roleCounts?.ADMINISTRATOR || 0}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">IT Staff Members</span>
              <span className="admin-stat-value">
                {adminStats.roleCounts?.IT_STAFF || 0}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Requesters</span>
              <span className="admin-stat-value">
                {adminStats.roleCounts?.REQUESTER || 0}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

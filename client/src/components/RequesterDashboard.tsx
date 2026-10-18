import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchRequesterDashboard, RequesterDashboardData } from "../api";
import "./RequesterDashboard.css";

export interface RequesterDashboardProps {
  onNavigateMyTickets?: (filterStatus?: string) => void;
  onSelectTicket?: (ticketId: number) => void;
  onCreateTicket?: () => void;
}

export const RequesterDashboard: React.FC<RequesterDashboardProps> = ({
  onNavigateMyTickets,
  onSelectTicket,
  onCreateTicket,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<RequesterDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const result = await fetchRequesterDashboard();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load requester dashboard");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Status badge style helper conforming to Zen Green UI Spec
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

  // Priority badge style helper
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
      <div className="requester-dashboard" data-testid="requester-dashboard">
        <div className="requester-loading-box" role="status" aria-live="polite">
          <div className="requester-spinner" />
          <p style={{ margin: 0, color: "#4A5E53", fontWeight: 500 }}>
            Loading your support dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="requester-dashboard" data-testid="requester-dashboard">
        <div className="requester-error-box" role="alert">
          <p className="requester-error-text">{error || "Unable to display dashboard metrics."}</p>
          <button
            type="button"
            className="requester-btn-primary"
            onClick={() => loadDashboard()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { metrics, recentTickets = [] } = data;
  const isActionRequired = metrics.waitingForRequester > 0;
  const hasNoTickets =
    metrics.totalOpenTickets === 0 &&
    metrics.waitingForRequester === 0 &&
    metrics.resolvedOrClosed === 0 &&
    recentTickets.length === 0;

  return (
    <div className="requester-dashboard" data-testid="requester-dashboard">
      {/* 1. Welcome Overview Banner */}
      <section className="requester-welcome-banner" data-testid="welcome-banner">
        <div className="requester-welcome-info">
          <h1 className="requester-welcome-title">
            Welcome, {user?.name || "Requester"}!
          </h1>
          <p className="requester-welcome-subtitle">
            Track your active service requests and recent updates.
          </p>
          <div className="requester-welcome-meta">
            <span>Logged in as <strong>{user?.email}</strong></span>
          </div>
        </div>

        <div className="requester-welcome-actions">
          <button
            type="button"
            className="requester-btn-refresh"
            data-testid="btn-refresh-dashboard"
            onClick={() => loadDashboard(true)}
            disabled={isRefreshing}
            aria-label="Refresh dashboard"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: isRefreshing ? "spin 0.8s linear infinite" : "none",
              }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </section>

      {/* 2. Quick Actions Toolbar */}
      <section className="requester-quick-actions">
        <h2 className="requester-quick-actions__title">Quick Actions</h2>
        <div className="requester-quick-actions__btn-group">
          <button
            type="button"
            className="requester-btn-primary"
            data-testid="btn-create-ticket"
            onClick={onCreateTicket}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Create New Ticket
          </button>
          <button
            type="button"
            className="requester-btn-secondary"
            data-testid="btn-view-all-tickets"
            onClick={() => onNavigateMyTickets?.()}
          >
            View All My Tickets
          </button>
        </div>
      </section>

      {/* 3. Personal Metric Cards Grid (3 cards) */}
      <section
        className="requester-metrics-grid"
        aria-label="Personal Ticket Summary Metrics"
      >
        {/* Card 1: Total Open Tickets */}
        <div
          className="requester-metric-card requester-metric-card--open"
          data-testid="metric-open-tickets"
          role="button"
          tabIndex={0}
          onClick={() => onNavigateMyTickets?.("open")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigateMyTickets?.("open");
            }
          }}
          aria-label={`Total Open Tickets: ${metrics.totalOpenTickets}`}
        >
          <div className="requester-metric-card__header">
            <span className="requester-metric-card__label">Total Open Tickets</span>
            <div className="requester-metric-card__icon-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          </div>
          <div className="requester-metric-card__body">
            <span className="requester-metric-card__value">
              {metrics.totalOpenTickets}
            </span>
          </div>
          <p className="requester-metric-card__subtitle">Active tickets in progress</p>
          <div className="requester-metric-card__footer">
            <span>View open tickets &rarr;</span>
          </div>
        </div>

        {/* Card 2: Action Required */}
        <div
          className={`requester-metric-card requester-metric-card--action-required ${
            isActionRequired ? "is-alert" : ""
          }`}
          data-testid="metric-action-required"
          role="button"
          tabIndex={0}
          onClick={() => onNavigateMyTickets?.("waiting")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigateMyTickets?.("waiting");
            }
          }}
          aria-label={`Action Required: ${metrics.waitingForRequester}`}
        >
          <div className="requester-metric-card__header">
            <span className="requester-metric-card__label">Action Required</span>
            <div className="requester-metric-card__icon-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="requester-metric-card__body">
            <span className="requester-metric-card__value">
              {metrics.waitingForRequester}
            </span>
          </div>
          <p className="requester-metric-card__subtitle">
            {isActionRequired ? "Waiting for your response" : "No pending replies needed"}
          </p>
          <div className="requester-metric-card__footer">
            <span>View pending items &rarr;</span>
          </div>
        </div>

        {/* Card 3: Resolved / Closed */}
        <div
          className="requester-metric-card requester-metric-card--resolved"
          data-testid="metric-resolved-tickets"
          role="button"
          tabIndex={0}
          onClick={() => onNavigateMyTickets?.("resolved")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigateMyTickets?.("resolved");
            }
          }}
          aria-label={`Resolved or Closed Tickets: ${metrics.resolvedOrClosed}`}
        >
          <div className="requester-metric-card__header">
            <span className="requester-metric-card__label">Resolved / Closed</span>
            <div className="requester-metric-card__icon-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="requester-metric-card__body">
            <span className="requester-metric-card__value">
              {metrics.resolvedOrClosed}
            </span>
          </div>
          <p className="requester-metric-card__subtitle">Completed support requests</p>
          <div className="requester-metric-card__footer">
            <span>View completed tickets &rarr;</span>
          </div>
        </div>
      </section>

      {/* 4. Empty State or Recent Ticket Progress List */}
      {hasNoTickets ? (
        <section
          className="requester-empty-state"
          data-testid="requester-dashboard-empty"
        >
          <div className="requester-empty-state__icon-wrap">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="requester-empty-state__title">You have no active tickets</h2>
          <p className="requester-empty-state__description">
            Everything is running smoothly! If you need assistance with any IT equipment,
            software, or network access, feel free to submit a request.
          </p>
          <button
            type="button"
            className="requester-btn-primary"
            data-testid="btn-create-first-ticket"
            onClick={onCreateTicket}
          >
            + Create Your First Ticket
          </button>
        </section>
      ) : (
        <section
          className="requester-recent-section"
          data-testid="recent-tickets-section"
        >
          <div className="requester-section-header">
            <div className="requester-section-title-wrap">
              <h2 className="requester-section-title">Recent Ticket Progress</h2>
              <p className="requester-section-subtitle">
                Track status and recent activity on your service requests
              </p>
            </div>
            <button
              type="button"
              className="requester-btn-secondary"
              onClick={() => onNavigateMyTickets?.()}
            >
              See all
            </button>
          </div>

          {recentTickets.length === 0 ? (
            <p style={{ textAlign: "center", color: "#5A6E63", padding: "20px" }}>
              No recent active tickets.
            </p>
          ) : (
            <div className="requester-tickets-table-wrapper">
              <table className="requester-tickets-table">
                <thead>
                  <tr>
                    <th>Ticket No.</th>
                    <th>Summary</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((t) => {
                    const statusStyle = getStatusBadgeStyle(t.currentStatus);
                    const priorityStyle = getPriorityBadgeStyle(t.requestedPriority);
                    const isUrgent = t.requestedPriority === "URGENT";

                    return (
                      <tr key={t.id} data-testid={`recent-ticket-row-${t.id}`}>
                        <td>
                          <span className="requester-ticket-number">
                            {t.ticketNumber}
                          </span>
                        </td>
                        <td>
                          <span className="requester-ticket-summary" title={t.summary}>
                            {t.summary}
                          </span>
                        </td>
                        <td>
                          <span
                            className="requester-badge"
                            style={priorityStyle}
                          >
                            {isUrgent && (
                              <span className="requester-badge-urgent-pulse" />
                            )}
                            {t.requestedPriority}
                          </span>
                        </td>
                        <td>
                          <span
                            className="requester-badge"
                            style={statusStyle}
                          >
                            {t.currentStatus.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "#4A5E53", fontSize: "12px" }}>
                            {formatDate(t.updatedAt)}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="requester-btn-view-detail"
                            data-testid={`btn-view-detail-${t.id}`}
                            onClick={() => onSelectTicket?.(t.id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

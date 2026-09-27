import React, { useState, useEffect } from "react";
import { Category, Ticket, fetchCategories, fetchStaffTickets } from "../api";
import "./StaffTicketQueue.css";

export interface StaffTicketQueueProps {
  onSelectTicket?: (ticket: Ticket) => void;
}

export const StaffTicketQueue: React.FC<StaffTicketQueueProps> = ({ onSelectTicket }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedItPriority, setSelectedItPriority] = useState<string>("");
  const [ownerFilter, setOwnerFilter] = useState<string>("all"); // "all" | "unassigned" | "me"
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch {
        // Fallback silently if category fetch encounters issues
      }
    }
    loadCategories();
  }, []);

  // Fetch Tickets with debounce for search
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    const debounceTimer = window.setTimeout(async () => {
      try {
        const ownerParam =
          ownerFilter === "unassigned"
            ? "unassigned"
            : ownerFilter === "me"
            ? "me"
            : undefined;

        const res = await fetchStaffTickets({
          search: search.trim() || undefined,
          category: selectedCategory || undefined,
          status: selectedStatus || undefined,
          priority: selectedPriority || undefined,
          itPriority: selectedItPriority || undefined,
          ownerId: ownerParam,
          sort: sortField,
          order: sortOrder,
          page: currentPage,
          limit,
        });

        if (!isCancelled) {
          setTickets(res.tickets);
          setPagination(res.pagination);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setTickets([]);
          setError(err.message || "Failed to retrieve IT Staff ticket queue");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, search ? 250 : 0);

    return () => {
      isCancelled = true;
      window.clearTimeout(debounceTimer);
    };
  }, [
    search,
    selectedCategory,
    selectedStatus,
    selectedPriority,
    selectedItPriority,
    ownerFilter,
    sortField,
    sortOrder,
    currentPage,
    limit,
  ]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSelectedPriority("");
    setSelectedItPriority("");
    setOwnerFilter("all");
    setSortField("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "" ||
    selectedStatus !== "" ||
    selectedPriority !== "" ||
    selectedItPriority !== "" ||
    ownerFilter !== "all";

  const renderPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    const priUpper = priority.toUpperCase();
    let badgeClass = "badge--medium";
    if (priUpper === "LOW") badgeClass = "badge--low";
    if (priUpper === "HIGH") badgeClass = "badge--high";
    if (priUpper === "URGENT") badgeClass = "badge--urgent";

    return <span className={`badge ${badgeClass}`}>{priUpper}</span>;
  };

  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    let statusClass = "badge-status--open";
    if (s === "NEW") statusClass = "badge-status--new";
    if (s === "IN_PROGRESS") statusClass = "badge-status--in-progress";
    if (s === "WAITING_FOR_REQUESTER") statusClass = "badge-status--waiting";
    if (s === "RESOLVED") statusClass = "badge-status--resolved";
    if (s === "CLOSED") statusClass = "badge-status--closed";
    if (s === "REOPENED") statusClass = "badge-status--reopened";
    if (s === "CANCELLED") statusClass = "badge-status--cancelled";

    const formattedLabel = s.replace(/_/g, " ");
    return <span className={`badge ${statusClass}`}>{formattedLabel}</span>;
  };

  const renderOwnerBadge = (owner?: { id: number; name: string; email: string } | null) => {
    if (!owner) {
      return <span className="badge badge-owner--unassigned">Unassigned</span>;
    }
    return <span className="badge badge-owner--assigned">{owner.name}</span>;
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.total, pagination.page * pagination.limit);

  return (
    <div className="staff-queue" data-testid="staff-ticket-queue">
      {/* Header Section */}
      <header className="staff-queue__header">
        <div className="staff-queue__title-group">
          <h1 className="staff-queue__title">IT Staff Ticket Queue</h1>
          <p className="staff-queue__subtitle">
            Shared organization ticket queue across all departments and systems
          </p>
        </div>
      </header>

      {/* Toolbar & Filters */}
      <section className="staff-queue__toolbar" aria-label="Queue Controls">
        {/* Search Input */}
        <div className="staff-queue__search-row">
          <div className="staff-queue__search-wrap">
            <span className="staff-queue__search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="staff-queue__search-input"
              placeholder="Search by Ticket No or Summary..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search tickets"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="staff-queue__filters-row">
          {/* Category Filter */}
          <select
            className="staff-queue__select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="staff-queue__select"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_REQUESTER">Waiting for Requester</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REOPENED">Reopened</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Requested Priority Filter */}
          <select
            className="staff-queue__select"
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by requested priority"
          >
            <option value="">All Req. Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* IT Priority Filter */}
          <select
            className="staff-queue__select"
            value={selectedItPriority}
            onChange={(e) => {
              setSelectedItPriority(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by IT priority"
          >
            <option value="">All IT Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Ownership Toggle */}
          <div className="staff-queue__owner-toggle" role="group" aria-label="Ownership filter">
            <button
              type="button"
              className={`staff-queue__toggle-btn ${ownerFilter === "all" ? "staff-queue__toggle-btn--active" : ""}`}
              onClick={() => {
                setOwnerFilter("all");
                setCurrentPage(1);
              }}
            >
              All
            </button>
            <button
              type="button"
              className={`staff-queue__toggle-btn ${ownerFilter === "unassigned" ? "staff-queue__toggle-btn--active" : ""}`}
              onClick={() => {
                setOwnerFilter("unassigned");
                setCurrentPage(1);
              }}
            >
              Unassigned
            </button>
            <button
              type="button"
              className={`staff-queue__toggle-btn ${ownerFilter === "me" ? "staff-queue__toggle-btn--active" : ""}`}
              onClick={() => {
                setOwnerFilter("me");
                setCurrentPage(1);
              }}
            >
              Assigned to Me
            </button>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="staff-queue__clear-btn"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "#FFEBEE",
            color: "#C62828",
            borderRadius: "6px",
            border: "1px solid #FFCDD2",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Table Representation (Desktop) */}
      <div className="staff-queue__table-wrap">
        <table className="staff-queue__table">
          <thead>
            <tr>
              <th
                className="staff-queue__th staff-queue__th--sortable"
                onClick={() => handleSortChange("ticketNumber")}
              >
                Ticket No {sortField === "ticketNumber" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="staff-queue__th staff-queue__th--sortable"
                onClick={() => handleSortChange("createdAt")}
              >
                Created Date {sortField === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="staff-queue__th">Summary</th>
              <th className="staff-queue__th">Category</th>
              <th className="staff-queue__th">Requester</th>
              <th className="staff-queue__th">Requested Priority</th>
              <th
                className="staff-queue__th staff-queue__th--sortable"
                onClick={() => handleSortChange("itPriority")}
              >
                IT Priority {sortField === "itPriority" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="staff-queue__th staff-queue__th--sortable"
                onClick={() => handleSortChange("currentStatus")}
              >
                Status {sortField === "currentStatus" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="staff-queue__th">Owner</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "3rem", color: "#5A6E63" }}>
                  Loading staff ticket queue...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="staff-queue__empty">
                    <h2 className="staff-queue__empty-title">No tickets match your filters</h2>
                    <p className="staff-queue__empty-desc">
                      Try adjusting your search criteria or resetting filters.
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        className="staff-queue__clear-btn"
                        style={{ margin: "0 auto" }}
                        onClick={handleClearFilters}
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="staff-queue__tr">
                  <td className="staff-queue__td">
                    <button
                      type="button"
                      className="staff-queue__ticket-link"
                      onClick={() => onSelectTicket && onSelectTicket(t)}
                    >
                      {t.ticketNumber}
                    </button>
                  </td>
                  <td className="staff-queue__td" style={{ color: "#5A6E63", fontSize: "0.8125rem" }}>
                    {formatDate(t.createdAt)}
                  </td>
                  <td className="staff-queue__td">
                    <div className="staff-queue__ticket-summary">{t.summary}</div>
                    {t.relatedSystem && (
                      <div className="staff-queue__ticket-meta">{t.relatedSystem.name}</div>
                    )}
                  </td>
                  <td className="staff-queue__td" style={{ color: "#37474F" }}>
                    {t.category?.name || "-"}
                  </td>
                  <td className="staff-queue__td">
                    <div style={{ fontWeight: "600", color: "#1A2E23" }}>
                      {t.requester?.name || "Unknown"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#7A9084" }}>
                      {t.requester?.email || ""}
                    </div>
                  </td>
                  <td className="staff-queue__td">{renderPriorityBadge(t.requestedPriority)}</td>
                  <td className="staff-queue__td">{renderPriorityBadge(t.itPriority)}</td>
                  <td className="staff-queue__td">{renderStatusBadge(t.currentStatus)}</td>
                  <td className="staff-queue__td">{renderOwnerBadge(t.owner)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack */}
      <div className="staff-queue__cards">
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#5A6E63" }}>
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="staff-queue__empty">
            <h2 className="staff-queue__empty-title">No tickets match your filters</h2>
            <p className="staff-queue__empty-desc">
              Try adjusting your search criteria or resetting filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                className="staff-queue__clear-btn"
                onClick={handleClearFilters}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="staff-queue-card">
              <div className="staff-queue-card__header">
                <button
                  type="button"
                  className="staff-queue__ticket-link"
                  onClick={() => onSelectTicket && onSelectTicket(t)}
                >
                  {t.ticketNumber}
                </button>
                {renderStatusBadge(t.currentStatus)}
              </div>
              <h2 className="staff-queue-card__title">{t.summary}</h2>
              <div className="staff-queue-card__meta-row">
                <span>{t.category?.name}</span>
                {t.relatedSystem && <span>• {t.relatedSystem.name}</span>}
                <span>• {formatDate(t.createdAt)}</span>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#5A6E63", marginBottom: "0.5rem" }}>
                Requester: <strong>{t.requester?.name}</strong>
              </div>
              <div className="staff-queue-card__badges">
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#7A9084" }}>Req:</span>
                  {renderPriorityBadge(t.requestedPriority)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#7A9084" }}>IT:</span>
                  {renderPriorityBadge(t.itPriority)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "auto" }}>
                  {renderOwnerBadge(t.owner)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && pagination.total > 0 && (
        <footer className="staff-queue__pagination">
          <div>
            Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of{" "}
            <strong>{pagination.total}</strong> tickets
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>Per page:</span>
              <select
                className="staff-queue__select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Items per page"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>

            <div className="staff-queue__page-buttons">
              <button
                type="button"
                className="staff-queue__page-btn"
                disabled={pagination.page <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                ‹
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === pagination.totalPages ||
                    Math.abs(p - pagination.page) <= 1
                  );
                })
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`staff-queue__page-btn ${
                      p === pagination.page ? "staff-queue__page-btn--active" : ""
                    }`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}

              <button
                type="button"
                className="staff-queue__page-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

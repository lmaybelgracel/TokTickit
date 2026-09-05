import React, { useState, useEffect } from "react";
import {
  Category,
  RequesterUser,
  Ticket,
  PaginationMeta,
  fetchCategories,
  fetchMyTickets,
} from "../api";
import "./MyTickets.css";

interface MyTicketsProps {
  activeRequester: RequesterUser;
  onNavigateCreate: () => void;
  onSelectTicket?: (ticket: Ticket) => void;
}

export const MyTickets: React.FC<MyTicketsProps> = ({
  activeRequester,
  onNavigateCreate,
  onSelectTicket,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sort, setSort] = useState<string>("createdAt:desc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load Categories on mount
  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        // Fallback silently if categories fail to load
      }
    }
    loadCats();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetchMyTickets(activeRequester.id, { search, category: selectedCategory, priority: selectedPriority, status: selectedStatus, sort, page: currentPage, pageSize: 10 });
        if (!cancelled) { setTickets(res.data); setPagination(res.pagination); }
      } catch {
        if (!cancelled) { setTickets([]); setError("Failed to load your tickets. Please try again."); }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, search ? 250 : 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [activeRequester.id, search, selectedCategory, selectedPriority, selectedStatus, sort, currentPage]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedPriority("");
    setSelectedStatus("");
    setSort("createdAt:desc");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "" ||
    selectedPriority !== "" ||
    selectedStatus !== "";

  const renderPriorityBadge = (priority: string) => {
    let badgeStyle = styles.badgeLow;
    if (priority === "HIGH") badgeStyle = styles.badgeHigh;
    if (priority === "MEDIUM") badgeStyle = styles.badgeMedium;

    return (
      <span style={{ ...styles.badge, ...badgeStyle }}>
        {priority}
      </span>
    );
  };

  const renderStatusBadge = (status: string) => {
    return (
      <span style={{ ...styles.badge, ...styles.badgeStatusNew }}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div style={styles.container} className="my-tickets">
      {/* Header Row */}
      <div style={styles.headerRow} className="my-tickets__header">
        <div>
          <h1 style={styles.title}>My Tickets</h1>
          <span style={styles.subtitle}>
            Manage and track support tickets created by {activeRequester.name}
          </span>
        </div>
        <button type="button" onClick={onNavigateCreate} style={styles.createBtn}>
          + Create Ticket
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={styles.filterCard}>
        <div style={styles.filterGrid}>
          {/* Search Input */}
          <div style={styles.searchWrapper}>
            <label className="visually-hidden" htmlFor="my-tickets-search">Search by ticket number or summary</label>
            <input
              id="my-tickets-search"
              type="text"
              placeholder="Search by ticket number or summary..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchInput}
            />
          </div>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.filterSelect}
            aria-label="Filter by Category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Priority Select */}
          <select
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.filterSelect}
            aria-label="Filter by Priority"
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.filterSelect}
            aria-label="Filter by Status"
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
          </select>

          {/* Sort Select */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={styles.filterSelect}
            aria-label="Sort Order"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="updatedAt:desc">Recently Updated</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button onClick={handleClearFilters} style={styles.clearBtn}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {error && <div style={styles.errorBanner} role="alert">{error}</div>}

      {isLoading ? (
        <div style={styles.cardContainer}>
          <p role="status" style={{ textAlign: "center", color: "#5A6E63", padding: "2rem" }}>
            Loading tickets...
          </p>
        </div>
      ) : tickets.length === 0 ? (
        <div style={styles.cardContainer}>
          {hasActiveFilters ? (
            /* No-Results State (UI-04) */
            <div style={styles.noResultsBox}>
              <h3 style={styles.noResultsTitle}>No Tickets Found</h3>
              <p style={styles.noResultsText}>
                No tickets match your search and filter criteria.
              </p>
              <button onClick={handleClearFilters} style={styles.clearBtnInline}>
                Clear Filters
              </button>
            </div>
          ) : (
            /* Empty State */
            <div style={styles.emptyBox}>
              <h3 style={styles.emptyTitle}>No Tickets Yet</h3>
              <p style={styles.emptyText}>
                You haven't submitted any IT support tickets. Click below to create your first ticket.
              </p>
              <button onClick={onNavigateCreate} style={styles.createBtnInline}>
                + Create Ticket
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div style={styles.tableCard} className="my-tickets__table-wrap">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ticket Number</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Summary</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Priority</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} style={styles.tr}>
                    <td style={styles.tdTicketNo}>{t.ticketNumber}</td>
                    <td style={styles.tdDate}>{formatDate(t.createdAt)}</td>
                    <td style={styles.tdSummary}>{t.summary}</td>
                    <td style={styles.tdCategory}>{t.category?.name || "-"}</td>
                    <td style={styles.td}>{renderPriorityBadge(t.requestedPriority)}</td>
                    <td style={styles.td}>{renderStatusBadge(t.currentStatus)}{onSelectTicket && <button type="button" className="ticket-open-link" onClick={() => onSelectTicket(t)}>View detail</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="my-tickets__cards">
            {tickets.map((t) => <article className="my-ticket-card" key={t.id}>
              <div className="my-ticket-card__top"><strong>{t.ticketNumber}</strong>{renderStatusBadge(t.currentStatus)}</div>
              <h2>{t.summary}</h2>
              <p>{t.category?.name || "Uncategorized"} - {formatDate(t.createdAt)}</p>
              <div className="my-ticket-card__actions">{renderPriorityBadge(t.requestedPriority)}{onSelectTicket && <button type="button" className="ticket-open-link" onClick={() => onSelectTicket(t)}>View detail</button>}</div>
            </article>)}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={styles.paginationRow} className="my-tickets__pagination">
              <span style={styles.paginationInfo}>
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} tickets)
              </span>

              <div style={styles.paginationBtnGroup}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.pageBtn,
                    ...(currentPage === 1 ? styles.pageBtnDisabled : {}),
                  }}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).filter(pageNum => pageNum === 1 || pageNum === pagination.totalPages || Math.abs(pageNum-currentPage) <= 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        ...styles.pageBtn,
                        ...(pageNum === currentPage ? styles.pageBtnActive : {}),
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={currentPage === pagination.totalPages}
                  style={{
                    ...styles.pageBtn,
                    ...(currentPage === pagination.totalPages ? styles.pageBtnDisabled : {}),
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1.5rem 1rem",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#006B3C",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#5A6E63",
    marginTop: "0.25rem",
    display: "block",
  },
  createBtn: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#006B3C",
    color: "#FFFFFF",
    borderRadius: "6px",
    border: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    border: "1px solid #E0E6E2",
    padding: "1rem",
    marginBottom: "1.5rem",
  },
  filterGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    alignItems: "center",
  },
  searchWrapper: {
    flex: "1 1 250px",
  },
  searchInput: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #C2D1C8",
    fontSize: "0.875rem",
    color: "#1A2E23",
    outline: "none",
    boxSizing: "border-box",
  },
  filterSelect: {
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #C2D1C8",
    fontSize: "0.875rem",
    color: "#1A2E23",
    backgroundColor: "#FFFFFF",
    outline: "none",
  },
  clearBtn: {
    padding: "0.5rem 0.875rem",
    borderRadius: "6px",
    border: "1px solid #006B3C",
    backgroundColor: "#FFFFFF",
    color: "#006B3C",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    border: "1px solid #E0E6E2",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    backgroundColor: "#F0F4F2",
    color: "#5A6E63",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    padding: "0.875rem 1rem",
    borderBottom: "1px solid #E0E6E2",
  },
  tr: {
    borderBottom: "1px solid #E0E6E2",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
  tdTicketNo: {
    padding: "1rem",
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#006B3C",
  },
  tdDate: {
    padding: "1rem",
    fontSize: "0.8125rem",
    color: "#5A6E63",
  },
  tdSummary: {
    padding: "1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#1A2E23",
  },
  tdCategory: {
    padding: "1rem",
    fontSize: "0.875rem",
    color: "#5A6E63",
  },
  td: {
    padding: "1rem",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.625rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  badgeLow: {
    backgroundColor: "#E8F5E9",
    border: "1px solid #C8E6C9",
    color: "#2E7D32",
  },
  badgeMedium: {
    backgroundColor: "#FFF3E0",
    border: "1px solid #FFE0B2",
    color: "#E65100",
  },
  badgeHigh: {
    backgroundColor: "#FDF2F2",
    border: "1px solid #F5C6CB",
    color: "#B71C1C",
  },
  badgeStatusNew: {
    backgroundColor: "#EAF6EF",
    border: "1px solid #B2DFDB",
    color: "#006B3C",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    border: "1px solid #E0E6E2",
    padding: "2rem",
  },
  emptyBox: {
    textAlign: "center",
    padding: "2rem 1rem",
  },
  emptyTitle: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#1A2E23",
    margin: "0 0 0.5rem 0",
  },
  emptyText: {
    color: "#5A6E63",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
  },
  createBtnInline: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#006B3C",
    color: "#FFFFFF",
    borderRadius: "6px",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  noResultsBox: {
    textAlign: "center",
    padding: "2rem 1rem",
  },
  noResultsTitle: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#1A2E23",
    margin: "0 0 0.5rem 0",
  },
  noResultsText: {
    color: "#5A6E63",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
  },
  clearBtnInline: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#FFFFFF",
    color: "#006B3C",
    border: "1px solid #006B3C",
    borderRadius: "6px",
    fontWeight: 600,
    cursor: "pointer",
  },
  errorBanner: {
    backgroundColor: "#FDF2F2",
    border: "1px solid #F5C6CB",
    color: "#B71C1C",
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.875rem",
  },
  paginationRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1.25rem",
  },
  paginationInfo: {
    fontSize: "0.8125rem",
    color: "#5A6E63",
  },
  paginationBtnGroup: {
    display: "flex",
    gap: "0.375rem",
  },
  pageBtn: {
    padding: "0.375rem 0.75rem",
    borderRadius: "4px",
    border: "1px solid #C2D1C8",
    backgroundColor: "#FFFFFF",
    color: "#1A2E23",
    fontSize: "0.8125rem",
    cursor: "pointer",
  },
  pageBtnActive: {
    backgroundColor: "#006B3C",
    borderColor: "#006B3C",
    color: "#FFFFFF",
    fontWeight: 700,
  },
  pageBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

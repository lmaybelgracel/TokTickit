import React, { useState, useEffect } from "react";
import {
  Ticket,
  PublicComment,
  InternalNote,
  StaffUser,
  fetchStaffTicketDetail,
  fetchStaffUsers,
  claimTicket,
  assignTicket,
  updateItPriority,
  updateTicketStatus,
  resolveTicket,
  addTicketComment,
  addTicketNote,
} from "../api";
import "./StaffTicketDetail.css";

export interface StaffTicketDetailProps {
  ticketId: number;
  onBack: () => void;
}

const ALLOWED_NEXT_STATUSES: Record<string, string[]> = {
  NEW: ["OPEN", "CANCELLED"],
  OPEN: ["IN_PROGRESS", "WAITING_FOR_REQUESTER", "CANCELLED"],
  IN_PROGRESS: ["WAITING_FOR_REQUESTER", "CANCELLED"],
  WAITING_FOR_REQUESTER: ["IN_PROGRESS", "CANCELLED"],
  RESOLVED: ["CLOSED", "REOPENED"],
  CLOSED: ["REOPENED"],
  REOPENED: ["IN_PROGRESS", "WAITING_FOR_REQUESTER", "CANCELLED"],
  CANCELLED: [],
};

export const StaffTicketDetail: React.FC<StaffTicketDetailProps> = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState<(Ticket & { comments?: PublicComment[]; notes?: InternalNote[] }) | null>(null);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Comment / Note input states
  const [commentInput, setCommentInput] = useState<string>("");
  const [noteInput, setNoteInput] = useState<string>("");
  const [isSubmittingMessage, setIsSubmittingMessage] = useState<boolean>(false);

  // Resolve Modal states
  const [isResolveModalOpen, setIsResolveModalOpen] = useState<boolean>(false);
  const [resolutionSummary, setResolutionSummary] = useState<string>("");
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // Load ticket details and staff roster
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [ticketData, usersData] = await Promise.all([
          fetchStaffTicketDetail(ticketId),
          fetchStaffUsers().catch(() => []),
        ]);
        if (!cancelled) {
          setTicket(ticketData);
          setStaffUsers(usersData);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load ticket details");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  const handleClaim = async () => {
    if (!ticket) return;
    try {
      setActionSuccess(null);
      const updated = await claimTicket(ticket.id);
      setTicket((prev) => (prev ? { ...prev, ...updated } : null));
      setActionSuccess("You have claimed ownership of this ticket.");
    } catch (err: any) {
      setError(err.message || "Failed to claim ticket");
    }
  };

  const handleAssign = async (targetUserId: number) => {
    if (!ticket || !targetUserId) return;
    try {
      setActionSuccess(null);
      const updated = await assignTicket(ticket.id, targetUserId);
      setTicket((prev) => (prev ? { ...prev, ...updated } : null));
      setActionSuccess("Ticket assigned successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to assign ticket");
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket || !newPriority) return;
    try {
      setActionSuccess(null);
      const updated = await updateItPriority(ticket.id, newPriority);
      setTicket((prev) => (prev ? { ...prev, ...updated } : null));
      setActionSuccess(`IT Priority updated to ${newPriority}.`);
    } catch (err: any) {
      setError(err.message || "Failed to update IT priority");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket || !newStatus) return;
    try {
      setActionSuccess(null);
      const updated = await updateTicketStatus(ticket.id, newStatus);
      setTicket((prev) => (prev ? { ...prev, ...updated } : null));
      setActionSuccess(`Status transitioned to ${newStatus}.`);
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    }
  };

  const handleResolveSubmit = async () => {
    if (!ticket) return;
    if (resolutionSummary.trim().length < 3 || resolutionSummary.trim().length > 500) {
      setResolveError("Resolution summary must be between 3 and 500 characters.");
      return;
    }

    setIsResolving(true);
    setResolveError(null);
    try {
      const updated = await resolveTicket(ticket.id, resolutionSummary.trim());
      setTicket((prev) => (prev ? { ...prev, ...updated } : null));
      setIsResolveModalOpen(false);
      setResolutionSummary("");
      setActionSuccess("Ticket has been resolved with resolution summary recorded.");
    } catch (err: any) {
      setResolveError(err.message || "Failed to resolve ticket");
    } finally {
      setIsResolving(false);
    }
  };

  const handleAddPublicComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !commentInput.trim()) return;

    setIsSubmittingMessage(true);
    try {
      const newComment = await addTicketComment(ticket.id, commentInput.trim());
      setTicket((prev) =>
        prev
          ? { ...prev, comments: [...(prev.comments || []), newComment] }
          : null
      );
      setCommentInput("");
    } catch (err: any) {
      setError(err.message || "Failed to post comment");
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !noteInput.trim()) return;

    setIsSubmittingMessage(true);
    try {
      const newNote = await addTicketNote(ticket.id, noteInput.trim());
      setTicket((prev) =>
        prev
          ? { ...prev, notes: [...(prev.notes || []), newNote] }
          : null
      );
      setNoteInput("");
    } catch (err: any) {
      setError(err.message || "Failed to add internal note");
    } finally {
      setIsSubmittingMessage(false);
    }
  };

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
    return <span className={`badge ${statusClass}`}>{s.replace(/_/g, " ")}</span>;
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

  if (isLoading) {
    return (
      <div className="staff-detail" style={{ textAlign: "center", padding: "4rem 1rem", color: "#5A6E63" }}>
        Loading ticket details...
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="staff-detail">
        <button type="button" className="staff-detail__back-btn" onClick={onBack}>
          ← Back to Queue
        </button>
        <div style={{ marginTop: "1rem", padding: "1.25rem", backgroundColor: "#FFEBEE", color: "#C62828", borderRadius: "8px" }}>
          {error}
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const validTransitions = ALLOWED_NEXT_STATUSES[ticket.currentStatus] || [];
  const canResolve = ["IN_PROGRESS", "WAITING_FOR_REQUESTER", "REOPENED"].includes(ticket.currentStatus);

  return (
    <div className="staff-detail" data-testid="staff-ticket-detail">
      {/* Header */}
      <header className="staff-detail__header">
        <button type="button" className="staff-detail__back-btn" onClick={onBack}>
          ← Back to Staff Queue
        </button>

        <div className="staff-detail__title-row">
          <div className="staff-detail__title-wrap">
            <h1 className="staff-detail__ticket-no">{ticket.ticketNumber}</h1>
            {renderStatusBadge(ticket.currentStatus)}
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#5A6E63", fontWeight: "700" }}>IT:</span>
              {renderPriorityBadge(ticket.itPriority || "MEDIUM")}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#5A6E63", fontWeight: "700" }}>REQ:</span>
              {renderPriorityBadge(ticket.requestedPriority)}
            </div>
          </div>
        </div>
      </header>

      {/* Success Notification */}
      {actionSuccess && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            backgroundColor: "#EAF6EF",
            color: "#006B3C",
            borderRadius: "6px",
            border: "1px solid #C8E6C9",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          {actionSuccess}
        </div>
      )}

      {/* Operational Actions Toolbar */}
      <section className="staff-detail__action-bar" aria-label="Ticket Operations">
        {/* Claim Ticket Action */}
        {!ticket.ownerId && (
          <button
            type="button"
            className="staff-detail__btn-claim"
            onClick={handleClaim}
          >
            Claim Ticket
          </button>
        )}

        {/* Assign Owner */}
        <div className="staff-detail__action-group">
          <label className="staff-detail__action-label" htmlFor="reassign-select">
            Assigned Owner
          </label>
          <select
            id="reassign-select"
            className="staff-detail__select"
            value={ticket.ownerId || ""}
            onChange={(e) => handleAssign(Number(e.target.value))}
          >
            <option value="" disabled>
              -- Select Owner --
            </option>
            {staffUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role.replace(/_/g, " ")})
              </option>
            ))}
          </select>
        </div>

        {/* IT Priority Selector */}
        <div className="staff-detail__action-group">
          <label className="staff-detail__action-label" htmlFor="it-priority-select">
            IT Priority
          </label>
          <select
            id="it-priority-select"
            className="staff-detail__select"
            value={ticket.itPriority || "MEDIUM"}
            onChange={(e) => handlePriorityChange(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {/* Status Transition Selector */}
        {validTransitions.length > 0 && (
          <div className="staff-detail__action-group">
            <label className="staff-detail__action-label" htmlFor="status-transition-select">
              Next Status
            </label>
            <select
              id="status-transition-select"
              className="staff-detail__select"
              value=""
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="" disabled>
                -- Transition Status --
              </option>
              {validTransitions.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Resolve Ticket Button */}
        {canResolve && (
          <button
            type="button"
            className="staff-detail__btn-resolve"
            onClick={() => setIsResolveModalOpen(true)}
          >
            Resolve Ticket
          </button>
        )}
      </section>

      {/* Problem Appears Resolved Indication Banner */}
      {ticket.requesterResolvedIndication && (
        <div className="staff-detail__indication-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>
            The requester has indicated that their problem appears resolved. Please review and formally resolve the ticket.
          </span>
        </div>
      )}

      {/* Main Content & Side Panel Grid */}
      <div className="staff-detail__grid">
        {/* Left Column: Summary, Description, Attachments, Dual Communication */}
        <div className="staff-detail__main-col">
          {/* Summary & Description */}
          <section className="staff-detail__card">
            <h2 className="staff-detail__card-title">{ticket.summary}</h2>
            <p className="staff-detail__desc-text">{ticket.description}</p>
          </section>

          {/* Resolution Summary (If resolved) */}
          {ticket.resolutionSummary && (
            <section
              className="staff-detail__card"
              style={{ backgroundColor: "#F9FCFA", borderLeft: "4px solid #2E7D32" }}
            >
              <h2 className="staff-detail__card-title" style={{ color: "#2E7D32" }}>
                Resolution Summary
              </h2>
              <p className="staff-detail__desc-text">{ticket.resolutionSummary}</p>
            </section>
          )}

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <section className="staff-detail__card">
              <h2 className="staff-detail__card-title">Attachments</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {ticket.attachments.map((att) => (
                  <li
                    key={att.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.75rem",
                      backgroundColor: "#F8FAF9",
                      borderRadius: "6px",
                      border: "1px solid #E0E6E2",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", color: "#1A2E23", fontWeight: "600" }}>
                      {att.filename}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#5A6E63" }}>
                      ({Math.round(att.fileSize / 1024)} KB)
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Dual Communication Panel (Public Comments vs Internal Notes) */}
          <section className="dual-comm" aria-label="Discussion and Notes">
            {/* Tabs */}
            <div className="dual-comm__tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "public"}
                className={`dual-comm__tab ${activeTab === "public" ? "dual-comm__tab--active-public" : ""}`}
                onClick={() => setActiveTab("public")}
              >
                Public Comments ({ticket.comments ? ticket.comments.length : 0})
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "private"}
                className={`dual-comm__tab ${activeTab === "private" ? "dual-comm__tab--active-private" : ""}`}
                onClick={() => setActiveTab("private")}
              >
                Internal Notes ({ticket.notes ? ticket.notes.length : 0})
              </button>
            </div>

            {/* Tab 1: Public Comments */}
            {activeTab === "public" && (
              <div className="dual-comm__content">
                <div className="dual-comm__public-banner">
                  Public comments are visible to all parties, including the requester and IT staff.
                </div>

                <div className="dual-comm__messages">
                  {!ticket.comments || ticket.comments.length === 0 ? (
                    <div style={{ color: "#7A9084", fontSize: "0.875rem", textAlign: "center", padding: "1.5rem" }}>
                      No public comments yet. Post a message to communicate with the requester.
                    </div>
                  ) : (
                    ticket.comments.map((comm) => (
                      <div key={comm.id} className="dual-comm__bubble dual-comm__bubble--public">
                        <div className="dual-comm__bubble-top">
                          <span className="dual-comm__bubble-author">
                            {comm.author.name}
                            <span style={{ fontSize: "0.75rem", color: "#5A6E63", fontWeight: "400" }}>
                              ({comm.author.role.replace(/_/g, " ")})
                            </span>
                          </span>
                          <span>{formatDate(comm.createdAt)}</span>
                        </div>
                        <p className="dual-comm__bubble-text">{comm.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddPublicComment} className="dual-comm__input-wrap">
                  <textarea
                    className="dual-comm__textarea"
                    placeholder="Write a public comment for the requester..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="dual-comm__submit-btn dual-comm__submit-btn--public"
                    disabled={isSubmittingMessage || !commentInput.trim()}
                  >
                    Post Public Comment
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Internal Notes */}
            {activeTab === "private" && (
              <div className="dual-comm__content">
                <div className="dual-comm__lock-banner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Private: Visible only to IT Staff & Administrator. Requesters cannot see this.</span>
                </div>

                <div className="dual-comm__messages">
                  {!ticket.notes || ticket.notes.length === 0 ? (
                    <div style={{ color: "#7A9084", fontSize: "0.875rem", textAlign: "center", padding: "1.5rem" }}>
                      No internal notes recorded. Record private technical logs or handover notes here.
                    </div>
                  ) : (
                    ticket.notes.map((note) => (
                      <div key={note.id} className="dual-comm__bubble dual-comm__bubble--private">
                        <div className="dual-comm__bubble-top">
                          <span className="dual-comm__bubble-author">
                            {note.author.name}
                            <span style={{ fontSize: "0.75rem", color: "#5A6E63", fontWeight: "400" }}>
                              ({note.author.role.replace(/_/g, " ")})
                            </span>
                          </span>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                        <p className="dual-comm__bubble-text">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddInternalNote} className="dual-comm__input-wrap">
                  <textarea
                    className="dual-comm__textarea"
                    placeholder="Write a private internal note for IT Staff..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="dual-comm__submit-btn dual-comm__submit-btn--private"
                    disabled={isSubmittingMessage || !noteInput.trim()}
                  >
                    Add Internal Note
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Metadata & Requester info */}
        <div className="staff-detail__side-col">
          {/* Requester Profile Card */}
          <section className="staff-detail__card">
            <h2 className="staff-detail__card-title">Requester Information</h2>
            <div className="staff-detail__meta-list">
              <div className="staff-detail__meta-item">
                <span className="staff-detail__meta-label">Full Name</span>
                <span className="staff-detail__meta-value">{ticket.requester?.name || "Unknown"}</span>
              </div>
              <div className="staff-detail__meta-item">
                <span className="staff-detail__meta-label">Email</span>
                <span className="staff-detail__meta-value">{ticket.requester?.email || "-"}</span>
              </div>
            </div>
          </section>

          {/* Ticket Metadata Card */}
          <section className="staff-detail__card">
            <h2 className="staff-detail__card-title">Ticket Metadata</h2>
            <div className="staff-detail__meta-list">
              <div className="staff-detail__meta-item">
                <span className="staff-detail__meta-label">Category</span>
                <span className="staff-detail__meta-value">{ticket.category?.name || "-"}</span>
              </div>
              <div className="staff-detail__meta-item">
                <span className="staff-detail__meta-label">Related System</span>
                <span className="staff-detail__meta-value">{ticket.relatedSystem?.name || "-"}</span>
              </div>
              <div className="staff-detail__meta-item">
                <span className="staff-detail__meta-label">Created Date</span>
                <span className="staff-detail__meta-value">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="staff-detail__meta-item">
                <span className="staff-detail__meta-label">Last Updated</span>
                <span className="staff-detail__meta-value">{formatDate(ticket.updatedAt)}</span>
              </div>
              <div className="staff-detail__meta-item">
                <span className="staff-detail__meta-label">Current Owner</span>
                <span className="staff-detail__meta-value">
                  {ticket.owner ? `${ticket.owner.name} (${ticket.owner.role ? ticket.owner.role.replace(/_/g, " ") : "IT Staff"})` : "Unassigned"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Resolve Ticket Modal */}
      {isResolveModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="resolve-modal-title">
          <div className="modal-card">
            <header className="modal-header">
              <h2 id="resolve-modal-title" className="modal-title">
                Resolve Ticket: {ticket.ticketNumber}
              </h2>
            </header>

            <div className="modal-body">
              <p style={{ fontSize: "0.875rem", color: "#5A6E63", margin: 0 }}>
                Per course business rule BR-20, resolving a ticket requires providing a clear resolution summary
                explaining the diagnostic steps and corrective action taken (3 to 500 characters).
              </p>

              {resolveError && (
                <div
                  style={{
                    padding: "0.625rem 0.875rem",
                    backgroundColor: "#FFEBEE",
                    color: "#C62828",
                    borderRadius: "6px",
                    fontSize: "0.8125rem",
                  }}
                >
                  {resolveError}
                </div>
              )}

              <label htmlFor="resolution-summary-input" style={{ fontSize: "0.8125rem", fontWeight: "700", color: "#1A2E23" }}>
                Resolution Summary *
              </label>
              <textarea
                id="resolution-summary-input"
                className="dual-comm__textarea"
                rows={4}
                placeholder="Describe how the problem was resolved (e.g. Replaced faulty cable, reconfigured VPN profile)..."
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                maxLength={500}
              />
              <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#5A6E63" }}>
                {resolutionSummary.trim().length} / 500 characters (min 3)
              </div>
            </div>

            <footer className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsResolveModalOpen(false);
                  setResolveError(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={isResolving || resolutionSummary.trim().length < 3}
                onClick={handleResolveSubmit}
              >
                {isResolving ? "Resolving..." : "Confirm & Resolve"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

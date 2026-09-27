import React, { useEffect, useState } from "react";
import {
  Attachment,
  RequesterUser,
  Ticket,
  PublicComment,
  downloadAttachment,
  fetchTicketDetail,
  removeAttachment,
  uploadAttachment,
  fetchTicketComments,
  addTicketComment,
  indicateTicketResolved,
} from "../api";
import "./TicketDetail.css";

interface Props { activeRequester: RequesterUser; ticketId: number; onBack: () => void; }
const size = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const date = (value?: string | null) => value ? new Date(value).toLocaleString() : "—";
const allowedFileTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]);
const maxFileSize = 5 * 1024 * 1024;

export const TicketDetail: React.FC<Props> = ({ activeRequester, ticketId, onBack }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<Attachment | null>(null);
  const [reason, setReason] = useState("");

  // Comments and Resolution Indication states
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [indicatingResolved, setIndicatingResolved] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTicketDetail(activeRequester.id, ticketId);
      setTicket(data);
      try {
        const commentList = await fetchTicketComments(ticketId, null, activeRequester.id);
        setComments(commentList || []);
      } catch {
        setComments([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [activeRequester.id, ticketId]);

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (!allowedFileTypes.has(file.type)) {
      setError("Only JPG, PNG, WEBP, and PDF files are allowed."); event.target.value = ""; return;
    }
    if (file.size > maxFileSize) {
      setError("Attachment must not exceed 5 MB."); event.target.value = ""; return;
    }
    setBusy(true); setError(""); try { await uploadAttachment(activeRequester.id, ticketId, file); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); } finally { setBusy(false); event.target.value = ""; }
  };

  const confirmRemove = async () => {
    if (!removing || reason.trim().length < 3) return;
    setBusy(true); setError(""); try { await removeAttachment(activeRequester.id, removing.id, reason.trim()); setRemoving(null); setReason(""); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Removal failed"); } finally { setBusy(false); }
  };

  const download = async (attachment: Attachment) => { setError(""); try { await downloadAttachment(activeRequester.id, attachment); } catch (e) { setError(e instanceof Error ? e.message : "Download failed"); } };

  const handleToggleIndicateResolved = async () => {
    if (!ticket || indicatingResolved) return;
    setIndicatingResolved(true);
    try {
      const nextState = !ticket.requesterIndicatedResolved;
      const updated = await indicateTicketResolved(ticket.id, nextState, null, activeRequester.id);
      setTicket(prev => prev ? { ...prev, requesterIndicatedResolved: updated.requesterIndicatedResolved } : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update resolution indication");
    } finally {
      setIndicatingResolved(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || commentBusy) return;
    setCommentBusy(true);
    try {
      const created = await addTicketComment(ticketId, commentText.trim(), null, activeRequester.id);
      setComments(prev => [...prev, created]);
      setCommentText("");
      setShowCommentBox(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to post comment");
    } finally {
      setCommentBusy(false);
    }
  };

  if (loading) return <div className="ticket-detail-state">Loading ticket detail…</div>;
  if (error && !ticket) return <div className="ticket-detail-state" role="alert">{error}<button onClick={onBack}>Back to My Tickets</button></div>;
  if (!ticket) return null;
  const attachments = ticket.attachments || [];

  return (
    <div className="ticket-detail">
      <button className="back-link" onClick={onBack}>← Back to My Tickets</button>
      <div className="ticket-detail__heading">
        <div>
          <span className="eyebrow">Ticket detail</span>
          <h1>{ticket.ticketNumber}</h1>
          <p>{ticket.summary}</p>
        </div>
        <div className="badges">
          <span className={`badge priority-${ticket.requestedPriority.toLowerCase()}`}>{ticket.requestedPriority}</span>
          <span className="badge status">{ticket.currentStatus.replace("_", " ")}</span>
          {ticket.requesterIndicatedResolved && (
            <span className="badge badge-resolved-indicated">Requester marked as resolved</span>
          )}
        </div>
      </div>

      {ticket.resolutionSummary && (
        <div className="resolution-card">
          <h3>Resolution Summary</h3>
          <p>{ticket.resolutionSummary}</p>
          {ticket.resolvedAt && <small>Resolved on {date(ticket.resolvedAt)}</small>}
        </div>
      )}

      {error && <div className="detail-error" role="alert">{error}</div>}

      <div className="ticket-detail__grid">
        <section className="detail-card">
          <h2>Request details</h2>
          <dl>
            <div><dt>Created</dt><dd>{date(ticket.createdAt)}</dd></div>
            <div><dt>Requester</dt><dd>{ticket.requester?.name || activeRequester.name}</dd></div>
            <div><dt>Category</dt><dd>{ticket.category?.name}</dd></div>
            <div><dt>Related system</dt><dd>{ticket.relatedSystem?.name}</dd></div>
          </dl>
          <h3>Description</h3>
          <p className="description">{ticket.description}</p>
          {ticket.currentStatus !== "CLOSED" && ticket.currentStatus !== "CANCELLED" && (
            <div className="requester-indication-box">
              <button
                type="button"
                className={`btn-indicate-resolved ${ticket.requesterIndicatedResolved ? "indicated" : ""}`}
                onClick={handleToggleIndicateResolved}
                disabled={indicatingResolved}
              >
                {ticket.requesterIndicatedResolved ? "✓ Problem Marked as Resolved" : "Problem Appears Resolved?"}
              </button>
            </div>
          )}
        </section>

        <section className="detail-card attachments">
          <div className="attachments__head">
            <div>
              <h2>Attachments</h2>
              <span>{attachments.filter(a => !a.isRemoved).length} of 5 active files</span>
            </div>
            <label className={`upload-button ${busy ? "disabled" : ""}`}>
              + Add file
              <input
                aria-label="Upload attachment"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                disabled={busy || attachments.filter(a => !a.isRemoved).length >= 5}
                onChange={onFile}
              />
            </label>
          </div>
          {attachments.length === 0 ? (
            <p className="empty-files">No attachments added.</p>
          ) : (
            <div className="attachment-list">
              {attachments.map(a => (
                <article key={a.id} className={`attachment ${a.isRemoved ? "removed" : ""}`}>
                  <div>
                    <div className="filename">{a.filename} {a.isRemoved && <span className="removed-badge">Removed</span>}</div>
                    <small>{size(a.fileSize)} · Uploaded {date(a.uploadedAt)}</small>
                    {a.isRemoved && (
                      <>
                        <small>Removed on {date(a.removedAt)}</small>
                        <blockquote>{a.removalReason}</blockquote>
                      </>
                    )}
                  </div>
                  <div className="attachment-actions">
                    {a.isRemoved ? (
                      <button disabled title="File removed - download unavailable">🔒 Download</button>
                    ) : (
                      <>
                        <button onClick={() => void download(a)}>Download</button>
                        <button className="remove" onClick={() => setRemoving(a)}>Soft Remove</button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Public Comments Thread for Requester */}
      <section className="ticket-comments-section">
        <div className="ticket-comments__head">
          <h2>Discussion & Updates ({comments.length})</h2>
          {!showCommentBox && !removing && (
            <button
              type="button"
              className="btn-indicate-resolved"
              onClick={() => setShowCommentBox(true)}
            >
              + Add Comment
            </button>
          )}
        </div>

        {comments.length === 0 ? (
          <p className="empty-files">No comments yet on this ticket.</p>
        ) : (
          <div className="comments-list">
            {comments.map(c => (
              <article key={c.id} className="comment-item">
                <div className="comment-item__header">
                  <div>
                    <span className="comment-author">{c.author.name}</span>
                    <span className={`comment-role ${c.author.role === "REQUESTER" ? "comment-role-requester" : c.author.role === "IT_STAFF" ? "comment-role-staff" : "comment-role-admin"}`}>
                      {c.author.role === "REQUESTER" ? "Requester" : c.author.role === "IT_STAFF" ? "IT Staff" : "Admin"}
                    </span>
                  </div>
                  <span className="comment-time">{date(c.createdAt)}</span>
                </div>
                <div className="comment-item__body">{c.content}</div>
              </article>
            ))}
          </div>
        )}

        {showCommentBox && !removing && (
          <div className="comment-composer">
            <textarea
              aria-label="Add a public comment"
              placeholder="Write a message or update for IT staff..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              disabled={commentBusy}
            />
            <div className="comment-composer-actions">
              <button
                type="button"
                className="btn-indicate-resolved"
                onClick={() => { setShowCommentBox(false); setCommentText(""); }}
                disabled={commentBusy}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-indicate-resolved indicated"
                onClick={handlePostComment}
                disabled={commentBusy || !commentText.trim()}
              >
                {commentBusy ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        )}
      </section>

      {removing && (
        <div className="modal-backdrop" role="presentation">
          <div className="remove-modal" role="dialog" aria-modal="true" aria-labelledby="remove-title">
            <h2 id="remove-title">Remove attachment?</h2>
            <p>The file will remain in the audit history but can no longer be downloaded.</p>
            <label>
              Removal reason <span>*</span>
              <textarea
                autoFocus
                value={reason}
                maxLength={250}
                onChange={e => setReason(e.target.value)}
              />
            </label>
            <small>{reason.trim().length}/250 characters (minimum 3)</small>
            <div>
              <button onClick={() => { setRemoving(null); setReason(""); }}>Cancel</button>
              <button
                className="confirm-remove"
                disabled={busy || reason.trim().length < 3}
                onClick={confirmRemove}
              >
                Confirm removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

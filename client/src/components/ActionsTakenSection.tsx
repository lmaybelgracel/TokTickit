import React, { useState, useEffect } from "react";
import {
  ActionTaken,
  CreateActionTakenPayload,
  UpdateActionTakenPayload,
  fetchTicketActions,
  createTicketAction,
  updateTicketAction,
} from "../api";
import { AuthContext } from "../context/AuthContext";
import "./ActionsTakenSection.css";

export interface ActionsTakenSectionProps {
  ticketId: number;
  ticketCreatedAt?: string;
  isStaffOrAdmin?: boolean;
  onActionRecorded?: () => void;
}

export const ActionsTakenSection: React.FC<ActionsTakenSectionProps> = ({
  ticketId,
  ticketCreatedAt,
  isStaffOrAdmin: isStaffOrAdminProp,
  onActionRecorded,
}) => {
  const auth = React.useContext(AuthContext);
  const user = auth?.user ?? null;
  const token = auth?.token ?? (typeof localStorage !== "undefined" ? localStorage.getItem("toktickit_auth_token") : null);
  const isStaffOrAdmin =
    isStaffOrAdminProp ?? (user?.role === "IT_STAFF" || user?.role === "ADMINISTRATOR");

  const [actions, setActions] = useState<ActionTaken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAction, setEditingAction] = useState<ActionTaken | null>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [actionDateTime, setActionDateTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [followUpRequired, setFollowUpRequired] = useState<boolean>(false);
  const [followUpNote, setFollowUpNote] = useState<string>("");
  const [attachmentNotes, setAttachmentNotes] = useState<string>("");

  const loadActions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTicketActions(ticketId, token, user?.id);
      // Sort chronologically by actionDateTime ascending
      const sorted = [...data].sort(
        (a, b) => new Date(a.actionDateTime).getTime() - new Date(b.actionDateTime).getTime()
      );
      setActions(sorted);
    } catch (err: any) {
      setError(err.message || "Failed to load actions taken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      void loadActions();
    }
  }, [ticketId, token, user?.id]);

  const openCreateModal = () => {
    const now = new Date();
    // format as YYYY-MM-DDTHH:mm
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setEditingAction(null);
    setActionDateTime(localIso);
    setDescription("");
    setResult("");
    setFollowUpRequired(false);
    setFollowUpNote("");
    setAttachmentNotes("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (action: ActionTaken) => {
    const actionDate = new Date(action.actionDateTime);
    const localIso = new Date(actionDate.getTime() - actionDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setEditingAction(action);
    setActionDateTime(localIso);
    setDescription(action.description);
    setResult(action.result);
    setFollowUpRequired(action.followUpRequired);
    setFollowUpNote(action.followUpNote || "");
    setAttachmentNotes(action.attachmentNotes || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAction(null);
    setModalError(null);
  };

  // Validation rules
  const isDescValid = description.trim().length >= 3 && description.trim().length <= 2000;
  const isResultValid = result.trim().length >= 2 && result.trim().length <= 1000;
  const isFollowUpValid = !followUpRequired || (followUpNote.trim().length >= 3 && followUpNote.trim().length <= 1000);
  const isFormValid = isDescValid && isResultValid && isFollowUpValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || formSubmitting) return;

    setFormSubmitting(true);
    setModalError(null);

    try {
      const parsedDate = actionDateTime ? new Date(actionDateTime).toISOString() : undefined;

      if (editingAction) {
        const payload: UpdateActionTakenPayload = {
          knownUpdatedAt: editingAction.updatedAt,
          description: description.trim(),
          result: result.trim(),
          actionDateTime: parsedDate,
          followUpRequired,
          followUpNote: followUpRequired ? followUpNote.trim() : null,
          attachmentNotes: attachmentNotes.trim() ? attachmentNotes.trim() : null,
        };

        await updateTicketAction(editingAction.id, payload, token);
      } else {
        const payload: CreateActionTakenPayload = {
          description: description.trim(),
          result: result.trim(),
          actionDateTime: parsedDate,
          followUpRequired,
          followUpNote: followUpRequired ? followUpNote.trim() : null,
          attachmentNotes: attachmentNotes.trim() ? attachmentNotes.trim() : null,
        };

        await createTicketAction(ticketId, payload, token);
      }

      closeModal();
      await loadActions();
      if (onActionRecorded) {
        onActionRecorded();
      }
    } catch (err: any) {
      if (err.status === 409 || (err.message && err.message.toLowerCase().includes("conflict"))) {
        setModalError(
          "Conflict: The record has been modified by another user. Please refresh and try again."
        );
      } else {
        setModalError(err.message || "Failed to save action taken");
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="actions-taken-container" data-testid="actions-taken-section">
      <div className="actions-taken-header">
        <h3 className="actions-taken-title">
          Actions Taken (ประวัติการปฏิบัติงาน)
          <span className="actions-taken-count-badge" data-testid="actions-count-badge">
            [ {actions.length} ]
          </span>
        </h3>
        {isStaffOrAdmin && (
          <button
            type="button"
            className="btn-record-action"
            data-testid="btn-record-action"
            onClick={openCreateModal}
          >
            + Record Action Taken
          </button>
        )}
      </div>

      {error && (
        <div className="action-modal-alert error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="actions-empty-state">Loading actions taken...</div>
      ) : actions.length === 0 ? (
        <div className="actions-empty-state" data-testid="actions-empty-state">
          No actions taken recorded yet.
        </div>
      ) : (
        <div className="actions-table-wrapper">
          <table className="actions-table" data-testid="actions-table">
            <thead>
              <tr>
                <th style={{ width: "160px" }}>Date & Time</th>
                <th style={{ width: "180px" }}>Performed By</th>
                <th>Description & Result</th>
                {isStaffOrAdmin && <th style={{ width: "80px", textAlign: "center" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {actions.map((act) => (
                <tr key={act.id} data-testid={`action-row-${act.id}`}>
                  <td className="action-date-cell">
                    {formatDateTime(act.actionDateTime)}
                  </td>
                  <td>
                    <span className="action-performer-badge">
                      {act.performedBy?.name || `Staff #${act.performedById}`}
                    </span>
                  </td>
                  <td>
                    <div className="action-description-text">{act.description}</div>
                    <div className="action-result-box">
                      <span className="action-result-label">Result:</span>
                      {act.result}
                    </div>
                    {act.followUpRequired && (
                      <div className="action-followup-banner" data-testid="followup-banner">
                        <span className="action-followup-label">
                          Follow-up Required (ต้องติดตามงานต่อ)
                        </span>
                        <span>{act.followUpNote}</span>
                      </div>
                    )}
                    {act.attachmentNotes && (
                      <div className="action-attachment-notes">
                        📎 Notes on files: {act.attachmentNotes}
                      </div>
                    )}
                  </td>
                  {isStaffOrAdmin && (
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className="btn-edit-action"
                        data-testid={`btn-edit-action-${act.id}`}
                        onClick={() => openEditModal(act)}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record / Edit Modal */}
      {isModalOpen && (
        <div className="action-modal-overlay" role="dialog" aria-modal="true">
          <div className="action-modal-container">
            <div className="action-modal-header">
              <h3>{editingAction ? "Edit Action Taken" : "Record Action Taken"}</h3>
              <button
                type="button"
                className="action-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="action-modal-body">
                {modalError && (
                  <div className="action-modal-alert error" role="alert">
                    {modalError}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="action-datetime">
                    Action Date & Time <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="action-datetime"
                    type="datetime-local"
                    value={actionDateTime}
                    onChange={(e) => setActionDateTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="action-description">
                    Action Description <span className="required-asterisk">*</span>
                  </label>
                  <textarea
                    id="action-description"
                    placeholder="Describe the technical steps or troubleshooting performed..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                  <div className="char-counter">{description.length} / 2000</div>
                  {description.length > 0 && description.trim().length < 3 && (
                    <span className="input-error-msg">Description must be at least 3 characters.</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="action-result">
                    Result <span className="required-asterisk">*</span>
                  </label>
                  <textarea
                    id="action-result"
                    placeholder="Describe the technical outcome or state after action..."
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    rows={2}
                    required
                  />
                  <div className="char-counter">{result.length} / 1000</div>
                  {result.length > 0 && result.trim().length < 2 && (
                    <span className="input-error-msg">Result must be at least 2 characters.</span>
                  )}
                </div>

                <div className="form-group checkbox-row">
                  <input
                    id="action-followup-toggle"
                    type="checkbox"
                    checked={followUpRequired}
                    onChange={(e) => setFollowUpRequired(e.target.checked)}
                  />
                  <label htmlFor="action-followup-toggle">
                    Follow-up Required (ต้องติดตามงานต่อ)
                  </label>
                </div>

                {followUpRequired && (
                  <div className="form-group" data-testid="followup-note-group">
                    <label htmlFor="action-followup-note">
                      Follow-up Note <span className="required-asterisk">*</span>
                    </label>
                    <textarea
                      id="action-followup-note"
                      placeholder="Specify follow-up steps, pending parts, or instructions..."
                      value={followUpNote}
                      onChange={(e) => setFollowUpNote(e.target.value)}
                      rows={2}
                    />
                    <div className="char-counter">{followUpNote.length} / 1000</div>
                    {followUpNote.trim().length < 3 && (
                      <span className="input-error-msg" data-testid="followup-error-msg">
                        Follow-up note is required when follow-up is requested (at least 3 characters).
                      </span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="action-attachment-notes">Attachment Notes (Optional)</label>
                  <input
                    id="action-attachment-notes"
                    type="text"
                    placeholder="Reference specific files, logs, or error codes..."
                    value={attachmentNotes}
                    onChange={(e) => setAttachmentNotes(e.target.value)}
                    maxLength={500}
                  />
                </div>
              </div>

              <div className="action-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  data-testid="btn-save-action"
                  disabled={!isFormValid || formSubmitting}
                >
                  {formSubmitting
                    ? "Saving..."
                    : editingAction
                    ? "Update Action"
                    : "Save Action"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

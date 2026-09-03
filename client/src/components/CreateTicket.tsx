import React, { useState, useEffect } from "react";
import {
  Category,
  RelatedSystem,
  RequesterUser,
  Ticket,
  fetchCategories,
  fetchRelatedSystems,
  createTicket,
} from "../api";

interface CreateTicketProps {
  activeRequester: RequesterUser;
  onSuccess: (ticket: Ticket) => void;
  onCancel: () => void;
}

export const CreateTicket: React.FC<CreateTicketProps> = ({
  activeRequester,
  onSuccess,
  onCancel,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedSystems, setRelatedSystems] = useState<RelatedSystem[]>([]);

  const [categoryId, setCategoryId] = useState<string>("");
  const [relatedSystemId, setRelatedSystemId] = useState<string>("");
  const [requestedPriority, setRequestedPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [summary, setSummary] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadOptions() {
      try {
        const [cats, systems] = await Promise.all([
          fetchCategories(),
          fetchRelatedSystems(),
        ]);
        if (isMounted) {
          setCategories(cats);
          setRelatedSystems(systems);
          if (cats.length > 0) setCategoryId(cats[0].id.toString());
          if (systems.length > 0) setRelatedSystemId(systems[0].id.toString());
        }
      } catch (err: any) {
        if (isMounted) {
          setGeneralError("Failed to load form reference data. Please refresh.");
        }
      } finally {
        if (isMounted) setIsLoadingOptions(false);
      }
    }
    loadOptions();
    return () => {
      isMounted = false;
    };
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const trimmedSummary = summary.trim();
    const trimmedDescription = description.trim();

    if (!categoryId) errors.categoryId = "Please select a category.";
    if (!relatedSystemId) errors.relatedSystemId = "Please select a related system.";

    if (trimmedSummary.length < 5 || trimmedSummary.length > 150) {
      errors.summary = "Summary must be between 5 and 150 characters.";
    }

    if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
      errors.description = "Description must be between 10 and 2000 characters.";
    }

    if (attachments.length > 5) {
      errors.attachments = "You can attach up to 5 files.";
    } else if (attachments.some((file) => file.size > 5 * 1024 * 1024)) {
      errors.attachments = "Each attachment must not exceed 5 MB.";
    } else if (attachments.some((file) => !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type))) {
      errors.attachments = "Only JPG, PNG, WEBP, and PDF files are allowed.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const createdTicket = await createTicket(activeRequester.id, {
        categoryId: parseInt(categoryId, 10),
        relatedSystemId: parseInt(relatedSystemId, 10),
        requestedPriority,
        summary: summary.trim(),
        description: description.trim(),
        attachments,
      });
      onSuccess(createdTicket);
    } catch (err: any) {
      if (err.details && Array.isArray(err.details)) {
        const newFieldErrors: Record<string, string> = {};
        err.details.forEach((item: { field: string; message: string }) => {
          newFieldErrors[item.field] = item.message;
        });
        setFieldErrors(newFieldErrors);
      }
      setGeneralError(err.message || "Failed to create ticket. Entered form data is preserved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (isLoadingOptions) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ color: "#5A6E63", textAlign: "center" }}>Loading form parameters...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerTitleRow}>
          <h1 style={styles.heading}>Create Support Ticket</h1>
          <span style={styles.subHeading}>Submit an official IT service request</span>
        </div>

        {generalError && (
          <div style={styles.errorAlert} role="alert">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Read-Only System Generated Header Info */}
          <div style={styles.readonlySection}>
            <div style={styles.readonlyField}>
              <label style={styles.readonlyLabel}>Ticket Number</label>
              <span style={styles.readonlyValue}>Auto-generated (TKT-2026-XXXXXX)</span>
            </div>
            <div style={styles.readonlyField}>
              <label style={styles.readonlyLabel}>Request Date</label>
              <span style={styles.readonlyValue}>{formattedDate}</span>
            </div>
            <div style={styles.readonlyField}>
              <label style={styles.readonlyLabel}>Requester Identity</label>
              <span style={styles.readonlyValue}>
                {activeRequester.name} ({activeRequester.department})
              </span>
            </div>
          </div>

          {/* Classification Section */}
          <div style={styles.gridRow}>
            <div style={styles.formGroup}>
              <label htmlFor="category-select" style={styles.label}>
                Category <span style={styles.required}>*</span>
              </label>
              <select
                id="category-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  ...styles.select,
                  ...(fieldErrors.categoryId ? styles.inputError : {}),
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId && (
                <span style={styles.fieldErrorText}>{fieldErrors.categoryId}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="system-select" style={styles.label}>
                Related System <span style={styles.required}>*</span>
              </label>
              <select
                id="system-select"
                value={relatedSystemId}
                onChange={(e) => setRelatedSystemId(e.target.value)}
                style={{
                  ...styles.select,
                  ...(fieldErrors.relatedSystemId ? styles.inputError : {}),
                }}
              >
                {relatedSystems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {fieldErrors.relatedSystemId && (
                <span style={styles.fieldErrorText}>{fieldErrors.relatedSystemId}</span>
              )}
            </div>
          </div>

          {/* Requested Priority Segmented Control */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Requested Priority <span style={styles.required}>*</span>
            </label>
            <div style={styles.prioritySelector}>
              {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => {
                const isSelected = requestedPriority === p;
                let activeStyle = {};
                if (isSelected) {
                  if (p === "HIGH") activeStyle = styles.priorityHigh;
                  if (p === "MEDIUM") activeStyle = styles.priorityMedium;
                  if (p === "LOW") activeStyle = styles.priorityLow;
                }
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setRequestedPriority(p)}
                    style={{
                      ...styles.priorityPill,
                      ...(isSelected ? activeStyle : {}),
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Input */}
          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label htmlFor="ticket-summary" style={styles.label}>
                Summary <span style={styles.required}>*</span>
              </label>
              <span style={styles.charCount}>
                {summary.trim().length}/150 chars
              </span>
            </div>
            <input
              id="ticket-summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of the issue (5–150 characters)"
              style={{
                ...styles.input,
                ...(fieldErrors.summary ? styles.inputError : {}),
              }}
            />
            {fieldErrors.summary && (
              <span style={styles.fieldErrorText}>{fieldErrors.summary}</span>
            )}
          </div>

          {/* Description Textarea */}
          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label htmlFor="ticket-description" style={styles.label}>
                Description <span style={styles.required}>*</span>
              </label>
              <span style={styles.charCount}>
                {description.trim().length}/2000 chars
              </span>
            </div>
            <textarea
              id="ticket-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide full details, steps to reproduce, or symptoms (10–2000 characters)"
              rows={5}
              style={{
                ...styles.textarea,
                ...(fieldErrors.description ? styles.inputError : {}),
              }}
            />
            {fieldErrors.description && (
              <span style={styles.fieldErrorText}>{fieldErrors.description}</span>
            )}
          </div>

          {/* Actions */}
          <div style={styles.formGroup}>
            <label htmlFor="ticket-attachments" style={styles.label}>Attachments (optional, up to 5)</label>
            <input
              id="ticket-attachments"
              aria-label="Initial attachments"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(event) => {
                setAttachments(Array.from(event.target.files ?? []));
                setFieldErrors((current) => {
                  const { attachments: _attachmentError, ...rest } = current;
                  return rest;
                });
              }}
              disabled={isSubmitting}
              style={{ ...styles.input, ...(fieldErrors.attachments ? styles.inputError : {}) }}
            />
            <span style={styles.attachmentHelp}>JPG, PNG, WEBP, or PDF; maximum 5 MB per file.</span>
            {attachments.length > 0 && (
              <ul style={styles.attachmentList} aria-label="Selected attachments">
                {attachments.map((file, index) => (
                  <li key={`${file.name}-${file.lastModified}-${index}`}>
                    <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    <button type="button" onClick={() => setAttachments((files) => files.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            {fieldErrors.attachments && <span style={styles.fieldErrorText}>{fieldErrors.attachments}</span>}
          </div>

          {/* Actions */}
          <div style={styles.actionRow}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={styles.submitBtn}
            >
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "896px",
    margin: "0 auto",
    padding: "1.5rem 1rem",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E0E6E2",
    boxShadow: "0 4px 16px rgba(0, 107, 60, 0.05)",
    padding: "2rem",
  },
  headerTitleRow: {
    marginBottom: "1.5rem",
    borderBottom: "1px solid #EAF6EF",
    paddingBottom: "1rem",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#006B3C",
    margin: 0,
  },
  subHeading: {
    fontSize: "0.875rem",
    color: "#5A6E63",
    marginTop: "0.25rem",
    display: "block",
  },
  errorAlert: {
    backgroundColor: "#FDF2F2",
    border: "1px solid #F5C6CB",
    color: "#B71C1C",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
  },
  readonlySection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    backgroundColor: "#F0F4F2",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
    border: "1px solid #E0E6E2",
  },
  readonlyField: {
    display: "flex",
    flexDirection: "column",
  },
  readonlyLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#5A6E63",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.25rem",
  },
  readonlyValue: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#1A2E23",
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1.25rem",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.375rem",
  },
  label: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#1A2E23",
    marginBottom: "0.375rem",
  },
  required: {
    color: "#B71C1C",
  },
  charCount: {
    fontSize: "0.75rem",
    color: "#5A6E63",
  },
  select: {
    padding: "0.625rem 0.875rem",
    borderRadius: "6px",
    border: "1px solid #C2D1C8",
    fontSize: "0.875rem",
    color: "#1A2E23",
    backgroundColor: "#FFFFFF",
    outline: "none",
  },
  input: {
    padding: "0.625rem 0.875rem",
    borderRadius: "6px",
    border: "1px solid #C2D1C8",
    fontSize: "0.875rem",
    color: "#1A2E23",
    backgroundColor: "#FFFFFF",
    outline: "none",
  },
  textarea: {
    padding: "0.625rem 0.875rem",
    borderRadius: "6px",
    border: "1px solid #C2D1C8",
    fontSize: "0.875rem",
    color: "#1A2E23",
    backgroundColor: "#FFFFFF",
    outline: "none",
    resize: "vertical",
    minHeight: "120px",
  },
  inputError: {
    borderColor: "#B71C1C",
    backgroundColor: "#FDF2F2",
  },
  attachmentHelp: {
    fontSize: "0.75rem",
    color: "#5A6E63",
    marginTop: "0.25rem",
  },
  attachmentList: {
    listStyle: "none",
    padding: 0,
    margin: "0.5rem 0 0",
    display: "grid",
    gap: "0.375rem",
  },
  fieldErrorText: {
    fontSize: "0.75rem",
    color: "#B71C1C",
    marginTop: "0.25rem",
  },
  prioritySelector: {
    display: "flex",
    gap: "0.5rem",
  },
  priorityPill: {
    flex: 1,
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "1px solid #C2D1C8",
    backgroundColor: "#FFFFFF",
    color: "#5A6E63",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s ease",
  },
  priorityLow: {
    backgroundColor: "#E8F5E9",
    borderColor: "#C8E6C9",
    color: "#2E7D32",
  },
  priorityMedium: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FFE0B2",
    color: "#E65100",
  },
  priorityHigh: {
    backgroundColor: "#FDF2F2",
    borderColor: "#F5C6CB",
    color: "#B71C1C",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1.5rem",
    paddingTop: "1rem",
    borderTop: "1px solid #EAF6EF",
  },
  cancelBtn: {
    padding: "0.625rem 1.25rem",
    borderRadius: "6px",
    border: "1px solid #006B3C",
    backgroundColor: "#FFFFFF",
    color: "#006B3C",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "0.625rem 1.5rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#006B3C",
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
};

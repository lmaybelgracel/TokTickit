import React, { useState, useEffect } from "react";
import { fetchRequesters, RequesterUser } from "../api";

interface RequesterSelectorProps {
  onSelectRequester: (requester: RequesterUser) => void;
  currentRequesterId?: number;
}

export const RequesterSelector: React.FC<RequesterSelectorProps> = ({
  onSelectRequester,
  currentRequesterId,
}) => {
  const [requesters, setRequesters] = useState<RequesterUser[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">(currentRequesterId || "");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchRequesters()
      .then((data) => {
        if (!isMounted) return;
        setRequesters(data);
        if (data.length > 0 && !currentRequesterId) {
          setSelectedId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load Development Requesters");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentRequesterId]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    const chosen = requesters.find((r) => r.id === Number(selectedId));
    if (chosen) {
      onSelectRequester(chosen);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006B3C" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </svg>
        </div>

        <h1 style={styles.title}>Select Development Requester</h1>
        <p style={styles.subtitle}>
          Choose a development requester to simulate the current requester context for Lab 2.
          This is for testing only and is not a login screen.
        </p>

        <div style={styles.noticeBanner}>
          <span style={styles.infoIcon}>i</span>
          Only active development requesters loaded from PostgreSQL are shown.
        </div>

        <div style={styles.authWarningBox}>
          <strong>Authentication coming in Lab 3</strong>
          <p style={styles.warningText}>
            In Lab 3, this selection will be replaced with secure authentication so you can access the system with your own account.
          </p>
        </div>

        {loading ? (
          <div style={styles.loadingState} data-testid="loading-state">
            <p>Loading Development Requesters...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState} data-testid="error-state">
            <p style={styles.errorText}>{error}</p>
            <button style={styles.retryButton} onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : requesters.length === 0 ? (
          <div style={styles.emptyState} data-testid="empty-state">
            <p>No active Development Requesters found in database.</p>
          </div>
        ) : (
          <form onSubmit={handleContinue} style={styles.form}>
            <label htmlFor="requester-select" style={styles.label}>
              Development Requester <span style={styles.asterisk}>*</span>
            </label>

            <select
              id="requester-select"
              style={styles.select}
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {requesters.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.name} ({req.email}) — {req.department}
                </option>
              ))}
            </select>

            <div style={styles.actions}>
              <button type="submit" style={styles.continueButton} disabled={!selectedId}>
                Continue
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#F5F7F6",
    padding: "1rem",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E0E6E2",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "520px",
    padding: "2rem",
    textAlign: "center",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#EAF6EF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem auto",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1A2E23",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#5A6E63",
    lineHeight: 1.5,
    marginBottom: "1.25rem",
  },
  noticeBanner: {
    backgroundColor: "#EAF6EF",
    border: "1px solid #B2DFDB",
    borderRadius: "6px",
    color: "#006B3C",
    padding: "0.75rem",
    fontSize: "0.8125rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textAlign: "left",
  },
  infoIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "1.5px solid #006B3C",
    fontWeight: "bold",
    fontSize: "0.75rem",
  },
  authWarningBox: {
    backgroundColor: "#F9FBF9",
    border: "1px solid #E0E6E2",
    borderRadius: "6px",
    padding: "0.875rem",
    textAlign: "left",
    marginBottom: "1.5rem",
    fontSize: "0.8125rem",
    color: "#1A2E23",
  },
  warningText: {
    color: "#5A6E63",
    marginTop: "0.25rem",
    marginBottom: 0,
  },
  form: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "#1A2E23",
    marginBottom: "0.5rem",
  },
  asterisk: {
    color: "#B71C1C",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #C2D1C8",
    fontSize: "0.875rem",
    color: "#1A2E23",
    backgroundColor: "#FFFFFF",
    outline: "none",
    marginBottom: "1.5rem",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  continueButton: {
    backgroundColor: "#006B3C",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    padding: "0.75rem 1.5rem",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  loadingState: {
    padding: "2rem 0",
    color: "#5A6E63",
  },
  emptyState: {
    padding: "2rem 0",
    color: "#5A6E63",
  },
  errorState: {
    padding: "1rem",
    backgroundColor: "#FDF2F2",
    borderRadius: "6px",
    border: "1px solid #B71C1C",
  },
  errorText: {
    color: "#B71C1C",
    marginBottom: "0.5rem",
  },
  retryButton: {
    backgroundColor: "#006B3C",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "4px",
    padding: "0.4rem 0.8rem",
    fontSize: "0.8125rem",
    cursor: "pointer",
  },
};

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const ChangePassword: React.FC = () => {
  const { updatePassword, isLoading, error, clearError, logout, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Complexity rules check
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isSameAsCurrent = currentPassword.length > 0 && newPassword.length > 0 && newPassword === currentPassword;

  const isFormValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    passwordsMatch &&
    !isSameAsCurrent &&
    currentPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!currentPassword) {
      setLocalError("Please enter your current temporary password.");
      return;
    }

    if (currentPassword === newPassword) {
      setLocalError("New password cannot be the same as current password.");
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
      setLocalError("New password does not meet all complexity requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError("New password and confirmation password do not match.");
      return;
    }

    try {
      await updatePassword({ currentPassword, newPassword });
    } catch {
      // Error handled by AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.amberBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 style={styles.title}>Password Change Required</h1>
          <p style={styles.subtitle}>
            Welcome, <strong>{user?.name || "User"}</strong>. Because you signed in with an initial temporary password, you must set a new secure password before continuing.
          </p>
        </div>

        {/* Amber Callout Notice */}
        <div style={styles.amberCallout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" style={{ marginRight: "10px", flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div style={styles.amberCalloutText}>
            For security reasons, access to ticket queues and management screens is locked until your new password is saved.
          </div>
        </div>

        {displayError && (
          <div role="alert" style={styles.errorAlert}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B71C1C" strokeWidth="2" style={{ marginRight: "10px", flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={styles.errorText}>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="current-password" style={styles.label}>
              Current (Temporary) Password
            </label>
            <input
              id="current-password"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="new-password" style={styles.label}>
              New Password
            </label>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create a new secure password"
              required
              disabled={isLoading}
              style={{
                ...styles.input,
                borderColor: isSameAsCurrent ? "#B71C1C" : "#E0E6E2",
              }}
            />
            {isSameAsCurrent && (
              <span style={{ color: "#B71C1C", fontSize: "11px" }}>
                New password must be different from current password
              </span>
            )}
          </div>

          {/* Real-time Password Complexity Checklist */}
          <div style={styles.checklist}>
            <span style={styles.checklistTitle}>Password Requirements:</span>
            <div style={styles.checklistItem}>
              <span style={{ color: hasMinLength ? "#006B3C" : "#A0AEC0", fontWeight: "bold" }}>
                {hasMinLength ? "[✓]" : "[ ]"}
              </span>
              <span style={{ color: hasMinLength ? "#1A2E23" : "#5A6E63", fontSize: "12px" }}>
                At least 8 characters
              </span>
            </div>
            <div style={styles.checklistItem}>
              <span style={{ color: hasUppercase ? "#006B3C" : "#A0AEC0", fontWeight: "bold" }}>
                {hasUppercase ? "[✓]" : "[ ]"}
              </span>
              <span style={{ color: hasUppercase ? "#1A2E23" : "#5A6E63", fontSize: "12px" }}>
                At least one uppercase letter (A-Z)
              </span>
            </div>
            <div style={styles.checklistItem}>
              <span style={{ color: hasLowercase ? "#006B3C" : "#A0AEC0", fontWeight: "bold" }}>
                {hasLowercase ? "[✓]" : "[ ]"}
              </span>
              <span style={{ color: hasLowercase ? "#1A2E23" : "#5A6E63", fontSize: "12px" }}>
                At least one lowercase letter (a-z)
              </span>
            </div>
            <div style={styles.checklistItem}>
              <span style={{ color: hasNumber ? "#006B3C" : "#A0AEC0", fontWeight: "bold" }}>
                {hasNumber ? "[✓]" : "[ ]"}
              </span>
              <span style={{ color: hasNumber ? "#1A2E23" : "#5A6E63", fontSize: "12px" }}>
                At least one numeric digit (0-9)
              </span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirm-password" style={styles.label}>
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
              style={{
                ...styles.input,
                borderColor: confirmPassword && !passwordsMatch ? "#B71C1C" : "#E0E6E2",
              }}
            />
            {confirmPassword && !passwordsMatch && (
              <span style={{ color: "#B71C1C", fontSize: "11px" }}>Passwords do not match</span>
            )}
          </div>

          <div style={styles.optionsRow}>
            <label style={styles.showPasswordLabel}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{ marginRight: "6px" }}
              />
              Show passwords
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            style={{
              ...styles.submitBtn,
              opacity: !isFormValid || isLoading ? 0.6 : 1,
              cursor: !isFormValid || isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Saving Password..." : "Save New Password & Continue"}
          </button>

          <button
            type="button"
            onClick={logout}
            disabled={isLoading}
            style={styles.cancelBtn}
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7F6",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    padding: "36px 32px",
    border: "1px solid #E0E6E2",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  amberBadge: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#FEF3C7",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1A2E23",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "13px",
    color: "#5A6E63",
    lineHeight: "1.5",
    margin: 0,
  },
  amberCallout: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    border: "1px solid #FDE68A",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "20px",
  },
  amberCalloutText: {
    color: "#92400E",
    fontSize: "12px",
    lineHeight: "1.4",
  },
  errorAlert: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    border: "1px solid #FFCDD2",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "20px",
  },
  errorText: {
    color: "#B71C1C",
    fontSize: "13px",
    lineHeight: "1.4",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1A2E23",
  },
  input: {
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #E0E6E2",
    outline: "none",
    color: "#1A2E23",
    backgroundColor: "#FFFFFF",
  },
  checklist: {
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  checklistTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: "2px",
  },
  checklistItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  optionsRow: {
    display: "flex",
    alignItems: "center",
  },
  showPasswordLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: "#5A6E63",
    cursor: "pointer",
  },
  submitBtn: {
    marginTop: "8px",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    backgroundColor: "#006B3C",
    border: "none",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  },
  cancelBtn: {
    padding: "8px",
    fontSize: "13px",
    color: "#5A6E63",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "center",
  },
};

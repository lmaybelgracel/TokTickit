import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Login: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (err: any) {
      // Error handled by AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 16 14" />
            </svg>
          </div>
          <h1 style={styles.title}>TokTickIT</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {displayError && (
          <div role="alert" style={styles.errorAlert}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B71C1C" strokeWidth="2" style={styles.errorIcon}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={styles.errorText}>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="login-email" style={styles.label}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. pae.karn@example.com"
              required
              autoFocus
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="login-password" style={styles.label}>
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleBtn}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitBtn,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.footerNote}>
          <span>IT Operations Platform — Zen Green Edition</span>
        </div>
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
    maxWidth: "440px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    padding: "36px 32px",
    border: "1px solid #E0E6E2",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  logoBadge: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#006B3C",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#006B3C",
    margin: "0 0 6px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#5A6E63",
    margin: 0,
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
  errorIcon: {
    marginRight: "10px",
    flexShrink: 0,
  },
  errorText: {
    color: "#B71C1C",
    fontSize: "13px",
    lineHeight: "1.4",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
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
    transition: "border-color 0.2s",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "10px 60px 10px 14px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #E0E6E2",
    outline: "none",
    color: "#1A2E23",
    backgroundColor: "#FFFFFF",
  },
  toggleBtn: {
    position: "absolute",
    right: "8px",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#006B3C",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  submitBtn: {
    marginTop: "8px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#FFFFFF",
    backgroundColor: "#006B3C",
    border: "none",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  },
  footerNote: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "11px",
    color: "#5A6E63",
  },
};

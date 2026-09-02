import React, { useState, useEffect } from "react";
import { RequesterUser, Ticket } from "./api";
import { RequesterSelector } from "./components/RequesterSelector";
import { CreateTicket } from "./components/CreateTicket";

export type CurrentView = "selector" | "my-tickets" | "create-ticket" | "ticket-detail";

export default function App() {
  const [activeRequester, setActiveRequester] = useState<RequesterUser | null>(() => {
    const saved = localStorage.getItem("toktickit_dev_requester");
    return saved ? JSON.parse(saved) : null;
  });

  const [createdSuccessTicket, setCreatedSuccessTicket] = useState<Ticket | null>(null);

  const [currentView, setCurrentView] = useState<CurrentView>(() => {
    return activeRequester ? "my-tickets" : "selector";
  });

  useEffect(() => {
    if (activeRequester) {
      localStorage.setItem("toktickit_dev_requester", JSON.stringify(activeRequester));
    } else {
      localStorage.removeItem("toktickit_dev_requester");
      setCurrentView("selector");
    }
  }, [activeRequester]);

  const handleSelectRequester = (requester: RequesterUser) => {
    setActiveRequester(requester);
    setCurrentView("my-tickets");
  };

  const handleChangeRequester = () => {
    setActiveRequester(null);
    setCurrentView("selector");
  };

  const handleTicketCreated = (ticket: Ticket) => {
    setCreatedSuccessTicket(ticket);
    setCurrentView("my-tickets");
  };

  return (
    <div style={styles.appWrapper}>
      {/* Zen Green Application Shell Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brandGroup}>
            <div style={styles.logoBadge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 16 14" />
              </svg>
            </div>
            <span style={styles.brandTitle}>TokTickIT</span>
          </div>

          {activeRequester && (
            <nav style={styles.navGroup}>
              <button
                style={{
                  ...styles.navItem,
                  ...(currentView === "my-tickets" ? styles.navItemActive : {}),
                }}
                onClick={() => setCurrentView("my-tickets")}
              >
                My Tickets
              </button>

              <button
                style={{
                  ...styles.navItem,
                  ...(currentView === "create-ticket" ? styles.navItemActive : {}),
                }}
                onClick={() => setCurrentView("create-ticket")}
              >
                + Create Ticket
              </button>
            </nav>
          )}

          <div style={styles.userProfileGroup}>
            {activeRequester ? (
              <div style={styles.profileBox}>
                <div style={styles.userAvatar}>
                  {activeRequester.name.charAt(0)}
                </div>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{activeRequester.name}</span>
                  <span style={styles.userRole}>Requester ({activeRequester.department})</span>
                </div>
                <button style={styles.changeUserBtn} onClick={handleChangeRequester} title="Change simulated user">
                  Change
                </button>
              </div>
            ) : (
              <span style={styles.testTag}>Testing Mode (Lab 2)</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {!activeRequester || currentView === "selector" ? (
          <RequesterSelector
            onSelectRequester={handleSelectRequester}
            currentRequesterId={activeRequester?.id}
          />
        ) : currentView === "create-ticket" ? (
          <CreateTicket
            activeRequester={activeRequester}
            onSuccess={handleTicketCreated}
            onCancel={() => setCurrentView("my-tickets")}
          />
        ) : currentView === "my-tickets" ? (
          <div style={styles.placeholderContainer}>
            <h2>My Tickets Screen</h2>
            {createdSuccessTicket && (
              <div style={{ backgroundColor: "#EAF6EF", border: "1px solid #B2DFDB", color: "#006B3C", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                Success! Created ticket <strong>{createdSuccessTicket.ticketNumber}</strong> ({createdSuccessTicket.summary})
              </div>
            )}
            <p>Active Requester: <strong>{activeRequester.name}</strong> ({activeRequester.email})</p>
            <p>Will be implemented in Issue 11 (My Tickets UI)</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appWrapper: {
    minHeight: "100vh",
    backgroundColor: "#F5F7F6",
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#1A2E23",
  },
  header: {
    backgroundColor: "#006B3C",
    color: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  headerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0.75rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoBadge: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  navGroup: {
    display: "flex",
    gap: "0.5rem",
  },
  navItem: {
    backgroundColor: "transparent",
    color: "rgba(255,255,255,0.85)",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  navItemActive: {
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#FFFFFF",
    fontWeight: 600,
  },
  userProfileGroup: {
    display: "flex",
    alignItems: "center",
  },
  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    backgroundColor: "rgba(0,0,0,0.15)",
    padding: "0.35rem 0.75rem",
    borderRadius: "20px",
  },
  userAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#EAF6EF",
    color: "#006B3C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.8125rem",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  userName: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#FFFFFF",
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.75)",
  },
  changeUserBtn: {
    backgroundColor: "#FFFFFF",
    color: "#006B3C",
    border: "none",
    borderRadius: "12px",
    padding: "0.25rem 0.6rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  testTag: {
    fontSize: "0.75rem",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "0.3rem 0.75rem",
    borderRadius: "12px",
  },
  mainContent: {
    padding: "2rem 1.5rem",
  },
  placeholderContainer: {
    maxWidth: "800px",
    margin: "3rem auto",
    padding: "2rem",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E0E6E2",
    textAlign: "center",
  },
};

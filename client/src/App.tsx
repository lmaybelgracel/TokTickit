import React, { useState } from "react";
import { RequesterUser, Ticket } from "./api";
import { CreateTicket } from "./components/CreateTicket";
import { MyTickets } from "./components/MyTickets";
import { TicketDetail } from "./components/TicketDetail";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from "./components/Login";
import { ChangePassword } from "./components/ChangePassword";
import { StaffTicketQueue } from "./components/StaffTicketQueue";
import { StaffTicketDetail } from "./components/StaffTicketDetail";

export type CurrentView = "my-tickets" | "create-ticket" | "ticket-detail" | "staff-queue";

function AppContent() {
  const { user, logout, isLoading } = useAuth();

  const isStaffOrAdmin = user?.role === "IT_STAFF" || user?.role === "ADMINISTRATOR";
  const [createdSuccessTicket, setCreatedSuccessTicket] = useState<Ticket | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<CurrentView>(
    isStaffOrAdmin ? "staff-queue" : "my-tickets"
  );

  // If loading auth state from localStorage token
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F5F7F6" }}>
        <span style={{ color: "#006B3C", fontSize: "16px", fontWeight: "600" }}>Loading TokTickIT...</span>
      </div>
    );
  }

  // If no authenticated user, render Login screen
  if (!user) {
    return <Login />;
  }

  // If user is authenticated and must change password, enforce change password screen
  if (user.mustChangePassword) {
    return <ChangePassword />;
  }

  // Active user representation for ticket components
  const activeRequester: RequesterUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    department: user.role === "REQUESTER" ? "Requester" : user.role === "IT_STAFF" ? "IT Staff" : "Administrator",
    isActive: true,
  };

  const handleTicketCreated = (ticket: Ticket) => {
    setCreatedSuccessTicket(ticket);
    setCurrentView("my-tickets");
  };

  const getRoleBadge = (role: string) => {
    if (role === "IT_STAFF" || role === "IT Staff") {
      return { label: "IT Staff", bg: "#E3F2FD", color: "#1565C0", border: "1px solid #BBDEFB" };
    }
    if (role === "ADMINISTRATOR" || role === "Administrator") {
      return { label: "Administrator", bg: "#F3E5F5", color: "#6A1B9A", border: "1px solid #E1BEE7" };
    }
    return { label: "Requester", bg: "#E8F5E9", color: "#2E7D32", border: "1px solid #C8E6C9" };
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="app-shell" style={styles.appWrapper}>
      {/* Zen Green Application Shell Header */}
      <header className="app-header" style={styles.header}>
        <div className="app-header__inner" style={styles.headerInner}>
          <div style={styles.brandGroup}>
            <div style={styles.logoBadge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 16 14" />
              </svg>
            </div>
            <span style={styles.brandTitle}>TokTickIT</span>
          </div>

          <nav className="app-nav" aria-label="Primary" style={styles.navGroup}>
            {isStaffOrAdmin && (
              <button
                style={{
                  ...styles.navItem,
                  ...(currentView === "staff-queue" ? styles.navItemActive : {}),
                }}
                onClick={() => setCurrentView("staff-queue")}
              >
                Staff Queue
              </button>
            )}

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

          <div style={styles.userProfileGroup}>
            <div className="requester-profile" style={styles.profileBox}>
              <div style={styles.userAvatar}>
                {user.name.charAt(0)}
              </div>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user.name}</span>
                <span
                  style={{
                    ...styles.roleBadge,
                    backgroundColor: roleBadge.bg,
                    color: roleBadge.color,
                    border: roleBadge.border,
                  }}
                >
                  {roleBadge.label}
                </span>
              </div>
              <button
                style={styles.signOutBtn}
                onClick={logout}
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main" style={styles.mainContent}>
        {currentView === "staff-queue" ? (
          <StaffTicketQueue
            onSelectTicket={(ticket) => {
              setSelectedTicketId(ticket.id);
              setCurrentView("ticket-detail");
            }}
          />
        ) : currentView === "create-ticket" ? (
          <CreateTicket
            activeRequester={activeRequester}
            onSuccess={handleTicketCreated}
            onCancel={() => setCurrentView(isStaffOrAdmin ? "staff-queue" : "my-tickets")}
          />
        ) : currentView === "my-tickets" ? (
          <div>
            {createdSuccessTicket && (
              <div style={{ maxWidth: "1200px", margin: "1rem auto 0 auto", padding: "0.75rem 1rem", backgroundColor: "#EAF6EF", border: "1px solid #B2DFDB", color: "#006B3C", borderRadius: "8px" }}>
                Success! Created ticket <strong>{createdSuccessTicket.ticketNumber}</strong> ({createdSuccessTicket.summary})
              </div>
            )}
            <MyTickets
              activeRequester={activeRequester}
              onNavigateCreate={() => setCurrentView("create-ticket")}
              onSelectTicket={(ticket) => { setSelectedTicketId(ticket.id); setCurrentView("ticket-detail"); }}
            />
          </div>
        ) : currentView === "ticket-detail" && selectedTicketId ? (
          isStaffOrAdmin ? (
            <StaffTicketDetail
              ticketId={selectedTicketId}
              onBack={() => setCurrentView("staff-queue")}
            />
          ) : (
            <TicketDetail
              activeRequester={activeRequester}
              ticketId={selectedTicketId}
              onBack={() => setCurrentView("my-tickets")}
            />
          )
        ) : null}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
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
    alignItems: "center",
    gap: "0.5rem",
  },
  navItem: {
    backgroundColor: "transparent",
    color: "#EAF6EF",
    border: "none",
    padding: "0.5rem 0.85rem",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
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
    gap: "0.6rem",
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: "0.35rem 0.65rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  userAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    color: "#006B3C",
    fontWeight: 700,
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "0.85rem",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  roleBadge: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 600,
    padding: "1px 6px",
    borderRadius: "10px",
    marginTop: "2px",
    alignSelf: "flex-start",
  },
  signOutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#FFFFFF",
    border: "none",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    marginLeft: "0.25rem",
  },
  mainContent: {
    padding: "2rem 1.5rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

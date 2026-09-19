# TokTickIT — Users, Roles, IT Staff Ticketing, and Admin Screens (Lab 3)

TokTickIT is a full-stack IT service desk application built with React, TypeScript, Vite, Express, Prisma ORM, and PostgreSQL. Lab 3 builds upon the foundation established in Lab 2, replacing the temporary development requester selector with production-grade JWT authentication, server-side role-based authorization, operational IT Staff shared queue and ticket management, dual public/confidential communication channels, and administrator user management.

---

## Lab 3 Product Features

### 1. Authentication & Security
- Secure user authentication via email and password with bcryptjs hashing (10 rounds).
- Stateless cryptographically signed JWT session tokens stored in `localStorage` (`toktickit_auth_token`) and passed via `Authorization: Bearer <token>`.
- Mandatory first-login password rotation (`mustChangePassword: true`) with a real-time 4-point password complexity checklist (min 8 chars, uppercase, lowercase, digit/symbol).
- Account activation safeguards preventing inactive users from logging in or maintaining active sessions.
- Role-based application shell and view router cleanly segregating navigation and permissions.

### 2. IT Staff Shared Ticket Queue & Operations
- Shared IT Staff Ticket Queue with search by ticket number/summary, multi-criteria filtering by category, system, status, and IT Priority.
- Responsive queue presentations: high-density table on desktop/tablet, stacked card layout on mobile and 320px screens.
- Ticket operations toolbar:
  - **Claim Ticket**: Self-assignment with automatic status transition from `NEW` to `OPEN`.
  - **Reassign Owner**: Assign ticket to any active IT Staff or Administrator.
  - **IT Priority**: Adjust operational priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) independent of the requester's requested priority.
  - **Status Transitions**: Strict enforcement of permitted lifecycle state transitions (`NEW`, `OPEN`, `IN_PROGRESS`, `WAITING_FOR_REQUESTER`, `RESOLVED`, `CLOSED`, `REOPENED`, `CANCELLED`).
  - **Formal Resolution**: Modal dialog requiring mandatory resolution summary (3–500 characters) to resolve a ticket.

### 3. Dual Communication: Public Comments & Confidential Notes
- **Public Comments Tab**: Bi-directional communication between Requester and IT Staff, rendered with Zen Green styling.
- **Internal Notes Tab**: Role-restricted operational logs visible exclusively to IT Staff and Administrator (`403 Forbidden` guard for Requesters). Highlighted with distinct Amber Callout styling, lock icon banner, and strict server-side authorization.

### 4. Administrator User Management
- Minimalist user management roster with search (name/email) and role filtering.
- Create User modal with initial password complexity validation and auto-enforced `mustChangePassword = true`.
- Edit User modal with built-in safety rules:
  - **Self-Deactivation Guard (BR-07)**: Administrators cannot deactivate their own account (`422 Unprocessable Entity`).
  - **Self-Demotion Guard (BR-08)**: Administrators cannot demote their own role (`422 Unprocessable Entity`).
  - **Sole Active Administrator Guard (BR-09)**: Prevention of deactivating or demoting the last active administrator (`422 Unprocessable Entity`).
  - Soft-deactivation pattern (`isActive: false`); hard deletion (`DELETE`) is strictly forbidden.
- Reset Password modal issuing one-time temporary passwords requiring rotation on next login.

### 5. Backward Compatibility & Requester Continuity
- All Lab 2 Requester workflows (ticket creation, search, filter, sort, attachment upload/download/removal) preserved 100% without regression.
- Authenticated Requester identity automatically bound to ticket creation and ownership checks.
- Requester "Problem Appears Resolved" indication action allowing requesters to notify IT Staff.

---

## Repository Structure

```text
TokTickIT/
├── client/                               # React 18, TypeScript, and Vite UI
│   ├── src/
│   │   ├── components/                   # Zen Green UI components (Login, Queue, Detail, Admin)
│   │   ├── context/                      # AuthContext and state management
│   │   ├── __tests__/lab-02/             # Lab 2 regression component tests
│   │   └── __tests__/lab-03/             # Lab 3 component traceability tests
│   └── tests/lab-01/                     # Lab 1 foundation tests
├── server/                               # Express and Prisma REST API
│   ├── prisma/
│   │   ├── schema.prisma                 # Database schema with User, Ticket, Notes, Comments
│   │   ├── migrations/                   # SQL migration history
│   │   └── seed.ts                       # Idempotent seed data
│   ├── src/
│   │   ├── routes/                       # Express route controllers (auth, staff, admin, tickets)
│   │   └── middleware/                   # Authentication and role guards
│   ├── tests/lab-01/                     # Lab 1 foundation tests
│   ├── tests/lab-02/                     # Lab 2 API integration tests
│   └── tests/lab-03/                     # Lab 3 security, staff, and admin API tests
├── e2e/lab-03/                           # Playwright end-to-end user journeys & visual audit
├── docs/lab-03/                          # Engineering contract and delivery evidence
│   ├── specification.md                  # System specification and business rules
│   ├── ui-spec.md                        # Zen Green UI design system & responsive rules
│   ├── api-spec.md                       # REST API endpoints, schemas, and error codes
│   ├── tests.md                          # Test plan, AC traceability, and execution logs
│   ├── reviewer.md                       # Verbatim peer review logs (Sections 1 & 2)
│   └── ai-use.md                         # AI pair-programming reflections and prompts
├── artifacts/lab-03/screenshots/         # Responsive visual evidence across 4 viewports
│   ├── authentication/
│   ├── staff-queue/
│   ├── staff-ticket-detail/
│   └── user-management/
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js**: 20.x or later (see `.nvmrc`)
- **npm**: 9.x or later
- **PostgreSQL**: 14.x or later
- **Playwright Chromium**: installed via `npm run install:e2e`

---

## Setup & Local Installation

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/lmaybelgracel/TokTickit.git
   cd TokTickit
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

2. **Configure environment variables:**
   ```powershell
   # Windows PowerShell
   Copy-Item server/.env.example server/.env
   Copy-Item client/.env.example client/.env
   ```
   ```bash
   # macOS / Linux
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Run database migrations and idempotent seed:**
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate deploy
   npm run prisma:seed
   ```

---

## Seed Accounts for Development & Testing

All seed user accounts use the default password `Password123!` (or initial password `Pass1234!` requiring mandatory first-login change):

| Role | Name | Email | Password Status |
|:-----|:-----|:------|:----------------|
| **Administrator** | John Admin | `admin@toktickit.com` | Active / Normal |
| **IT Staff** | Jane Staff | `staff@toktickit.com` | Active / Normal |
| **IT Staff** | David Technician | `david@toktickit.com` | Active / Normal |
| **IT Staff** | Sarah Support | `sarah@toktickit.com` | Active / Normal |
| **IT Staff** | Inactive Staff | `inactivestaff@toktickit.com` | Inactive |
| **Requester** | Alice Requester | `alice@example.com` | Active / Normal |
| **Requester** | Bob Engineering | `bob@example.com` | Active / Normal |
| **Requester** | Charlie Marketing | `charlie@example.com` | Active / Normal |
| **Requester** | Diana Operations | `diana@example.com` | Active / Normal |
| **Requester** | Inactive Requester | `inactivereq@example.com` | Inactive |
| **Requester (New)** | Temp User | `tempuser@example.com` | Initial (`mustChangePassword: true`) |

---

## Running the Application

Start the backend API server (runs at `http://localhost:3000`):
```bash
cd server
npm run dev
```

In a separate terminal, start the React frontend (runs at `http://localhost:5173`):
```bash
cd client
npm run dev
```

---

## Verification & Automated Test Suites

### 1. Server Vitest Test Suite (152 Tests Passing)
Runs complete unit, API integration, security authorization, and database verification suites:
```bash
cd server
npm test
```
*Results: 17/17 test files passed, 152/152 tests passing (100%).*

### 2. Client Vitest Test Suite (52 Tests Passing)
Runs React Testing Library component tests across all Lab 1, Lab 2, and Lab 3 screens:
```bash
cd client
npm test
```
*Results: 12/12 test files passed, 52/52 tests passing (100%).*

### 3. Playwright End-to-End Test Suite (4 Tests Passing)
Verifies full browser workflows and captures responsive visual evidence:
```bash
# Ensure Playwright browser binaries are installed
npx playwright install chromium

# Run all E2E test suites
npx playwright test e2e/lab-03/
```
- `authentication.spec.ts`: Login → `mustChangePassword` → complexity checklist → app shell.
- `staff-ticket-flow.spec.ts`: Create ticket → claim → update priority → notes/comments → resolve.
- `user-administration.spec.ts`: Roster view → create user → reset password → self-safety guards.
- `visual-evidence.spec.ts`: Audits zero horizontal scrolling across 1280px, 768px, 375px, and 320px viewports, generating 28 screenshot artifacts.

### 4. Production Build Verification
```bash
cd server && npx tsc --noEmit
cd ../client && npm run build
```
*Results: Zero TypeScript compile errors, clean production bundle generated.*

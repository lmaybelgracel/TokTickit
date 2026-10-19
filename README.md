# TokTickIT — Actions Taken, Role Dashboards, and Final Regression (Lab 4)

TokTickIT is an enterprise full-stack IT service-desk application built with React 18, TypeScript, Vite, Express, Prisma ORM, and PostgreSQL. Sprint 4 completes the core service-desk lifecycle, introducing parent-child Actions Taken by IT Staff, authoritative role-appropriate dashboards for Requesters, IT Staff, and Administrators, strict state workflow rules with formal resolution gates, optimistic concurrency conflict handling, and complete regression hardening across Labs 1 through 3 under the Zen Green design system.

---

## Lab 4 Product Features & Increments

### 1. Actions Taken Collaboration & Work History
- **Parent-Child Work Structure (BR-01)**: Tickets support multiple sequential Actions Taken entries providing transparent technical history.
- **Collaborative Action Attribution (BR-02)**: The primary Ticket Owner coordinates the ticket, while any permitted IT Staff member or Administrator can record actions.
- **Auto-Stamped Performer (BR-03)**: Performed By (`performedById`) is automatically stamped from the authenticated session context; client impersonation is strictly rejected.
- **Action Data Model**: Each record captures Action Date/Time (`actionDateTime`), Action Description (3–2000 chars), Result status, Follow-up Required flag, Follow-up Note (mandatory 3–1000 chars when follow-up is required), and Attachment Notes.
- **Chronological & Bound Validation (BR-05)**: Action timestamps are validated to fall strictly between ticket creation date (`ticket.createdAt`) and current server time (future dates rejected with `422 Unprocessable Entity`).
- **Role-Based Visibility (BR-04, AC-01, AC-03)**: IT Staff and Administrators have full create/edit capabilities; Requesters receive read-only visibility into actions for their owned tickets (all creation/editing controls suppressed).
- **Parent Timestamp Synchronization**: Recording or editing an action touches the parent ticket's `updatedAt`, alerting concurrent clients of updates.

### 2. Authoritative Role-Appropriate Dashboards
- **Requester Personal Dashboard (BR-16, AC-04)**:
  - Summarizes only the authenticated requester's tickets with strict ownership isolation (`requesterId = caller.id`).
  - Metric cards: **Total Open Tickets**, **Action Required** (tickets in `WAITING_FOR_REQUESTER` with amber attention styling), and **Resolved / Closed** completed tickets.
  - Recent Ticket Progress list with direct ticket detail navigation.
  - 1-click drill-down navigation linking cards directly into filtered `MyTickets` views matching exact metric counts (`AC-11`).
  - Calming Zen Green empty state illustration and CTA for users with zero tickets.
- **IT Staff & Administrator Operational Dashboard (BR-17, BR-18, AC-05)**:
  - Operational metric cards: **Unassigned Tickets**, **My Assigned Tickets**, **My Actions Recorded** (tracking tickets where caller performed actions via `actionBy=me`), **Urgent Tickets** (with pulsating amber indicator for active non-terminal urgent tickets), and **Waiting for Requester**.
  - Queue breakdown matrix: Interactive status and priority distribution pills computed directly in PostgreSQL via Prisma aggregate queries.
  - Recent Queue Activity table (up to 5 tickets) with ticket number, summary, priority badge, status badge, owner, formatted timestamp, and direct row-click navigation.
  - **Administrator User Account Statistics (BR-18)**: Conditionally displayed for administrators, summarizing `totalUsers`, `activeUsers`, `inactiveUsers`, and role breakdown.

### 3. Strict Ticket Lifecycle, Resolution Gate & Concurrency Conflict Handling
- **8-State Permitted Transition Matrix (BR-10)**: Enforces valid state transitions across `NEW`, `OPEN`, `IN_PROGRESS`, `WAITING_FOR_REQUESTER`, `RESOLVED`, `CLOSED`, `REOPENED`, and `CANCELLED`.
- **Formal Resolution Gate (BR-11, AC-06)**: Direct transition to `RESOLVED` via general status endpoint is strictly forbidden (`422 Unprocessable Entity`). Resolution requires formal invocation of `PATCH /api/staff/tickets/:id/resolve` with mandatory `resolutionSummary` (3–500 chars).
- **Optimistic Concurrency & Stale-Update Protection (BR-13, AC-08)**: Mandatory `knownUpdatedAt` timestamp required on all mutation payloads (missing timestamp returns `422`). Concurrent updates where client timestamp differs from database return `409 Conflict`, prompting the UI to display conflict banners and reload authoritative data.
- **Requester Advisory Resolution Indication (BR-12, AC-10)**: Requester indication that a problem appears resolved toggles `requesterResolvedIndication` without altering `currentStatus`, notifying staff via an advisory banner.
- **Inactive User Assignment Guard (BR-14, AC-09)**: Reject assignment or action attribution to deactivated users with `422 Unprocessable Entity`.

---

## Repository Structure

```text
TokTickIT/
├── client/                               # React 18, TypeScript, and Vite UI
│   ├── src/
│   │   ├── components/                   # Zen Green components (Dashboard, ActionsTaken, Queue, Detail)
│   │   ├── context/                      # AuthContext and session state
│   │   ├── __tests__/lab-02/             # Lab 2 regression component tests
│   │   ├── __tests__/lab-03/             # Lab 3 component traceability tests
│   │   └── __tests__/lab-04/             # Lab 4 Dashboard, ActionsTaken, & Workflow tests
│   └── tests/lab-01/                     # Lab 1 foundation tests
├── server/                               # Express and Prisma REST API
│   ├── prisma/
│   │   ├── schema.prisma                 # Database schema with User, Ticket, ActionTaken, Notes, Comments
│   │   ├── migrations/                   # SQL migration history (including Lab 4 ActionTaken model)
│   │   └── seed.ts                       # Idempotent seed data with 0, 1, and multiple Actions Taken
│   ├── src/
│   │   ├── routes/                       # Controllers (actions, dashboard, staff, admin, tickets, auth)
│   │   └── middleware/                   # Authentication, mustChangePassword, and role guards
│   ├── tests/lab-01/                     # Lab 1 foundation tests
│   ├── tests/lab-02/                     # Lab 2 API integration tests
│   ├── tests/lab-03/                     # Lab 3 security, staff, and admin API tests
│   └── tests/lab-04/                     # Lab 4 actions-taken, workflow, and dashboard API tests
├── e2e/
│   ├── lab-03/                           # Lab 3 authentication and staff journey E2E tests
│   └── lab-04/                           # Lab 4 Playwright E2E suites & visual audits
│       ├── actions-taken-flow.spec.ts    # Action recording & requester read-only guard
│       ├── ticket-resolution.spec.ts     # Resolution gate & 409 conflict handling
│       ├── dashboards.spec.ts            # Drill-down count parity & mobile layout audit
│       └── visual-evidence.spec.ts       # Multi-viewport screenshots & accessibility audit
├── docs/lab-04/                          # Lab 4 Engineering Contract & Deliverables
│   ├── specification.md                  # System specification, FR, BR, data model, and DoD
│   ├── ui-spec.md                        # Zen Green UI design system & responsive layout rules
│   ├── api-spec.md                       # REST API endpoints, schemas, and 409 Conflict handling
│   ├── tests.md                          # Master Test Catalog, AC traceability, and execution logs
│   ├── reviewer.md                       # Circle peer review logs with verbatim feedback
│   └── ai-use.md                         # AI pair-programming reflections and prompts
├── artifacts/lab-04/screenshots/         # Responsive visual evidence across 4 viewports
│   ├── staff-dashboard/                  # Desktop 1280px, Tablet 768px, Mobile 375px, Small Mobile 320px
│   ├── requester-dashboard/              # Desktop 1280px, Tablet 768px, Mobile 375px, Small Mobile 320px
│   ├── actions-taken/                    # Desktop 1280px and Mobile 375px
│   ├── resolution/                       # Desktop 1280px and Mobile 375px modal dialogs
│   └── dashboards/                       # Combined multi-device dashboard captures
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js**: 20.x or later (see `.nvmrc`)
- **npm**: 9.x or later
- **PostgreSQL**: 14.x or later
- **Playwright Chromium**: installed via `npx playwright install chromium`

---

## Setup & Local Installation

1. **Clone the repository and install root and workspace dependencies:**
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

| Role | Name | Email | Password Status | Notes |
|:-----|:-----|:------|:----------------|:------|
| **Administrator** | John Admin | `admin@toktickit.com` | Active / Normal | Full system administration and staff operations |
| **IT Staff** | Jane Staff | `staff@toktickit.com` | Active / Normal | Primary staff queue coordinator |
| **IT Staff** | David Technician | `david@toktickit.com` | Active / Normal | IT technician with recorded actions |
| **IT Staff** | Sarah Support | `sarah@toktickit.com` | Active / Normal | Helpdesk support staff |
| **IT Staff** | Somchai Staff | `somchai.it@toktickit.com` | Active / Normal | E2E test staff actor |
| **IT Staff** | Inactive Staff | `inactivestaff@toktickit.com` | Inactive | Used to test assignment rejection guards (BR-14) |
| **Requester** | Alice Requester | `alice@example.com` | Active / Normal | Has tickets with 0, 1, and multiple Actions Taken |
| **Requester** | Bob Engineering | `bob@example.com` | Active / Normal | Requester with resolved & closed tickets |
| **Requester** | Charlie Marketing | `charlie@example.com` | Active / Normal | Zero-ticket user for empty state testing |
| **Requester** | Diana Operations | `diana@example.com` | Active / Normal | Active requester with urgent open tickets |
| **Requester** | Inactive Requester | `inactivereq@example.com` | Inactive | Inactive requester login rejection test |
| **Requester (New)** | Temp User | `tempuser@example.com` | Initial (`mustChangePassword: true`) | Mandatory password rotation test |

---

## Running the Application Locally

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

### 1. Server Vitest Test Suite (209 Tests Passing)
Runs complete unit, API integration, security authorization, actions taken, workflow, and dashboard verification:
```bash
cd server
npm test
```
*Results: 22/22 test files passed, 209/209 tests passing 100% (0 skipped).*

### 2. Client Vitest Test Suite (101 Tests Passing)
Runs React component and traceability tests across all screens, modals, dashboards, and role restrictions:
```bash
cd client
npm test
```
*Results: 16/16 test files passed, 101/101 tests passing 100% (0 skipped).*

### 3. Full Regression Suite (310 Tests Passing)
Executes all server and client test suites concurrently:
```bash
npm run test:full
```
*Results: 38/38 test files passed, 310/310 tests passing 100% (Zero Regression across Labs 1 through 4).*

### 4. Playwright End-to-End Test Suite (Lab 4 E2E Suites)
Verifies full browser workflows and captures responsive visual evidence across 4 device viewports:
```bash
# Ensure Playwright browser binaries are installed
npx playwright install chromium

# Run Lab 4 E2E test suites
npx playwright test e2e/lab-04/
```
- `actions-taken-flow.spec.ts`: Staff records action with follow-up note → Amber attention banner displayed → requester views read-only.
- `ticket-resolution.spec.ts`: Formal resolution gate validation (`resolutionSummary`) → 409 Conflict handling on stale updates.
- `dashboards.spec.ts`: Authoritative metric card calculation matching database → 1-click drill-down navigation with count parity → 375px mobile responsive layout collapse.
- `visual-evidence.spec.ts`: Zero horizontal scrollbar audit (`scrollWidth <= clientWidth`) and full-page responsive screenshots across Desktop (1280px), Tablet (768px), Mobile (375px), and Small Mobile (320px).

### 5. Production Build Verification
```bash
cd server && npx tsc --noEmit
cd ../client && npm run build
```
*Results: Clean production bundle compiled in ~1.0s, zero TypeScript errors.*

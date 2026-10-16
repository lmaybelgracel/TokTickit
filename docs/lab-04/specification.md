# TokTickIT - Sprint 4 Engineering Specification

## 1. Sprint Goal
Complete the core TokTickIT service-desk workflow by modeling and implementing a parent-child work structure with Actions Taken under each Ticket, enforcing the complete Ticket status-transition matrix and formal resolution gate, delivering role-appropriate operational dashboards with drill-down capabilities for Requesters and IT Staff, and hardening the entire application across accessibility, security, responsiveness, and zero-regression standards under the Zen Green design system.

## 2. Stakeholder Request Interpretation
The stakeholder requires a structured and reliable mechanism to plan, execute, and track ongoing technical work on tickets beyond simple comment threads. Each ticket must support multiple Actions Taken records capturing exact date/time, description, result, actor attribution, follow-up requirements, and attachment notes. While a ticket has one coordinating Ticket Owner, different IT Staff members can execute and record actions. Requesters may signal that their problem appears resolved, but formal resolution remains strictly an IT Staff responsibility with enforced resolution summaries. Furthermore, Requesters, IT Staff, and Administrators must receive role-appropriate dashboards that summarize operational health, highlight urgent items, and provide seamless drill-down into detailed views without replacing existing screens. Finally, all capabilities delivered across Labs 1 through 3 must continue to operate flawlessly without functional regression.

## 3. Scope

### 3.1. Included Work
- **Actions Taken Subsystem (Parent-Child Structure)**:
  - Data model, Prisma migration, and seed records for `ActionTaken` linked to `Ticket`.
  - Actor attribution automatically stamped from authenticated user context.
  - Follow-up workflow: mandatory `followUpNote` when `followUpRequired = true`.
  - Read-only visibility for Requesters on their owned tickets; full create, view, and update capabilities for IT Staff and Administrators.
  - Rejection of assignments or actions attributed to inactive users.
- **Ticket Lifecycle & Workflow Hardening**:
  - Full enforcement of the 8-state transition matrix on the backend (`New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, `Cancelled`).
  - Strict resolution gate: Transition to `Resolved` requires using the resolution endpoint with a mandatory 3–500 character resolution summary. Direct status tampering is rejected.
  - Clarification that Requester "Problem Appears Resolved" toggle remains advisory and does not alter official status.
  - Optimistic concurrency control and stale-update detection returning HTTP 409 Conflict.
- **Role-Appropriate Dashboards**:
  - **Requester Dashboard**: Total open tickets, tickets waiting for requester, recently updated tickets, recently resolved tickets, with data ownership strictly isolated to the authenticated user.
  - **IT Staff Dashboard**: Unassigned tickets, tickets owned by current user, tickets categorized by status and IT priority, and recently updated operational tickets.
  - **Administrator Dashboard**: IT Staff operational metrics plus concise user account statistics (active vs inactive, role distribution).
  - Backend authoritative metric calculations with defined empty states and drill-down links to filtered queue/detail views.
- **Zen Green UI Extensions & Application Shell**:
  - Role-aware Dashboard navigation with active-page indicators in the main header.
  - Actions Taken panel embedded within Ticket Detail supporting list, create modal/form, and edit capabilities.
  - Responsive layouts optimized for Desktop (1280px+), Tablet (768px), and Mobile (375px) without horizontal scrolling.
  - Accessibility compliance: WCAG 2.1 AA color contrast, visible keyboard focus rings, semantic labels, and non-color status cues.
- **Regression Preservation & Product Polish**:
  - Zero regression across all Lab 1, 2, and 3 features (Authentication, Session, Passwords, My Tickets, Create Ticket, Attachments, Public Comments, Internal Notes, Staff Queue, and Admin User Management).
  - Removal of obsolete controls, dead links, placeholder text, and duplicate elements.

### 3.2. Explicitly Excluded Work
- Automated SLA clocks, countdown timers, escalation engines, and breach notifications.
- External communications (SMS, Email, LINE Notify, Webhooks, Push Notifications).
- Inventory, spare parts, asset management, and cost accounting.
- Timesheet billing, labor rate tracking, and payroll calculations.
- Multi-tier approval hierarchies and digital signatures.
- Advanced business intelligence, ad-hoc query builders, and data warehouse exports.
- Multi-tenant data segregation and cloud infrastructure management.

## 4. Functional Requirements (FR)

### Actions Taken Subsystem
- **FR-01:** The system shall allow permitted IT Staff and Administrators to create an Action Taken record under any accessible ticket.
- **FR-02:** The system shall record Action Date/Time, Action Description, Result, Performed By (automatically stamped by the server from authenticated context), Follow-Up Required flag, Follow-up Note, and Attachment Notes.
- **FR-03:** The system shall require a non-empty Follow-up Note whenever Follow-Up Required is marked as true.
- **FR-04:** The system shall allow permitted IT Staff and Administrators to update existing Action Taken records on accessible tickets.
- **FR-05:** The system shall allow authenticated Requesters to view all Action Taken records associated with tickets they own in read-only mode.
- **FR-06:** The system shall reject any create, update, or delete attempt on Action Taken records submitted by Requesters with HTTP 403 Forbidden.
- **FR-07:** The system shall reject attributing or assigning actions to inactive users with HTTP 422 Unprocessable Entity.

### Ticket Status & Workflow
- **FR-08:** The system shall enforce the approved 8-state transition matrix across all status changes on the backend.
- **FR-09:** The system shall require a valid resolution summary (3–500 characters) when transitioning any ticket to `Resolved`.
- **FR-10:** The system shall maintain the Requester "Problem Appears Resolved" toggle as an advisory indicator without automatically transitioning ticket status.
- **FR-11:** The system shall detect concurrent modifications using update timestamps or version tokens and reject stale updates with HTTP 409 Conflict.

### Role-Appropriate Dashboards
- **FR-12:** The system shall provide a Requester Dashboard endpoint returning authoritative counts for Total Open Tickets, Tickets Waiting for Requester, and lists of Recently Updated and Recently Resolved tickets owned by the caller.
- **FR-13:** The system shall provide an IT Staff Dashboard endpoint returning authoritative counts for Unassigned Tickets, Tickets Owned by the Caller, Actions Taken recorded by the Caller (current-user Actions Taken), breakdown counts by Status and IT Priority, and Recently Updated operational tickets.
- **FR-14:** The system shall provide an Administrator Dashboard combining operational IT Staff metrics with user account statistics.
- **FR-15:** The system shall provide actionable drill-down links on dashboard metric cards that navigate users to appropriately filtered list or detail screens.

### Application Shell & Polish
- **FR-16:** The application header shall provide persistent, role-aware navigation linking to Dashboard, Ticket Queue/My Tickets, and Management screens with clear active indicators.
- **FR-17:** All screens shall render responsively on Viewport widths of 1280px (Desktop), 768px (Tablet), and 375px (Mobile) without horizontal scrolling or content clipping.

## 5. Business Rules (BR)

### Actions Taken Rules
- **BR-01:** An Action Taken belongs to exactly one Ticket. Orphaned actions are prohibited.
- **BR-02:** The primary Ticket Owner coordinates the Ticket, but an Action Taken may be recorded and performed by any active IT Staff member or Administrator.
- **BR-03:** The `performedById` field must reference an active user with role `IT_STAFF` or `ADMINISTRATOR`. It is stamped server-side from the authenticated token; client-supplied overrides are ignored.
- **BR-04:** Requesters have strict read-only access to Actions Taken on their owned tickets. Any write request from a Requester returns HTTP 403 Forbidden.
- **BR-05:** `actionDateTime` defaults to the current server timestamp. If supplied by the client, it must be between the ticket's `createdAt` timestamp and the current server timestamp (future dates are rejected with HTTP 422).
- **BR-06:** `description` is mandatory (min 3 characters, max 2,000 characters). `result` is mandatory (min 2 characters, max 1,000 characters).
- **BR-07:** If `followUpRequired` is `true`, `followUpNote` is mandatory (min 3 characters, max 1,000 characters). If `followUpRequired` is `false`, `followUpNote` must be null or empty string.
- **BR-08:** `attachmentNotes` is optional (max 500 characters) and serves as reference notes describing files, screenshots, or physical hardware.

### Ticket Status & Resolution Rules
- **BR-09:** Permitted Ticket Statuses are: `New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, and `Cancelled`.
- **BR-10:** Permitted State Transition Matrix:
  - From `New`: May transition to `Open` (upon claim or assignment) or `Cancelled`.
  - From `Open`: May transition to `In Progress`, `Waiting for Requester`, or `Cancelled`.
  - From `In Progress`: May transition to `Waiting for Requester`, `Resolved`, or `Cancelled`.
  - From `Waiting for Requester`: May transition to `In Progress`, `Resolved`, or `Cancelled`.
  - From `Resolved`: May transition to `Closed` (verified by Requester or Staff) or `Reopened` (if issue recurs).
  - From `Closed`: May transition to `Reopened`.
  - From `Reopened`: May transition to `In Progress`, `Waiting for Requester`, or `Resolved`.
  - From `Cancelled`: Terminal state; cannot be transitioned except by Administrator.
- **BR-11:** Transition to `Resolved` must occur strictly through the resolution endpoint (`PATCH /api/staff/tickets/:id/resolve`) requiring a mandatory `resolutionSummary` (3–500 characters). Calling the general status transition endpoint with `status = "Resolved"` is rejected with HTTP 422 Unprocessable Entity.
- **BR-12:** The Requester "Problem Appears Resolved" toggle (`requesterResolvedIndication`) is strictly an advisory signal. It displays a visual banner for IT Staff but does not modify `Ticket.status`.
- **BR-13:** When updating a ticket or action taken, the client must supply the record's known `updatedAt` timestamp. If the database record has a newer timestamp, the update is rejected with HTTP 409 Conflict.
- **BR-14:** Assigning ticket ownership or recording actions to an inactive user (`isActive = false`) is rejected with HTTP 422 Unprocessable Entity.

### Dashboard Calculation Rules
- **BR-15:** All dashboard metrics must be computed dynamically by the backend from authoritative database records. Client-side aggregation of full collections is prohibited.
- **BR-16:** Requester Dashboard Calculation Rules:
  - `totalOpenTickets`: Count of tickets where `requesterId = caller.id` and `status IN ('New', 'Open', 'In Progress', 'Waiting for Requester', 'Reopened')`.
  - `waitingForRequester`: Count of tickets where `requesterId = caller.id` and `status = 'Waiting for Requester'`.
  - `recentlyUpdated`: Up to 5 tickets where `requesterId = caller.id`, sorted by `updatedAt DESC`.
  - `recentlyResolved`: Up to 5 tickets where `requesterId = caller.id` and `status IN ('Resolved', 'Closed')`, sorted by `updatedAt DESC`.
- **BR-17:** IT Staff Dashboard Calculation Rules:
  - `unassignedTickets`: Count of active tickets where `ownerId IS NULL` and `status NOT IN ('Closed', 'Cancelled')`.
  - `myAssignedTickets`: Count of active tickets where `ownerId = caller.id` and `status NOT IN ('Closed', 'Cancelled')`.
  - `myActionsTakenCount`: Count of all `ActionTaken` records performed by the authenticated staff member (`performedById = caller.id`).
  - `statusCounts`: Aggregate counts grouped by `status` for all active tickets.
  - `priorityCounts`: Aggregate counts grouped by `itPriority` for all active tickets.
  - `urgentOpenTickets`: Count of tickets with `itPriority = 'URGENT'` and `status NOT IN ('Resolved', 'Closed', 'Cancelled')`.
  - `recentQueueTickets`: Up to 5 tickets across the queue, sorted by `updatedAt DESC`.
- **BR-18:** Administrator Dashboard Calculation Rules:
  - Inherits all IT Staff metrics plus: `totalUsers`, `activeUsers`, `inactiveUsers`, and breakdown by `role`.

## 6. UI Specification Summary

### IT Staff Dashboard Screen
- **Welcome Banner**: Displays greeting with staff member name, role badge, and quick date context.
- **Operational Metric Cards**:
  - `Unassigned Tickets` (Green accent, links to queue filtered by unassigned).
  - `My Active Tickets` (Green accent, links to queue filtered by current user ownership).
  - `My Actions Recorded` (Count of Actions Taken by current staff member, links to filtered queue/actions history).
  - `Urgent Tickets` (Red/Amber badge, links to queue filtered by URGENT priority).
  - `Waiting for Requester` (Amber badge, links to queue filtered by Waiting for Requester).
- **Recent Queue Activity Table**: Displays 5 most recently updated tickets with Ticket Number, Summary, Priority Badge, Status Badge, Owner, and Last Updated.
- **Quick Action Bar**: Fast navigation buttons to Create Ticket, Ticket Queue, and Search.

### Requester Dashboard Screen
- **Welcome Banner**: Displays requester name and active summary.
- **Personal Metric Cards**:
  - `Open Tickets` (Links to My Tickets with active filter).
  - `Action Required / Waiting for You` (Amber callout if > 0, links to tickets needing reply).
  - `Resolved / Closed` (Links to completed tickets).
- **Recent Tickets List**: Shows top 5 owned tickets with status, updated date, and direct detail links.
- **Quick Action Bar**: "Create New Ticket" and "View All My Tickets".

### Actions Taken Section on Ticket Detail
- **Location**: Tabbed panel or dedicated section below Ticket Details and above Comments.
- **List / Table View**:
  - Columns/Rows: Action Date/Time, Description, Result, Performed By (Staff Name), Follow-up Status (Badge with note on hover/click), and Attachment Notes.
  - Order: Append-only chronological order (oldest to newest or newest to oldest with toggle).
- **Create Action Modal / Form**:
  - Input fields: Action Date/Time (default now), Description (textarea), Result (textarea), Follow-Up Required (toggle), Follow-up Note (conditionally visible and required if toggle on), Attachment Notes (text).
  - Real-time client-side validation and character counters.
- **Edit Action Modal**:
  - Pre-populates existing data, enforces version/timestamp check for conflict handling.
- **Requester View**:
  - Renders read-only list. Create and Edit buttons are completely suppressed.

## 7. Data Changes & Justifications

### 7.1. Database Schema Additions & Inverse Relations
```prisma
// Extension to existing model Ticket
model Ticket {
  // ... existing Lab 1-3 fields (id, ticketNumber, summary, requesterId, ownerId, etc.) ...
  actionsTaken    ActionTaken[]
}

// Extension to existing model User
model User {
  // ... existing Lab 1-3 fields (id, email, name, role, isActive, etc.) ...
  actionsTaken    ActionTaken[] @relation("PerformedActions")
}

// New Child Model ActionTaken
model ActionTaken {
  id                Int      @id @default(autoincrement())
  ticketId          Int      @map("ticket_id")
  performedById     Int      @map("performed_by_id")
  actionDateTime    DateTime @default(now()) @map("action_date_time")
  description       String   @db.Text
  result            String   @db.Text
  followUpRequired  Boolean  @default(false) @map("follow_up_required")
  followUpNote      String?  @map("follow_up_note") @db.Text
  attachmentNotes   String?  @map("attachment_notes") @db.VarChar(500)
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  ticket            Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  performedBy       User     @relation("PerformedActions", fields: [performedById], references: [id], onDelete: Restrict)

  @@index([ticketId])
  @@index([performedById])
  @@index([actionDateTime])
  @@map("actions_taken")
}
```

### 7.2. Database Design Justifications
1. **Dedicated Child Entity with Normalized Foreign Keys**:
   - *Justification:* Storing Actions Taken in a dedicated `actions_taken` relational table rather than as embedded JSON in `Ticket` guarantees strict referential integrity with `User` (tracking the exact staff member who took action) and enables performant indexed filtering, sorting, and reporting without full-table parsing. Foreign key `onDelete: Cascade` ensures clean lifecycle teardown when tickets are removed during test cleanup, while `onDelete: Restrict` on `performedBy` prevents deleting active staff with operational history.
2. **Optimistic Concurrency Control via Timestamp Validation (`updatedAt`)**:
   - *Justification:* In a multi-agent service desk, multiple staff members and requesters may simultaneously view and update the same ticket or actions. Instead of heavy database row locks (pessimistic locking), TokTickIT utilizes optimistic concurrency checking on `updatedAt`. If a mutation payload presents an outdated timestamp, the transaction is rejected with HTTP 409 Conflict, preserving data consistency while maintaining high throughput.

### 7.3. Migration, Backfill & Seed Strategy
- **Migration**: A clean SQL DDL migration creates the `actions_taken` table and indexes without modifying or locking existing `tickets`, `users`, or `attachments`.
- **Backfill**: Legacy tickets from Labs 1–3 contain zero actions taken. Dashboard queries handle `actions_taken.length === 0` safely via `LEFT JOIN` and coalesce counts.
- **Seed Data**: Expanded seed script generates realistic tickets covering zero, single, and multiple actions taken, attributed across different IT Staff members, providing both zero and positive dashboard metric verification.

## 8. API Contract Summary

| Method | Endpoint | Allowed Roles | Description | Success Code | Conflict/Error Codes |
|:---|:---|:---|:---|:---:|:---:|
| `GET` | `/api/tickets/:id/actions` | All Authenticated | Get all Actions Taken for a ticket (Requester must own ticket) | `200 OK` | `401`, `403`, `404` |
| `POST` | `/api/tickets/:id/actions` | `IT_STAFF`, `ADMINISTRATOR` | Create new Action Taken under ticket | `201 Created` | `400`, `401`, `403`, `422` |
| `PATCH` | `/api/actions/:id` | `IT_STAFF`, `ADMINISTRATOR` | Update an existing Action Taken record | `200 OK` | `400`, `401`, `403`, `404`, `409`, `422` |
| `GET` | `/api/dashboard/requester` | `REQUESTER` | Retrieve authenticated requester dashboard metrics | `200 OK` | `401`, `403` |
| `GET` | `/api/dashboard/staff` | `IT_STAFF`, `ADMINISTRATOR` | Retrieve IT Staff queue metrics and breakdowns | `200 OK` | `401`, `403` |
| `PATCH` | `/api/staff/tickets/:id/status` | `IT_STAFF`, `ADMINISTRATOR` | Transition ticket status (except to Resolved) | `200 OK` | `400`, `401`, `403`, `409`, `422` |
| `PATCH` | `/api/staff/tickets/:id/resolve` | `IT_STAFF`, `ADMINISTRATOR` | Formally resolve ticket with mandatory summary | `200 OK` | `400`, `401`, `403`, `409`, `422` |

## 9. Acceptance Criteria (AC)

- **AC-01:** Given an authenticated IT Staff user, when valid Action Taken data is submitted to `POST /api/tickets/:id/actions`, then the action is persisted with `performedById` set to the caller and returned with HTTP 201.
- **AC-02:** Given an authenticated Requester, when `POST /api/tickets/:id/actions` is called, the request is rejected with HTTP 403 Forbidden.
- **AC-03:** Given an Action Taken creation request with `followUpRequired = true` and an empty `followUpNote`, the backend rejects with HTTP 422 Unprocessable Entity.
- **AC-04:** Given an authenticated Requester calling `GET /api/dashboard/requester`, then the response returns counts and recent tickets strictly matching tickets owned by that Requester.
- **AC-05:** Given an authenticated IT Staff member calling `GET /api/dashboard/staff`, then the response returns accurate counts for unassigned tickets, my tickets, urgent tickets, and status breakdowns.
- **AC-06:** Given a ticket in `In Progress`, when IT Staff calls `PATCH /api/staff/tickets/:id/resolve` with a valid `resolutionSummary` (>= 3 chars), the ticket status transitions to `Resolved`.
- **AC-07:** Given a ticket in `In Progress`, when IT Staff attempts to transition `status = "Resolved"` via `PATCH /api/staff/tickets/:id/status`, the request is rejected with HTTP 422.
- **AC-08:** Given a ticket modification request where the provided `updatedAt` is older than the database record, the backend rejects with HTTP 409 Conflict.
- **AC-09:** Given a user with `isActive = false`, any attempt to assign them as Ticket Owner or Action Performer is rejected with HTTP 422.
- **AC-10:** Given a Requester toggling "Problem Appears Resolved", the flag is saved but the ticket status remains unchanged.
- **AC-11:** Given the IT Staff Dashboard UI, clicking on the "Unassigned Tickets" card navigates to the Ticket Queue with filter preset to unassigned tickets.
- **AC-12:** Given the Ticket Detail screen, all Actions Taken are displayed in chronological order with Performed By names and follow-up callouts.
- **AC-13:** Given any screen on a 375px mobile viewport, all cards, tables, and dialogs adapt responsively with zero horizontal page scrolling.
- **AC-14:** Given an initial clean database seed, running the seed script multiple times is completely idempotent and safe.
- **AC-15:** All existing regression test suites from Labs 1, 2, and 3 pass with 100% success.
- **AC-16:** The final main branch passes all unit, integration, and E2E Playwright test suites.

## 10. Definition of Done (DoD)

- [ ] `docs/lab-04/` specification suite (`specification.md`, `ui-spec.md`, `api-spec.md`, `tests.md`, `reviewer.md`, `ai-use.md`) complete and peer-reviewed.
- [ ] Database schema evolved with Prisma migration for `ActionTaken` without loss of Lab 1–3 data.
- [ ] Idempotent seed script populated with tickets having 0, 1, and multiple Actions Taken and diverse metric states.
- [ ] Backend REST API endpoints implemented, secured by RBAC, and verified with Vitest integration tests.
- [ ] Frontend Dashboards and Actions Taken UI implemented following Zen Green tokens and verified with Vitest component tests.
- [ ] Playwright E2E test suites automated and passing across all core workflows.
- [ ] Responsive screenshots captured across Desktop, Tablet, and Mobile viewports without layout clipping.
- [ ] Bidirectional peer review logged with verbatim comments and approvals in `reviewer.md`.
- [ ] Comprehensive single-file submission PDF compiled and verified covering Answer Part 1 through Answer Part 9.

## 11. Assumptions & Engineering Decisions

1. **Authentication Context Injection**: User identity for `performedById` is strictly derived from the verified JWT payload on the backend to prevent impersonation.
2. **Read-Only Requester Visibility**: In alignment with Handout Section 8.3 ("Requesters will see all Actions Taken items"), Requesters are granted transparent visibility into technical progress on their own tickets to enhance communication while preventing unauthorized modifications.
3. **Drill-down URL Parameters**: Dashboard cards link to existing list views using URL search parameters (e.g., `/staff/queue?assignment=unassigned` or `/requester/tickets?status=waiting`) to maintain cohesive application architecture.
4. **Optimistic Concurrency**: Timestamp comparison on `updatedAt` is utilized to safeguard shared ticket workflows against stale overwrites without adding heavyweight lock management.

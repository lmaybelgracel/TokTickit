# TokTickIT - Sprint 3 Engineering Specification

## 1. Sprint Goal
Deliver a secure, role-based IT ticketing workflow by replacing the temporary Development Requester selector with production-grade authentication and authorization supporting three distinct roles: Requester, IT Staff, and Administrator. Empower IT Staff with a collaborative Ticket Queue and operational Detail workflow (ownership claim/reassign, IT priority, status transitions, Public Comments, and private Internal Notes), provide Administrators with minimalist User Management, and preserve all Lab 2 Requester capabilities without regression.

## 2. Stakeholder Request Interpretation
The stakeholder requires transitioning TokTickIT from a prototype testing setup to a real multi-user operational environment. Authentication must be enforced at the server level, requiring users with initial passwords to set a new password upon first sign-in. The system must distinctly separate responsibilities: Requesters submit and track their own tickets; IT Staff manage queues, assign owners, set internal priorities, and communicate via public or private notes; Administrators manage user accounts with strict safety controls (no self-deactivation, no orphaned systems). All interfaces must continue the responsive Zen Green design language established in Lab 2.

## 3. Scope

### 3.1. Included Work
- Authentication system: Email/password login, logout, session/token management, and mandatory first-login password change.
- Server-side Role-Based Access Control (RBAC) across Requester, IT Staff, and Administrator.
- User migration from Lab 2 `RequesterUser` to unified `User` model, preserving existing ticket ownership and attachment data.
- Requester regression verification: Continuation of Create Ticket, My Tickets, Ticket Detail, and Attachments using real authenticated identity.
- Requester Public Comments and "Problem Appears Resolved" indication.
- IT Staff Ticket Queue: Search, multi-filtering, sorting, pagination, status/priority indicators, and responsive table/card layouts.
- IT Staff Ticket Detail: Claim ownership, reassign owner, edit IT Priority, execute permitted status transitions with validation, and manage attachments.
- Dual-stream communication: Append-only Public Comments (all roles) and private Internal Notes (IT Staff and Administrator only).
- Minimalist Administrator User Management: User listing, search, role filtering, account creation, basic profile editing, one-role assignment, account activation/deactivation, and initial password resets.
- Zen Green UI extensions, responsive viewports (Desktop, Tablet, Mobile, 320px), and accessibility.

### 3.2. Explicitly Excluded Work
- Email delivery services (no real email sending for invitations or resets).
- Multi-factor authentication (MFA), OAuth/social login, and SSO.
- Self-registration / public sign-up.
- IT Staff "Actions Taken" checklist (explicitly deferred to Lab 4).
- Formal SLA calculations, automated escalation rules, and notification dispatchers.
- Advanced analytics dashboards and KPI metric widgets.
- Multi-tenant organization and department hierarchy management.
- Production cloud deployment infrastructure changes.
- Multiple roles per user (exactly one role assigned per user).
- User deletion (hard delete), bulk user imports/exports, and audit history logs.
- Profile pictures, avatars upload, and extended profile attributes.
- Account lockouts and complex identity approval workflows.

## 4. Functional Requirements (FR)

### Authentication & Account Management
- **FR-01:** The system shall authenticate users via email address and password, returning authenticated session tokens and user profile information.
- **FR-02:** The system shall detect whether an authenticated user has `mustChangePassword = true` and force immediate redirection to the Change Password screen before granting application access.
- **FR-03:** The system shall allow users to change their password by supplying their current password and a new valid password matching complexity rules.
- **FR-04:** The system shall terminate user sessions upon explicit logout and reject subsequent authenticated requests.
- **FR-05:** The system shall display the authenticated user's full name, role badge, and permitted navigation items in the application shell.

### Requester Workflow & Regression
- **FR-06:** Requesters shall create, view, search, and manage tickets using their authenticated account identity without Development Requester headers.
- **FR-07:** Requesters shall view only tickets and attachments that they own.
- **FR-08:** Requesters shall post Public Comments on their tickets and view Public Comments posted by IT Staff or Administrators.
- **FR-09:** Requesters shall be able to indicate that their reported issue appears resolved.

### IT Staff Operations & Workflow
- **FR-10:** IT Staff shall access a shared Ticket Queue displaying all submitted tickets across the organization.
- **FR-11:** The Ticket Queue shall support text search (Ticket Number, Summary), multi-attribute filtering (Category, Status, Requested Priority, IT Priority, Assignment), sorting, and pagination.
- **FR-12:** IT Staff shall view full Ticket Details, including Requester info, attachments, Public Comments, and Internal Notes.
- **FR-13:** IT Staff shall claim unassigned tickets or reassign ticket ownership to another active IT Staff member or Administrator.
- **FR-14:** IT Staff shall update the ticket IT Priority independently of Requested Priority.
- **FR-15:** IT Staff shall transition ticket status according to the approved state transition matrix.

### Communication
- **FR-16:** IT Staff and Administrators shall create and view private Internal Notes attached to a ticket.
- **FR-17:** All users with access to a ticket shall create and view append-only Public Comments.

### Administrator User Management
- **FR-18:** Administrators shall view a user roster, search by name/email, and filter by role.
- **FR-19:** Administrators shall create new user accounts with one designated role, active status, and an initial password.
- **FR-20:** Administrators shall update user profile details (Name, Email, Role, Active status) and issue password resets.

## 5. Business Rules (BR)

### Security & Authentication Rules
- **BR-01:** Only active accounts (`isActive = true`) with valid credentials can authenticate. Inactive accounts receive an authentication error without disclosing internal status.
- **BR-02:** Users with `mustChangePassword = true` are restricted exclusively to password change endpoints; all operational routes return HTTP 403.
- **BR-03:** Authenticated context derived from server-side verification determines ownership. Client-supplied user or requester IDs in request bodies are ignored.
- **BR-04:** Passwords must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one numeric digit. Plaintext passwords must never be stored.
- **BR-05:** Each user account is assigned exactly one role: `REQUESTER`, `IT_STAFF`, or `ADMINISTRATOR`.

### Administrator Safety Rules
- **BR-06:** User accounts cannot be deleted (no hard delete). Inactive status (`isActive = false`) is used to revoke system access.
- **BR-07:** An Administrator cannot deactivate their own account.
- **BR-08:** An Administrator cannot change their own role away from `ADMINISTRATOR`.
- **BR-09:** The system must prevent deactivation or role modification of the last active Administrator account.
- **BR-10:** Email addresses must be globally unique across all users.
- **BR-11:** When an Administrator resets a user's password, `mustChangePassword` is automatically set to `true`.

### Communication & Privacy Rules
- **BR-12:** Public Comments are visible to Requesters (ticket owners), IT Staff, and Administrators.
- **BR-13:** Internal Notes are strictly confidential and visible only to IT Staff and Administrators. Requesters are blocked from reading or creating notes (HTTP 403).
- **BR-14:** Comments and Internal Notes are append-only. Editing and deletion are prohibited.
- **BR-15:** Comment and note content must not be empty or whitespace-only, and must be between 1 and 2,000 characters. Author and timestamp are stamped by the server.

### Ticket Lifecycle, Ownership & Status Rules
- **BR-16:** A ticket can have zero or one primary Ticket Owner, who must be an active user with role `IT_STAFF` or `ADMINISTRATOR`.
- **BR-17:** `requestedPriority` remains immutable as submitted by the Requester. `itPriority` defaults to `requestedPriority` at creation and can subsequently be modified only by IT Staff or Administrator.
- **BR-18:** Permitted Ticket Statuses are: `New`, `Open`, `In Progress`, `Waiting for Requester`, `Resolved`, `Closed`, `Reopened`, and `Cancelled`.
- **BR-19:** State Transition Matrix:
  - From `New`: May transition to `Open` (upon assignment/claim) or `Cancelled`.
  - From `Open`: May transition to `In Progress`, `Waiting for Requester`, or `Cancelled`.
  - From `In Progress`: May transition to `Waiting for Requester`, `Resolved`, or `Cancelled`.
  - From `Waiting for Requester`: May transition to `In Progress`, `Resolved`, or `Cancelled`.
  - From `Resolved`: May transition to `Closed` or `Reopened`.
  - From `Closed`: May transition to `Reopened`.
  - From `Cancelled`: Terminal state; no transitions permitted.
- **BR-20:** Requesters cannot transition tickets directly to `Resolved` or `Closed`. A Requester's "Problem Appears Resolved" flag serves as operational feedback for IT Staff. Setting status to `Resolved` requires a mandatory `resolutionSummary` (3-500 characters).

## 6. UI Specification Summary
- **Palette & Tokens:** Strict application of Zen Green Design System (`#006B3C` primary, `#0B7A46` secondary, `#EAF6EF` pale green, `#F5F7F6` page background, `#1A2E23` dark text).
- **App Shell:** Unified responsive navbar displaying user identity, role tag, contextual navigation links, and logout CTA.
- **Login & Password Change:** Clean centered cards with field validation, visibility toggles, loading state indicators, and feedback banners.
- **IT Staff Queue:** High-density data table on desktop with sorting indicators, multi-select dropdown filters, and mobile card view.
- **Ticket Detail:** Tabbed or clearly segregated panels distinguishing Public Comments (green accent) from Internal Notes (amber/warning accent).
- **Admin Management:** Roster table with quick action toggles, modal dialogs for user creation and password resets.
- **Responsive Standard:** Flawless usability across Desktop (>=992px), Tablet (768px-991px), Mobile (<768px), and 320px small viewports without horizontal clipping.

## 7. Data Changes (Prisma Schema Evolution)
- **Migrate Model:** Replace `RequesterUser` with unified `User` model:
  - Fields: `id`, `email`, `passwordHash`, `name`, `role` (Enum: `REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`), `isActive`, `mustChangePassword`, `createdAt`, `updatedAt`.
  - Relations: `submittedTickets` (1:N with Ticket), `assignedTickets` (1:N with Ticket), `comments` (1:N with PublicComment), `notes` (1:N with InternalNote).
- **Update Model:** `Ticket`:
  - New fields: `ownerId` (FK to User, nullable), `itPriority` (Enum: `LOW`, `MEDIUM`, `HIGH`), `resolutionSummary` (String, nullable), `requesterResolvedIndication` (Boolean, default false).
  - Extended Status Enum: `NEW`, `OPEN`, `IN_PROGRESS`, `WAITING_FOR_REQUESTER`, `RESOLVED`, `CLOSED`, `REOPENED`, `CANCELLED`.
- **New Model:** `PublicComment`:
  - Fields: `id`, `ticketId` (FK), `authorId` (FK to User), `content`, `createdAt`.
- **New Model:** `InternalNote`:
  - Fields: `id`, `ticketId` (FK), `authorId` (FK to User), `content`, `createdAt`.
- **Indexes:** Add composite indexes on `User(email)`, `User(role, isActive)`, `Ticket(ownerId, currentStatus)`, `PublicComment(ticketId)`, and `InternalNote(ticketId)`.

## 8. API Contract Summary
- `POST /api/auth/login` - Authenticate with email/password, issue token/session.
- `POST /api/auth/logout` - Clear session/token.
- `GET /api/auth/me` - Return current authenticated user profile and permissions.
- `POST /api/auth/change-password` - Update password and clear `mustChangePassword`.
- `GET /api/tickets/my` - Fetch tickets submitted by current authenticated Requester.
- `POST /api/tickets` - Create ticket under authenticated Requester.
- `GET /api/tickets/:id` - Retrieve ticket detail (enforces ownership or IT/Admin role).
- `GET /api/staff/tickets` - Retrieve shared queue for IT Staff (search, filter, sort, page).
- `PATCH /api/staff/tickets/:id/claim` - Assign current IT Staff as ticket owner.
- `PATCH /api/staff/tickets/:id/assign` - Reassign ticket owner.
- `PATCH /api/staff/tickets/:id/priority` - Update ticket IT Priority.
- `PATCH /api/staff/tickets/:id/status` - Transition ticket status with validation.
- `GET /api/tickets/:id/comments` - Retrieve public comments.
- `POST /api/tickets/:id/comments` - Post a public comment.
- `GET /api/tickets/:id/notes` - Retrieve internal notes (IT/Admin only).
- `POST /api/tickets/:id/notes` - Post an internal note (IT/Admin only).
- `PATCH /api/tickets/:id/resolve-indication` - Requester toggles resolution flag.
- `GET /api/admin/users` - Retrieve user roster (Admin only).
- `POST /api/admin/users` - Create user account (Admin only).
- `PATCH /api/admin/users/:id` - Update user account details (Admin only).
- `POST /api/admin/users/:id/reset-password` - Set initial password for user (Admin only).

## 9. Acceptance Criteria (AC)
- **AC-01:** Given an active user with valid credentials, when they log in, then authenticated access is established and user role metadata is returned.
- **AC-02:** Given a user with `mustChangePassword = true`, when login succeeds, then all normal application views remain blocked until a new valid password is saved.
- **AC-03:** Given an authenticated Requester, when they view their tickets, only tickets submitted by their user ID are returned, regardless of query parameters.
- **AC-04:** Given a Requester account, when accessing Internal Note endpoints, then the operation is rejected with HTTP 403 Forbidden without leaking note metadata.
- **AC-05:** Given an IT Staff user, when viewing the Ticket Queue, then all tickets across all Requesters are visible with accurate search, filter, and pagination counts.
- **AC-06:** Given an IT Staff user, when claiming an unassigned ticket, then their user ID is set as the `ownerId` and the ticket status transitions from `New` to `Open`.
- **AC-07:** Given a ticket in `In Progress`, when IT Staff updates status to `Resolved` with a valid resolution summary, then the transition succeeds and timestamp is recorded.
- **AC-08:** Given a ticket in `In Progress`, when an invalid transition (e.g. to `New`) is attempted, the system rejects it with HTTP 400 and descriptive error.
- **AC-09:** Given an Administrator, when creating a user with an existing email, then HTTP 409 Conflict is returned and no record is created.
- **AC-10:** Given the last active Administrator, when attempting deactivation or role change, the system blocks the operation with HTTP 400 Bad Request.
- **AC-11:** Given an authenticated user, when Public Comments or Internal Notes are submitted, the backend stamps the author identity and creation timestamp.
- **AC-12:** Given all Lab 2 ticket creation and attachment workflows, when executed by an authenticated Requester, all functions operate identically without Development Requester selector.

## 10. Definition of Done (DoD)

### Part 1: Product Completion Checklist
- [ ] Prisma schema evolved with `User`, `PublicComment`, `InternalNote`, and updated `Ticket` relations.
- [ ] Database migration executed safely and idempotent seed populated with >=4 Requesters, >=3 IT Staff, and >=1 Admin.
- [ ] Full authentication suite operational (Login, Logout, Me, Password Change).
- [ ] Role-based authorization enforced on all endpoints and frontend views.
- [ ] Lab 2 Requester workflows verified against authenticated identity without regression.
- [ ] IT Staff Ticket Queue and Detail operational with claim, assign, priority, and status transitions.
- [ ] Public Comments and role-restricted Internal Notes operational and visually distinct.
- [ ] Administrator User Management operational with safety guards against self/orphan deactivation.
- [ ] Zen Green Design System applied consistently across desktop, tablet, mobile, and 320px viewports.

### Part 2: Course Delivery Checklist
- [ ] All development performed on feature branches branched from `lab3-staging`.
- [ ] All PRs peer-reviewed, approved, and merged into `lab3-staging`.
- [ ] 100% passing automated tests across Server Vitest, Client Vitest, and Playwright E2E suites.
- [ ] All 6 documentation files complete in `docs/lab-03/`.
- [ ] Screenshot evidence captured in `artifacts/lab-03/screenshots/`.
- [ ] Final release PR merged from `lab3-staging` into `main`.
- [ ] Single PDF submission report compiled following Answer Part 1 to Answer Part 9.

## 11. Assumptions and Decisions
1. **Authentication Mechanism:** Session tokens will be managed via cryptographically signed JWT tokens or secure session cookies with HTTP-only flags.
2. **Password Security:** Passwords hashed with `bcrypt` (salt rounds = 10) to prevent brute-force attacks.
3. **Migration Strategy:** Existing Lab 2 `RequesterUser` records are migrated directly to `User` rows with role `REQUESTER` and default temporary passwords (`Pass1234!`) with `mustChangePassword = true`.
4. **Queue Default Sorting:** Ticket Queue defaults to descending order of creation date (`createdAt DESC`).

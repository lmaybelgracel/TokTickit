# Lab 2 Sprint Engineering Specification — TokTickIT Requester Ticketing MVP with UI Foundation

## 1. Sprint Goal
Develop and deliver a professional, responsive, end-user facing ticketing experience for TokTickIT. Requesters can create IT support tickets with permitted attachments, receive a unique backend-generated Ticket Number, view and filter their owned tickets in "My Tickets", inspect ticket details, and manage permitted attachments (upload and soft-removal) under a temporary Development Requester identity with strict data ownership boundaries and Zen Green UI standards.

---

## 2. Stakeholder Request Interpretation
The IT department needs a Requester-facing application to receive real IT support requests. A user must be able to describe their problem, select a category and related system, specify priority, attach evidence (up to 5 MB per file, max 5 active attachments, allowed types: JPG/JPEG, PNG, WEBP, PDF), and submit the ticket. Following submission, the system generates a unique official Ticket Number. The user must be able to find, search, filter, sort, and paginate through their own tickets in "My Tickets", view ticket details, add attachments, and soft-remove their attachments. Since real authentication will be introduced in Lab 3, a temporary Development Requester selection dropdown ("user login") must be provided for test purposes to simulate multi-user ownership.

---

## 3. Scope

### Included Scope
1. **Development Requester Selection ("Login"):** Dropdown to select active simulated Requester identities; identity context switching; display of current user identity in the application shell.
2. **Create Ticket Workflow:** Form with Category, Related System, Requested Priority, Summary, Description, Attachments upload, input validation, backend ticket number generation, and busy/loading/success/error states.
3. **My Tickets Workflow:** Paginated ticket list owned by the active Requester; search by ticket number or summary; filtering by category, priority, and status; sorting; empty, loading, no-results, and error states.
4. **Requester Ticket Detail Workflow:** Read-only detailed view of an owned ticket, list of active and soft-removed attachment metadata, active attachment download, additional attachment upload, and soft-removal of attachments with reason recording.
5. **Ownership & Security Boundary:** Strict backend enforcement ensuring Requester A cannot view or manage tickets or attachments belonging to Requester B.
6. **Zen Green UI Theme & Responsive Design:** Reusable form controls, badges, cards, tables, loading skeletons, error callouts, and responsive behavior for Desktop ($\ge 992\text{px}$), Tablet ($768\text{px}-991\text{px}$), and Mobile ($< 768\text{px}$).

### Excluded Scope
1. Real authentication, passwords, sessions, JWT tokens, and role-based authorization (Lab 3).
2. IT Staff workflows (dashboard, queue management, claiming/reassigning tickets, IT priority adjustment).
3. Ticket collaboration features (Public Comments, Internal Notes, Actions Taken).
4. Ticket lifecycle transitions beyond initial status `New` (no resolving, closing, reopening, or cancelling).
5. Administration management of users, Requesters, roles, or reference data.

---

## 4. Functional Requirements

- **FR-01 (Requester Selection):** The system shall allow selecting an active Development Requester identity from PostgreSQL to set the testing context.
- **FR-02 (Requester Switching):** The system shall allow switching the active Development Requester at any time, instantly refreshing all user-owned ticket lists and detail screens.
- **FR-03 (Inactive Requester Filtering):** Inactive Development Requesters shall not appear in the selection dropdown or be selectable for creating tickets.
- **FR-04 (Ticket Creation):** The system shall allow a Requester to submit a new IT ticket with required fields: Category, Related System, Requested Priority, Summary, Description, and optional initial Attachments.
- **FR-05 (Backend Ticket Number):** The backend shall automatically generate a unique, non-sequential Ticket Number (format: `TKT-YYYY-XXXXXX`) upon ticket creation.
- **FR-06 (Initial Ticket Status):** All newly created tickets shall begin with status `New`.
- **FR-07 (My Tickets Retrieval):** The system shall retrieve a paginated list of tickets owned exclusively by the currently selected Development Requester.
- **FR-08 (Search & Filter):** The system shall allow searching tickets by Ticket Number or Summary, and filtering by Category, Requested Priority, and Status.
- **FR-09 (Sorting & Pagination):** The system shall support sorting tickets by creation date or last updated date (ascending/descending) and paginating results with metadata (total items, total pages, current page).
- **FR-10 (Ticket Detail Access):** The system shall allow a Requester to view read-only details of a ticket they own, returning HTTP 403/404 if direct access is attempted by a non-owner.
- **FR-11 (Attachment Upload):** The system shall permit uploading supporting files to a ticket during creation or from the Ticket Detail screen (max 5 MB, allowed types: JPG, JPEG, PNG, WEBP, PDF, max 5 active attachments per ticket).
- **FR-12 (Attachment Soft Removal):** The system shall permit soft-removing an active attachment owned by the Requester upon providing a non-empty removal reason.
- **FR-13 (Attachment Metadata & Download Protection):** Soft-removed attachments shall remain visible in metadata (marked as removed with timestamp and reason) but shall be strictly blocked from preview or download.

---

## 5. Business Rules

- **BR-01 (Unique Ticket Number):** The Ticket Number is generated strictly by the backend and must be globally unique across all Requesters.
- **BR-02 (Initial Status):** Every new ticket starts with Current Status = `New`.
- **BR-03 (Dev Requester Context):** The Development Requester selector is a test mechanism for simulating user identity, not secure authentication.
- **BR-04 (Ownership Restriction):** A Requester can only query, view, attach files to, download attachments from, or soft-remove attachments on tickets where `requesterId` matches their active session context.
- **BR-05 (Attachment File Validation):**
  - Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `application/pdf`.
  - Max file size: $5\,\text{MB}$ ($5,242,880\,\text{bytes}$). Files exceeding this size must be rejected on both client and server.
- **BR-06 (Active Attachment Limit):** A single ticket can have a maximum of 5 **active** (non-removed) attachments at any given time.
- **BR-07 (Soft Removal & Reason Constraint):** Removed attachments are marked with `isRemoved = true`, `removedAt = NOW()`, and `removalReason`. `removalReason` is required and must be between 3 and 250 characters after trimming whitespace. Removed files must not be downloadable, previewable, or restorable.
- **BR-08 (Input Trimming & Field Lengths):** Text inputs must be trimmed of leading/trailing whitespace.
  - `summary`: Required, 5 to 150 characters.
  - `description`: Required, 10 to 2000 characters.
  - `removalReason`: Required upon removal, 3 to 250 characters.
- **BR-09 (Form Data Retention on Error):** If ticket creation or attachment upload fails due to validation or server errors, entered form values must be preserved in the UI so the user does not lose input data.
- **BR-10 (Idempotent Reference Data & Seed):** Categories and Related Systems must be seeded with fixed unique identifiers and names to allow re-running seed scripts without creating duplicates.
- **BR-11 (Atomic Creation & Transaction Strategy):** Initial ticket creation along with initial attachment records is executed within an atomic database transaction. If attachment storage or metadata creation fails during creation, the entire transaction is rolled back so no orphaned ticket is created.

---

## 6. UI Specification Summary

The application UI strictly implements the **Zen Green Theme**:
- **Primary Color:** `#006B3C` (App header, primary action buttons, strong emphasis)
- **Secondary Color:** `#0B7A46` (Active tabs, focus accents, links, hover states)
- **Pale Green:** `#EAF6EF` (Selected rows, subtle section backgrounds, success badges)
- **Background Color:** `#F5F7F6` (Quiet near-white body background)
- **Surface / Cards:** White background with subtle border (`#E0E6E2`) and restrained shadow.
- **Text:** Dark charcoal-green (`#1A2E23`) for comfortable contrast.
- **Screens:**
  1. **Development Requester Selector Screen:** Card with user selection dropdown, notice banner, and Continue button.
  2. **Create Ticket Screen:** Form layout with system-generated read-only fields at top, category/system/priority classification fields, Summary & Description inputs, Attachment dropzone, and clear Primary Submit / Cancel actions.
  3. **My Tickets Screen:** Search input, filter dropdowns (Category, Priority, Status), Sort toggle, Clear Filters button, Responsive Table (Desktop) / Ticket Cards (Mobile), Pagination controls, Empty & No-results placeholders.
  4. **Ticket Detail Screen:** Read-only header info, status/priority badges, tabbed or sectioned Attachment list showing active attachments (with Preview/Download/Delete actions) and soft-removed metadata (with removal reason).

---

## 7. Data Changes (Database Schema)

### PostgreSQL Models (Prisma)
- **`RequesterUser`**: `id` (Int, PK), `name` (String), `email` (String, Unique), `department` (String), `isActive` (Boolean, default true), `createdAt`, `updatedAt`.
- **`Category`**: `id` (Int, PK), `name` (String, Unique), `description` (String?), `isActive` (Boolean, default true).
- **`RelatedSystem`**: `id` (Int, PK), `name` (String, Unique), `category` (String?), `isActive` (Boolean, default true).
- **`Ticket`**: `id` (Int, PK), `ticketNumber` (String, Unique), `summary` (String), `description` (String), `requestedPriority` (Enum: LOW, MEDIUM, HIGH), `currentStatus` (Enum: NEW, IN_PROGRESS, RESOLVED, CLOSED, default NEW), `requesterId` (Int, FK -> RequesterUser), `categoryId` (Int, FK -> Category), `relatedSystemId` (Int, FK -> RelatedSystem), `createdAt`, `updatedAt`.
  - **Indexes:** `@@index([requesterId])`, `@@index([requesterId, createdAt])`, `@@index([categoryId])`, `@@index([relatedSystemId])`.
- **`Attachment`**: `id` (Int, PK), `ticketId` (Int, FK -> Ticket), `filename` (String), `storedPath` (String), `fileSize` (Int), `mimeType` (String), `isRemoved` (Boolean, default false), `removedAt` (DateTime?), `removalReason` (String?), `uploadedAt` (DateTime, default NOW()).
  - **Indexes:** `@@index([ticketId])`, `@@index([ticketId, isRemoved])`.

---

## 8. API Contract Summary

- **Context Header Standard:** All requester-scoped API calls require the header `X-Development-Requester-Id: <id>` to represent the selected testing identity.
- `GET /api/requesters` — Retrieve active Development Requesters.
- `GET /api/categories` — Retrieve active Ticket Categories.
- `GET /api/related-systems` — Retrieve active Related Systems.
- `POST /api/tickets` — Create a new validated Ticket for active Requester.
- `GET /api/tickets` — Retrieve paginated tickets for active Requester (`?search=&category=&priority=&status=&sort=&page=&pageSize=`).
- `GET /api/tickets/:id` — Retrieve ticket detail (Ownership check enforced via `X-Development-Requester-Id`).
- `POST /api/tickets/:id/attachments` — Upload attachment to ticket (Ownership check, file type/size/limit validated).
- `GET /api/attachments/:id/download` — Download active attachment (Fails if file is soft-removed or requested by non-owner).
- `DELETE /api/attachments/:id` — Soft-remove attachment with reason `{ "removalReason": "..." }`.

---

## 9. Acceptance Criteria

- **AC-01:** Given a valid ticket request form submitted by Requester A, when submitted, then one Ticket is saved with status `New`, a unique `TKT-YYYY-XXXXXX` number is generated, and the ticket is displayed in Requester A's list.
- **AC-02:** Given no Development Requester is selected, when attempting to open Create Ticket or My Tickets, then the system redirects to the Requester Selection screen.
- **AC-03:** Given Requester B is active, when requesting a Ticket or Attachment belonging to Requester A via API or URL, then access is denied with HTTP 403/404.
- **AC-04:** Given an uploaded file exceeding 5 MB or invalid MIME type (e.g. `.exe`), when attaching, then submission is rejected with field-level validation messages.
- **AC-05:** Given a ticket with 5 active attachments, when attempting to upload a 6th active attachment, then the API returns HTTP 400 with active attachment limit exceeded error.
- **AC-06:** Given an active attachment owned by Requester A, when soft-removed with reason "Outdated screenshot", then `isRemoved` is set to true, metadata displays removal timestamp and reason, and download links return HTTP 410/404.
- **AC-07:** Given Requester A switches identity to Requester B, when viewing My Tickets, then Requester A's tickets disappear and only Requester B's tickets are displayed.
- **AC-08:** Given a search query or filter combination that matches no tickets owned by the active Requester, when My Tickets renders, then a clear no-results state with clear-filters action is displayed.
- **AC-09:** Given a server error or backend validation failure during ticket submission, when the request completes, then a safe error message is displayed while preserving all user-entered form values.

---

## 10. Definition of Done (DoD)

### Part 1: Product Completion Checklist
- [ ] All functional scope (FR-01 to FR-13) and business rules (BR-01 to BR-11) implemented.
- [ ] All acceptance criteria (AC-01 to AC-09) satisfied and backed by traceable automated tests.
- [ ] 100% passing Unit, API, UI Component, UI Style, Responsive, and Playwright E2E tests on `main`.
- [ ] Zen Green Design System fully applied with zero clipping, overflow, or broken focus indicators across Desktop, Tablet, and Mobile viewports.
- [ ] Soft-removal and cross-requester ownership protection verified.

### Part 2: Course Delivery Checklist
- [ ] Git workflow strictly followed: all 12 Issues developed on separate feature branches from `lab2-staging`.
- [ ] All PRs peer-reviewed, comments answered, approved, and merged into `lab2-staging` by Reviewer.
- [ ] PRs linked to corresponding GitHub Issues on Kanban board.
- [ ] Final release PR merged from `lab2-staging` into `main`.
- [ ] All required documents (`specification.md`, `tests.md`, `ui-spec.md`, `api-spec.md`, `reviewer.md`, `ai-use.md`, `README.md`) complete and updated.
- [ ] Single concise PDF report containing Answer Part 1 through Part 9 submitted.

---

## 11. Assumptions and Decisions

1. **Development Identity Storage:** Selected Requester ID is stored in `localStorage` / React State for client persistence during test sessions and transmitted via HTTP header `X-Development-Requester-Id`.
2. **File Storage Location:** Attachments are stored safely on server disk in `server/uploads/lab-02/` with sanitized, UUID-prefixed filenames to prevent directory traversal and file overwrite issues.
3. **Pagination Defaults:** My Tickets page size defaults to 10 items per page, with options for 5, 10, or 25.

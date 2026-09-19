# Lab 3 - Peer Review Record

**Author:** Patitaya Kaewwichain 67070505220 - GitHub: [@lmaybelgracel](https://github.com/lmaybelgracel)

**Peer reviewer (reviewed my PRs):** Titaya Phongsakul 67070505201 - GitHub: [@titayaaa](https://github.com/titayaaa)

**Partner I reviewed (circle review):** Chanya Poolketkij 67070501058 - GitHub: [@chanya06](https://github.com/chanya06)

**Feature PR target:** `lab3-staging`

---

## 1. Pull Requests I Authored (Reviewed by @titayaaa)

| PR | Issue / Branch | Reviewer Verdict | Link |
|:---|:---------------|:-----------------|:-----|
| [#36](https://github.com/lmaybelgracel/TokTickit/pull/36) | Issue 17: Sprint 3 Engineering Contract & Specification / `feature/17-spec-and-tests` | Approved and Merged into `lab3-staging` | [PR #36](https://github.com/lmaybelgracel/TokTickit/pull/36) |
| [#47](https://github.com/lmaybelgracel/TokTickit/pull/47) | Issue 18: Database Schema Evolution, User Migration & Idempotent Seed Data / `feature/18-database-and-seed` | Approved and Merged into `lab3-staging` | [PR #47](https://github.com/lmaybelgracel/TokTickit/pull/47) |
| [#48](https://github.com/lmaybelgracel/TokTickit/pull/48) | Issue 19: Authentication, Session & Mandatory Password Change / `feature/19-auth-and-passwords` | Approved and Merged into `lab3-staging` | [PR #48](https://github.com/lmaybelgracel/TokTickit/pull/48) |
| [#49](https://github.com/lmaybelgracel/TokTickit/pull/49) | Issue 20: IT Staff Ticket Queue / `feature/20-it-staff-ticket-queue` | Approved and Merged into `lab3-staging` | [PR #49](https://github.com/lmaybelgracel/TokTickit/pull/49) |
| [#50](https://github.com/lmaybelgracel/TokTickit/pull/50) | Issue 21: IT Staff Ticket Operations & Detail / `feature/21-it-staff-operations` | Approved and Merged into `lab3-staging` | [PR #50](https://github.com/lmaybelgracel/TokTickit/pull/50) |
| [#51](https://github.com/lmaybelgracel/TokTickit/pull/51) | Issue 22: Administrator User Management / `feature/22-admin-user-management` | Approved and Merged into `lab3-staging` | [PR #51](https://github.com/lmaybelgracel/TokTickit/pull/51) |
| [#52](https://github.com/lmaybelgracel/TokTickit/pull/52) | Issue 23: Automated Testing Suite / `feature/23-automated-testing-suite` | Approved and Merged into `lab3-staging` | [PR #52](https://github.com/lmaybelgracel/TokTickit/pull/52) |
| [#53](https://github.com/lmaybelgracel/TokTickit/pull/53) | Issue 24: Responsive Visual Evidence & UI Style Audit / `feature/24-ui-style-checking` | Approved and Merged into `lab3-staging` | [PR #53](https://github.com/lmaybelgracel/TokTickit/pull/53) |


### Issue 17 - Sprint 3 Engineering Contract & Specification


- **Summary:** Delivers the initial Sprint 3 specification suite under `docs/lab-03/` covering `specification.md`, `ui-spec.md`, `api-spec.md`, `tests.md`, `reviewer.md`, and `ai-use.md`.
- **Reviewer Verdict & Summary:** Commented and Approved by @titayaaa:
  > "นอกนั้นพวก Flow การทำงาน, แบ่ง Role 3 ระดับ, โทนสี UI Zen Green กับกล่อง Internal Notes สีเหลืองส้มอันนี้ทำมาดีมาก ชัดเจนดีแล้ว ฝากแก้จุดข้างบนนี้นิดนึง เดี๋ยวแก้เสร็จทักมาเลย เรามากด Approve ให้น้า"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Data Leak in Ticket Detail Response (`docs/lab-03/api-spec.md`):**
     - *Reviewer Feedback:* In `GET /api/tickets/:id`, returning `internalNotes` to Requesters causes a confidential data leak. Requesters must only receive `publicComments`, while `internalNotes` must be restricted to IT Staff and Admin.
     - *My Action:* Updated `docs/lab-03/api-spec.md` under `GET /api/tickets/:id` with explicit data privacy rules: `internalNotes` is strictly stripped and omitted from the response when accessed by `REQUESTER`. IT Staff and Admins access notes via `GET /api/tickets/:id/notes`.
  2. **Comment on Status vs Resolve Endpoint Collision (`docs/lab-03/api-spec.md`):**
     - *Reviewer Feedback:* Using `PATCH /api/staff/tickets/:id/status` to set `status: "RESOLVED"` risks bypassing the mandatory `resolutionSummary` rule (BR-20).
     - *My Response & Action:* Clarified and reinforced the server-side guard. Direct transition to `RESOLVED` via `PATCH /api/staff/tickets/:id/status` is strictly rejected (`422 Unprocessable Entity`). Resolving a ticket requires using `PATCH /api/staff/tickets/:id/resolve` with mandatory `resolutionSummary` (3-500 characters), ensuring BR-20 cannot be bypassed under any circumstances.
  3. **Comment on Ticket Number Format (`docs/lab-03/api-spec.md`):**
     - *Reviewer Feedback:* Suggestion to change Ticket Number to `TKT-YYYYMMDD-XXXX` (e.g. `TKT-20260913-0001`).
     - *My Response & Verification (Constructive Clarification):* Verified against our active repository codebase and tests. In our repository (`lmaybelgracel/TokTickit`), the Lab 2 generator in `server/src/app.ts:105` and the automated regression test in `create-ticket.api.test.ts:64` explicitly enforce `^TKT-\d{4}-\d{6}$` (`TKT-YYYY-XXXXXX`). Furthermore, the instructor's Lab 3 handout (Section 8.3 & 8.4 mockups on pages 9 and 10) explicitly displays `TKT-2025-001234`. Changing to `TKT-YYYYMMDD-XXXX` would cause our repository's existing regression tests to fail. Therefore, we verified and preserved `TKT-YYYY-XXXXXX` (e.g. `TKT-2026-000142`) for 100% backward compatibility and alignment with the instructor's specification.
  4. **Comment on Priority Enum missing URGENT (`docs/lab-03/specification.md`):**
     - *Reviewer Feedback:* `enum Priority` had only 3 levels (LOW, MEDIUM, HIGH), missing `URGENT` from Lab 3 specifications.
     - *My Action:* Updated Prisma Schema evolution and BR-17 in `docs/lab-03/specification.md` and `docs/lab-03/api-spec.md` to include all 4 levels: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
  5. **Comment on Role Badge Enum Mapping (`docs/lab-03/ui-spec.md`):**
     - *Reviewer Feedback:* UI shows `Requester`, `IT Staff`, `Administrator` while Prisma uses `REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`. Suggested clarifying note for frontend component authoring.
     - *My Action:* Added an Enum Mapping Note in `docs/lab-03/ui-spec.md` Section 1.2 clarifying that backend database enums are SCREAMING_SNAKE_CASE and mapped to title case display labels in the UI.
  6. **Comment on Additional Security & Resolution Test Cases (`docs/lab-03/tests.md`):**
     - *Reviewer Feedback:* Add explicit test cases for Requester hitting `GET /api/tickets/:id/notes` getting 403 Forbidden, and resolving a ticket without `resolutionSummary` getting 422.
     - *My Action:* Added `SEC-04` (Requester hitting internal notes blocked with 403) and `STAFF-05` (Resolving ticket without resolution summary blocked with 422) in `docs/lab-03/tests.md`.
- **Final Result:** Approved by @titayaaa and merged into `lab3-staging` (commit `2abef9f`).

---

### Issue 18 - Database Schema Evolution, User Migration & Idempotent Seed Data

- **Summary:** Evolved database schema to introduce unified `User` model, `PublicComment`, `InternalNote`, extended `Priority` and `TicketStatus` enums, ticket ownership relations, and idempotent seed data with comprehensive test coverage.
- **Reviewer Verdict & Summary:** Commented and Approved by @titayaaa (commit `b108cd3`):
  > "ตรวจเช็ค commit 3a2e156 เรียบร้อยแล้ว แก้ไขครบถ้วนทั้ง 4 จุดได้อย่างยอดเยี่ยมมาก
  > 1. เพิ่มไฟล์ Prisma Migration พร้อม SQL Backfill ข้อมูล Requester เดิม ช่วยรักษาตั๋ว Lab 2 ได้อย่างสมบูรณ์แบบ
  > 2. ปรับปรุง Seed Data และตัดฟิลด์ department ออกตรงตามข้อกำหนดของ Lab 3
  > 3. ชุดเทสต์ 17 เคสใน database-schema-seed.test.ts ครอบคลุมและผ่านหมด
  > 4. บันทึก reviewer.md เรียบร้อย"
- **Reviewer Feedback Items & My Responses:**
  1. **Prisma Migration Files in PR:**
     - *Reviewer Feedback:* In PR #47, `schema.prisma` was modified but there was no migration folder in `server/prisma/migrations/`.
     - *My Action:* Created and committed `server/prisma/migrations/20260917000000_lab3_users_and_ticket_evolution/migration.sql` containing full DDL commands for enums, `users` table, altered `tickets` columns/indexes/foreign keys, `public_comments`, and `internal_notes`.
  2. **Foreign Key of `Ticket.requesterId` & Lab 2 Data Preservation:**
     - *Reviewer Feedback:* Changing `Ticket.requesterId` to reference `User.id` directly risks breaking existing Lab 2 tickets if requester IDs do not match user IDs.
     - *My Action:* Added automated backfill in both the migration SQL and `server/prisma/seed.ts`. It copies existing `requester_users` into `users` table preserving the exact primary key `id`s (`INSERT INTO "users" ... SELECT "id", ... FROM "requester_users"`), ensuring complete data integrity, matching foreign keys, and zero data loss.
  3. **Department Field in `model User` (Exclusion Rule):**
     - *Reviewer Feedback:* In `model User`, `department String?` was added, but Lab 3 handout Section 4.2 & 5.1 explicitly states departments are excluded from Lab 3 User model.
     - *My Action:* Removed `department` attribute from `model User` in `server/prisma/schema.prisma` and updated `server/prisma/seed.ts` and tests to ensure strict compliance with course exclusions without scope creep.
  4. **Path Import in `database-schema-seed.test.ts`:**
     - *Reviewer Feedback:* Check module import conventions in tests.
     - *My Action:* Verified ESM bundler path resolution across environments and added explicit test cases validating migration file existence, ID preservation during backfill, and department exclusion.
- **Final Result:** Approved and Merged into `lab3-staging` by @titayaaa (Merge commit `b108cd3`).

---

### Issue 19 - Authentication, Session & Mandatory Password Change

- **Summary:** Implemented production-grade JWT authentication, session management, password complexity rules, inactive user access blocking, first-login mandatory password change guard, and Zen Green Login and Change Password user interfaces with full test coverage.
- **Key Deliverables:**
  - Backend auth endpoints: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/auth/change-password`.
  - Password complexity validator and bcryptjs hashing (10 rounds).
  - Authentication and role guard middlewares (`authenticateToken`, `requireAuth`, `enforcePasswordChange`, `requireRole`).
  - Frontend `AuthContext`, `Login` component, `ChangePassword` component with dynamic real-time complexity checklist, and role-based app shell.
- **Reviewer Verdict & Summary:** Changes Requested by @titayaaa:
  > "เราไล่ตรวจโค้ดใน PR #48 ให้แล้วนะ ทำออกมาได้ครบวงจรมาก ทั้ง Backend Auth, JWT Middleware, Context, และหน้า UI สวยงาม คุมธีม Zen Green และ Amber Callout ตรงตามสเปกเลย แต่มีจุดสำคัญที่อยากให้ช่วยปรับแก้ก่อน Merge..."
- **Reviewer Feedback Items & My Responses:**
  1. **Removal of "Select Development Requester" in Login Screen:**
     - *Reviewer Feedback:* Under the Login form in `client/src/App.tsx`, there was a button to toggle back to the old Lab 2 Development Requester Selector, violating Handout Sections 1, 2, and 8.2 ("The Development Requester selector and Change Requester action must be removed").
     - *My Action:* Completely removed the Dev Selector button and legacy selector toggle from `App.tsx`, ensuring 100% of unauthenticated access goes strictly through the production Login form. Updated `client/tests/lab-01/App.test.tsx` to assert the Login entrypoint and authenticated shell.
  2. **Password Rotation Policy (Preventing Identical New Password):**
     - *Reviewer Feedback:* Under Mandatory First-Login Password Rotation, setting `newPassword` identical to `currentPassword` must be prevented.
     - *My Action:* Added server-side validation in `server/src/routes/auth.routes.ts` returning `422 Unprocessable Entity` (`{ error: "New password cannot be the same as current password" }`), and added frontend client check and warning in `ChangePassword.tsx` that keeps the submit button disabled if both passwords match. Added test coverage in both `auth.api.test.ts` and `ChangePassword.test.tsx`.
  3. **HTTP Status Code for Password Complexity Failure:**
     - *Reviewer Feedback:* In `POST /api/auth/change-password`, complexity failure returned 400 Bad Request, whereas API Spec Section 1.4 defines 422 Unprocessable Entity for semantic validation errors.
     - *My Action:* Updated status code to `422 Unprocessable Entity` in `auth.routes.ts`, updated `auth.api.test.ts` assertions, and aligned `docs/lab-03/api-spec.md`.
  4. **Token Storage Clarification:**
     - *Reviewer Feedback:* Clarify token storage convention between cookie and `localStorage`.
     - *My Action:* Documented in both `specification.md` and `api-spec.md` that the React Single Page Application (SPA) stores the Bearer JWT in `localStorage` (`toktickit_auth_token`) and transmits it via `Authorization: Bearer <token>` for all API requests.
- **Final Result:** Approved by @titayaaa ("good !!") and merged into `lab3-staging` (Merge commit `94e2f3c`).

---

### Issue 20 - IT Staff Ticket Queue

- **Summary:** Implemented the shared IT Staff Ticket Queue API and UI enabling IT Staff and Administrators to monitor, search, filter, sort, and paginate tickets across all Requesters within TokTickIT.
- **Key Deliverables:**
  - Backend queue query API: `GET /api/staff/tickets` in `server/src/routes/staff.routes.ts` with multi-criteria filtering (`category`, `status`, `priority`, `itPriority`, `ownerId`), search across ticket number and summary, sorting, and pagination.
  - Security & Role Guards: Strict enforcement via `requireAuth`, `enforcePasswordChange`, and `requireRole(Role.IT_STAFF, Role.ADMINISTRATOR)`. Requesters blocked with 403 Forbidden.
  - Frontend `StaffTicketQueue.tsx` component & `StaffTicketQueue.css` adhering to Zen Green design system:
    - 250ms debounced search bar.
    - Category, Status, Requested Priority, and IT Priority filter dropdowns.
    - Ownership segmented toggle (`All`, `Unassigned`, `Assigned to Me`).
    - Sortable table headers (Ticket No, Created Date, IT Priority, Status).
    - Status, Priority, and Owner badges.
    - Desktop high-density table and Mobile responsive card stack.
    - Clear Filters reset action and empty/no-results state.
    - Pagination bar with configurable items per page (10, 25, 50).
  - Comprehensive test coverage:
    - 16 server API tests in `server/tests/lab-03/staff-queue.api.test.ts`.
    - 7 client component tests in `client/src/__tests__/lab-03/StaffTicketQueue.test.tsx`.
- **Reviewer Verdict & Summary:** Approved and Merged by @titayaaa (Merge commit `f7838f7`):
  > "เราไล่ตรวจโค้ดใน PR #49 ให้ครบทุกจุดแล้วนะ ทำออกมาได้ดีและละเอียดมาก ทั้งฝั่ง Backend API และหน้าบ้าน UI คุมธีม Zen Green สวยงาม สบายตา ตรงตามสเปกเลยจ้า... เรากด Approve ให้เรียบร้อยแล้วน้า เดี๋ยวเรากด Merge เข้า `lab3-staging` ให้เลย"
- **Reviewer Feedback Items & Notes:**
  1. **RBAC & Security Middleware:** Confirmed thorough coverage across Token check, Role guard (`IT_STAFF`, `ADMINISTRATOR`), and `mustChangePassword` blocking with proper status codes (401, 403).
  2. **UX & Responsive Layout:** Commended 250ms debounced search, ownership segmented buttons (`All`, `Unassigned`, `Assigned to Me`), and responsive transformation to mobile card stack.
  3. **Priority Sorting & Automated Tests:** Verified Postgres enum-aware `itPriority` sort and 100% pass rate across all 16 backend and 7 frontend test cases.
  4. **Constructive Suggestions Noted for Future Refinement:** In `staff.routes.ts`, consider returning `400 Bad Request` if invalid enum strings are provided; and consider adding ellipsis (`...`) dividers in pagination for large page counts.
- **Final Result:** Approved by @titayaaa and merged into `lab3-staging` (Merge commit `f7838f7`).

---

### Issue 21 - IT Staff Ticket Operations & Detail

- **Summary:** Implemented comprehensive IT Staff Ticket Operations and Detail views, dual-stream communications (public comments and confidential internal notes), resolution workflow with mandatory summary, state transitions, ownership management, and Requester problem resolution indication.
- **Key Deliverables:**
  - Backend Operations Endpoints in `server/src/routes/staff.routes.ts`:
    - `GET /api/staff/users`: Active staff roster query for assignment dropdowns.
    - `GET /api/staff/tickets/:id`: Rich staff ticket view including requester, category, related system, owner, attachments, public comments, and confidential internal notes.
    - `PATCH /api/staff/tickets/:id/claim`: Allows staff/admin to claim unassigned ticket ownership.
    - `PATCH /api/staff/tickets/:id/assign`: Allows reassigning ticket to any active staff user.
    - `PATCH /api/staff/tickets/:id/priority`: Updates operational `itPriority` (LOW, MEDIUM, HIGH, URGENT).
    - `PATCH /api/staff/tickets/:id/status`: Enforces BR-19 status transition matrix, strictly rejecting direct transition to `RESOLVED` (422 Unprocessable Entity).
    - `PATCH /api/staff/tickets/:id/resolve`: Enforces BR-20 mandatory resolution summary (3-500 chars), setting status to `RESOLVED` and timestamping `resolvedAt`.
  - Dual Communication & Resolution Indication Endpoints in `server/src/routes/comments.routes.ts`:
    - `GET /api/tickets/:id/comments`: Fetch public comments (Requester owner, IT Staff, Admin).
    - `POST /api/tickets/:id/comments`: Post public comment with author attribution.
    - `GET /api/tickets/:id/notes`: Strictly restricted to IT Staff and Admin. Requesters blocked with 403 Forbidden (BR-13 privacy guard).
    - `POST /api/tickets/:id/notes`: Post internal technical note (Staff/Admin only).
    - `PATCH /api/tickets/:id/resolve-indication`: Allows ticket owner Requester to toggle `requesterResolvedIndication` (BR-21).
  - Frontend Component Suite:
    - `StaffTicketDetail.tsx` & `StaffTicketDetail.css`:
      - Zen Green operations toolbar with Claim Ticket, Reassign Owner, IT Priority select, Next Status select, and Resolve Ticket modal.
      - Dual-stream tabbed conversation interface with clear visual distinction:
        - Public Comments: `#EAF6EF` light green bubble styling.
        - Internal Notes: `#FFF8E1` amber bubble styling with lock icon banner explicitly stating visibility restriction to staff only.
      - Resolution modal with character counter (min 3, max 500) and form validation.
      - Requester indication banner displayed when requester marks problem as resolved.
    - `TicketDetail.tsx` (Requester view):
      - Integrated public comments thread and comment composer.
      - Problem Appears Resolved toggle button allowing requesters to indicate resolution status.
      - Resolution summary card displayed when ticket is resolved or closed.
    - `App.tsx`: Dynamic routing to `StaffTicketDetail` for IT Staff/Admin, and `TicketDetail` for Requesters.
  - Test Suites:
    - 16 automated tests in `server/tests/lab-03/staff-ticket-detail.api.test.ts`.
    - 12 automated tests in `server/tests/lab-03/comments-notes.api.test.ts`.
    - 8 automated tests in `client/src/__tests__/lab-03/StaffTicketDetail.test.tsx`.
- **Reviewer Verdict & Summary:** Approved and Merged by @titayaaa (Merge commit `f63cc9c`):
  > "ตรวจทานโค้ดและชุดทดสอบของ PR #50 (Issue 21: IT Staff Ticket Operations & Detail) เรียบร้อยแล้วน้า ละเอียด ครบถ้วน และครอบคลุมตามโจทย์ Lab 3 ดีมาก ๆ เลย! โครงสร้างโค้ดสะอาด เป็นระเบียบ แยกสิทธิ์ถูกต้องตามเกณฑ์ และเทสผ่านครบถ้วนทั้งหมด ไม่มีจุดติดขัดเลย เรา Approve ให้เรียบร้อย"
- **Reviewer Feedback Items & Notes:**
  1. **Dual-stream Communication & Data Privacy (BR-13 & AC-05):** Verified strict route separation between public comments and internal notes. Requesters are strictly forbidden (403) from accessing internal notes. Verified requester ticket ownership guard to prevent cross-ticket commenting.
  2. **Operations & Transition Matrix (BR-19, BR-20):** Confirmed automatic status transition from NEW to OPEN on Claim, validation that assigned user is active staff, strict rejection of status change to RESOLVED via standard status endpoint (422), and mandatory 3-500 character resolution summary.
  3. **Zen Green Design System & Visuals:** Commended clear dual styling (light green for public comments vs amber with lock icon for confidential staff notes), real-time modal character counter, and Requester "Problem Appears Resolved" toggle banner.
  4. **Test Quality & Coverage:** Confirmed 100% pass across all 16 ticket detail API tests, 12 comments/notes API tests, and 8 frontend component tests.
  5. **Minor Recommendation Noted:** Consider adding explicit max length validation (`content.trim().length <= 2000`) on comments per BR-15.
- **Final Result:** Approved and Merged into `lab3-staging` by @titayaaa (Merge commit `f63cc9c`).

---

### Issue 22 - Administrator User Management

- **Pull Request:** [#51](https://github.com/lmaybelgracel/TokTickit/pull/51)
- **Branch:** `feature/22-admin-user-management`
- **Target:** `lab3-staging`
- **Summary:** Implements complete Administrator User Management API and UI according to Sprint 3 specifications and Course Rubric Part 6 (10 pts).
  - Backend API (`server/src/routes/admin.routes.ts` & `server/src/app.ts`):
    - Mounted at `/api/admin/users` protected by `requireAuth`, `enforcePasswordChange`, and `requireRole(Role.ADMINISTRATOR)`.
    - `GET /api/admin/users`: Search (name/email/dept), role filter, active status filter, ordered by creation date, excludes password hashes.
    - `POST /api/admin/users`: Validates full name, department, role, email uniqueness (409), password complexity (min 8 chars, uppercase, lowercase, number, symbol), bcrypt hashing with 10 rounds, sets `mustChangePassword = true`.
    - `PATCH /api/admin/users/:id`: Supports updating name, department, role, active status, email uniqueness (409), and enforces BR-07 (Admin cannot deactivate self - 400), BR-08 (Admin cannot demote self - 400), and BR-09 (Cannot deactivate or demote last active Administrator - 400).
    - `POST /api/admin/users/:id/reset-password`: Validates password complexity, updates hash, forces `mustChangePassword = true`.
  - Frontend Component Suite:
    - `AdminUserManagement.tsx` & `AdminUserManagement.css`:
      - Zen Green roster table and mobile responsive card view (<768px) with role badges, status chips, and credential indicators.
      - Search input with debounce, role filter dropdown, and active status filter dropdown.
      - Create User modal with real-time password complexity checklist and input validation.
      - Edit User modal with built-in safety disabled guards for current admin self-deactivation/demotion and last active admin demotion.
      - Reset Password modal with real-time password complexity checklist and confirmation state.
    - `App.tsx`: Admin navigation button for "User Management" visible exclusively to Administrator role.
  - Test Suites:
    - 26 automated tests in `server/tests/lab-03/admin-users.api.test.ts`.
    - 8 automated tests in `client/src/__tests__/lab-03/AdminUserManagement.test.tsx`.
- **Reviewer Verdict & Summary:** Approved and Merged by @titayaaa (Merge commit `a3c72a4`):
  > "เราลองไล่เช็กโค้ดให้แบบละเอียดทั้งหน้าบ้าน หลังบ้าน แล้วก็ลองรันเทสต์ดูให้หมดแล้วนะ ทำออกมาดีมากก เก็บเงื่อนไขของแล็บนี้ครบเลย! ... ทุกอย่างเรียบร้อยและปลอดภัยดีมากก กด Approve ให้แล้วนะ"
- **Reviewer Feedback Items & Notes:**
  1. **Security & Role-based Access Guards (BR-07, BR-08, BR-09):** Checked authentication, password change enforcement, and admin guards. Verified self-deactivation and self-demotion prevention (400), last active admin demotion/deactivation prevention (400), and case-insensitive unique email handling (409).
  2. **Frontend UI & Password Complexity Checklist:** Real-time 4-point password complexity checklist preventing form submission when incomplete, responsive desktop table and mobile cards (<768px) with `(You)` indicator badge and auto-disabled controls for own account.
  3. **Reviewer Observations & Constructive Notes:**
     - In PR description draft, mention of `department` and `symbol` was noted from initial notes; confirmed actual implementation code cleanly matches specification without unnecessary fields.
     - Reset Password button on own account row currently functional (forces password change on next login); noted recommendation for future UX polish to disable for `(You)` row.
  4. **Test Quality & Verification:** Confirmed 100% pass across all 26 server tests in `admin-users.api.test.ts`, 8 client tests in `AdminUserManagement.test.tsx`, and clean zero-error production build.
- **Final Result:** Approved and Merged into `lab3-staging` by @titayaaa (Merge commit `a3c72a4`).

---

### Issue 23 - Automated Testing Suite (Unit, API, Component, and E2E)

- **Pull Request:** [#52](https://github.com/lmaybelgracel/TokTickit/pull/52)
- **Branch:** `feature/23-automated-testing-suite`
- **Target:** `lab3-staging`
- **Summary:** Implements the complete automated verification test suite for Sprint 3 covering all layers (Backend API integration & security, Frontend React components, and Playwright End-to-End journeys) with 100% traceability to Course Rubric Part 7 and AC-01 to AC-12.
  - End-to-End Test Suite (`e2e/lab-03/`):
    - `authentication.spec.ts` (E2E-AUTH-01): Valid login, `mustChangePassword` enforcement redirect, real-time password complexity checklist validation, password update, and dashboard access.
    - `staff-ticket-flow.spec.ts` (E2E-STAFF-01): Requester submits ticket -> IT Staff claims unassigned ticket, updates IT Priority, switches between Public Comments and Internal Notes tabs, executes permitted status transitions, enters mandatory resolution summary to resolve -> Requester verifies resolution.
    - `user-administration.spec.ts` (E2E-ADMIN-01): Administrator views roster, creates new user, triggers administrative password reset, verifies safety rules (BR-07 self-deactivation guard and BR-08 self-demotion guard), and tests logout.
  - Backend Security & Authorization Test Suite (`server/tests/lab-03/`):
    - `authorization.api.test.ts`: SEC-01 (cross-ticket isolation), SEC-02 & SEC-04 (internal notes isolation and 403 enforcement), SEC-03 (admin role guards), and unauthenticated / mustChangePassword token challenge enforcement.
    - `admin-users.api.test.ts`: ADM-01 (duplicate email 409), ADM-02 (BR-07 self-deactivation 400), ADM-03 (BR-09 last active admin 400), and ADM-04 (password reset).
  - Frontend Component Traceability Suite (`client/src/__tests__/lab-03/`):
    - `AdminUserManagement.test.tsx`: UI-ADMIN-01 (roster rendering), UI-ADMIN-02 (create user modal & submission), and UI-ADMIN-03 (BR-07/08 safety disabled states in edit modal).
- **First Review Verdict (CHANGES_REQUESTED by @titayaaa):**
  > "เราลองไล่ตรวจโค้ดแบบเจาะลึกระดับ Line-by-line และลองเทียบ Route กับ Test Logic ให้ใหม่อีกรอบนะ เจอจุดที่ควรปรับปรุงเพื่อความสมบูรณ์แบบของโปรเจกต์ ... 1. Endpoint ใน authorization.api.test.ts ยิงผิดเส้น (/api/staff/queue -> /api/staff/tickets) ... 2. มีไฟล์เทสต์ซ้ำซ้อนกัน 2 คู่ ... 3. Assertion ตกหล่นใน UserManagement.test.tsx ... 4. ขาดกฎ BR-08 ใน users-admin.api.test.ts ... 5. Behavior ของ useEffect ใน App.tsx"
- **Changes Made & Follow-up Actions:**
  1. Corrected endpoint in `authorization.api.test.ts` from `/api/staff/queue` to `/api/staff/tickets`.
  2. Removed duplicate test files (`users-admin.api.test.ts`, `UserManagement.test.tsx`) and consolidated all test coverage and traceability in `admin-users.api.test.ts` (26 tests) and `AdminUserManagement.test.tsx` (8 tests). Updated `docs/lab-03/tests.md`.
  3. Verified comprehensive coverage for BR-08 (preventing self-demotion), BR-07, BR-09, BR-10, Reset Password modal, and submit assertions.
  4. Implemented `sessionStorage` view state persistence in `App.tsx` and `AuthContext.tsx` so page refreshes retain the active view (ticket detail or create ticket) without unexpected redirects, while fresh logins route cleanly to role defaults.
- **Second Review Verdict (APPROVED by @titayaaa):**
  > "ตรวจทานโค้ดใน commit `7347855` ให้เรียบร้อยแล้วน้า แก้ไขได้ตรงจุดและเก็บรายละเอียดครบถ้วนดีมากเลย
  > - แก้ Endpoint ใน `authorization.api.test.ts` ได้ถูกต้องตรงกับ Route จริง
  > - เคลียร์ไฟล์เทสต์ที่ซ้ำซ้อนออกแล้ว ชุดเทสต์สะอาดขึ้นเยอะและ Traceability ครบถ้วน
  > - การเก็บ View state ลง `sessionStorage` ใน `App.tsx` ช่วยแก้ปัญหาหน้าหลุดตอน Refresh ได้ดีมาก
  > ผลเทสต์ผ่านครบทุกตัว งานเรียบร้อยสมบูรณ์ กด Approve ให้เรียบร้อยแล้วน้า"
- **Test Quality & Verification:**
  - Server test suite: 119/119 passing across 7 test files (100%).
  - Client test suite: 31/31 passing across 5 test files (100%).
  - End-to-End test suite: 3/3 passing across 3 spec files (100%).
  - Total: 153/153 tests passing.
- **Final Result:** Approved and Merged into `lab3-staging` by @titayaaa (Merge commit `15194b5`).

---

### Issue 24 - Responsive Visual Evidence & UI Style Audit

- **Pull Request:** [#53](https://github.com/lmaybelgracel/TokTickit/pull/53)
- **Branch:** `feature/24-ui-style-checking`
- **Target:** `lab3-staging`
- **Summary:** Implements automated Playwright visual screenshot capture spec (`e2e/lab-03/visual-evidence.spec.ts`) and audit of Zen Green design language compliance across desktop (1280px), tablet (768px), mobile (375px), and small mobile (320px) viewports.
- **First Review Verdict (CHANGES_REQUESTED by @titayaaa):**
  > "เราไล่เช็กโค้ด Diff ของ PR #53 แบบละเอียดเจาะลึกทุกบรรทัด ทั้งตัวสเปกเทสต์และหลักฐานรูปภาพให้แล้วน้า ... พบจุดบกพร่องและจุดที่ตัวเลขไม่ตรงกัน 4 จุด อยากให้ปรับแก้ให้เป๊ะก่อน Merge ... 1. เทสต์ Empty State ใน visual-evidence.spec.ts ไม่ได้เช็ก query param ... 2. ยอดจำนวนรูปภาพใน PR Description ไม่ตรงกับโค้ดจริง (24 vs 28) ... 3. ยังไม่ได้บันทึก Issue 24 ลงใน docs/lab-03/reviewer.md ... 4. หลีกเลี่ยงการใช้ waitForTimeout"
- **Changes Made & Follow-up Actions:**
  1. Updated `e2e/lab-03/visual-evidence.spec.ts` under `/api/staff/tickets` route handler to inspect `url.searchParams.get("search")` and verify `searchQuery === "NonExistentQueryXYZ"`, returning empty results array.
  2. Corrected summary counts in PR description and documentation to explicitly specify **28 visual screenshot artifacts** across all 4 categories (Authentication: 8, Staff Queue: 6, Staff Ticket Detail: 7, User Management: 7).
  3. Added full Issue 24 section and review log tracking in `docs/lab-03/reviewer.md`.
  4. Replaced `page.waitForTimeout(400)` with Web-first auto-retrying Playwright assertion `await expect(page.getByText(/No tickets found/i)).toBeVisible();` to ensure non-flaky test execution.
- **Second Review Verdict (APPROVED by @titayaaa):**
  > "ตรวจทานโค้ดและเอกสารที่แก้ไขเพิ่มเติมใน commit `6768c06` ครบถ้วนทุกจุดแล้ว ... โค้ดและเอกสารมีคุณภาพสูง สมบูรณ์แบบทุกจุด approve !!"
- **Final Result:** Approved and Merged into `lab3-staging` by @titayaaa (Merge commit `6768c06` / PR #53).


---


## 2. Pull Requests I Reviewed for Partner (@chanya06)

**Partner author:** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

ตารางสรุปสถานะการรีวิวโค้ดให้คู่ตรวจครบทั้ง 12 Issues ของ Lab 3 (Issue #45–#56 บนคลัง `chanya06/toktickit`):

| Issue | PR | Partner Feature / Branch | My Review Verdict | Status | Link |
|:------|:---|:-------------------------|:------------------|:-------|:-----|
| #45 (Issue 17) | [#44](https://github.com/chanya06/toktickit/pull/44) | docs(lab-03): Sprint 3 engineering contract and specs / `feature/17-spec-and-tests` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #44](https://github.com/chanya06/toktickit/pull/44) |
| #46 (Issue 18) | [#57](https://github.com/chanya06/toktickit/pull/57) | feat(db): Database Schema & Seed Data / `feature/18-db-schema-and-seed` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #57](https://github.com/chanya06/toktickit/pull/57) |
| #47 (Issue 19) | [#58](https://github.com/chanya06/toktickit/pull/58) | feat(auth): Authentication Foundation & Password Change / `feature/19-auth-api` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #58](https://github.com/chanya06/toktickit/pull/58) |
| #48 (Issue 20) | [#59](https://github.com/chanya06/toktickit/pull/59) | feat(auth-ui): Login Screen, Mandatory Password Change & Header Shell (Issue 20) / `feature/20-auth-ui` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #59](https://github.com/chanya06/toktickit/pull/59) |
| #49 (Issue 21) | [#60](https://github.com/chanya06/toktickit/pull/60) | feat: requester session regression and resolution indication action (#49) / `feature/21-requester-session` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #60](https://github.com/chanya06/toktickit/pull/60) |
| #50 (Issue 22) | [#61](https://github.com/chanya06/toktickit/pull/61) | feat: IT Staff ticket queue retrieval and query engine (#50) / `feature/22-staff-queue-api` | Approved | Merged into `lab3-staging` | [PR #61](https://github.com/chanya06/toktickit/pull/61) |
| #51 (Issue 23) | [#62](https://github.com/chanya06/toktickit/pull/62) | feat(staff): implement IT Staff ticket queue UI and filters / `feature/23-staff-queue-ui` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #62](https://github.com/chanya06/toktickit/pull/62) |
| #52 (Issue 24) | [#63](https://github.com/chanya06/toktickit/pull/63) | feat(staff): IT Staff ticket operations and status matrix (#52) / `feature/24-staff-operations` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #63](https://github.com/chanya06/toktickit/pull/63) |
| #53 (Issue 25) | [#64](https://github.com/chanya06/toktickit/pull/64) | feat(comments): public comments and private internal notes (#53) / `feature/25-comments-and-notes` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #64](https://github.com/chanya06/toktickit/pull/64) |
| #54 (Issue 26) | [#65](https://github.com/chanya06/toktickit/pull/65) | feat(admin): administrator user management & safety validations (#54) / `feature/26-admin-user-management` | Changes Requested / Feedback addressed, Approved | Merged into `lab3-staging` | [PR #65](https://github.com/chanya06/toktickit/pull/65) |
| #55 (Issue 27) | Pending | Issue 27: Administrator User Management Interface & Modals | Awaiting Author PR Submission | In Progress by @chanya06 | [Issue #55](https://github.com/chanya06/toktickit/issues/55) |
| #56 (Issue 28) | Pending | Issue 28: QA, Automated Tests, Screenshots, Reviewer Sync & Release Integration | Awaiting Author PR Submission | In Progress by @chanya06 | [Issue #56](https://github.com/chanya06/toktickit/issues/56) |

---

### Partner PR Detailed Review Logs

#### PR #44 — docs(lab-03): Sprint 3 engineering contract and specs

- **Pull Request:** [#44](https://github.com/chanya06/toktickit/pull/44)
- **Branch:** `feature/17-spec-and-tests`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (CHANGES_REQUESTED - 2026-09-16):**
    > ### Peer Review: Sprint 3 Engineering Contract & Specifications (PR #44)
    > 
    > ตรวจเอกสารใน `docs/lab-03/` ทั้งหมดเทียบกับ Lab 3 Handout เรียบร้อยแล้ว การวางสเปกแบบ Spec DD ก่อนเริ่มโค้ดทำได้ครอบคลุมและมีโครงสร้างที่ดีมาก ครอบคลุมทั้ง FR-01–FR-20, BR-01–BR-18, AC-01–AC-12 และการขยาย UI Zen Green
    > 
    > มีข้อเสนอแนะเชิงสถาปัตยกรรมและจุดที่อยากให้ปรับเพิ่มในเอกสารก่อนเริ่ม Implementation ดังนี้:
    > 
    > ---
    > 
    > #### 1. ความสอดคล้องของ Data Types ใน Prisma Schema (`specification.md` Section 7)
    > - ในโมเดลใหม่ `PublicComment` และ `InternalNote` มีการกำหนด `ticketId String` 
    > - แต่ในโค้ดเดิมของ **Lab 2 โมเดล `Ticket.id` ใช้ประเภท `Int` (Autoincrement)**
    > - โจทย์ Section 5 กำหนดว่าต้องรักษาข้อมูลเดิมของ Lab 2 ไว้ (*"evolve without discarding existing Ticket or Attachment data"*) ดังนั้น Foreign Key `ticketId` ของ Comments และ Notes ควรใช้ประเภท `Int` ให้ตรงกับ `Ticket.id`
    > - ส่วน `User.id` หากจะเปลี��ยนจาก `Int` (ของ `DevelopmentRequester` เดิม) มาเป็น `String (UUID)` อยากให้ระบุแผนการทำ Data Migration ลงใน Section 7 ให้ชัดเจนว่าจะแปลง `Ticket.requesterId` จาก `Int` เดิมไปเป็น `UUID` อย่างไร
    > 
    > ---
    > 
    > #### 2. เพิ่ม Endpoint รองรับ "Problem Appears Resolved" ของ Requester (`api-spec.md`)
    > - ตาม Section 1, 4.3 และ 8.2 ระบุว่า Requester สามารถส่งสัญญาณระบุว่าปัญหาได้รับการแก้ไขแล้วได้ (*"indicate that the reported problem appears resolved"*) โดยไม่ถือเป็นการปิดตั๋วอย่างเป็นทางการ
    > - ใน `api-spec.md` ปัจจุบันมีเฉพาะ Endpoint เปลี่ยนสถานะของ IT Staff/Admin แต่ยังไม่มี Endpoint หรือ Flag สำหรับฝั่ง Requester
    > - แนะนำให้เพิ่ม Endpoint เช่น `POST /api/tickets/:id/resolve-indication` หรือ `PATCH /api/tickets/:id` เพื่อระบุการทำงานนี้ให้ชัดเจน
    > 
    > ---
    > 
    > #### 3. ���ะบุ Permitted Roles ใน Status Transition Matrix (`specification.md` BR-14)
    > - ใน BR-14 มีระบุ Matrix การเปลี่ยนสถานะ 8 สถานะเรียบร้อย แต่ยังไม่ได้ระบุ Role กำกับในแต่ละ Transition เช่น:
    >   - `NEW -> OPEN`: ทำได้โดย IT Staff (ตอนเคลมตั๋ว)
    >   - `OPEN / IN_PROGRESS -> CANCELLED`: ใครทำได้บ้าง (Requester ยกเลิกตั๋วตัวเองได้ไหม หรือเฉพาะ IT Staff)
    >   - `CLOSED -> REOPENED`: Requester เปิดตั๋วซ้ำได้หรือไม่
    > - แนะนำให้ระบุ Role ที่อนุญาตให้ทำได้ในแต่ละเส้น Transition ให้ชัดเจนเพื่อป้องกันสิทธิ์หลุดตอนเขียน API
    > 
    > ---
    > 
    > #### 4. ปรับตารางใน `docs/lab-03/tests.md` ให้ตรง Section 10
    > - ตาราง Planned Tests ใน `tests.md` ปัจจุบันรวมรายละเอียดไว้ในช่อง Description และยังขาดคอลัมน์ `Test ID`
    > - แนะนำให้ปรับคอลัมน์ตาม Template หน้า 14 ของอาจารย์: `Test ID | Type | Requirement / AC | What It Tests | Expected Result | Automated Test File | Final` เพื่อความชัดเจนและง่ายต่อการตรวจคะแนน Test DD 
    > 
    > ---
    > 
    > #### 5. เก็บรายละเอียดเล็กน้อยใน `ai-use.md` และ `reviewer.md`
    > - ใน `docs/lab-03/ai-use.md` ช่อง User Input มีตัวอักษร `?????????` ค้างอยู่ รบกวนปรับให้เป็นข้อความที่สมบูรณ์
    > - ใน `docs/lab-03/reviewer.md` ใส่ชื่อ Reviewer เป็น `@lmaybelgracel` ได้เลย
    > 
    > ---
    > 
    > **Verdict**: สามารถปรับรายละเอียด 5 ข้อด้านบนลงในไฟล์ของ branch `feature/17-spec-and-tests` แล้ว push อัปเดตขึ้นมาได้เลย 
    > 
  - **Round 2 (COMMENTED - 2026-09-16):**
    > ### Peer Review: Sprint 3 Engineering Contract & Specifications (PR #44) - Round 2
    > 
    > ตรวจรอบแก้ไขเรียบร้อย ข้อเ���นอแนะทั้ง 5 ข้อได้รับการปรับปรุงครบถ้วน:
    > 
    > * **Schema Continuity**: ปรับ Foreign Key `ticketId` และ `User.id` เป็น `Int` ตรงกับโมเดลเดิมของ Lab 2 และระบุแผน Data Migration ชัดเจน ข้อมูลเดิมไม่สูญหาย
    > * **Requester Resolution**: เพิ่ม Endpoint `POST /api/tickets/:id/resolve-indication` และระบุ BR-19 รองรับการกดแจ้งว่าปัญหาได้รับการแก้ไขแล้ว
    > * **Authorization Matrix**: ระบุ Permitted Roles ใน Status Transition Matrix (BR-14) ค��บทุกสถานะ ป้องกันปัญหาเรื่องสิทธิ์ในชั้น API
    > * **Test DD Traceability**: จัดโครงสร้างตาราง 7 คอลัมน์ตาม Section 10 พร้อมระบุ Test ID ครบทั้ง API, UI และ E2E รวม 22 ข้อทดสอบ
    > * **Documentation Cleanliness**: แก้ไขข้อความใน `ai-use.md` และอัปเดตบันทึกการรีวิวใน `reviewer.md` เรียบร้อย
  - **Round 3 (APPROVED - 2026-09-16):**
    > 
- **Partner Response and Follow-up Actions:**
    > > ### Peer Review: Sprint 3 Engineering Contract & Specifications (PR #44)
    > > ตรวจเอกสารใน `docs/lab-03/` ทั้งหมดเทียบกับ Lab 3 Handout เรียบร้อยแล้ว การวางสเปกแบบ Spec DD ก่อนเริ่มโค้ดทำได้ครอบคลุมและมีโครงสร้างที่ดีมาก ครอบคลุมทั้ง FR-01–FR-20, BR-01–BR-18, AC-01–AC-12 และการขยาย UI Zen Green
    > > 
    > > มีข้อเสนอแนะเชิงสถาปัตยกรรมและจุดที่อยากให้ปรับเพิ่มในเอกสารก่อนเริ่ม Implementation ดังนี้:
    > > 
    > > #### 1. ความสอดคล้องของ Data Types ใน Prisma Schema (`specification.md` Section 7)
    > > * ในโมเดลใหม่ `PublicComment` และ `InternalNote` มีการกำหนด `ticketId String`
    > > * แต่ในโค้ดเดิมของ **Lab 2 โมเดล `Ticket.id` ใช้ประเภท `Int` (Autoincrement)**
    > > * โจทย์ Section 5 กำหนดว่าต้องรักษาข้อมูลเดิมของ Lab 2 ไว้ (_"evolve without discarding existing Ticket or Attachment data"_) ดังนั้น Foreign Key `ticketId` ของ Comments และ Notes ควรใช้ประเภท `Int` ให้ตรงกับ `Ticket.id`
    > > * ส่วน `User.id` หากจะเปลี่ยนจาก `Int` (ของ `DevelopmentRequester` เดิม) มาเป็น `String (UUID)` อยากให้ระบุแผนการทำ Data Migration ลงใน Section 7 ให้ชัดเจนว่าจะแปลง `Ticket.requesterId` จาก `Int` เดิมไปเป็น `UUID` อย่างไร
    > > 
    > > #### 2. เพิ่ม Endpoint รองรับ "Problem Appears Resolved" ของ Requester (`api-spec.md`)
    > > * ตาม Section 1, 4.3 และ 8.2 ระบุว่า Requester สามารถส่งสัญญาณระบุว่าปัญหาได้รับการแก้ไขแล้วได้ (_"indicate that the reported problem appears resolved"_) โดยไม่ถือเป็นการปิดตั๋วอย่างเป็นทางการ
    > > * ใน `api-spec.md` ปัจจุบันมีเฉพาะ Endpoint เปลี่ยนสถานะของ IT Staff/Admin แต่ยังไม่มี Endpoint หรือ Flag สำหรับฝั่ง Requester
    > > * แนะนำให้เพิ่ม Endpoint เช่น `POST /api/tickets/:id/resolve-indication` หรือ `PATCH /api/tickets/:id` เพื่อระบุการทำงานนี้ให้ชัดเจน
    > > 
    > > #### 3. ระบุ Permitted Roles ใน Status Transition Matrix (`specification.md` BR-14)
    > > * ใน BR-14 มีระบุ Matrix การเปลี่ยนสถานะ 8 สถานะเรียบร้อย แต่ยังไม่ได้ระบุ Role กำกับในแต่ละ Transition เช่น:
    > >   
    > >   * `NEW -> OPEN`: ทำได้โดย IT Staff (ตอนเคลมตั๋ว)
- **Evidence:** [PR #44 Review Conversation](https://github.com/chanya06/toktickit/pull/44)

---

#### PR #57 — feat(db): Database Schema & Seed Data

- **Pull Request:** [#57](https://github.com/chanya06/toktickit/pull/57)
- **Branch:** `feature/18-db-schema-and-seed`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (CHANGES_REQUESTED - 2026-09-16):**
    > ### Peer Review: Database Schema & Seed Data (PR #57)
    > 
    > ตรวจโค้ดส่วน Database Schema และ Seed Script เรียบร้อยแล้ว โครงสร้างส่วนใหญ่ทำได้ถูกต้องตามสเปก Section 5 ของ Lab 3:
    > 
    > * **Schema & Relationships**: โมเดล `User`, `Role`, `PublicComment`, `InternalNote` และการปรับฟิลด์บน `Ticket` (`ownerId`, `isResolutionIndicated`, สถานะใหม่) ถูกต้องสมบูรณ์ รักษาระบบ ID เป็น `Int` ทำให้ข้อมูลและ Foreign Key เดิมของ Lab 2 ยังใช้งานได้ต่อเนื่อง
    > * **Security**: รหัสผ่านเข้ารหัสผ่าน `bcrypt` (10 salt rounds) ไม่เก็บ Plaintext ใน Database
    > * **Seed Requirements**: ข้อมูล Seed เป็น Idempotent มี User ครบตามเกณฑ์ (Requester 4+1, IT Staff 3+1, Admin 1) พร้อมตัวอย่าง Tickets, Public Comments และ Internal Notes ครบถ้วน
    > 
    > มีจุดที่ต้องปรับเพิ่ม 2 ข้อก่อน Approve & Merge :
    > 
    > 1. **Commit ไฟล์ Migration**: ยังขาดไฟล์ Migration ของ Lab 3 ใน `server/prisma/migrations/` รบกวนรัน `npx prisma migrate dev --name lab3_db_init` แล้ว commit โฟลเดอร์ migration เข้ามาด้วย
    > 2. **Connection Cleanup ใน seed.ts**: เพิ่ม `.finally(async () => { await getPrisma().$disconnect(); })` กลับเข้ามาตรงท้ายไฟล์ `server/prisma/seed.ts` เพื่อปิด Database Connection หลังรัน seed เสร็จ
    > 
    > ปรับ 2 จุดนี้แล้ว push ขึ้นมาได้เลย 
    > 
  - **Round 2 (APPROVED - 2026-09-16):**
    > ### Peer Review: Database Schema & Seed Data (PR #57) - Round 2
    > 
    > ตรวจเช็ครอบแก้ไขเรียบร้อย โค้ดส่วน Database แ���ะ Seed ครบถ้วนตามสเปก Section 5 ของ Lab 3 ทั้งหมดแล้ว:
    > 
    > * **Migration Integrity**: ไฟล์ `20260917000000_lab3_db_init/migration.sql` เขียนคำสั่งโอนย้ายข้อมูลจาก `DevelopmentRequester` ไปยังตาราง `User` ได้อย่างถูกต้อง รักษา Foreign Key ของตั๋วเดิมใน Lab 2 และสร้างดัชนี (Indexes) รวมถึงสิทธิ์ความสัมพันธ์ครบถ้วน
    > * **Seed Reliability**: สคริปต์ `seed.ts` มีการคืนบล็อก `.finally()` สำหรับตัดการเชื่อมต่อ Prisma Connection หลังทำงานเสร็จเรียบร้อย ข้อมูล Seed มีความหลากหลาย เป็น Idempotent และแฮชรหัสผ่านด้วย `bcrypt` อย่างปลอดภัย
    > * **Review Record**: อัปเดตบันทึกประวัติการรีวิวและแนวทางการแก้ไขใน `reviewer.md` เรียบร้อย
- **Partner Response and Follow-up Actions:**
    > > ### Peer Review: Database Schema & Seed Data (PR #57)
    > > ตรวจโค้ดส่วน Database Schema และ Seed Script เรียบร้อยแล้ว โครงสร้างส่วนใหญ่ทำได้ถูกต้องตามสเปก Section 5 ของ Lab 3:
    > > 
    > > * **Schema & Relationships**: โมเดล `User`, `Role`, `PublicComment`, `InternalNote` และการปรับฟิลด์บน `Ticket` (`ownerId`, `isResolutionIndicated`, สถานะใหม่) ถูกต้องสมบูรณ์ รักษาระบบ ID เป็น `Int` ทำให้ข้อมูลและ Foreign Key เดิมของ Lab 2 ยังใช้งานได้ต่อเนื่อง
    > > * **Security**: รหัสผ่านเข้ารหัสผ่าน `bcrypt` (10 salt rounds) ไม่เก็บ Plaintext ใน Database
    > > * **Seed Requirements**: ข้อมูล Seed เป็น Idempotent มี User ครบตามเกณฑ์ (Requester 4+1, IT Staff 3+1, Admin 1) พร้อมตัวอย่าง Tickets, Public Comments และ Internal Notes ครบถ้วน
    > > 
    > > มีจุดที่ต้องปรับเพิ่ม 2 ข้อก่อน Approve & Merge :
    > > 
    > > 1. **Commit ไฟ���์ Migration**: ยังขาดไฟล์ Migration ของ Lab 3 ใน `server/prisma/migrations/` รบกวนรัน `npx prisma migrate dev --name lab3_db_init` แล้ว commit โฟลเดอร์ migration เข้ามาด้วย
    > > 2. **Connection Cleanup ใน seed.ts**: เพิ่ม `.finally(async () => { await getPrisma().$disconnect(); })` กลับเข้ามาตรงท้ายไฟล์ `server/prisma/seed.ts` เพื่อปิด Database Connection หลังรัน seed เสร็จ
    > > 
    > > ปรับ 2 จุดนี้แล้ว push ขึ้นมาได้เลย
    > 
    > ขอบคุณสำหรับการรีวิว ได้ปรับปรุงแก้ไขครบทั้ง 2 ข้อใน commit `107968d` เรียบร้อยแล้ว:
    > 
    > 1. **Migration File**: เพิ่มไฟล์ Migration ของ Lab 3 ในโฟลเดอร์ `server/prisma/migrations/20260917000000_lab3_db_init/migration.sql` เรียบร้อยแล้ว ครอบคลุมการสร้าง enum Role, สถานะใหม่, ตาราง User, PublicComment, InternalNote และการย้ายข้อมูลจาก DevelopmentRequester โดยไม่กระทบ Foreign Key
    > 2. **Connection Cleanup**: เพิ่ม `.finally(async () => { await getPrisma().$disconnect(); })` ที่ท้ายไฟล์ `server/prisma/seed.ts` เพื่อปิด Database Connection เมื่อรันเสร็จเรียบร้อย
    > 
    > พร้อมสำหรับการตรวจรอบถัดไปและ Approve & Merge เข้า `lab3-staging` แล้ว
- **Evidence:** [PR #57 Review Conversation](https://github.com/chanya06/toktickit/pull/57)

---

#### PR #58 — feat(auth): Authentication Foundation & Password Change

- **Pull Request:** [#58](https://github.com/chanya06/toktickit/pull/58)
- **Branch:** `feature/19-auth-api`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (COMMENTED - 2026-09-16):**
    > ### Peer Review: Authentication Foundation & Password Change (PR #58)
    > 
    > ตรวจโค้ดส่วน Authentication และ Password Management เรียบร้อยแล้ว ฟังก์ชันและเทสต���งตามข้อกำหนดของ Lab 3 Section 4.1, 4.4 และ 6:
    > 
    > * **Authentication & Session**: Endpoint `/api/auth/login`, `/logout`, `/me` และ `/change-password` ทำงานได้สมบูรณ์ รองรับทั้ง Bearer Token และ HTTP-Only Cookie
    > * **Security & Business Rules**: ปฏิบัติตาม BR-01 (สกัดบัญชี Inactive), BR-02 (มี requirePasswordChanged middleware), BR-04 (รหัสผ่านแฮชด้วย bcrypt และไม่ expose hash ออกไปภายนอก) และมีการตรวจสอบ Password Strength ครบทุกเงื่อนไข
    > * **Automated Tests**: ครอบคลุม Test ID API-01, API-02, API-03 พร้อม Edge Cases (รหัสผิด, อีเมลไม่มีในระบบ, รหัสใหม่ไม่ปลอดภัย) ครบถ้วน
    > 
    > **ข้อเสนอแนะเพิ่มเติม (Optional)**:
    > - ใน `auth.api.test.ts` อาจเพิ่มการคืนค่ารหัสผ่านเดิมของ user ใน `afterAll` เพื่อให้ชุดเทสรันซ้ำได้โดยไม่ต้อง re-seed
    > - เพิ่ม `JWT_SECRET` ใน `server/.env.example`
  - **Round 2 (APPROVED - 2026-09-16):**
    > ### Peer Review: Authentication Foundation & Password Change (PR #58) - Round 2
    > 
    > ตรวจเช็ครอบแก้ไขเรียบร้อย ข้อเสนอแนะเพิ่มเติมได้รับการปรับปรุงครบถ้วน:
    > 
    > * **Idempotent Test Suite**: เพิ่ม `afterAll` คืนค่ารหัสผ่านเริ่มต้นและรีเซ็ต `mustChangePassword: true` ใน `auth.api.test.ts` ทำให้ชุดทดสอบรันซ้ำได้โดยไม่กระทบข้อมูลในฐานข้อมูล
    > * **Environment Documentation**: ระบุตัวแปร `JWT_SECRET` ใน `server/.env.example` เรียบร้อย
    > * **Audit Trail**: อัปเดตบันทึกผลการรีวิวใน `docs/lab-03/reviewer.md` ครบถ้วน
- **Partner Response and Follow-up Actions:**
    > > ### Peer Review: Authentication Foundation & Password Change (PR #58)
    > > ตรวจโค้ดส่วน Authentication และ Password Management เรียบร้อยแล้ว ฟังก์ชันและเทสตรงตามข้อกำหนดของ Lab 3 Section 4.1, 4.4 และ 6:
    > > 
    > > * **Authentication & Session**: Endpoint `/api/auth/login`, `/logout`, `/me` และ `/change-password` ทำงานได้สมบูรณ์ รองรับทั้ง Bearer Token และ HTTP-Only Cookie
    > > * **Security & Business Rules**: ปฏิบัติตาม BR-01 (สกัดบัญชี Inactive), BR-02 (มี requirePasswordChanged middleware), BR-04 (รหัสผ่านแฮชด้วย bcrypt และไม่ expose hash ออกไปภายนอก) และมีการตรวจสอบ Password Strength ครบทุกเงื่อนไข
    > > * **Automated Tests**: ครอบคลุม Test ID API-01, API-02, API-03 พร้อม Edge Cases (รหัสผิด, อีเมลไม่มีในระบบ, รหัสใหม่ไม่ปลอดภัย) ครบถ้วน
    > > 
    > > **ข้อเสนอแนะเพิ่มเติม (Optional)**:
    > > 
    > > * ใน `auth.api.test.ts` อาจเ��ิ่มการคืนค่ารหัสผ่านเดิมของ user ใน `afterAll` เพื่อให้ชุดเทสรันซ้ำได้โดยไม่ต้อง re-seed
    > > * เพิ่ม `JWT_SECRET` ใน `server/.env.example`
    > 
    > ขอบคุณสำหรับการรีวิว ได้ปรับปรุงตามข้อเสนอแนะเพิ่มเติมเรียบร้อยแล้ว:
    > 
    > 1. **Test Teardown / State Reset**: เพิ่ม `afterAll` hook ใน `server/tests/lab-03/auth.api.test.ts` เพื่อคืนค่ารหัสผ่านและสถานะ `mustChangePassword` ของ `david.lee@example.com` กลับเป็นค่าเริ่มต้น ทำให้สามารถรันชุดทดสอบซ้ำได้ต่อเนื่องโดยไม่ต้อง re-seed DB
    > 2. **Environment Configuration**: เพิ่ม `JWT_SECRET` ใน `server/.env.example` เรียบร้อยแล้ว
- **Evidence:** [PR #58 Review Conversation](https://github.com/chanya06/toktickit/pull/58)

---

#### PR #59 — feat(auth-ui): Login Screen, Mandatory Password Change & Header Shell (Issue 20)

- **Pull Request:** [#59](https://github.com/chanya06/toktickit/pull/59)
- **Branch:** `feature/20-auth-ui`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (CHANGES_REQUESTED - 2026-09-16):**
    > ### Peer Review: Login Screen, Mandatory Password Change & Header Shell (PR #59)
    > 
    > ตรวจโค้ดใน PR #59 และรัน Flow เทียบกับสเปก Lab 3 และ UI Spec เรียบร้อยแล้ว ตัว Component UI ทำระบบ Checklist ตรวจรหัสผ่าน และ Badge ของ Role ได้เรียบร้อยดีมาก แต่มีจุดบกพร่องเชิง Logic การทำงานของ Auth และ Routing ที่ต้องปรับแก้ก่อน Merge ดังนี้:
    > 
    > ---
    > 
    > #### 1. แก้ไข Login Bypass จาก `toktickit_dev_requester_id` ใน LocalStorage (`client/src/App.tsx`)
    > - ใน `App.tsx` เงื่อนไข `isDevRequesterFlow` ไปเช็ค `localStorage.getItem("toktickit_dev_requester_id")` โดยตรง
    > - ถ้าเครื่องใครเคยรัน Lab 2 มาก่อ�� ค่านี้จะค้างอยู่ในเบราว์เซอร์ ทำให้พอเปิดหน้าเว็บขึ้นมาจะหลุดข้ามหน้า Login ไปเข้า UI ของ Lab 2 ทันที
    > - **สิ่งที่ต้องปรับ:** ให้ผูกเงื่อนไขนี้เฉพาะตอนรันโหมดเทสเท่านั้น เช่น:
    >   ```typescript
    >   const isDevRequesterFlow =
    >     import.meta.env.MODE === "test" &&
    >     (Boolean(localStorage.getItem("toktickit_dev_requester_id")) || isModalOpen);
    > 
  - **Round 2 (CHANGES_REQUESTED - 2026-09-17):**
    > ### ติดตามผลการรีวิว PR #59
    > 
    > ตรวจเช็ค commit `0a604aa` เรียบร้อยแล้ว:
    > - จุดที่ 1 เรื่อง **Login Bypass จากค่า LocalStorage เดิม แก้ไขได้ถูกต้องดีแล้ว** ผูกเงื่อนไขกับ `import.meta.env.MODE === "test"` ช่วยให้เปิดบนเบราว์เซอร์ปกติจะบังคับแสดงหน้า Login เสมอ
    > 
    > แต่ยังมีอีก **3 จุดที่ยังค้างอยู่** รบกวนช่วยปรับเพิ่มอีกนิด:
    > 
    > 1. **Initial Tab ตาม Role (`client/src/App.tsx`)**:
    >    - ตอนนี้ `activeTab` ตั้งต้นเป็น `"my-tickets"` ตลอด พอ `IT_STAFF` หรือ `ADMINISTRATOR` ล็อกอินเข้ามา จะถูกพาไปหน้า `<MyTicketsView>` ของ Requester และใน Navbar จะไม่มีแท็บไหนถูกเลือก
    >    - ให้เพิ่ม `useEffect` เช็ค `user?.role` เมื่อล็อกอินสำเร็จ เพื่อตั้งแท็บเริ่มต้นให้ตรง Role:
    >      - Admin -> `"user-management"`
    >      - IT Staff -> `"ticket-queue"`
    >      - Requester -> `"my-tickets"`
    > 
    > 2. **บันทึก Token ใหม่ใน `changePassword` (`client/src/api.ts` & `AuthContext.tsx`)**:
    >    - ใน `client/src/api.ts` ฟังก์ชัน `changePassword` ยังขาด `if (data.token) setStoredToken(data.token);`
    >    - ทำให้ Client ยังถือ Token เก่าหลังเปลี่ยนรหัสผ่าน ให้เติมการบันทึก Token แ���ะ sync state ใน `AuthContext.tsx` ด้วย
    > 
    > 3. **นำ Debug Component ของ Lab 1 ออก (`client/src/App.tsx`)**:
    >    - นำ `<HomeOverview />` ออกจากหน้า Login และหน้าจอหลัก เพื่อให้ UI ตรงตามสเปกหน้า 8 ของอาจารย์
    > 
    > แก้ 3 จุดนี้เสร็จแล้ว push ขึ้นมาได้เลย เดี๋ยวตรวจให้ทันที
    > 
  - **Round 3 (APPROVED - 2026-09-17):**
    > ### Peer Review (PR #59)
    > 
    > ตรวจเช็คการแก้ไขใน commit `8116192` เทียบกับข้อเสนอแนะในรอบที่แล้วเรียบร้อยแล้ว:
    > 
    > 1. **Role-Based Tab Routing**: ระบบตั้งค่าแท็บเริ่มต้น (`user-management`, `ticket-queue`, `my-tickets`) ตาม Role ของผู้ใช้ที่ล็อกอินถูกต้อง และไฮไลต์แท็บใน Navbar ตรงตามสเปก
    > 2. **Token Persistence**: ฟังก์ชัน `changePassword` บันทึก Token ���หม่ลง LocalStorage และซิงก์เข้า AuthContext เรียบร้อย
    > 3. **UI Spec Adherence**: นำ Debug Component (`<HomeOverview />`) ออกจากหน้า Login และหน้าจอหลัก ทำให้ UI สะอาดตรงตามแบบร่างหน้า 8 ของเอกสาร Lab 3
    > 4. **Automated Test Coverage**: มีการเพิ่มชุดทดสอบใน `AppRoleNav.test.tsx` และ `ChangePassword.test.tsx` ครอบคลุมพฤติกรรมที่ปรับแก้ทั้งหมด
    > 
    > โค้ดพร้อมสำหรับการนำไปใช้งาน สามารถ Merge เข้าสู่ branch `lab3-staging` ได้เลย
    > 
- **Partner Response and Follow-up Actions:**
    > > ### Peer Review: Login Screen, Mandatory Password Change & Header Shell (PR #59)
    > > ตรวจโค้ดใน PR #59 และรัน Flow เทียบกับสเปก Lab 3 และ UI Spec เรียบร้อยแล้ว ตัว Component UI ทำระบบ Checklist ตรวจรหัสผ่าน และ Badge ของ Role ได้เรียบร้อยดีมาก แต่มีจุดบกพร่องเชิง Logic การทำงานของ Auth และ Routing ที่ต้องปรับแก้ก่อน Merge ดังนี้:
    > > 
    > > #### 1. แก้ไข Login Bypass จาก `toktickit_dev_requester_id` ใน LocalStorage (`client/src/App.tsx`)
    > > * ใน `App.tsx` เงื่อนไข `isDevRequesterFlow` ไปเช็ค `localStorage.getItem("toktickit_dev_requester_id")` โดยตรง
    > > * ถ้าเครื่องใครเคยรัน Lab 2 มาก่อน ค่านี้จะค้างอยู่ในเบราว์เซอร์ ทำให้พอเปิดหน้าเว็บขึ้นมาจะหลุดข้ามหน้า Login ไปเข้า UI ของ Lab 2 ทันที
    > > * **สิ่งที่ต้องปรับ:** ให้ผูกเงื��อนไขนี้เฉพาะตอนรันโหมดเทสเท่านั้น เช่น:
    > >   ```ts
    > >   const isDevRequesterFlow =
    > >     import.meta.env.MODE === "test" &&
    > >     (Boolean(localStorage.getItem("toktickit_dev_requester_id")) || isModalOpen);
    > >   ```
    > 
    > ขอบคุณสำหรับการรีวิวและตรวจพบจุด Login Bypass ได้ทำการแก้ไขใน commit ล่าสุดเรียบร้อยแล้ว:
    > 
    > 1. **ป้องกัน Login Bypass (`client/src/App.tsx`)**: ปรับเงื่อนไข `isDevRequesterFlow` ให้ตรวจสอบ `import.meta.env.MODE === "test"` ร่วมด้วย ทำให้การเข้าใช้งานผ่านเบราว์เซอร์จริงจะแสดงหน้า Login (`LoginView`) เสมอ แม้จะมีค่า `toktickit_dev_requester_id` ค้างอยู่ใน LocalStorage จาก Lab 2 ก็ตาม ขณะเดียวกันยังคงรักษาความเข้ากันได้กับการรันชุดทดสอบของ Lab 2 ไว้อย่างสมบูรณ์ (52/52 tests pass)
    > 
    > > ### ติดตามผลการรีวิว PR #59
    > > ตรวจเช็ค commit `0a604aa` เรียบร้อยแล้ว:
    > > 
    > > * จุดที่ 1 เรื่อง **Login Bypass จากค่า LocalStorage เดิม แก้ไขได้ถูกต้องดีแล้ว** ผูกเงื่อนไขกับ `import.meta.env.MODE === "test"` ช่วยให้เปิดบนเบราว์เซอร์ปกติจะบังคับแสดงหน้า Login เสมอ
    > > 
    > > แต่ยังมีอีก **3 จุดที่ยังค้างอยู่** รบกวนช่วยปรับเพิ่มอีกนิด:
    > > 
    > > 1. **Initial Tab ตาม Role (`client/src/App.tsx`)**:
    > >    
    > >    * ตอนนี้ `activeTab` ตั้งต้นเป็น `"my-tickets"` ตลอด พอ `IT_STAFF` หรือ `ADMINISTRATOR` ล็อกอินเข้ามา จะถูกพาไปหน้า `<MyTicketsView>` ของ Requester และใน Navbar จะไม่มีแท็บไหนถูกเลือก
    > >    * ให้เพิ่ม `useEffect` เช็ค `user?.role` เมื่อล็อกอินสำเร็จ เพื่อตั้งแท็บเริ่มต้นให้ตรง Role:
    > >      
    > >      * Admin -> `"user-management"`
    > >      * IT Staff -> `"ticket-queue"`
    > >      * Requester -> `"my-tickets"`
    > > 2. **บันทึก Token ใหม่ใน `changePassword` (`client/src/api.ts` & `AuthContext.tsx`)**:
    > >    
    > >    * ใน `client/src/api.ts` ฟังก์ชัน `changePassword` ยังขาด `if (data.token) setStoredToken(data.token);`
    > >    * ทำให้ Client ยังถือ Token เก่าหลังเปลี่ยนรหัสผ่าน ให้เติมการบันทึ�� Token และ sync state ใน `AuthContext.tsx` ด้วย
    > > 3. **นำ Debug Component ของ Lab 1 ออก (`client/src/App.tsx`)**:
- **Evidence:** [PR #59 Review Conversation](https://github.com/chanya06/toktickit/pull/59)

---

#### PR #60 — feat: requester session regression and resolution indication action (#49)

- **Pull Request:** [#60](https://github.com/chanya06/toktickit/pull/60)
- **Branch:** `feature/21-requester-session`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (CHANGES_REQUESTED - 2026-09-17):**
    > ### Peer Review: Requester Session Regression & Resolution Indication Action (PR #60)
    > 
    > ตรวจโค้ดใน PR #60 เทียบกับสเปก Lab 3, Handout (Section 1, 4.3, 8.2) และ Issue #49 เรียบร��อยแล้ว
    > 
    > จุดเด่นที่ทำได้ดี:
    > - ฝั่ง Backend ทำ Data Isolation รัดกุม ป้องกันไม่ให้ Requester เข้าถึงหรือระบุ requesterId ของผู้ใช้อื่น (403 Forbidden)
    > - ฟังก์ชัน POST /api/tickets/:id/resolve-indication ใช้ Prisma $transaction อัปเดตแฟล็ก isResolutionIndicated: true พร้อมสร้าง PublicComment แบบ Atomic ได้ถูกต้องตาม BR-19
    > - มีชุดทดสอบครอบคลุมทั้ง API Authorization และ Resolution Indication ครบถ้วน
    > 
    > จุดบกพร่องที่ต้องแก้ไขก่อน Merge (Request Changes):
    > 
    > 1. แก้ไข State Wipeout ใน TicketDetailView.tsx หลังกดส่งสัญญาณ Resolution (บรรทัดที่ 43):
    >    - ปัจจุบันมีการเรียก setTicket(res.ticket); โดยตรง แต่ API ส่งกลับมาเฉพาะ partial fields (id, ticketNumber, status, isResolutionIndicated) ทำให้ฟิลด์อื่นๆ ทั้งหมด (Summary, Description, Category, Priority, CreatedAt) กลายเป็น undefined ส่ง���ลให้หน้าจอข้อมูลตั๋วหายเกลี้ยงทันทีที่กดยืนยัน
    >    - วิธีแก้: ให้ทำ State Merge กับข้อมูลเดิม:
    >      setTicket((prev) => (prev ? { ...prev, ...res.ticket } : res.ticket));
    > 
    > 2. แก้ไขแท็บ Attachments หมุนค้างในหน้าตั๋วของ User ที่ล็อกอิน (AttachmentSection.tsx):
    >    - ใน client/src/components/AttachmentSection.tsx ยังไม่ได้เชื่อมต่อกับ AuthContext ยังคงใช้เฉพาะ const { selectedRequester } = useRequester();
    >    - เมื่อล็อกอินด้วย User จริงใน Lab 3 ค่า selectedRequester จะเป็น null ทำให้:
    >      - ฟังก์ชัน loadAttachments ติดเงื่อนไข if (!selectedRequester) return; และค้างสถานะ loading: true เกิด Spinner หมุนค้างตลอดกาล
    >      - ฟังก์ชัน Upload, Download และ Soft-remove ไม่ทำงานเพราะติดเงื่อนไขเดียวกัน
    >    - วิธีแก้: ให้ดึง user จาก AuthContext มาสร้าง effectiveRequesterId เช่นเดียวกับใน TicketDetailView และ MyTicketsView:
    >      const auth = useContext(AuthContext);
    >      const user = auth?.user;
    >      const { selectedRequester } = useRequester();
    >      const effectiveRequesterId = user ? user.id : selectedRequester?.id;
    >      แล้วเปลี่ยนเงื่อนไข Guard และการส่ง Request ให้ใช้ effectiveRequesterId แทน
    > 
    > 3. อัปเดต Traceability Table ใน docs/lab-03/tests.md:
    >    - ในแถว API-14 แก้ชื่อไฟล์ Automated Test ให้ตรงกับไฟล์ที่สร้างจริงเป็น server/tests/lab-03/requester-resolution.api.test.ts และเพิ่มการอ้างอิงชุดเทส UI client/tests/lab-03/RequesterResolution.test.tsx เพื่อให้คะแนน Traceability ใน Rubric สมบูรณ์
    > 
    > คำตัดสิน: Request changes ปรับแก้ 3 ข้อนี้เสร็จแล้ว push ขึ้นมาใหม่ เดี๋ยวตรวจให้นะ
  - **Round 2 (APPROVED - 2026-09-17):**
    > ### Peer Review Verdict: APPROVED (PR #60)
    > 
    > ตรวจเช็คการแก้ไขใน commit `8b3ad62` เทียบกับข้อเสนอแนะรอบที่แล้วอย่างละเอียดเรียบร้อยแล้ว:
    > 
    > 1. **State Preservation**: ใน `TicketDetailView.tsx` มีการทำ State Merge ข้อมูลเดิมเข้ากับ `res.ticket` อย่างถูกต้อง ข้อมูลตั๋วทั้งหมด (Summary, Description, Category, Priority ฯลฯ) ยังคงแสดงครบถ้วน ไม่สูญหายหลังกดส่งสัญญาณ Resolution
    > 2. **Attachment Lifecycle Under Auth**: ใน `AttachmentSection.tsx` มีการดึง `user` จาก `AuthContext` มาคำนวณ `effectiveRequesterId` แก้ปัญหา Spinner หมุนค้าง และทำให้ฟังก์ชันการโหลด/อัปโหลด/ดาวน์โหลด/Soft-remove ไฟล์แนบสำหรับ Authenticated User ทำงานได้สมบูรณ์
    > 3. **Traceability Table Aligned**: ตาราง `docs/lab-03/tests.md` อัปเดตลิงก์ไฟล์ทดสอบจริงทั้งฝั่ง Backend (`requester-resolution.api.test.ts`) และ Frontend (`RequesterResolution.test.tsx`) ครบถ้วนตาม Rubric
    > 
    > โค้ดทำงานถูกต้อง รัดกุม และไม่พบจุดตกหล่นเพิ่มเติม สามารถ Merge เข้าสู่ branch `lab3-staging` ได้เลย
    > 
- **Partner Response and Follow-up Actions:**
    > > ### Peer Review: Requester Session Regression & Resolution Indication Action (PR #60)
    > > ตรวจโค้ดใน PR #60 เทียบกับสเปก Lab 3, Handout (Section 1, 4.3, 8.2) และ Issue #49 เรียบร้อยแล้ว
    > > 
    > > จุดเด่นที่ทำได้ดี:
    > > 
    > > * ฝั่ง Backend ทำ Data Isolation รัดกุม ป้องกันไม่ให้ Requester เข้าถึงหรือระบุ requesterId ของผู้ใช้อื่น (403 Forbidden)
    > > * ฟังก์ชัน POST /api/tickets/:id/resolve-indication ใช้ Prisma $transaction อัปเดตแฟล็ก isResolutionIndicated: true พร้อม��ร้าง PublicComment แบบ Atomic ได้ถูกต้องตาม BR-19
    > > * มีชุดทดสอบครอบคลุมทั้ง API Authorization และ Resolution Indication ครบถ้วน
    > > 
    > > จุดบกพร่องที่ต้องแก้ไขก่อน Merge (Request Changes):
    > > 
    > > 1. แก้ไข State Wipeout ใน TicketDetailView.tsx หลังกดส่งสัญญาณ Resolution (บรรทัดที่ 43):
    > >    
    > >    * ปัจจุบันมีการเรียก setTicket(res.ticket); โดยตรง แต่ API ส่งกลับมาเฉพาะ partial fields (id, ticketNumber, status, isResolutionIndicated) ทำให้ฟิลด์อื่นๆ ทั้งหมด (Summary, Description, Category, Priority, CreatedAt) กลายเป็น undefined ส่งผลให้หน้าจอข้อมูลตั๋วหายเกลี้ยงทันทีที่กดยืนยัน
    > >    * วิธีแก้: ให้ทำ State Merge กับข้อมูลเดิม:
    > >      setTicket((prev) => (prev ? { ...prev, ...res.ticket } : res.ticket));
    > > 2. แก้ไขแท็บ Attachments หมุนค้างในหน้าตั๋วของ User ที่ล็อกอิน (AttachmentSection.tsx):
    > >    
    > >    * ใน client/src/components/AttachmentSection.tsx ยังไม่ได้เชื่อมต่อกับ AuthContext ยังคงใช้เฉพาะ const { selectedRequester } = useRequester();
    > >    * เมื่อล็อกอินด้วย User จริงใน Lab 3 ค่า selectedRequester จะเป็น null ทำให้:
- **Evidence:** [PR #60 Review Conversation](https://github.com/chanya06/toktickit/pull/60)

---

#### PR #61 — feat: IT Staff ticket queue retrieval and query engine (#50)

- **Pull Request:** [#61](https://github.com/chanya06/toktickit/pull/61)
- **Branch:** `feature/22-staff-queue-api`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (APPROVED - 2026-09-17):**
    > ### Peer Review Verdict: APPROVED (PR #61 — Issue 22 / Issue #50)
    > 
    > ตรวจเช็คโค้ดของ Issue 22 (GitHub Issue #50: IT Staff Ticket Queue Retrieval & Query Engine) อย่างละเอียดทุกส่วนเรียบร้อยแล้ว:
    > 
    > 1. **Security & Role Protection**:
    >    - บังคับใช้ `requireAuth`, `requirePasswordChanged` และ `requireRole(Role.IT_STAFF, Role.ADMINISTRATOR)` ป้องกัน Requester และดักจับ Session ได้ถูกต้องสมบูรณ์
    > 
    > 2. **Query Engine & Data Integrity**:
    >    - ค้นหา Substring บน `ticketNumber` และ `summary` แบบ Case-insensitive
    >    - ฟิลเตอร์รองรับทั้ง Single และ Multi-value บน `category`, `status`, และ `itPriority`
    >    - ตัวกรอง `ownerId` จัดการเงื่อนไข `unassigned` (`ownerId: null`), `me` (`ownerId: req.user.id`), Specific ID และ `all` ได้ถูกต้อง
    >    - `attachmentCount` นับเฉพาะไฟล์แนบที่ `{ isRemoved: false }` ตรงตามสเปก
    > 
    > 3. **Sorting & Pagination Compatibility**:
    >    - ป้องกัน Injection ด้วย `ALLOWED_SORT_FIELDS`
    >    - คืนค่า Pagination ทั้งแบบ `page`/`limit` และ `currentPage`/`pageSize` พร้อมสำหรับการต่อ Component ใน Issue 23 ทันที
    > 
    > 4. **Test Suite Completeness**:
    >    - `server/tests/lab-03/staff-queue.api.test.ts` ผ่านครบทั้ง 14 Scenarios ครอบคลุมทุกเงื่อนไขการทำงาน พร้อมมี `afterAll` Teardown ข้อมูลทดสอบสะอาดเรียบร้อย
    > 
    > โค้ดมีความรัดกุมและพร้อมสำหรับการเชื่อมต่อ UI ใน Issue 23 สามารถ Merge เข้าสู่ `lab3-staging` ได้เลย
    > 
- **Partner Response and Follow-up Actions:**
    > > ### Peer Review Verdict: APPROVED (PR #61 — Issue 22 / Issue #50)
    > > ตรวจเช็คโค้ดของ Issue 22 (GitHub Issue #50: IT Staff Ticket Queue Retrieval & Query Engine) อย่างละเอียดทุกส่วนเรียบร้อยแล้ว:
    > > 
    > > 1. **Security & Role Protection**:
    > >    
    > >    * บังคับใช้ `requireAuth`, `requirePasswordChanged` และ `requireRole(Role.IT_STAFF, Role.ADMINISTRATOR)` ป้องกัน Requester และดักจับ Session ได้ถูกต้องสมบูรณ์
    > > 2. **Query Engine & Data Integrity**:
    > >    
    > >    * ค้นหา Substring บน `ticketNumber` และ `summary` แบบ Case-insensitive
    > >    * ฟิลเตอร์รองรับทั้ง Single และ Multi-value บน `category`, `status`, และ `itPriority`
    > >    * ตัวกรอง `ownerId` จัดการเงื่อนไข `unassigned` (`ownerId: null`), `me` (`ownerId: req.user.id`), Specific ID และ `all` ได้ถูกต้อง
    > >    * `attachmentCount` นับเฉพาะไฟล์แนบที่ `{ isRemoved: false }` ตรงตามสเปก
    > > 3. **Sorting & Pagination Compatibility**:
    > >    
    > >    * ป้องกัน Injection ด้วย `ALLOWED_SORT_FIELDS`
    > >    * คืนค่า Pagination ทั้งแบบ `page`/`limit` และ `currentPage`/`pageSize` พร้อมสำหรับการต่อ Component ใน Issue 23 ทันที
    > > 4. **Test Suite Completeness**:
    > >    
    > >    * `server/tests/lab-03/staff-queue.api.test.ts` ผ่านครบทั้ง 14 Scenarios ครอบคลุมทุกเงื่อนไขการทำงาน พร้อมมี `afterAll` Teardown ข้อมูลทดสอบสะอาดเรียบร้อย
    > > 
- **Evidence:** [PR #61 Review Conversation](https://github.com/chanya06/toktickit/pull/61)

---

#### PR #62 — feat(staff): implement IT Staff ticket queue UI and filters

- **Pull Request:** [#62](https://github.com/chanya06/toktickit/pull/62)
- **Branch:** `feature/23-staff-queue-ui`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (COMMENTED - 2026-09-17):**
    > ### ข้อเสนอแนะเพิ่มเติมสำหรับ PR #62 (Staff Ticket Queue UI)
    > 
    > ตรวจเช็คเทียบกับ `ui-spec.md` และการใช้งานจริงอย่าง��ะเอียดอีกครั้ง พบจุดที่อยากให้ช่วยปรับปรุงเพิ่มเติมอีกเล็กน้อยเพื่อความสมบูรณ์ตามสเปกของอาจารย์:
    > 
    > 1. **เพิ่มคอลัมน์ `Requested Priority` ในตาราง Desktop (`StaffTicketQueue.tsx`)**:
    >    - ตามสเปก Screen 3 ของ `ui-spec.md` กำหนดให้ตารางแสดงทั้ง `Requested Priority` (ที่ผู้ใช้ขอมา) ควบคู่กับ `IT Priority` (ที่ IT ประเมิน)
    >    - ปัจจุบันในตารางมีเฉพาะ `IT Priority` รบกวนเพิ่มคอลัมน์ `Requested Priority` พร้อม Badge เข้าไปในตารางด้วย
    > 
    > 2. **รีเซ็ตหน้ากลับไปหน้า 1 เมื่อเปลี่ยนการ Sort (`StaffTicketQueue.tsx`)**:
    >    - ที่ Dropdown `queueSortBy` และปุ่มสลับลูกศร `queueSortDir` รบกวนเพิ่ม `setPage(1)` ด้วยเช่นกัน เพราะถ้าเปิดดูค้างอยู่ที่หน้า 2 หรือ 3 แล้วกดเปลี่ยนการจัดเรียง ลิสต์ควรเริ่มต้นแสดงผลจากหน้าแรก
    > 
    > 3. **ปรับสี Row Hover Highlight ให้ตรงตาม Zen Green Token**:
    >    - ตามสเปกระบุให้แถวตารางเวลาเอาเมาส์ชี้เปลี่ยนเป็นสี `#EAF6EF` (Pale Highlight) รบกวนเพิ่มสไตล์ hover บนแถวตารางให้ตรงตามโทเคน
    > 
    > 4. **ปรับเกลี่ยความกว้างคอลัมน์ (Width %) ให้รวมกันได้ 100%**:
    >    - ตอนนี้ width รวมใน `<th>` เกินไปที่ 110% เมื่อเพิ่มคอลัมน์ Requested Priority แล้ว ให้ช่วยเกลี่ยสัดส่วนเปอร์เซ็นต์ให้ลงตัวพอดี 100%
    > 
  - **Round 2 (APPROVED - 2026-09-17):**
    > ## Peer Review: Approved (PR #62 - IT Staff Ticket Queue UI)
    > 
    > ได้ตรวจสอบการแก้ไขเพิ่มเติมตาม commit `6ecd380` เทียบกับ Requirement ของ Issue #51 (Task 23), Handout Section 4 และ `ui-spec.md` (Screen 3: IT Staff Ticket Queue) อย่างละเอียดอีกครั้ง:
    > 
    > ### ผลการตรวจสอบจุดปรับปรุงเพิ่มเติม:
    > 1. **Requested Priority Column & Badges:**
    >    - เพิ่มคอลัมน์ `Req. Priority` บนตาราง Desktop เรียบร้อย แสดง Badge ตรงตามระดับความสำคัญ (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
    >    - ใน Mobile Card View มีการแสดง Badge ทั้งส่วนของ `Req:` และ `IT:` สอดคล้องกันอย่างชัดเจน
    > 2. **Pagination Reset on Sort Change:**
    >    - การเปลี่ยนตัวเลือกใน `queue-sort-by` และการคลิกสลับทิศทางใน `queue-sort-dir` มีการเรียก `setPage(1)` ช่วยป้องกันข้อผิดพลาดกรณีค้างอยู่ที่หน้าถัดไปแล้วจัดเรียงใหม่
    > 3. **Zen Green Row Hover Token (`#EAF6EF`):**
    >    - กำหนดสไตล์ Hover ให้ตารางด้วย Pale Highlight Token `#EAF6EF` ทั���งใน `client/src/index.css` และ scoped class `.staff-queue-table` แสดงผลถูกต้องตาม Zen Design System
    > 4. **Table Column Width Distribution:**
    >    - เกลี่ยความกว้างของคอลัมน์ทั้ง 9 คอลัมน์ (13%, 11%, 22%, 11%, 9%, 9%, 10%, 9%, 6%) รวมกันได้ 100% พอดี ไม่ล้นกรอบตาราง
    > 5. **Test Coverage & Verification:**
    >    - เพิ่มเคสทดสอบใน `client/tests/lab-03/StaffTicketQueue.test.tsx` ครอบคลุมการแสดงผลคอลัมน์ใหม่และการรีเซ็ตหน้าเมื่อเปลี่ยน Sort อย่างครบถ้วน
- **Partner Response and Follow-up Actions:**
    > > ### ข้อเสนอแนะเพิ่มเติมสำหรับ PR #62 (Staff Ticket Queue UI)
    > > ตรวจเช็คเทียบกับ `ui-spec.md` และการใช้งานจริงอย่างละเอียดอีกครั้ง พบจุดที่อยากให้ช่วยปรับปรุงเพิ่มเติมอีกเล็กน้อยเพื่อความสมบูรณ์ตามสเปกของอาจารย์:
    > > 
    > > 1. **เพิ่มคอลัมน์ `Requested Priority` ในตาราง Desktop (`StaffTicketQueue.tsx`)**:
    > >    
    > >    * ตามสเปก Screen 3 ของ `ui-spec.md` กำหนดให้ตารางแสดงทั้ง `Requested Priority` (ที่ผู้ใช้ขอมา) ควบคู่กับ `IT Priority` (ที่ IT ประเมิน)
    > >    * ปัจจุบันในตารางมีเฉพาะ `IT Priority` รบกวนเพิ่มคอลัมน์ `Requested Priority` พร้อม Badge เข้าไปในตารางด้วย
    > > 2. **รีเซ็ตหน้ากลับไปหน้า 1 เมื่อเปลี่ยนการ Sort (`StaffTicketQueue.tsx`)**:
    > >    
    > >    * ที่ Dropdown `queueSortBy` และปุ่มสลับลูกศร `queueSortDir` รบกวนเพิ่ม `setPage(1)` ด้วยเช่นกัน เพราะถ้าเปิดดูค้างอยู่ที่หน้า 2 หรือ 3 แล้วกดเปลี่ยนการจัดเรียง ลิสต์ควรเริ่มต้นแสดงผลจากหน้าแรก
    > > 3. **ปรับสี Row Hover Highlight ให้ตรงตาม Zen Green Token**:
    > >    
    > >    * ตามสเปกระบุให้แถวตารางเวลาเอาเมาส์ชี้เปลี่ยนเป็นสี `#EAF6EF` (Pale Highlight) รบกวนเพิ่มสไตล์ hover บนแถวตารางให้ตรงตามโทเคน
    > > 4. **ปรับเกลี่ยความกว้างคอลัมน์ (Width %) ให้รวมกันได้ 100%**:
    > >    
    > >    * ตอนนี้ width รวมใน `<th>` เกินไปที่ 110% เมื่อเพิ่มคอลัมน์ Requested Priority แล้ว ให้ช่วยเกลี่ยสัดส่วนเปอร์เซ็นต์ให้ลงตัวพอดี 100%
    > 
    > ขอบคุณสำหรับกา���ตรวจทานอย่างละเอียด ได้ดำเนินการปรับปรุงแก้ไขครบทั้ง 4 ข้อเรียบร้อยแล้วใน commit `6ecd380`:
    > 
    > 1. **เพิ่มคอลัมน์ Requested Priority ในตาราง Desktop และ Mobile Cards (`client/src/components/StaffTicketQueue.tsx`)**:
- **Evidence:** [PR #62 Review Conversation](https://github.com/chanya06/toktickit/pull/62)

---

#### PR #63 — feat(staff): IT Staff ticket operations and status matrix (#52)

- **Pull Request:** [#63](https://github.com/chanya06/toktickit/pull/63)
- **Branch:** `feature/24-staff-operations`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (CHANGES_REQUESTED - 2026-09-17):**
    > ### Peer Review for PR #63: Changes Requested (IT Staff Ticket Operations & Status Matrix)
    > 
    > ได้ตรวจสอบการทำงานของ PR #63 (Issue #52 / Task 24) ทั้ง Backend API, Frontend Operations Panel ��ละชุดทดสอบทั้งหมดอย่างละเอียดเทียบกับ Handout Section 4, `specification.md` (BR-10 ถึง BR-14), `api-spec.md` (Section 2) และ `ui-spec.md` (Screen 4)
    > 
    > การวางโครงสร้างระบบ Claim, Assign, IT Priority และ Status Transition ทำได้ดีมากและมีชุดทดสอบครอบคลุม แต่พบจุดบกพร่องที่ต้องปรับปรุงแก้ไข 4 จุดดังนี้:
    > 
    > 1. **เพิ่มสถานะ `REOPENED` ใน Status Transition Matrix (สำคัญมาก):**
    >    - ปัจจุบันใน `PERMITTED_STATUS_TRANSITIONS` (`server/src/routes/staff.ts`) และ `PERMITTED_NEXT_STATUSES` (`client/src/components/TicketDetailView.tsx`) ยังไม่มี Key `[TicketStatus.REOPENED]`
    >    - ส่งผลให้เมื่อตั๋วถูก Reopen แล้ว ตัวเลือกสถานะถัดไปจะว่างเปล่า Dropdown ถูก Disable และ API ปฏิเสธด้วย 422 กลายเป็น Dead-end status
    >    - รบกวนเพิ่ม Key `REOPENED` ทั้งฝั่ง Backend และ Frontend เช่น:
    >      ```ts
    >      [TicketStatus.REOPENED]: [
    >        TicketStatus.IN_PROGRESS,
    >        TicketStatus.RESOLVED,
    >        TicketStatus.CANCELLED,
    >      ],
    >      ```
    > 
    > 2. **อัปเดต `getStatusBadgeClass` ใน `TicketDetailView.tsx` ให้ครบ 8 สถานะ:**
    >    - ปัจจุบันขาดสถานะ `WAITING_FOR_REQUESTER`, `REOPENED` และ `CANCELLED` ทำให้ตกไปเป็นสีเทา (`badge bg-secondary`) ทั้งหมด
    >    - รบกวนปรับปรุงให้ครอบคลุมครบถ้วนและใช้สีตาม Zen Design Tokens
    > 
    > 3. **ปรับข้อความปุ่ม Back ด้านล่าง (`TicketDetailView.tsx` บรรทัดที่ 729):**
    >    - ปุ่มด้านล่างสุดยัง Hardcoded เป็น `&laquo; Back to My Tickets List`
    >    - รบกวนปรับให้เปลี่ยนตาม Role เช่นเดียวกับปุ่มด้านบน:
    >      ```tsx
    >      &laquo; {isStaffOrAdmin ? "Back to Ticket Queue" : "Back to My Tickets List"}
    >      ```
    > 
    > 4. **เพิ่ม `AbortSignal` ใน `fetchStaffAssignees` (`TicketDetailView.tsx`):**
    >    - รบกวนส่ง `AbortController.signal` เข้าไปใน `fetchStaffAssignees()` เพื่อป้องกั��ปัญหาตอน Component Unmount
    > 
    > รบกวนช่วยแก้ไขจุดดังกล่าวเพิ่มเติม แล้วแจ้งอีกครั้งเพื่อตรวจสอบและ Approve เข้า `lab3-staging`
    > 
  - **Round 2 (APPROVED - 2026-09-17):**
    > ## Peer Review Update: Approved  (PR #63 - IT Staff Ticket Operations & Status Matrix)
    > 
    > ได้ตรวจสอบ commit `6accf01` ที่แก้ไขตามข้อเสนอแนะครบทั้ง 4 จุดเรียบร้อย:
    > 
    > 1. **REOPENED Status Transition Matrix** — เพิ่ม Key `[REOPENED]: [IN_PROGRESS, RESOLVED, CANCELLED]` ครบทั้ง Backend (`staff.ts`) และ Frontend (`TicketDetailView.tsx`) พร้อมอัปเดต BR-14 ใน `specification.md` และมีชุดทดสอบครอบคลุมทั้ง 3 เส้นทาง
    > 2. **Status Badge ครบ 8 สถานะ** — เพิ่มฟังก์ชัน `getStatusBadgeStyle()` ใช้ inline style สีตรงตาม Zen Design Tokens ใน `ui-spec.md` ครบถ้วน (`WAITING_FOR_REQUESTER`, `REOPENED`, `CANCELLED` ไม่ตกหล่นอีกต่อไป)
    > 3. **ปุ่ม Back ด้านล่าง** — ปรับเป็น Role-Aware Text สอดคล้องกับปุ่มด้านบนและ Breadcrumbs แล้ว มี Test ยืนยันทั้ง Staff และ Requester
    > 4. **AbortSignal ใน fetchStaffAssignees** — ใช้ `AbortController` พร้อม cleanup function ป้องกัน Memory Leak / Unmounted Component Warning อย่างถูกต้อง
- **Partner Response and Follow-up Actions:**
    > > ### Peer Review for PR #63: Changes Requested (IT Staff Ticket Operations & Status Matrix)
    > > ได้ตรวจสอบการทำงานของ PR #63 (Issue #52 / Task 24) ทั้ง Backend API, Frontend Operations Panel และชุดทดสอบทั้งหมดอย่างละเอียดเทียบกับ Handout Section 4, `specification.md` (BR-10 ถึง BR-14), `api-spec.md` (Section 2) และ `ui-spec.md` (Screen 4)
    > > 
    > > การวางโครงสร้างระบบ Claim, Assign, IT Priority และ Status Transition ทำได้ดีมากและมีชุดทดสอบครอบคลุม แต่พบจุดบกพร่องที่ต้องปรับปรุงแก้ไข 4 จุดดังนี้:
    > > 
    > > 1. **เพิ่มสถานะ `REOPENED` ใน Status Transition Matrix (สำคัญมาก):**
    > >    
    > >    * ปัจจุบันใน `PERMITTED_STATUS_TRANSITIONS` (`server/src/routes/staff.ts`) และ `PERMITTED_NEXT_STATUSES` (`client/src/components/TicketDetailView.tsx`) ยังไม่มี Key `[TicketStatus.REOPENED]`
    > >    * ส่งผลให้เมื่อตั๋วถูก Reopen แล้ว ตัวเลือกสถานะถัดไปจะว��างเปล่า Dropdown ถูก Disable และ API ปฏิเสธด้วย 422 กลายเป็น Dead-end status
    > >    * รบกวนเพิ่ม Key `REOPENED` ทั้งฝั่ง Backend และ Frontend เช่น:
    > >      ```ts
    > >      [TicketStatus.REOPENED]: [
    > >        TicketStatus.IN_PROGRESS,
    > >        TicketStatus.RESOLVED,
    > >        TicketStatus.CANCELLED,
    > >      ],
    > >      ```
    > > 2. **อัปเดต `getStatusBadgeClass` ใน `TicketDetailView.tsx` ให้ครบ 8 สถานะ:**
    > >    
    > >    * ปัจจุบันขาดสถานะ `WAITING_FOR_REQUESTER`, `REOPENED` และ `CANCELLED` ทำให้ตกไปเป็นสีเทา (`badge bg-secondary`) ทั้งหมด
- **Evidence:** [PR #63 Review Conversation](https://github.com/chanya06/toktickit/pull/63)

---

#### PR #64 — feat(comments): public comments and private internal notes (#53)

- **Pull Request:** [#64](https://github.com/chanya06/toktickit/pull/64)
- **Branch:** `feature/25-comments-and-notes`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (CHANGES_REQUESTED - 2026-09-17):**
    > ### ผลการตรวจสอบ PR #64: REQUEST CHANGES / RECOMMEND IMPROVEMENTS
    > 
    > ภาพรวมของฟังก์ชันหลัก ระบบความปลอดภัย การจำกัดสิทธ���์ตามบทบาท (RBAC) และ Business Rules ทำงานได้ถูกต้องครบถ้วนตามข้อกำหนด Lab-03 แต่พบจุดบกพร่องด้าน UX และ State ในหน้าบ้านที่ควรพิจารณาแก้ไขก่อนทำการ Merge:
    > 
    > #### ประเด็นที่ควรปรับปรุง (Issues to Address):
    > 1. **ตัวเลข Badge บนแท็บแสดงเป็น (0) เสมอตอนเข้าหน้ารายละเอียดตั๋ว**:
    >    - เนื่องจากแท็บเปิดมาที่ Attachments เป็นค่าเริ่มต้น และใช้ Conditional Rendering ทำให้แท็บ Public Comments และ Internal Notes ยังไม่ถูก Mount ตัวนับ Badge จึงค้างอยู่ที่ `0` ตลอดเวลาจนกว่าผู้ใช้จะคลิกเข้าไป
    >    - ข้อเสีย: ทำให้ผู้ใช้หรือ Staff เข้าใจผิดว่าไม่มีข้อความหรือบันทึกภายในอยู่เลย
    >    - แนะนำ: ทำ Prefetch ข้อมูลนับจำนว���ตั้งแต่ Mount หน้ารายละเอียด หรือย้ายการเรียก API ไปไว้ใน Hook ระดับบน
    > 
    > 2. **ข้อความที่กำลังพิมพ์หลุดหายเมื่อสลับแท็บ (Draft State Loss)**:
    >    - การสลับแท็บไปดูรูปภาพแนบหรือดูข้อมูลอื่นจะทำให้ `CommentsSection` / `InternalNotesSection` ถูก Unmount ส่งผลให้ข้อความที่กำลังพิมพ์อยู่ใน Textarea หายไปทันที
    >    - แนะนำ: ใช้การซ่อนแสดงด้วย `style={{ display: activeTab === '...' ? 'block' : 'none' }}` หรือยก State ของข้อความขึ้นมาเก็บที่ Parent
    > 
    > 3. **ลำดับแท็บกับแท็บเริ่มต้นไม่สอดคล้องกัน**:
    >    - แท็บแรกคือ Public Comments แต่ระบบตั้งค่าเริ่มต้นให้เปิดที่ Attachments (แท็บที่ 3) ควรพิจารณาตั้งค่าเริ่มต้นให้เปิดที่แท็บแรก หรือจัดลำดับให้สอดคล้องกัน
    > 
    > 4. **การนำ Middleware กลับมาใช้ซ้ำใน Backend (server/src/routes/comments.ts)**:
    >    - ปัจจุบันมีการเขียน `if (!req.user)` และ `if (req.user.mustChangePassword)` เองในทุก Endpoint ควรเปลี่ยนมาใช้ `requireAuth` และ `requirePasswordChanged` จาก `auth.ts` เพื่อความกระชับและเป็นมาตรฐานเดียวกัน
    > 
    > #### จุดที่ทำได้ดีมาก:
    > - ระบบสิทธิ์ Internal Notes ปิดกั้น Requester ทั้งหมดด้วย 403 Forbidden และซ่อนแท็บในหน้าบ้านได้ถูกต้อง
    > - Auto-transition สถานะตั๋วจาก WAITING_FOR_REQUESTER เป็น IN_PROGRESS ทำงานผ่าน Prisma $transaction แบบ Atomic ได้อย่างสมบูรณ์
    > - การตรวจสอบความยาวข้อความ 2 ถึง 2000 ตัวอักษรทำได้รัดกุมทั้งหน้าบ้านและหลังบ้าน
    > 
  - **Round 2 (APPROVED - 2026-09-17):**
    > ### ผลการรีวิว PR #64 (การตรวจสอบขั้นสุดท้าย): APPROVED
    > 
    > ตรวจสอบโค้ดทั้งหมดใน PR #64 อย่างละเอียดครบถ้วนทุกมิติ:
    > 
    > 1. ด้านความปลอดภัยและการจำกัดสิทธิ์ (Security & RBAC):
    >    - Internal Notes ได้รับการป้องกันอย่างรัดกุมผ่าน requireRole(IT_STAFF, ADMINISTRATOR) ที่ระดับ Middleware และซ่อนจาก DOM ของ Requester อย่างเด็ดขาด
    >    - Public Comments มีการแยกสิทธิ์ Requester ให้เข้าถึงได้เฉพาะตั๋วของตนเอง ป้องกัน IDOR ได้อย่างสมบูรณ์
    >    - ไม่มีการเปิดเผยข้อมูล passwordHash ในผลลัพธ์การ Query ของผู้เขียน
    > 
    > 2. กฎทางธุรกิจและการทำงานของระบบ (Business Rules):
    >    - BR-14: การเปลี่ยนสถานะตั���วจาก WAITING_FOR_REQUESTER เป็น IN_PROGRESS ทำงานร่วมกับการสร้าง Public Comment ผ่าน Prisma $transaction แบบ Atomic ข้อมูลถูกต้องสอดคล้องกัน
    >    - BR-17: รักษาความถูกต้องของข้อมูลแบบ Append-only ปฏิเสธคำขอแก้ไขและลบ
    >    - BR-18: มีการตรวจสอบความยาวข้อความ 2 ถึง 2000 ตัวอักษรอย่างรัดกุมทั้งหน้าบ้านและหลังบ้าน
    > 
    > 3. ส่วนติดต่อผู้ใช้และประสิทธิภาพ (UI/UX & State):
    >    - ออกแบบตรงตาม UI Spec Screen 4 ด้วยแถบสีอำพัน Amber สำหรับ Internal Notes
    >    - แก้ไขปัญหาตัวเลข Badge ด้วยการแสดงผลแบบ Persistent Display ทำให้ระบบดึงข้อมูลมาแสดงผลตัวเลขจริงบนแท็บได้ทันทีตั้งแต่เปิดหน้า
    >    - ป้องกันการสูญหายของข้อความร่างที่พิมพ์ค้างไว้เมื่อมีการสลับแท็บ
    >    - ลำดับแท็บเริ่มต้นเปิดที่ Public Comments สอดคล้องกับแถบนำทาง
    > 
    > 4. ชุดทดสอบ (Automated Tests):
    >    - มีชุดทดสอบครอบคลุมทั้ง API Integration Tests และ Client Unit Tests ผ่านการทดสอบทั้งหมดโดยไม่มีข้อผิดพลาด
    > 
    > สรุป: โค้ดมีความถูกต้อง สมบูรณ์ และพร้อมสำหรับการ Merge เข้าสู่กิ่ง lab3-staging
- **Partner Response and Follow-up Actions:**
    > ### Response to Code Review (Commit `071dbbc`)
    > 
    > Thank you for the thorough review and constructive feedback! All 4 reported issues have been addressed and validated with automated tests:
    > 
    > 1. **Badge Counts Prefetch on Mount (`TicketDetailView.tsx`)**:
    >    - Tab sections (`CommentsSection`, `InternalNotesSection`, and `AttachmentSection`) are now kept mounted and toggled via `style={{ display: activeTab === '...' ? 'block' : 'none' }}`.
    >    - Both comments and internal notes counts are fetched and populated immediately upon loading the ticket details without requiring the user to switch tabs first.
    >    - Role security is strictly maintained: `InternalNotesSection` is only mounted when `isStaffOrAdmin === true`, ensuring Requesters cannot mount the component or trigger notes API calls.
    > 
    > 2. **Draft State Preservation Across Tab Switching (`TicketDetailView.tsx`)**:
    >    - Because the sections are toggled using `display` styling rather than conditional unmounting, drafts in both the comment textarea and the internal note textarea are fully preserved when switching between tabs (e.g., to review attachments).
    > 
    > 3. **Tab Ordering and Default Active Tab Alignment (`TicketDetailView.tsx`)**:
    >    - Aligned the initial `activeTab` state to `"comments"` so that the view opens directly on the first tab in the navigation bar.
    > 
    > 4. **Reusable Middleware Adoption in Backend (`server/src/routes/comments.ts`)**:
    >    - Refactored `GET /:id/comments`, `POST /:id/comments`, `GET /:id/notes`, and `POST /:id/notes` to use `requireAuth`, `requirePasswordChanged`, and `requireRole(Role.IT_STAFF, Role.ADMINISTRATOR)` middlewares from `server/src/middleware/auth.ts`.
    >    - Removed duplicate manual `if (!req.user)` and `if (req.user.mustChangePassword)` checks across all handlers while keeping base ticket endpoints unintercepted.
    > 
    > 5. **Automated Test Coverage**:
- **Evidence:** [PR #64 Review Conversation](https://github.com/chanya06/toktickit/pull/64)

---

#### PR #65 — feat(admin): administrator user management & safety validations (#54)

- **Pull Request:** [#65](https://github.com/chanya06/toktickit/pull/65)
- **Branch:** `feature/26-admin-user-management`
- **What I Reviewed & Feedback Given:**
  - **Round 1 (CHANGES_REQUESTED - 2026-09-18):**
    > ### ผลการรีวิว PR #65: REQUEST CHANGES / RECOMMEND IMPROVEMENTS
    > 
    > ระบบความปลอดภัย การควบคุมสิทธิ์ Router-level RBAC และ Safety Rules (BR-07, BR-08, BR-09) ทำงานได้ถูกต้องและรัดกุมมาก แต่จากการตรวจสอบความเข้ากันได้ของข้อมูลอย่างละเอียด พบจุดที่ควรปรับปรุงแก้ไขก่อนทำการ Merge ดังนี้:
    > 
    > #### ประเด็นที่ต้องปรับปรุงแก้ไข:
    > 1. **ความไม่สอดคล้องของฟิลด์ชื่อในโมเดล User (`name` vs `fullName`)**:
    >    - ใน Prisma schema มีทั้ง `fullName String` และ `name String?` (เพื่อความเข้ากันได้ย้อนหลังกับโค้ด Lab 2)
    >    - ปัจจุบันใน `POST /api/admin/users` และ `PATCH /api/admin/users/:id` มีการบันทึกเฉพาะ `fullName` แต่ปล่อยให้ `name` เป็น `null`
    >    - แนะนำ: ให้กำหนด `name: trimmedName` ควบคู่กับ `fullName: trimmedName` ทั้งในคำสั่ง `prisma.user.create` และ `prisma.user.update` เพื่อให้ข้อมูลชื่อครบถ้วนทั้งสองฟิลด์เหมือนใน `seed.ts`
    > 
    > 2. **การรองรับฟิลด์แผนก (`department`)**:
    >    - ในโมเดล `User` มีฟิลด์ `department String?` และหน้าบ้านมีการแสดงผลแผนกของผู้ใช้
    >    - ปัจจุบันใน `SAFE_USER_SELECT` และ Endpoint การสร้าง/แก้ไขผู้ใช้ยังไม่ได้อ่านค่าหรือส่งคืนฟิลด์ `department`
    >    - แนะนำ: เพิ่มฟิลด์ `department?: string | null` ใน `CreateAdminUserPayload`, `UpdateAdminUserPayload`, `AdminUserResponse` และใน `SAFE_USER_SELECT` พร้อมทั้งบันทึกลงฐานข้อมูล
    > 
    > 3. **เอกสารสารบัญไฟล์ทดสอบ (`docs/lab-03/tests.md`)**:
    >    - ในตารางที่ 1 มีการแมป `API-10..13` ไปที่ `users-admin.api.test.ts` แล้ว แต่ในหัวข้อที่ 2 `Test Suite File Map` ยังขาดรายการของ `users-admin.api.test.ts`
    >    - แนะนำ: เพิ่มบรรทัดอธิบายไฟล์ `users-admin.api.test.ts` ใต้หัวข้อ `### Backend Integration & Security Tests`
    > 
    > #### จุดเด่นที่ทำได้ถูกต้องสมบูรณ์แล้ว:
    > - Router-level middlewares (`requireAuth`, `requirePasswordChanged`, `requireRole`) ครอบคลุม ปลอดภัยสูง
    > - Safety Rules สำหรับการป้องกัน Self-deactivation (422) และการป้องกัน Deactivation/Demotion แอดมินคนสุดท้าย (422) ทำงานถูกต้องทุกสถานการณ์
    > - มีการจำกัดเพดาน Pagination สูงสุด 100 รายการ ป้องกัน DoS
    > - อีเมลถูกแปลงเป็นตัวพิมพ์เล็กเพื่อความไม่ซ้ำ���ันแบบ Case-insensitive
    > - รหัสผ่านได้รับการตรวจสอบความยากและแฮชด้วย bcrypt (10 rounds) โดยไม่ส่ง `passwordHash` ออกไปใน Response
    > 
  - **Round 2 (APPROVED - 2026-09-18):**
    > ### ผลการรีวิว PR #65 (รอบอนุมัติขั้นสุดท้าย): APPROVED
    > 
    > ตรวจสอบการแก้ไขใน commit `20a5a0d` อย่างละเอียดครบถ้วนทุกบรรทัด โค้ดมีความถูกต้อง สมบูรณ์ และได้มาตรฐานตามข้อกำหนดของ Lab-03 ทุกประการ:
    > 
    > 1. **การซิงโครไนซ์ฟิลด์ name และ fullName**:
    >    - บันทึกและอัปเดตทั้ง `fullName: trimmedName` และ `name: trimmedName` ในคำสั่งสร้าง (POST) และแก้ไข (PATCH)
    >    - รวม `name: true` ใน `SAFE_USER_SELECT` และเพิ่มใน `ALLOWED_SORT_FIELDS` เพื่อความเข้ากัน���ด้ย้อนหลังกับโค้ด Lab 2 อย่างสมบูรณ์
    > 
    > 2. **การรองรับฟิลด์แผนก (department)**:
    >    - ตรวจสอบและบันทึกฟิลด์ `department` ลงฐานข้อมูล โดยตัดช่องว่างและบันทึกเป็น `null` หากเป็นค่าว่าง
    >    - รองรับการอัปเดตหรือส่ง `null` มาเพื่อล้างค่าแผนกในคำสั่ง PATCH
    >    - อัปเดต TypeScript Interface ใน `client/src/api.ts` ให้ตรงกันครบถ้วน
    > 
    > 3. **ความปลอดภัยและ Safety Rules**:
    >    - Router-level RBAC (`requireAuth`, `requirePasswordChanged`, `requireRole(Role.ADMINISTRATOR)`) ครอบคลุมทุก Endpoint อย่างรัดกุม
    >    - ป้องกันการปิดใช้งานบัญชีตนเอง (422 Unprocessable Entity)
    >    - ป้องกันการปิดใช้งานหรือลดขั้นบทบาทแอดมินที่ใช้งานอยู่คนสุดท้าย (422 Unprocessable Entity)
    >    - ป้องกัน Email Conflict เมื่อแอดม��นกดบันทึกโดยไม่เปลี่ยนอีเมลผ่านเงื่อนไข `NOT: { id: targetId }`
    > 
    > 4. **ชุดทดสอบและเอกสาร**:
    >    - ชุดทดสอบใน `users-admin.api.test.ts` มีการตรวจสอบค่าจริงในฐานข้อมูลผ่าน `prisma.user.findUniqueOrThrow` สำหรับฟิลด์ `name`, `fullName`, และ `department` ครบทั้ง Flow สร้างและแก้ไข
    >    - อัปเดตสารบัญไฟล์ทดสอบใน `docs/lab-03/tests.md` และบันทึกประวัติการรีวิวใน `docs/lab-03/reviewer.md` ครบถ้วน
    > 
    > โค้ดผ่านการตรวจสอบทั้งหมดอย่างสมบูรณ์แบบ สามารถทำการ Merge เข้าสู่กิ่ง lab3-staging ได้ทันที
    > 
  - **Round 3 (APPROVED - 2026-09-18):**
    > ### Peer Review: Approved (PR #65)
    > 
    > ตรวจทานโค้ดและเอกสารที่ปรับปรุงเพิ่มเติมใน commit `20a5a0d` เรียบร้อยแล้ว ครบถ้วนและสมบูรณ์แบบมาก:
    > 
    > 1. **การซิงโครไนซ์ฟิลด์ `name` และ `fullName`**: ดำเนินการผูกค่าคู่ขนานทั้งใน `create` และ `update` ครบถ้วน ช่วยรักษาความเข้ากันได้ย้อนหลังกับโค้ด Lab 2 ได้อย่างสมบูรณ์แบบ
    > 2. **การรองรับฟิลด์แผนก (`department`)**: เพิ่มการอ่านค่า ตรวจสอบ และส่งคืนฟิลด์แผนกครบทั้งฝั่ง Backend และ TypeScript Interfaces ฝั่ง Frontend
    > 3. **สารบัญเอกสารการทดสอบ (`docs/lab-03/tests.md`)**: ระบุรายละเอียดของ `users-admin.api.test.ts` ชัดเจนและสอดคล้องกับตาราง Traceability Matrix
    > 4. **ชุดทดสอบและการ Build**: ตรวจสอบการทำงานของเทสต์ 149 เคสบน Server และ 99 เคสบน Client ผ่านครบ 100% พร้อมทั้งผ่านการ Build สะอาดปราศจากข้อผิดพลาด
    > 
    > งานมีคุณภาพสูง ปลอดภัย และตรงตามสเปกทุกประการ อนุมัติ (Approved) ให้ดำเนินการ Merge เข้าสู่ `lab3-staging` ได้เลย
- **Partner Response and Follow-up Actions:**
    > ### สรุปการปรับปรุงแก้ไขตามผลการรีวิว (PR #65)
    > 
    > ขอบคุณสำหรับคำแนะนำและข้อเสนอแนะที่ละเอียดและช่วยเพิ่มความสมบูรณ์ของระบบจัดการผู้ใช้ ได้ดำเนินการปรับปรุงแก้ไขครบทั้ง 3 ประเด็นใน commit `20a5a0d` เรียบร้อยแล้ว:
    > 
    > 1. **ซิงโครไนซ์ฟิลด์ `name` ควบคู่กับ `fullName` (`server/src/routes/users.ts`)**:
    >    - เพิ่มการกำหนด `name: trimmedName` ควบคู่กับ `fullName: trimmedName` ทั้งใน `prisma.user.create` (`POST /api/admin/users`) และ `prisma.user.update` (`PATCH /api/admin/users/:id`) เพื่อความเข้ากันได้แบบย้อนหลัง (Backwards Compatibility) 100% กับสคีมาและโค้ดของ Lab 2
    >    - บรรจุ `name: true` ลงใน `SAFE_USER_SELECT` และเพิ่มใน `ALLOWED_SORT_FIELDS`
    > 
    > 2. **รองรับฟิลด์แผนก `department` ครบวงจร (`server/src/routes/users.ts`, `client/src/api.ts`)**:
    >    - เพิ่ม `department: true` ใน `SAFE_USER_SELECT` และ `ALLOWED_SORT_FIELDS`
    >    - ปรับปรุง `POST /api/admin/users` ให้อ่านและตรวจสอบ `department` (optional string) แล้วบันทึกลงฐานข้อมูล
    >    - ปรับปรุง `PATCH /api/admin/users/:id` ให้รองรับการอัปเดตหรือล้างค่า `department` (string หรือ `null`)
    >    - ปรับปรุง TypeScript Interface ใน `client/src/api.ts`: เพิ่ม `department?: string | null` ใน `CreateAdminUserPayload`, `UpdateAdminUserPayload`, และ `AdminUserResponse`
    > 
    > 3. **อัปเดตสารบัญไฟล์ทดสอบ (`docs/lab-03/tests.md`)**:
    >    - เพิ่มรายการ `users-admin.api.test.ts` ในหัวข้อ `### Backend Integration & Security Tests` ใน Section 2 พร้อมระบุขอบเขตการทดสอบครอบคลุม API-10..13, name/fullName sync, department support, password reset และ safety rules
    > 
    > 4. **ชุดทดสอบและการตรวจสอบความถูกต้อง**:
    >    - อัปเดตชุดทดสอบใน `server/tests/lab-03/users-admin.api.test.ts` ทั้งในส่วนสร้างผู้ใช้ (POST) และแก้ไขผู้ใช้ (PATCH) ตรวจสอบการส่งคืนและจัดเก็บลง DB จริงของทั้ง `name`, `fullName`, และ `department`
    >    - ผลการรันเทส:
- **Evidence:** [PR #65 Review Conversation](https://github.com/chanya06/toktickit/pull/65)

---

#### Issue #55 (Issue 27) — Administrator User Management Interface & Modals

- **Issue Reference:** [Issue #55](https://github.com/chanya06/toktickit/issues/55) on `chanya06/toktickit`
- **Partner Branch:** `feature/27-admin-ui` (Pending submission)
- **Status:** In progress by author (@chanya06). Reviewer (@lmaybelgracel) is on standby to perform code review as soon as the PR is opened.
- **Review Criteria Prepared:**
  - Verify Zen Green UI styling for Admin table and action buttons.
  - Verify Add User Modal, Edit User Modal, and Reset Password Confirmation Modal.
  - Verify real-time validation, role selector, active/inactive badge styling, and client-side guards matching BR-07, BR-08, BR-09.

---

#### Issue #56 (Issue 28) — QA, Automated Tests, Screenshots, Reviewer Sync & Release Integration

- **Issue Reference:** [Issue #56](https://github.com/chanya06/toktickit/issues/56) on `chanya06/toktickit`
- **Partner Branch:** `release/lab3-integration` (Pending submission)
- **Status:** In progress by author (@chanya06). Reviewer (@lmaybelgracel) is on standby to perform final QA audit and merge verification.
- **Review Criteria Prepared:**
  - Verify complete automated test suite execution (Unit, API, Component, E2E) with 100% pass rate.
  - Verify responsive screenshots across desktop (1280px), tablet (768px), and mobile (375px, 320px).
  - Verify synchronised `reviewer.md`, documentation integrity, and clean git staging merge into `main`.

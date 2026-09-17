# Lab 3 - Peer Review Record

**Author:** Patitaya Kaewwichain 67070505220 - GitHub: [@lmaybelgracel](https://github.com/lmaybelgracel)

**Peer reviewer:** Titaya - GitHub: [@titayaaa](https://github.com/titayaaa)

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

## 2. Pull Requests I Reviewed for Partner (@titayaaa)

**Partner author:** Titaya - GitHub: [@titayaaa](https://github.com/titayaaa)

| PR | Partner Feature / Branch | My Review Verdict | Link |
|:---|:-------------------------|:------------------|:-----|
| [Pending] | [Partner Issue / Branch] | Ready to review when partner submits | [Link] |

### Partner PR Review Log
- **What I Reviewed:** [To be completed when reviewing partner's PR]
- **Partner Response and Follow-up:** [To be completed]
- **Evidence:** [Link to PR conversation]

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
| [PR #Pending] | Issue 20: IT Staff Ticket Queue / `feature/20-it-staff-ticket-queue` | Ready for Peer Review | [PR Link] |

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
- **Current Status:** Ready for Peer Review by @titayaaa.

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

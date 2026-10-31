# Lab 4 - Peer Review Record

**Author:** Patitaya Kaewwichain 67070505220 — GitHub: [@lmaybelgracel](https://github.com/lmaybelgracel)

**Peer reviewer (reviewed my PRs):** Phatthidawadi — GitHub: [@phatthidawadi](https://github.com/phatthidawadi)

**Partner I reviewed (circle review):** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

**Feature PR target:** `lab4-staging`

---

## 1. Pull Requests I Authored (Reviewed by Peer Reviewer)

| PR | Issue / Branch | Reviewer Verdict | Status | Link |
|:---|:---------------|:-----------------|:-------|:-----|
| [#69](https://github.com/lmaybelgracel/TokTickit/pull/69) | Issue 27: Sprint 4 Engineering Contract & Specifications / `feature/27-sprint4-spec-and-tests` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #69](https://github.com/lmaybelgracel/TokTickit/pull/69) |
| [#70](https://github.com/lmaybelgracel/TokTickit/pull/70) | Issue 28: Database Evolution, Actions Taken Model, Migration & Idempotent Seed Data / `feature/28-database-and-seed` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #70](https://github.com/lmaybelgracel/TokTickit/pull/70) |
| [#71](https://github.com/lmaybelgracel/TokTickit/pull/71) | Issue 29: Actions Taken Backend REST API & Authorization Guards / `feature/29-actions-taken-api` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #71](https://github.com/lmaybelgracel/TokTickit/pull/71) |
| [#72](https://github.com/lmaybelgracel/TokTickit/pull/72) | Issue 30: Actions Taken Frontend UI & Ticket Detail Integration / `feature/30-actions-taken-ui` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #72](https://github.com/lmaybelgracel/TokTickit/pull/72) |
| [#73](https://github.com/lmaybelgracel/TokTickit/pull/73) | Issue 31: Ticket Status Workflow, Resolution Gate & Concurrency Conflict Handling / `feature/31-status-workflow-and-resolution` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #73](https://github.com/lmaybelgracel/TokTickit/pull/73) |
| [#74](https://github.com/lmaybelgracel/TokTickit/pull/74) | Issue 32: Role Dashboards Backend API & Authoritative Query Engine / `feature/32-dashboards-api` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #74](https://github.com/lmaybelgracel/TokTickit/pull/74) |
| [#75](https://github.com/lmaybelgracel/TokTickit/pull/75) | Issue 33: IT Staff & Administrator Dashboard Frontend UI / `feature/33-staff-dashboard-ui` | Approved (Round 1: Changes Requested, Round 2: Changes Requested, Round 3: Approved) | Merged | [PR #75](https://github.com/lmaybelgracel/TokTickit/pull/75) |
| [#76](https://github.com/lmaybelgracel/TokTickit/pull/76) | Issue 34: Requester Dashboard Frontend UI & Regression Verification / `feature/34-requester-dashboard-ui` | Approved (Round 1: Changes Requested, Round 2: Changes Requested, Round 3: Approved) | Merged | [PR #76](https://github.com/lmaybelgracel/TokTickit/pull/76) |
| [#77](https://github.com/lmaybelgracel/TokTickit/pull/77) | Issue 35: End-to-End Automation, Responsive Visual Evidence & Accessibility Audit / `feature/35-e2e-automation-and-audit` | Approved (Round 1: Changes Requested, Round 2: Changes Requested, Round 3: Approved) | Merged | [PR #77](https://github.com/lmaybelgracel/TokTickit/pull/77) |

---

### Issue 27 - Sprint 4 Engineering Contract & Specification

- **Pull Request:** [#69](https://github.com/lmaybelgracel/TokTickit/pull/69)
- **Branch:** `feature/27-sprint4-spec-and-tests`
- **Summary:** Establishes the complete Sprint 4 specification suite under `docs/lab-04/` covering `specification.md`, `ui-spec.md`, `api-spec.md`, `tests.md`, `reviewer.md`, and `ai-use.md`. Defines parent-child Actions Taken model, dashboard calculation rules, status transition matrix, resolution gate, and AC traceability.
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-16T13:35:03Z):
  > "### ผลการตรวจประเมิน Issue 27 - Sprint 4 Engineering Contract & Specification
  > 
  > จากการตรวจสอบเอกสารอย่างละเอียดใน PR #69 (Commit `8786e8b`) ยังมีจุดบกพร่องที่ต้องขอให้แก้ไขเพิ่มเติมก่อนจึงจะสามารถอนุมัติได้ ดังนี้:
  > 
  > 1. **[docs/lab-04/api-spec.md] การใช้ชื่อฟิลด์สถานะตั๋ว (`currentStatus` vs `status`):**
  >    - ในตัวอย่าง JSON Response ของ Requester Dashboard (บรรทัด 148), Staff Queue Activity (บรรทัด 197) และ Status Transition (บรรทัด 240) ยังใช้ชื่อฟิลด์ว่า `"status"`
  >    - เนื่องจากใน Prisma Schema และคอมโพเนนต์เดิมของ Lab 2 และ 3 (`api.ts`, `TicketDetail.tsx`, `StaffTicketQueue.tsx`) ใช้งานชื่อฟิลด์ว่า `currentStatus` 
  >    - **สิ่งที่ต้องแก้:** รบกวนปรับชื่อฟิลด์ใน `api-spec.md` ให้เป็น `currentStatus` ให้ตรงกันทั้งระบบ เพื่อป้องกันไม่ให้เกิด Regression ในฝั่ง Client ครับ
  > 
  > 2. **[docs/lab-04/api-spec.md] การตรวจสอบกรณีขาด `knownUpdatedAt`:**
  >    - ในหัวข้อ 1.1 และ 4.1 มีการระบุ `409 Conflict` ชัดเจน แต่ยังไม่ได้ระบุพฤติกรรมเมื่อ Client ไม่ได้แนบ `knownUpdatedAt` มาใน Body
  >    - **สิ่งที่ต้องแก้:** ระบุให้ชัดเจนในสเปกว่า `knownUpdatedAt` เป็นฟิลด์ Mandatory หาก Client ไม่ส่งมาให้ปฏิเสธด้วย `422 Unprocessable Entity: knownUpdatedAt is required` เพื่อป้องกันการ Bypass Stale Update Check
  > 
  > 3. **[docs/lab-04/reviewer.md] สถานะการรีวิว:**
  >    - อัปเดตบันทึกข้อเสนอแนะและสถานะใน `docs/lab-04/reviewer.md` ให้สะท้อนการทำงานของ PR #69
  > 
  > **คำตัดสิน: Request Changes** — รบกวนแก้ไข 3 จุดนี้และพุชคอมมิตใหม่"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Ticket Status Field Name (`currentStatus` vs `status`):**
     - *Reviewer Feedback:* In `docs/lab-04/api-spec.md`, JSON examples for Requester Dashboard, Staff Queue Activity, and Status Transition used `status` instead of the system-wide canonical `currentStatus` used in Prisma schema and Lab 2/3 components.
     - *My Action:* Updated `docs/lab-04/api-spec.md` and `docs/lab-04/specification.md` to use `currentStatus` uniformly across all response payloads, request bodies, and calculation rules (`BR-12`, `BR-16`, `BR-17`), with backward-compatible alias parsing noted for controllers.
  2. **Comment on Missing `knownUpdatedAt` Validation:**
     - *Reviewer Feedback:* While 409 Conflict was specified for stale updates, the behavior when a client omits `knownUpdatedAt` was unspecified, allowing potential bypass of the stale check.
     - *My Action:* Explicitly specified in Section 1 and Section 4 of `docs/lab-04/api-spec.md` that `knownUpdatedAt` is a mandatory field for all ticket/action mutation payloads; omitting it returns HTTP `422 Unprocessable Entity: knownUpdatedAt is required`. Updated `specification.md` (`BR-13`, `AC-08`) and added test case `API-WORK-06` in `docs/lab-04/tests.md`.
  3. **Comment on Reviewer Record Status:**
     - *Reviewer Feedback:* Update review records and status in `docs/lab-04/reviewer.md` reflecting PR #69.
     - *My Action:* Updated `docs/lab-04/reviewer.md` with Round 1 Changes Requested verdict, verbatim quotes, and detailed responses.
- **Round 1 Verdict:** Changes Requested
- **Round 2 Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-16T14:02:32Z):
  > "### ผลการตรวจสอบรอบที่ 2 (Round 2 Peer Review Verification)
  > 
  > - **Commit ที่ตรวจสอบ:** `712f681`
  > - **ผลการรันชุดทดสอบ Regression Labs 1–3:** **29/29 ไฟล์ผ่าน (204/204 เทสต์ ผ่านครบ 100%, ข้าม 0)**
  > - **สถานะข้อค้นพบ:** ได้รับการแก้ไขที่ต้นเหตุครบถ้วนทุกข้อ (Zero remaining findings)
  > 
  > #### ผลการตรวจยืนยันในโค้ดและเอกสาร:
  > 1. **[Resolved] Ticket Status Field Naming (`currentStatus`):** ใน `api-spec.md` และ `specification.md` ปรับเปลี่ยนมาใช้ `currentStatus` ตรงตาม Prisma Schema และโค้ดเดิมของ Client เรียบร้อย พร้อมระบุการรองรับ backward-compatible alias ป้องกันความเสี่ยงเรื่อง Regression ได้ 100%
  > 2. **[Resolved] Mandatory `knownUpdatedAt` Validation (422):** ระบุข้อกำหนดบังคับส่ง `knownUpdatedAt` ในการทำ Mutation ชัดเจน หากไม่ส่งมาจะถูกปฏิเสธด้วย `422 Unprocessable Entity` พร้อมทั้งเพิ่มรหัสทดสอบ `API-WORK-06` ใน `tests.md` รองรับครบถ้วน
  > 3. **[Resolved] Reviewer Record Tracking:** บันทึกข้อเสนอแนะรอบแรกและการตอบสนองใน `reviewer.md` อัปเดตครบถ้วน ตรงตามหลักฐานจริง
  > 
  > **คำตัดสิน: Approve** — เอกสารข้อกำหนด Sprint 4 ผ่านการตรวจสอบความถูกต้องและรัดกุมครบถ้วน ปราศจากข้อติดค้าง"
- **Final Verdict:** Approved
- **Status:** Merged into `lab4-staging` by @phatthidawadi

---

### Issue 28 - Database Evolution, Actions Taken Model, Migration & Idempotent Seed Data

- **Pull Request:** [#70](https://github.com/lmaybelgracel/TokTickit/pull/70)
- **Branch:** `feature/28-database-and-seed`
- **Summary:** Evolves Prisma schema to introduce `ActionTaken` model with 1:N relationship under `Ticket` and foreign key to `User` (`performedById`). Adds SQL migration DDL under `server/prisma/migrations/20261016000000_lab4_actions_taken_model/migration.sql`. Expands seed script (`server/prisma/seed.ts`) with idempotent execution covering 0, 1, and multiple Actions Taken across diverse IT Staff. Verified via automated test suite (`database-schema-seed.test.ts`, API-MIG-01).
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-16T15:18:02Z):
  > "### ผลการตรวจประเมิน Issue 28 - Database & Seed (Request Changes)
  > 
  > โครงสร้าง Prisma Schema, ไฟล์ Migration SQL และสคริปต์ Seed Data ทำออกมาได้ดีมากและผ่านการทดสอบ 215 เทสต์ครบ 100% โดยไม่มีข้อผิดพลาด
  > 
  > อย่างไรก็ตาม มีจุดที่ต้องขอให้แก้ไขในเอกสาร Test Plan ก่อนการอนุมัติ:
  > 
  > 1. **[docs/lab-04/tests.md] ความไม่สอดคล้องของเส้นทางไฟล์ทดสอบ (Traceability Mismatch):**
  >    - ในตารางที่ 2 และตารางที่ 3 ของ `docs/lab-04/tests.md` ระบุว่าชุดทดสอบ `API-MIG-01` (AC-14: Idempotent database seed execution) จะอยู่ที่ไฟล์ `server/tests/lab-04/actions-taken.api.test.ts`
  >    - แต่ไฟล์ทดสอบจริงที่ส่งมอบมาใน PR นี้ตั้งชื่อว่า `server/tests/lab-04/database-schema-seed.test.ts`
  >    - **สิ่งที่ต้องแก้:** รบกวนอัปเดตพาธไฟล์ของ `API-MIG-01` ใน `docs/lab-04/tests.md` ให้เป็น `server/tests/lab-04/database-schema-seed.test.ts` เพื่อให้สอดคล้องกับไฟล์จริงในคลังโค้ดตามเกณฑ์การตรวจของ Handout Part 3
  > 
  > 2. **[docs/lab-04/reviewer.md] อัปเดตสถานะการรีวิว:**
  >    - อัปเดตบันทึกประวัติการรีวิวของ Issue 28 / PR #70 ให้สะท้อนสถานะปัจจุบัน
  > 
  > **คำตัดสิน: Request Changes** — รบกวนปรับแก้พาธใน `tests.md` ให้ตรงกัน"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Test File Path Mismatch for API-MIG-01:**
     - *Reviewer Feedback:* Traceability matrix and Master Test Catalog in `docs/lab-04/tests.md` listed `server/tests/lab-04/actions-taken.api.test.ts` for `API-MIG-01` instead of the actual test implementation file `server/tests/lab-04/database-schema-seed.test.ts`.
     - *My Action:* Updated both Table 2 and Table 3 in `docs/lab-04/tests.md` to reference `server/tests/lab-04/database-schema-seed.test.ts` and marked status as `Passed`.
  2. **Comment on Reviewer Log Update:**
     - *Reviewer Feedback:* Update review records for Issue 28 / PR #70 to reflect current status.
     - *My Action:* Recorded Round 1 Changes Requested verdict, verbatim review comments, and response actions in `docs/lab-04/reviewer.md`.
- **Round 1 Verdict:** Changes Requested
- **Round 2 Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-16T15:30:59Z):
  > "### ผลการตรวจสอบซ้ำรอบที่ 2 (Round 2 Peer Review Verification)
  > 
  > - **Commit ที่ตรวจสอบ:** `dfe4a95`
  > - **ผลการทดสอบอัตโนมัติทั้งระบบ:** **ผ่าน 30/30 ไฟล์ (215/215 เทสต์ ผ่านครบ 100%, ข้าม 0)**
  > - **สถานะข้อค้นพบ:** ได้รับการแก้ไขที่ต้นเหตุครบถ้วนทุกข้อ (Zero remaining findings)
  > 
  > #### ผลการตรวจยืนยันในโค้ดและเอกสาร:
  > 1. **[Resolved] Test Path Traceability Parity:** ใน `docs/lab-04/tests.md` ตารางที่ 2 และ 3 ได้อัปเดตพาธของ `API-MIG-01` เป็น `server/tests/lab-04/database-schema-seed.test.ts` ตรงกับไฟล์ที่ส่งมอบจริงในคลังโค้ด พร้อมระบุสถานะ `Passed` ครบถ้วน
  > 2. **[Resolved] Reviewer Record Tracking:** บันทึกข้อเสนอแนะรอบแรกและการตอบสนองใน `docs/lab-04/reviewer.md` อัปเดตครบถ้วน ตรงตามหลักฐานจริง
  > 
  > **คำตัดสิน: Approve** — งานฐานข้อมูล โมเดล ActionTaken, Migration SQL และ Idempotent Seed Data สำหรับ Issue 28 ผ่านการตรวจสอบความถูกต้องและรัดกุมครบถ้วน"
- **Final Verdict:** Approved
- **Status:** Merged into `lab4-staging` by @phatthidawadi

---

### Issue 29 - Actions Taken Backend REST API & Authorization Guards

- **Pull Request:** [#71](https://github.com/lmaybelgracel/TokTickit/pull/71)
- **Branch:** `feature/29-actions-taken-api`
- **Summary:** Implemented `GET /api/tickets/:id/actions`, `POST /api/tickets/:id/actions`, and `PATCH /api/actions/:id` with comprehensive authorization guards (Staff/Admin write, Requester read-only for owned tickets, 403 on unowned), active user checks, optimistic concurrency check (`knownUpdatedAt` mandatory with 422, 409 Conflict on mismatch), input validation (description 3–2000 chars, result 2–1000 chars, followUpNote mandatory 3–1000 chars when followUpRequired=true, rejection of future actionDateTime and lower-bound rejection of timestamps earlier than ticket creation date), auto-stamping of `performedById`, and touching ticket `updatedAt`. Added automated Vitest suite `server/tests/lab-04/actions-taken.api.test.ts` (18/18 tests passing, 233/233 regression tests passing 100%).
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-16T16:19:59Z):
  > "### ผลการตรวจประเมิน Issue 29 - Actions Taken Backend REST API (Request Changes)
  > การ implement endpoint ทั้ง 3 ตัว (GET, POST, PATCH) พร้อม optimistic concurrency, inactive user guard, role-based authorization และ test suite 15 tests ทำออกมาได้ดีและครบถ้วนมาก
  > 
  > อย่างไรก็ตาม มีจุดที่ต้องขอให้แก้ไขก่อนการอนุมัติ:
  > 
  > 1. **[server/src/routes/actions.routes.ts] ขาดการตรวจ lower-bound ของ actionDateTime (BR-05 Violation):**
  > - ตาม **BR-05** ใน docs/lab-04/specification.md ระบุว่า actionDateTime ที่ client ส่งมาต้องอยู่ **"between the ticket's createdAt timestamp and the current server timestamp"**
  > - ปัจจุบัน POST handler และ PATCH handler ตรวจเฉพาะ upper-bound (future dates) เท่านั้น: if (parsed.getTime() > Date.now() + 60000) แต่ไม่มีการตรวจว่า parsed >= ticket.createdAt เลย
  > - ทำให้สามารถส่ง actionDateTime: "1970-01-01T00:00:00Z" ผ่านได้โดยไม่มี error ทั้งที่วันดังกล่าวเกิดก่อน ticket จะถูกสร้าง
  > - **สิ่งที่ต้องแก้:**
  > - ใน POST handler: เพิ่ม createdAt: true ใน ticket select แล้วตรวจ parsed < ticket.createdAt → reject 422
  > - ใน PATCH handler: ปัจจุบันไม่ได้ fetch ticket เลยในส่วน actionDateTime validation รบกวน fetch ticket มาเพื่อนำ createdAt มาใช้ตรวจ lower-bound ด้วย
  > 
  > 2. **[server/src/routes/actions.routes.ts] Dev-requester header fallback ยังคงอยู่ใน Lab 4 routes:**
  > - ฟังก์ชัน requireAuthenticatedUser มีการ copy x-development-requester-id fallback มาจาก Lab 1–2 ไว้ด้วย
  > - เนื่องจาก authenticateToken middleware ถูก mount ใน app.ts ก่อนแล้ว การมี header-based fallback ซ้ำใน Lab 4 routes ทำให้สามารถส่ง header นี้เพื่อ bypass JWT authentication และ impersonate requester ID ใดก็ได้โดยไม่ต้องมี token
  > - **สิ่งที่ต้องแก้:** รบกวนลบ dev-header block ออกจาก requireAuthenticatedUser ให้เหลือเพียง if (req.user) check และ return 401 หากไม่มี user
  > 
  > 3. **[server/tests/lab-04/actions-taken.api.test.ts] ขาด test case สำหรับ actionDateTime ก่อน ticket.createdAt:**
  > - Test suite ครอบคลุม future date ✅ แต่ยังขาด test ที่ตรวจ lower-bound ตาม BR-05
  > - **สิ่งที่ต้องแก้:** รบกวนเพิ่ม test case ที่ส่ง actionDateTime: "1970-01-01T00:00:00.000Z" และ expect 422 Unprocessable Entity พร้อมกับการแก้ implementation ในข้อ 1 ครับ
  > 
  > **คำตัดสิน: Request Changes** — รบกวนแก้ไขทั้ง 3 จุดข้างต้น"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Missing Lower-Bound Check for actionDateTime (BR-05):**
     - *Reviewer Feedback:* In `server/src/routes/actions.routes.ts`, POST and PATCH endpoints only checked upper-bound (future dates) and allowed `actionDateTime` timestamps earlier than `ticket.createdAt` to pass through without error.
     - *My Action:* Updated POST handler to include `createdAt: true` in ticket select and reject with HTTP 422 (`details: ["actionDateTime: Cannot be earlier than ticket creation date."]`) if `parsed < ticket.createdAt`. Updated PATCH handler to include `ticket: { select: { id: true, createdAt: true } }` on `existingAction` and reject with HTTP 422 if updated `actionDateTime < existingAction.ticket.createdAt`.
  2. **Comment on Development Requester Header Fallback in Lab 4 Routes:**
     - *Reviewer Feedback:* `requireAuthenticatedUser` retained the `x-development-requester-id` fallback, allowing header-based bypass of JWT authentication.
     - *My Action:* Completely removed the development header fallback block from `requireAuthenticatedUser`, strictly enforcing JWT verification through `req.user` and returning HTTP 401 Unauthorized for unauthenticated requests.
  3. **Comment on Automated Tests for BR-05 Lower-Bound and Header Rejection:**
     - *Reviewer Feedback:* Vitest suite lacked negative test cases validating `actionDateTime` earlier than `ticket.createdAt`.
     - *My Action:* Added automated tests in `server/tests/lab-04/actions-taken.api.test.ts` verifying that `POST` and `PATCH` reject timestamps earlier than `ticket.createdAt` with HTTP 422, and verifying that `x-development-requester-id` without token is rejected with HTTP 401 (expanding suite to 18/18 passing tests).
- **Round 1 Verdict:** Changes Requested
- **Round 2 Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-16T16:43:29Z):
  > "### ผลการตรวจประเมินรอบที่ 2 (Re-review Round 2) 
  > 
  > ขอบคุณสำหรับการแก้ไขโค้ดและชุดทดสอบอย่างรวดเร็วและตรงจุดใน commit `4810a75` ได้ดำเนินการ Re-review ในระดับโค้ดจริงและรัน Full Regression Test Suite เรียบร้อยแล้ว มีผลการตรวจดังนี้:
  > 
  > 1. **การตรวจสอบ Lower-Bound ของ `actionDateTime` (BR-05):**
  >    - ใน `server/src/routes/actions.routes.ts` ทั้ง `POST /api/tickets/:id/actions` และ `PATCH /api/actions/:id` มีการดึง `ticket.createdAt` มาเปรียบเทียบ หากระบุเวลาก่อนหน้าวันสร้างตั๋ว จะถูกปฏิเสธด้วย HTTP 422 Unprocessable Entity ตามสเปกอย่างถูกต้อง
  > 2. **ความปลอดภัยของ Authentication Middleware:**
  >    - นำโค้ดดัก `x-development-requester-id` ออกจาก `requireAuthenticatedUser` เรียบร้อยแล้ว ทำให้ไม่มีช่องโหว่ในการส่ง header จำลองผู้ใช้โดยไม่มี JWT Token อีกต่อไป
  > 3. **ชุดการทดสอบอัตโนมัติ (Automated Tests):**
  >    - เพิ่ม test cases ครอบคลุมทั้งกรณีส่งเวลา 1970 ใน create/update และกรณีส่ง dev header โดยไม่มี token ได้อย่างครบถ้วน (Actions Taken suite ผ่านครบ 18/18 เทสต์)
  > 4. **การทดสอบความเข้ากันได้ย้อนหลัง (Regression Suite):**
  >    - รัน Full Test Suite ทั้งระบบ: Server ผ่าน 19 ไฟล์ (181/181 เทสต์) และ Client ผ่าน 12 ไฟล์ (52/52 เทสต์) รวมทั้งสิ้น 233 เทสต์ผ่าน 100% โดยไม่มีข้อผิดพลาด
  > 
  > **คำตัดสิน: Approve** — งาน Actions Taken Backend REST API ของ Issue 29 มีคุณภาพ สมบูรณ์"
- **Final Verdict:** Approved
- **Status:** Merged into `lab4-staging` by @phatthidawadi

---

### Issue 30 - Actions Taken Frontend UI & Ticket Detail Integration

- **Pull Request:** [#72](https://github.com/lmaybelgracel/TokTickit/pull/72)
- **Branch:** `feature/30-actions-taken-ui`
- **Summary:** Built the Actions Taken Frontend component (`ActionsTakenSection.tsx` & `ActionsTakenSection.css`) adhering strictly to the Zen Green design system. Implemented chronological action history rendering (`UI-ACT-02`), performer badges, result callout boxes, conditional Amber follow-up banners, and file attachment notes. Built accessible Record & Edit modals with real-time character counters, datetime picker with min/max bounds and inline error messages, and inline validation disabling submit if followUpRequired is checked without followUpNote (`UI-ACT-01`). Added Escape key keyboard navigation (WCAG 2.1 AA). Embedded component into both `StaffTicketDetail.tsx` (interactive permissions with `onActionRecorded` refreshing ticket data) and `TicketDetail.tsx` (Requester view-only mode hiding all creation/edit controls, `UI-ACT-03`). Added client Vitest suite (`client/src/__tests__/lab-04/ActionsTaken.test.tsx`, 9/9 tests passing) and verified zero regressions across 242 total tests (Server 181, Client 61).
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-16T17:32:54Z):
  > "### ผลการตรวจประเมิน Issue 30 - Actions Taken Frontend UI & Ticket Detail Integration
  > 
  > จากการตรวจสอบโค้ดและการทำงานอย่างละเอียดใน PR #72 (Branch feature/30-actions-taken-ui) ยังมีจุดบกพร่องที่ต้องขอให้แก้ไขเพิ่มเติมก่อนจึงจะสามารถอนุมัติได้ ดังนี้:
  > 
  > 1. [client/src/components/StaffTicketDetail.tsx] ขาดการส่ง Callback onActionRecorded (บรรทัด 459):
  >    - มีการเรียกใช้ <ActionsTakenSection /> โดยส่งเพียง ticketId, ticketCreatedAt และ isStaffOrAdmin แต่ไม่ได้ส่ง onActionRecorded
  >    - ในฝั่ง Backend เมื่อมีการบันทึก Action Taken ตัว Ticket แม่จะถูกอัปเดตค่า updatedAt ในฐานข้อมูลด้วยเสมอ
  >    - การไม่ส่ง Callback ทำให้ StaffTicketDetail ไม่ได้รับแจ้งเตือนให้ดึงข้อมูลตั๋วใหม่ ส่งผลให้ค่า ticket.updatedAt ในเครื่อง Client ล้าสมัย หากเจ้าหน้าที่กดเปลี่ยนสถานะตั๋วหรือกด Resolve ตั๋วต่อทันที จะส่งผลให้คำขอล้มเหลวด้วยข้อผิดพลาด HTTP 409 Conflict (อ้างอิง BR-13)
  >    - สิ่งที่ต้องแก้: ดึงฟังก์ชันโหลดข้อมูลตั๋วใน useEffect ออกมาเป็นฟังก์ชันแยก (เช่น loadTicketData) แล้วส่งต่อเป็น onActionRecorded={loadTicketData} ให้กับ <ActionsTakenSection />
  > 
  > 2. [client/src/components/ActionsTakenSection.tsx] พร็อพ ticketCreatedAt ไม่ได้ถูกนำไปใช้ และขาดข้อจำกัด min/max บนช่องวันที่ (บรรทัด 22, 230):
  >    - มีการรับพร็อพ ticketCreatedAt เข้ามาในคอมโพเนนต์แต่ไม่ได้ถูกนำไปอ้างอิงเลย
  >    - ตามข้อกำหนด Handout 4.1 และกฎ BR-05 วันเวลาที่ปฏิบัติงาน (actionDateTime) ต้องไม่เกิดขึ้นก่อนเวลาที่สร้างตั๋ว และต้องไม่เป็นเวลาในอนาคต
  >    - ปัจจุบันช่อง <input id="action-datetime" type="datetime-local"> ไม่มีแอตทริบิวต์ min และ max ทำให้ผู้ใช้สามารถเลือกเวลาที่ผิดและกดปุ่ม Save Action ได้ โดยจะไปล้มเหลวที่ Backend (422) แทนที่จะบล็อกตั้งแต่หน้าจอ
  >    - สิ่งที่ต้องแก้: นำ ticketCreatedAt มาแปลงเป็น Local ISO String เพื่อกำหนดเป็นค่า min และใช้วันที่ปัจจุบันเป็นค่า max บน input พร้อมเพิ่มการตรวจเช็กช่วงเวลาในเงื่อนไข isFormValid
  > 
  > 3. [client/src/components/ActionsTakenSection.tsx] ขาดการรองรับปุ่ม Escape เพื่อปิด Modal (บรรทัด 210):
  >    - หน้าต่าง Modal มี role="dialog" และ aria-modal="true" เรียบร้อยแล้ว แต่ยังไม่สามารถกดยกเลิกหรือปิดด้วยปุ่ม Escape บนคีย์บอร์ดได้
  >    - ตามมาตรฐาน Accessibility และ WCAG 2.1 AA ใน ui-spec.md หน้าต่าง Modal ควรปิดได้เมื่อกดปุ่ม Escape
  >    - สิ่งที่ต้องแก้: เพิ่ม Event Listener ดักจับการกดปุ่ม Escape ใน useEffect ขณะที่ Modal กำลังเปิดอยู่เพื่อสั่งเรียก closeModal()
  > 
  > 4. [client/src/api.ts] ลบโค้ด Header จำลอง X-Development-Requester-Id ที่ตกค้าง (บรรทัด 733):
  >    - ในฟังก์ชัน fetchTicketActions ยังมีเงื่อนไข Fallback ส่ง headers["X-Development-Requester-Id"] ตกค้างอยู่
  >    - เนื่องจากใน PR #71 ที่ผ่านมา เส้นทาง /api/tickets/:id/actions ฝั่ง Server บังคับใช้ JWT Authentication เต็มรูปแบบแล้ว และไม่ได้ดึงค่าจาก Header นี้อีกต่อไป
  >    - สิ่งที่ต้องแก้: ปรับฟังก์ชันใน api.ts ให้เรียกผ่าน Bearer Token เพียงอย่างเดียวเพื่อความกระชับและไม่ให้เกิดความสับสน
  > 
  > คำตัดสิน: Request Changes — รบกวนแก้ไขประเด็นข้างต้น (โดยเฉพาะข้อ 1 และ 2) แล้วพุชคอมมิตใหม่เพื่อตรวจสอบอีกครั้ง"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Missing `onActionRecorded` Callback in StaffTicketDetail:**
     - *Reviewer Feedback:* Without `onActionRecorded`, `StaffTicketDetail` was not notified to re-fetch ticket data when an action was recorded. Because the backend touches ticket `updatedAt`, subsequent ticket mutations (e.g., status changes, resolution) would fail with 409 Conflict.
     - *My Action:* Extracted ticket loading into a reusable `loadTicketData` function and passed `onActionRecorded={loadTicketData}` to `<ActionsTakenSection />` in `StaffTicketDetail.tsx`.
  2. **Comment on Unused `ticketCreatedAt` Prop & Missing Min/Max Date Bounds:**
     - *Reviewer Feedback:* `ticketCreatedAt` prop was received but unused, and `<input id="action-datetime" type="datetime-local">` lacked `min` and `max` attributes, allowing users to enter dates prior to ticket creation or in the future and submit invalid dates.
     - *My Action:* Converted `ticketCreatedAt` to local ISO format for `min` and current timestamp for `max`. Added date range validation in `isFormValid` and inline warning error messages to block form submission if the date is out of range.
  3. **Comment on Missing Escape Key Modal Dismissal (WCAG 2.1 AA):**
     - *Reviewer Feedback:* Modal could not be closed using the keyboard Escape key.
     - *My Action:* Added a `keydown` window event listener in `useEffect` when `isModalOpen` is active, closing the modal when Escape is pressed.
  4. **Comment on Legacy `X-Development-Requester-Id` Header Fallback in `api.ts`:**
     - *Reviewer Feedback:* `fetchTicketActions` in `client/src/api.ts` still had development requester header fallback code which was deprecated in Sprint 4.
     - *My Action:* Removed the header fallback, standardizing `fetchTicketActions` to use the `Authorization: Bearer ${authToken}` scheme.
- **Round 1 Verdict:** Changes Requested
- **Round 2 Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-16T18:03:29Z):
  > "### ผลการตรวจประเมินรอบที่ 2 (Re-review Round 2)
  > 
  > ขอบคุณสำหรับการแก้ไขโค้ดและชุดทดสอบอย่างรวดเร็วและตรงจุดใน commit `d0f0fd2` ได้ดำเนินการ Re-review ในระดับโค้ดจริงและรัน Full Regression Test Suite เรียบร้อยแล้ว มีผลการตรวจดังนี้:
  > 
  > 1. **การส่ง Callback `onActionRecorded` เพื่อซิงค์ข้อมูลตั๋วแม่ (F-01):**
  >    - ใน `client/src/components/StaffTicketDetail.tsx` มีการแยกฟังก์ชันดึงข้อมูลตั๋วออกมาเป็น `loadTicketData` และส่งผ่านพร็อพ `onActionRecorded={loadTicketData}` ให้กับ `<ActionsTakenSection />` อย่างถูกต้อง เมื่อมีการบันทึกหรือแก้ไขการปฏิบัติงาน ข้อมูลตั๋วแม่รวมถึง `ticket.updatedAt` ในหน้าจอจะได้รับการรีเฟรชทันที ป้องกันปัญหา HTTP 409 Conflict ในการเปลี่ยนสถานะหรือ Resolve ตั๋วต่อ
  > 2. **การจำกัดขอบเขต `min` / `max` ของ `actionDateTime` ตามกฎ BR-05 (F-02):**
  >    - ใน `client/src/components/ActionsTakenSection.tsx` มีการนำ `ticketCreatedAt` มาแปลงเป็น `minDateTime` และใช้เวลาปัจจุบันสำหรับ `maxDateTime` ผูกเข้ากับ `<input id="action-datetime" type="datetime-local">` พร้อมทั้งเพิ่มฟังก์ชัน `isDateTimeValid()` ในเงื่อนไข `isFormValid` และแสดงข้อความเตือนสีแดงแบบเรียลไทม์ ป้องกันการระบุวันเวลาย้อนหลังก่อนสร้างตั๋วหรือเวลาในอนาคตได้อย่างสมบูรณ์
  > 3. **การรองรับปุ่ม `Escape` เพื่อปิด Modal ตามมาตรฐาน Accessibility (F-03):**
  >    - เพิ่ม `useEffect` ดักจับคีย์บอร์ด Event `keydown` เพื่อตรวจสอบ `e.key === "Escape"` และสั่งเรียก `closeModal()` พร้อมฟังก์ชัน Clean-up Event Listener อย่างถูกต้อง สอดคล้องกับมาตรฐาน WCAG 2.1 AA
  > 4. **การเก็บกวาด Header จำลองใน `api.ts` (F-04):**
  >    - นำพารามิเตอร์ `requesterId` และเงื่อนไขส่ง `X-Development-Requester-Id` ออกจากฟังก์ชัน `fetchTicketActions` ใน `client/src/api.ts` เรียบร้อยแล้ว ทำให้การเรียกใช้งานส่งเฉพาะ `Authorization: Bearer <token>` ตามมาตรฐานความปลอดภัยของ Sprint 4
  > 5. **ชุดการทดสอบอัตโนมัติและความเข้ากันได้ย้อนหลัง (Regression Suite):**
  >    - ขยายชุดทดสอบใน `client/src/__tests__/lab-04/ActionsTaken.test.tsx` ครอบคลุมทั้งกรณี min/max วันที่, ปุ่ม Escape และการเรียก `onActionRecorded` callback (ผ่านครบ 9/9 เทสต์)
  >    - รัน Full Test Suite ทั้งระบบ: Server ผ่าน 19 ไฟล์ (181/181 เทสต์) และ Client ผ่าน 13 ไฟล์ (61/61 เทสต์) รวมทั้งสิ้น 242 เทสต์ผ่าน 100% โดยไม่มีข้อผิดพลาดและไม่มีผลกระทบต่อของเดิม (Zero Regression)
  > 
  > **คำตัดสิน: Approve** — งาน Actions Taken Frontend UI & Ticket Detail Integration ของ Issue 30 มีคุณภาพ สมบูรณ์ ถูกต้องตามข้อกำหนด"
- **Final Verdict:** Approved
- **Status:** Merged into `lab4-staging` by @phatthidawadi

---

### Issue 31 - Ticket Status Workflow, Resolution Gate & Concurrency Conflict Handling

- **Pull Request:** [#73](https://github.com/lmaybelgracel/TokTickit/pull/73)
- **Branch:** `feature/31-status-workflow-and-resolution`
- **Summary:** Enforces the 8-state transition matrix on `PATCH /api/staff/tickets/:id/status` (BR-10). Rejects direct transition to `RESOLVED` via status endpoint with HTTP 422 (BR-11, API-WORK-02). Implements the formal resolution gate on `PATCH /api/staff/tickets/:id/resolve` requiring mandatory `resolutionSummary` (3–500 chars) and transitioning status to `RESOLVED` (API-WORK-01). Enforces mandatory `knownUpdatedAt` across both status and resolve endpoints with HTTP 422 if omitted (API-WORK-06) and HTTP 409 Conflict if stale (API-WORK-03). Enforces inactive user guard on `PATCH /api/staff/tickets/:id/assign` returning HTTP 422 (BR-14, API-WORK-04). Supports requester resolution advisory toggle via `PATCH /api/tickets/:id/resolve-indication` without mutating ticket currentStatus (BR-12, API-WORK-05). Adds user-facing error and conflict alert banners with automatic reload on HTTP 409 Conflict, Escape key dismiss on resolve modal, and advisory banner in `StaffTicketDetail.tsx` (UI-WORK-01). Verified via automated test suites `server/tests/lab-04/ticket-workflow.api.test.ts` (11/11 tests passing) and `client/src/__tests__/lab-04/TicketWorkflow.test.tsx` (6/6 tests passing), maintaining 100% zero regression across all 259 project tests (Server 192, Client 67).
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-16T19:11:28Z):
  > "### ผลการตรวจประเมิน Issue 31 - Ticket Status Workflow, Resolution Gate & Concurrency Conflict Handling
  > 
  > จากการตรวจสอบโค้ดและการทำงานใน PR #73 (Branch `feature/31-status-workflow-and-resolution`) ตัวฟีเจอร์หลักทั้ง Transition Matrix, Resolution Gate, 409 Conflict, Inactive User Guard และชุดทดสอบ 259 เคสทำออกมาได้ดีมากและผ่าน 100%
  > 
  > มีจุดที่อยากให้ปรับแก้เล็กน้อยในไฟล์ของ PR #73 ก่อน ดังนี้:
  > 
  > 1. **[client/src/components/StaffTicketDetail.tsx] อัปเดตรหัสกฎใน Resolve Modal (บรรทัด 670):**
  >    - ข้อความคำอธิบายใน Modal ยังระบุว่า *"Per course business rule BR-20..."* ซึ่งเป็นรหัสเดิมของ Sprint 3
  >    - ในเอกสารสเปกของ Sprint 4 (`docs/lab-04/specification.md`) กฎ Resolution Gate ถูกจัดลำดับเป็น **`BR-11`**
  >    - **สิ่งที่ต้องแก้:** ปรับข้อความเป็น `BR-11` เพื่อความถูกต้องในการ Traceability กับเอกสาร Lab 4 ครับ
  > 
  > 2. **[server/src/routes/staff.routes.ts] ลำดับการตรวจสอบใน `PATCH /api/staff/tickets/:id/status` (บรรทัด 398–408):**
  >    - ปัจจุบันโค้ดดักจับการห้ามเปลี่ยนสถานะเป็น `RESOLVED` ทำงานก่อนการตรวจสอบว่ามี `knownUpdatedAt` หรือไม่
  >    - **สิ่งที่ต้องแก้:** สลับนำการตรวจเช็ก `knownUpdatedAt` ขึ้นมาไว้ก่อนการตรวจเช็กค่าสถานะ เพื่อให้ลำดับ Error Precedence สอดคล้องกับ `api-spec.md`
  > 
  > **คำตัดสิน: Request Changes** — รบกวนปรับแก้จุดข้างต้นเล็กน้อย"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Business Rule Code in Resolve Modal:**
     - *Reviewer Feedback:* In `client/src/components/StaffTicketDetail.tsx`, the modal description referenced legacy Sprint 3 rule code `BR-20` instead of Sprint 4 rule `BR-11`.
     - *My Action:* Updated modal description text to explicitly reference `BR-11` conforming to `docs/lab-04/specification.md`.
  2. **Comment on Validation Precedence in Status Mutation Endpoint:**
     - *Reviewer Feedback:* In `server/src/routes/staff.routes.ts`, the check rejecting direct transition to `RESOLVED` was executed before verifying the mandatory presence of `knownUpdatedAt`.
     - *My Action:* Reordered endpoint validation logic so that the `knownUpdatedAt` presence check (returning 422 Unprocessable Entity) executes prior to target status examination, strictly aligning with `api-spec.md` error precedence.
- **Round 1 Verdict:** Changes Requested
- **Round 2 Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-17T06:11:56Z):
  > "### ผลการตรวจประเมินรอบที่ 2 (Re-review Round 2)
  > 
  > ขอบคุณสำหรับการแก้ไขโค้ดและชุดทดสอบอย่างรวดเร็วและตรงจุดใน commit `cf7f558` ได้ดำเนินการ Re-review ในระดับโค้ดจริงและรัน Full Regression Test Suite เรียบร้อยแล้ว มีผลการตรวจดังนี้:
  > 
  > 1. **การอัปเดตรหัสข้อกำหนดใน Resolve Modal (F-01):**
  >    - ใน `client/src/components/StaffTicketDetail.tsx` (บรรทัด 687) มีการปรับแก้ข้อความคำอธิบายใน Modal จาก `BR-20` เป็น **`BR-11`** เพื่อให้สอดคล้องกับเอกสารสเปกของ Sprint 4 (`docs/lab-04/specification.md`) อย่างถูกต้อง
  > 2. **การปรับลำดับ Error Precedence ของ `knownUpdatedAt` ใน `PATCH /status` (F-02):**
  >    - ใน `server/src/routes/staff.routes.ts` (บรรทัด 398–412) มีการสลับนำการตรวจสอบฟิลด์ `knownUpdatedAt` ขึ้นมาทำงานก่อนการตรวจสอบค่าสถานะ `RESOLVED` โดยหาก Client ไม่ได้แนบ Timestamp มาจะถูกปฏิเสธด้วย `422 Unprocessable Entity: knownUpdatedAt is required` เป็นลำดับแรก สอดคล้องกับข้อกำหนดใน `api-spec.md` (หัวข้อที่ 1) อย่างสมบูรณ์
  > 3. **ชุดการทดสอบอัตโนมัติและความเข้ากันได้ย้อนหลัง (Regression Suite):**
  >    - มีการอัปเดตชุดทดสอบ `staff-ticket-detail.api.test.ts` ให้แนบ `knownUpdatedAt` สอดคล้องกับลำดับการตรวจสอบใหม่ โดยไม่มีการข้ามเทสต์หรือลดทอนเงื่อนไข
  >    - รัน Full Test Suite ทั้งระบบ: Server ผ่าน 20 ไฟล์ (192/192 เทสต์) และ Client ผ่าน 14 ไฟล์ (67/67 เทสต์) รวมทั้งสิ้น 259 เทสต์ผ่าน 100% โดยไม่มีข้อผิดพลาดและไม่มีผลกระทบต่อของเดิม (Zero Regression)
  > 
  > **คำตัดสิน: Approve** — งาน Ticket Status Workflow, Resolution Gate & Concurrency Conflict Handling ของ Issue 31 มีคุณภาพ สมบูรณ์ ถูกต้องตามข้อกำหนด"
- **Final Verdict:** Approved
- **Status:** Merged into `lab4-staging` by @phatthidawadi

---

### Issue 32 - Role Dashboards Backend API & Authoritative Query Engine

- **Pull Request:** [#74](https://github.com/lmaybelgracel/TokTickit/pull/74)
- **Branch:** `feature/32-dashboards-api`
- **Summary:** Implemented authoritative backend dashboard calculation endpoints for Requesters, IT Staff, and Administrators in `server/src/routes/dashboard.routes.ts` with direct route aliases in `server/src/app.ts`. Computed dynamic metrics directly from the database without client-side aggregation (BR-15). Enforced strict data isolation for Requesters (`requesterId = caller.id`) providing `totalOpenTickets`, `waitingForRequester`, `resolvedOrClosed`, `recentTickets`, and `recentlyResolved` (BR-16, AC-04, API-DASH-01). Provided IT Staff and Admin metrics including `unassignedTickets`, `myAssignedTickets`, `myActionsTakenCount`, `urgentTickets`, `waitingForRequester`, `totalActiveTickets`, complete 8-state `statusDistribution`, 4-level `priorityDistribution`, and `recentQueueActivity` (BR-17, AC-05, API-DASH-02, API-DASH-04). Populated `adminStats` with user counts (`totalUsers`, `activeUsers`, `inactiveUsers`) and role breakdown for Administrators while omitting for IT Staff (BR-18, AC-05, API-DASH-03). Enforced authentication, role authorization, and mustChangePassword guards. Added automated Vitest suites `server/tests/lab-04/requester-dashboard.api.test.ts` (6/6 tests passing) and `server/tests/lab-04/staff-dashboard.api.test.ts` (8/8 tests passing), maintaining 100% zero regression across all 273 project tests (Server 206, Client 67).
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-18T06:40:49Z):
  > "### ผลการตรวจประเมิน Issue 32 - Sprint 4 Role Dashboards Backend API & Authoritative Query Engine
  > 
  > จากการตรวจสอบโค้ดและชุดทดสอบอย่างละเอียดใน PR #74 (Commit `b62dde4`) ยังมีจุดบกพร่องที่ต้องขอให้แก้ไขเพิ่มเติมก่อนจึงจะสามารถอนุมัติได้ ดังนี้:
  > 
  > 1. **[server/src/routes/dashboard.routes.ts] การคำนวณ Priority Distribution ไม่กรองเฉพาะ Active Tickets ตามข้อกำหนด BR-17 (บรรทัด 221–232):**
  >    - ใน `docs/lab-04/specification.md` ข้อกำหนด **BR-17** ระบุชัดเจนว่า `priorityCounts` ต้องเป็น *"Aggregate counts grouped by itPriority for all active tickets"*
  >    - ในโค้ดปัจจุบันใช้ `prisma.ticket.groupBy` โดยไม่มีเงื่อนไข `where` ทำให้ตั๋วสถานะ Terminal (`CLOSED` และ `CANCELLED`) ถูกดึงมารวมด้วย ส่งผลให้สถิติตามลำดับความสำคัญของคิวงาน IT Staff คลาดเคลื่อนจากความเป็นจริง
  >    - **สิ่งที่ต้องแก้:** เพิ่มเงื่อนไข `where: { currentStatus: { notIn: TERMINAL_STATUSES } }` ในการ query `priorityDistribution` เพื่อให้นับเฉพาะตั๋วที่ยังดำเนินการอยู่ (Active Tickets) ตรงตามข้อกำหนด BR-17 
  > 
  > 2. **[server/src/routes/dashboard.routes.ts & server/src/app.ts] การทำ Recursive Router Dispatching และการ Mutate `req.url` (บรรทัด 326–332):**
  >    - ใน Endpoint `/admin` มีการเขียน `req.url = "/staff"` แล้วเรียก `dashboardRouter(req, res, next)` ซ้ำซ้อน ซึ่งทำให้ Middleware การยืนยันตัวตน (`requireAuth` และ `enforcePasswordChange`) ถูกเรียกทำงานซ้ำ 2 รอบ และเสี่ยงต่อการทำ Query Parameters สูญหาย
  >    - **สิ่งที่ต้องแก้:** แยกการประมวลผลของ Staff Dashboard ออกมาเป็นฟังก์ชันอิสระ เช่น `handleStaffDashboard(req, res)` แล้วเรียกใช้ฟังก์ชันดังกล่าวโดยตรงจากทั้ง Route `/staff` และ `/admin` แทนการเขียนทับ `req.url` และวนเรียก Router ซ้ำ
  > 
  > 3. **[server/tests/lab-04/requester-dashboard.api.test.ts] ขาดชุดทดสอบ Security กรณี Requester ต้องเปลี่ยนรหัสผ่าน (`mustChangePassword`):**
  >    - ใน `staff-dashboard.api.test.ts` (บรรทัด 73–85) มีการทดสอบกรณีผู้ใช้ติดสถานะ `mustChangePassword: true` แล้วถูกปฏิเสธด้วย `403 Forbidden` ไว้อย่างชัดเจน
  >    - แต่ใน `requester-dashboard.api.test.ts` ยังไม่มี Test Case ตรวจสอบกรณี Requester ที่มีแฟล็ก `mustChangePassword: true`
  >    - **สิ่งที่ต้องแก้:** เพิ่ม Test Case ใน `requester-dashboard.api.test.ts` เพื่อยืนยันว่า Requester ที่มีแฟล็ก `mustChangePassword: true` จะถูกปฏิเสธด้วย `403 Forbidden` เช่นเดียวกัน เพื่อให้ครอบคลุมเงื่อนไขความปลอดภัยตามมาตรฐานของระบบ
  > 
  > **คำตัดสิน: Request Changes** — รบกวนแก้ไข 3 จุดนี้และพุชคอมมิตใหม่"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Priority Distribution Query Missing Active Tickets Filter (BR-17):**
     - *Reviewer Feedback:* In `server/src/routes/dashboard.routes.ts`, `prisma.ticket.groupBy` for `itPriority` lacked a `where` filter, incorrectly including terminal tickets (`CLOSED`, `CANCELLED`).
     - *My Action:* Added `where: { currentStatus: { notIn: TERMINAL_STATUSES } }` to the `itPriority` aggregation query in `handleStaffDashboard`, strictly limiting the distribution to active tickets per `BR-17`. Added automated assertion in `server/tests/lab-04/staff-dashboard.api.test.ts`.
  2. **Comment on Recursive Router Dispatching and `req.url` Mutation:**
     - *Reviewer Feedback:* In `/admin` route and alias mounts, `req.url = "/staff"` was used with `dashboardRouter(req, res, next)`, causing middleware to execute twice and mutating request URLs.
     - *My Action:* Extracted `handleRequesterDashboard` and `handleStaffDashboard` as clean standalone handler functions. Mounted them directly on both primary routes and root aliases (`/api/requester/dashboard`, `/api/staff/dashboard`, `/api/admin/dashboard`) in `server/src/app.ts` with explicit middleware chain and zero URL mutations.
  3. **Comment on Explicit Password Change Security Tests for Requester Dashboard:**
     - *Reviewer Feedback:* Vitest suite in `requester-dashboard.api.test.ts` lacked explicit security verification for requesters with `mustChangePassword: true`.
     - *My Action:* Added dedicated test cases in `server/tests/lab-04/requester-dashboard.api.test.ts` verifying that requesters with `mustChangePassword: true` are rejected with HTTP 403 Forbidden on both `/api/dashboard/requester` and `/api/requester/dashboard`.
- **Round 1 Verdict:** Changes Requested
- **Round 2 Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-18T16:20:52Z):
  > "### ผลการตรวจประเมินรอบที่ 2 (Re-review Round 2)
  > 
  > ขอบคุณสำหรับการแก้ไขโค้ดและชุดทดสอบอย่างรวดเร็วและตรงประเด็นใน commit `e46cee0`
  > 
  > ผลการ Re-review ในระดับโค้ดจริงและการรันชุดทดสอบยืนยันดังนี้:
  > 1. **การกรอง Active Tickets ใน Priority Distribution (BR-17):** ได้รับการแก้ไขที่รากเหง้าโดยเพิ่มเงื่อนไข `where: { currentStatus: { notIn: TERMINAL_STATUSES } }` ใน `server/src/routes/dashboard.routes.ts` พร้อม assertion ตรวจสอบใน `staff-dashboard.api.test.ts` ครบถ้วน
  > 2. **การแยก Dashboard Handlers และยกเลิก `req.url` Mutation:** สถาปัตยกรรมการ Routing ใน `app.ts` และ `dashboard.routes.ts` ได้รับการปรับปรุงเป็น Clean Handlers และเชื่อมต่อกับ Middleware Chain โดยตรง ปราศจากการเรียก Dispatch ซ้ำซ้อน
  > 3. **ชุดทดสอบ Security สำหรับ Requester Password Change:** เพิ่ม Test Cases ใน `requester-dashboard.api.test.ts` ยืนยันการปฏิเสธด้วย HTTP 403 Forbidden ครอบคลุมทั้งเส้นทางหลักและ Alias
  > 4. **ความเข้ากันได้ย้อนหลัง (Full Regression):** รันเทสต์ทั้งระบบผ่านครบ 274/274 tests (Server 207, Client 67) ปราศจากข้อผิดพลาด 100%
  > 
  > **Verdict: Approve** — งาน Role Dashboards Backend API & Authoritative Query Engine ของ Issue 32 มีคุณภาพสมบูรณ์ ถูกต้องตามข้อกำหนด"
- **Final Verdict:** Approved
- **Status:** Merged into `lab4-staging` by @phatthidawadi

---

### Issue 33 - IT Staff & Administrator Dashboard Frontend UI

- **Pull Request:** [#75](https://github.com/lmaybelgracel/TokTickit/pull/75)
- **Branch:** `feature/33-staff-dashboard-ui`
- **Summary:** Implemented IT Staff & Administrator Dashboard frontend UI in `client/src/components/StaffDashboard.tsx`, `StaffDashboard.css`, and integrated into `client/src/App.tsx` and `StaffTicketQueue.tsx`. Features welcome overview banner with staff name, role badge, formatted date, and refresh button; quick actions toolbar; 5 operational metric cards (`unassignedTickets`, `myAssignedTickets`, `myActionsTakenCount` for AC-05/BR-17, `urgentTickets` with critical pulse, `waitingForRequester` attention badge) with 1-click drill-down navigation into ticket queue; queue breakdown matrix with interactive status and priority pills; recent queue activity table (up to 5 tickets) with ticket number, summary, priority badge, status badge, owner, formatted timestamp, and row click navigation to ticket details; administrator user statistics grid (`totalUsers`, `activeUsers`, `inactiveUsers`, role counts) shown conditionally for `ADMINISTRATOR` role. Added Vitest component test suite `client/src/__tests__/lab-04/StaffDashboard.test.tsx` (18/18 tests passing covering UI-DASH-02, UI-DASH-03, UI-DASH-04), preserving 100% full regression pass rate across 292 tests (Server: 207, Client: 85).
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-18T17:59:17Z):
  > "### ผลการตรวจประเมิน Issue 33 - Sprint 4 IT Staff & Administrator Dashboard UI
  > 
  > จากการตรวจสอบโค้ดและชุดทดสอบอย่างละเอียดใน PR #75 (Commit `dcd5138`) ยังมีจุดบกพร่องที่ทำให้การบิลด์ระบบล้มเหลว จึงต้องขอให้แก้ไขเพิ่มเติมก่อนที่จะสามารถอนุมัติได้ ดังนี้:
  > 
  > 1. **[client/src/components/StaffDashboard.tsx] TypeScript Compile Error จากการอ้างอิงฟิลด์ `recentTickets` (บรรทัด 152):**
  >    - ใน `StaffDashboard.tsx` บรรทัด 152 มีการเขียน fallback:
  >      ```typescript
  >      const recentTickets: StaffDashboardTicket[] =
  >        data.recentQueueActivity || data.recentQueueTickets || data.recentTickets || [];
  >      ```
  >    - ฟิลด์ `recentTickets` ไม่ได้ถูกประกาศไว้ใน Interface `StaffDashboardData` ใน `client/src/api.ts`
  >    - ส่งผลให้คำสั่ง `npm --prefix client run build` ล้มเหลวทันที (`error TS2339: Property 'recentTickets' does not exist on type 'StaffDashboardData'`) ซึ่งขัดต่อเกณฑ์ Clean Build ตาม **AC-16**
  >    - **สิ่งที่ต้องแก้:** นำ `|| data.recentTickets` ออกจากบรรทัด 152 ให้เหลือเฉพาะ `data.recentQueueActivity || data.recentQueueTickets || []` ให้ตรงตาม Type Signature ของ `StaffDashboardData` ครับ
  > 
  > 2. **[client/src/__tests__/lab-04/StaffDashboard.test.tsx] Type Signature Mismatch ในไฟล์ชุดทดสอบ (บรรทัด 42, 111, 339):**
  >    - ใน `StaffDashboard.test.tsx` มีการระบุฟิลด์ที่ผิดจาก Interface 3 ตำแหน่ง:
  >      - **บรรทัด 42:** มีการใส่ฟิลด์ `myActiveTickets: 3` ใน Object `mockDashboardData.metrics` ซึ่งไม่มีใน Type `StaffDashboardMetrics` (`api.ts` ใช้ชื่อ `myAssignedTickets`)
  >      - **บรรทัด 111 และ 339:** มีการ Mock ฟังก์ชัน `refreshUser: vi.fn()` ใน `authContext.useAuth` ซึ่งไม่มีอยู่ใน Interface `AuthContextType` (`client/src/context/AuthContext.tsx`)
  >    - ส่งผลให้เกิดข้อผิดพลาด `error TS2353: Object literal may only specify known properties` ทำให้ `tsc` คอมไพล์ไม่ผ่าน
  >    - **สิ่งที่ต้องแก้:** ตัดฟิลด์ `myActiveTickets` ออกจาก `mockDashboardData.metrics` ในบรรทัด 42 และปรับ Mock Object ของ `useAuth` ในบรรทัด 111 และ 339 ให้ตรงตาม `AuthContextType` ครับ
  > 
  > 3. **[docs/lab-04/reviewer.md] สถานะการรีวิว:**
  >    - อัปเดตบันทึกข้อเสนอแนะและสถานะใน `docs/lab-04/reviewer.md` ให้สะท้อนผลการตรวจประเมินรอบที่ 1 ของ PR #75
  > 
  > ---
  > 
  > **คำตัดสิน: Request Changes** — รบกวนแก้ไข 3 จุดนี้และพุชคอมมิตใหม่"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Invalid `recentTickets` Property Causing TypeScript Build Failure:**
     - *Reviewer Feedback:* In `client/src/components/StaffDashboard.tsx` line 152, fallback chain referenced `data.recentTickets` which was not defined on `StaffDashboardData` in `api.ts`, causing `tsc` compilation to fail during `npm run build` and violating clean build criteria (`AC-16`).
     - *My Action:* Removed `|| data.recentTickets` from line 152, strictly retaining `data.recentQueueActivity || data.recentQueueTickets || []`. Clean build now compiles with 0 errors in under 1 second.
  2. **Comment on Type Signature Mismatch in Test File (`StaffDashboard.test.tsx`):**
     - *Reviewer Feedback:* In `client/src/__tests__/lab-04/StaffDashboard.test.tsx`, `mockDashboardData.metrics` contained invalid property `myActiveTickets`, and `useAuth` mock contained non-existent `refreshUser`, triggering TS2353 errors.
     - *My Action:* Removed `myActiveTickets` from `mockDashboardData.metrics`, ensured `recentQueueActivity` mock tickets strictly conform to `StaffDashboardTicket`, and updated `useAuth` mock to implement the complete `AuthContextType` interface (`error`, `updatePassword`, `clearError`).
  3. **Comment on Reviewer Tracking Record:**
     - *Reviewer Feedback:* Update review records for Issue 33 / PR #75 to reflect Round 1 Changes Requested verdict and response actions.
     - *My Action:* Recorded Round 1 Changes Requested verdict, verbatim quotes, and detailed responses in `docs/lab-04/reviewer.md`.

- **Round 2 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-18T18:29:46Z):
  > "### Second Reviewer Feedback — Request Changes
  > 
  > จากการ Re-review เชิงลึกใน PR #75 พบประเด็นด้าน Data Semantic และ Drill-Down Consistency ที่ต้องขอให้ปรับปรุงเพิ่มเติมก่อนอนุมัติ ดังนี้:
  > 1. **[Drill-Down Mismatch] การเชื่อมโยงการ์ด \"My Actions Recorded\" (`StaffDashboard.tsx:L318`):**
  >    - ตัวเลข `myActionsTakenCount` นับการกระทำที่ผู้ใช้เป็นผู้บันทึก (`performedById = caller.id`) แต่ Handler กลับส่ง `ownerFilter: \"me\"` ซึ่งไปกรองตั๋วที่ผู้ใช้เป็นเจ้าของตั๋วหลัก หากผู้ใช้ไปช่วยทำ Action บนตั๋วของคนอื่น (ตาม BR-02) ตั๋วเหล่านั้นจะไม่ปรากฏในคิว แนะนำให้พิจารณาการแสดงผลหรือจัดทำโหมดกรองสำหรับ My Actions ให้ถูกต้อง
  > 2. **[Count Discrepancy] การ์ด \"Urgent Tickets\" ส่งผลให้ตัวเลขไม่ตรงกับตารางคิวงาน (`StaffDashboard.tsx:L348`):**
  >    - Backend นับเฉพาะ Urgent ที่ยังไม่จบงาน (`notIn: RESOLVED, CLOSED, CANCELLED`) แต่การ์ดส่งเฉพาะ `{ itPriority: \"URGENT\" }` ทำให้คิวงานดึงตั๋ว Closed/Cancelled ขึ้นมาแสดงด้วย ส่งผลให้จำนวนตั๋วในคิวมากกว่าตัวเลขบนการ์ด ขัดต่อข้อกำหนด E2E-DASH-01 (\"landing on queue matching count\") แนะนำให้ปรับให้คิวงานแสดงเฉพาะตั๋ว Active เมื่อกดมาจาก Urgent Card
  > 3. **[Navigation Flow] การกดย้อนกลับจากหน้ารายละเอียดตั๋ว (`App.tsx:L323`):**
  >    - เมื่อคลิกดูตั๋วจาก Recent Queue Activity ในหน้า Dashboard เมื่อกด Back ใน `StaffTicketDetail` ระบบจะพาไปหน้า `staff-queue` แทนที่จะกลับมาที่ `staff-dashboard` แนะนำให้บันทึก View ต้นทางเพื่อพากลับมาหน้าเดิมได้อย่างถูกต้อง"
- **Round 2 Reviewer Feedback Items & My Responses:**
  1. **Comment on Drill-Down Mismatch for \"My Actions Recorded\" Card (`StaffDashboard.tsx`, `StaffTicketQueue.tsx`, `staff.routes.ts`, `api.ts`):**
     - *Reviewer Feedback:* Card 3 counted actions logged by caller (`performedById = caller.id`), but drill-down only queried tickets where caller is primary owner (`ownerFilter: \"me\"`). If staff assisted on others' tickets (BR-02), those tickets disappeared from the queue.
     - *My Action:* Added `actionBy` query parameter to backend `GET /api/staff/tickets` querying `where.actionsTaken = { some: { performedById: req.user.id } }`. Added `actionBy?: string` to `FetchStaffTicketsParams` and `initialActionBy` prop to `StaffTicketQueue.tsx`. Added dedicated 4th ownership toggle button `My Actions` (`ownerFilter === \"my-actions\"`), and updated Dashboard Card 3 click handler to dispatch `onDrillDown?.({ ownerFilter: \"my-actions\", actionBy: \"me\" })`.
  2. **Comment on Count Discrepancy for \"Urgent Tickets\" Card (`StaffDashboard.tsx`, `StaffTicketQueue.tsx`, `staff.routes.ts`):**
     - *Reviewer Feedback:* Backend metric counts active urgent tickets (`notIn: RESOLVED, CLOSED, CANCELLED`), but drill-down sent only `{ itPriority: \"URGENT\" }`, causing closed/cancelled tickets to load into queue and creating count discrepancy violating E2E-DASH-01.
     - *My Action:* Added `status === \"ACTIVE\"` support to backend `GET /api/staff/tickets` querying `where.currentStatus = { notIn: [RESOLVED, CLOSED, CANCELLED] }`. Added `<option value=\"ACTIVE\">Active (Non-terminal)</option>` to status select in `StaffTicketQueue.tsx`. Updated Dashboard Card 4 click handler to dispatch `onDrillDown?.({ itPriority: \"URGENT\", status: \"ACTIVE\" })`.
  3. **Comment on Back Button Navigation Flow (`App.tsx`):**
     - *Reviewer Feedback:* Navigating to ticket details from Recent Queue Activity on Dashboard and clicking Back navigated to `staff-queue` instead of returning to `staff-dashboard`.
     - *My Action:* Added `previousStaffView` state tracking in `App.tsx`. Recorded `previousStaffView = \"staff-dashboard\"` on dashboard ticket click and `\"staff-queue\"` on queue ticket click. Restored exact originating view in `StaffTicketDetail.onBack`.
- **Round 3 / Final Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-18T19:00:49Z):
  > "### ผลการตรวจประเมินรอบที่ 2 (Re-review Round 2)
  > 
  > ขอบคุณสำหรับการแก้ไขปัญหาเชิงลึกใน commit `7454aa6` อย่างยอดเยี่ยมและตรงประเด็น
  > 
  > ผลการ Re-review ในระดับโค้ดจริงและการตรวจสอบระบบ:
  > 1. **Clean Build ผ่านสมบูรณ์ (AC-16):** การตัด `data.recentTickets` ออกจาก `StaffDashboard.tsx` และปรับปรุง Type Signature ใน `StaffDashboard.test.tsx` ทำให้ `npm run build` (`tsc && vite build`) สำเร็จ 100% ปราศจากข้อผิดพลาด
  > 2. **ความถูกต้องของ Drill-Down Filter (AC-11, BR-02, BR-17):**
  >    - การ์ด \"My Actions Recorded\" รองรับการกรอง `actionBy=me` ผ่านความสัมพันธ์ของ Actions Taken อย่างแท้จริง ไม่จำกัดเฉพาะตั๋วที่ตนเองเป็นเจ้าของ
  >    - การ์ด \"Urgent Tickets\" ส่งตัวกรอง `status=ACTIVE` ทำให้จำนวนตั๋วในคิวงานตรงกับตัวเลขบนการ์ดตามเกณฑ์ E2E-DASH-01
  > 3. **Navigation Flow สมบูรณ์:** ระบบจดจำ View ต้นทางทำให้การกดย้อนกลับจากหน้ารายละเอียดตั๋วกลับสู่ Dashboard ได้อย่างถูกต้อง
  > 4. **ความเข้ากันได้ย้อนหลัง (Full Regression):** รันเทสต์ทั้งระบบผ่านครบถ้วนทั้ง 292 tests (Server 207 tests, Client 85 tests) ปราศจากข้อผิดพลาด 100%
  > 
  > **Verdict: Approve**"
- **Final Verdict:** Approved
- **Status:** Merged into `lab4-staging` by @phatthidawadi
---

### Issue 34 - Requester Dashboard Frontend UI & Regression Verification

- **Pull Request:** [#76](https://github.com/lmaybelgracel/TokTickit/pull/76)
- **Branch:** `feature/34-requester-dashboard-ui`
- **Summary:** Implemented Requester Dashboard frontend UI in `client/src/components/RequesterDashboard.tsx`, `RequesterDashboard.css`, and integrated into `client/src/App.tsx` and `MyTickets.tsx`. Features welcome overview banner with requester name, caption, email, and refresh button; quick actions toolbar (+ Create New Ticket, View All My Tickets); 3 personal metric cards (`totalOpenTickets`, `waitingForRequester` with dynamic amber alert when > 0, `resolvedOrClosed`) with 1-click drill-down navigation into `MyTickets`; recent ticket progress list table with ticket number, summary, priority badge (including urgent pulse indicator), status badge, formatted timestamp, and direct \"View Details\" row action; calming Zen Green empty state illustration and CTA when user has zero tickets; updated application shell navigation with persistent active indicators and view history preservation for seamless Back button navigation. Added Vitest component test suite `client/src/__tests__/lab-04/RequesterDashboard.test.tsx` (16/16 tests passing covering UI-DASH-01, AC-04), preserving 100% full regression pass rate across 308 tests (Server: 207, Client: 101).
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-18T19:54:01Z):
  > "### ผลการตรวจประเมิน Issue 34 - Sprint 4 Requester Dashboard Frontend UI
  > 
  > จากการตรวจสอบโค้ดและชุดทดสอบอย่างละเอียดใน PR #76 (Commit `9486edb`) พบว่าภาพรวมการออกแบบ UI, State Handling (Loading, Error, Empty State), Accessibility, และการเรียกใช้งาน API ตาม BR-16 ทำได้ดีมาก อย่างไรก็ตาม ยังมีจุดบกพร่องเรื่อง Drill-Down Navigation และตัวกรองสถานะที่ทำให้ตัวเลขบน Dashboard ไม่ตรงกับตารางรายการตั๋ว ซึ่งต้องขอให้แก้ไขเพิ่มเติมก่อนจึงจะสามารถอนุมัติได้ ดังนี้:
  > 
  > 1. **[client/src/components/RequesterDashboard.tsx & MyTickets.tsx] การ Drill-Down การ์ด \"Resolved / Closed\" ไม่แสดงตั๋วสถานะ CLOSED (AC-04, AC-11, BR-16):**
  >    - **ปัญหา:** การ์ดสถิติที่ 3 คำนวณและแสดงผลตัวเลขรวมของตั๋วที่เสร็จสิ้น `metrics.resolvedOrClosed` (Backend รวมทั้ง `RESOLVED` และ `CLOSED`) แต่เมื่อผู้ใช้คลิกการ์ดนี้ ฟังก์ชัน `handleCardClick` ใน `RequesterDashboard.tsx` (บรรทัด 297) ส่งค่า `onNavigateMyTickets?.(\"resolved\")` ไปยัง `MyTickets.tsx` ซึ่งฟังก์ชัน `mapStatusFilter` (บรรทัด 23) แปลงค่านั้นเป็น `selectedStatus = \"RESOLVED\"` เพียงสถานะเดียว
  >    - **ผลกระทบ:** ตาราง `MyTickets` จะยิงคำขอ `GET /api/tickets?status=RESOLVED` และแสดงเฉพาะตั๋ว `RESOLVED` โดยไม่แสดงตั๋ว `CLOSED` ทำให้จำนวนรายการที่แสดงในตารางน้อยกว่าตัวเลขรวมบนการ์ด Dashboard (เช่น ถ้ามี Resolved 1 ใบ และ Closed 4 ใบ การ์ดจะแสดงเลข 5 แต่คลิกเข้ามาเห็นตั๋วเพียง 1 ใบ) ซึ่งขัดต่อข้อกำหนด **AC-11** (\"landing on filtered queue matching count\")
  >    - **สิ่งที่ต้องแก้:**
  >      - ปรับให้ `onNavigateMyTickets` ส่งพารามิเตอร์สถานะที่สื่อถึงทั้งสองสถานะ เช่น `\"resolved_or_closed\"` หรือรองรับการกรองแบบรวม
  >      - ปรับ `mapStatusFilter` และตัวกรองใน `MyTickets.tsx` ให้สามารถเลือกแสดงผลกลุ่มตั๋วที่เสร็จสิ้นแล้วทั้งหมด (`RESOLVED` และ `CLOSED`) ได้อย่างถูกต้อง
  > 
  > 2. **[server/src/app.ts] ขยาย Endpoint `GET /api/tickets` ให้รองรับการกรองสถานะคู่ (`RESOLVED_OR_CLOSED`):**
  >    - **ปัญหา:** ใน `server/src/app.ts` (บรรทัด 371–385) พารามิเตอร์ `status` ของ `GET /api/tickets` รองรับเพียงค่า `ACTIVE` หรือค่าเดี่ยวของ `TicketStatus` เท่านั้น หากส่งค่าอื่นเข้ามาจะติด `400 INVALID_QUERY`
  >    - **สิ่งที่ต้องแก้:** เพิ่มการรองรับ query parameter เช่น `status=RESOLVED_OR_CLOSED` (หรือ `COMPLETED`) ใน `server/src/app.ts` โดยให้ query Prisma ด้วย `where.currentStatus = { in: [TicketStatus.RESOLVED, TicketStatus.CLOSED] }` เพื่อให้ Client ฝั่ง Requester สามารถ Drill-down ดูรายการตั๋วที่ตรงกับยอดรวมของการ์ดได้อย่างสมบูรณ์
  > 
  > 3. **[docs/lab-04/reviewer.md] สถานะการรีวิว:**
  >    - บันทึกข้อเสนอแนะและอัปเดตผลการประเมินรอบที่ 1 สำหรับ Issue 34 / PR #76 ลงในตาราง Review History ใน `docs/lab-04/reviewer.md`
  > 
  > ---
  > 
  > **คำตัดสิน: Request Changes** — รบกวนแก้ไข 3 จุดนี้และพุชคอมมิตใหม่"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Drill-Down on \"Resolved / Closed\" Card Mismatch (`RequesterDashboard.tsx` & `MyTickets.tsx`):**
     - *Reviewer Feedback:* Card 3 aggregates both `RESOLVED` and `CLOSED` tickets (`metrics.resolvedOrClosed`), but drill-down only queried `RESOLVED`, hiding `CLOSED` tickets and violating AC-11 count parity.
     - *My Action:* Updated Card 3 click handler in `RequesterDashboard.tsx` to dispatch `onNavigateMyTickets?.(\"resolved_or_closed\")`. Updated `mapStatusFilter` in `MyTickets.tsx` to map `\"resolved_or_closed\"` (as well as `\"resolved\"` and `\"completed\"`) to `\"RESOLVED_OR_CLOSED\"`. Added `<option value=\"RESOLVED_OR_CLOSED\">Resolved / Closed</option>` to the status select dropdown in `MyTickets.tsx`.
  2. **Comment on Backend `GET /api/tickets` Support for Combined Status (`RESOLVED_OR_CLOSED`):**
     - *Reviewer Feedback:* `GET /api/tickets` in `server/src/app.ts` rejected non-enum queries, preventing combined status queries.
     - *My Action:* Added support for `status === \"RESOLVED_OR_CLOSED\"` (and alias `\"COMPLETED\"`) in `server/src/app.ts`, querying Prisma with `where.currentStatus = { in: [TicketStatus.RESOLVED, TicketStatus.CLOSED] }`.
  3. **Comment on Reviewer Tracking Record:**
     - *Reviewer Feedback:* Record Round 1 Changes Requested review and response in `docs/lab-04/reviewer.md`.
     - *My Action:* Recorded Round 1 Changes Requested verdict, verbatim quotes, and detailed responses in `docs/lab-04/reviewer.md`.
- **Status:** Round 1 fixes committed, pushed, and re-reviewed.
- **Round 2 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-18T20:20:42Z):
  > "### ผลการตรวจประเมินรอบที่ 2 (Re-review Round 2) — Issue 34 / PR #76
  > 
  > ขอบคุณสำหรับการแก้ไขโค้ดและชุดทดสอบอย่างรวดเร็วใน commit `f090d53` ได้ดำเนินการ Re-review ในระดับโค้ดจริงและรัน Full Regression Test Suite เรียบร้อยแล้ว มีผลการตรวจดังนี้:
  > 
  > 1. **การ Drill-Down การ์ด \"Resolved / Closed\" ครอบคลุมทั้ง `RESOLVED` และ `CLOSED` แล้ว (F-01):**
  >    - ใน `client/src/components/RequesterDashboard.tsx` บรรทัด 297 และ 302 ได้เปลี่ยน `onNavigateMyTickets?.(\"resolved\")` เป็น `onNavigateMyTickets?.(\"resolved_or_closed\")` ครบทั้ง `onClick` และ `onKeyDown` แล้ว
  >    - ใน `client/src/components/MyTickets.tsx` บรรทัด 24 ฟังก์ชัน `mapStatusFilter` แมปค่า `\"resolved_or_closed\"` ไปเป็น `\"RESOLVED_OR_CLOSED\"` อย่างถูกต้อง พร้อมเพิ่ม `<option value=\"RESOLVED_OR_CLOSED\">Resolved / Closed</option>` ใน Dropdown แล้ว
  >    - ชุดทดสอบ `client/src/__tests__/lab-04/RequesterDashboard.test.tsx` บรรทัด 218 อัปเดต assertion เป็น `expect(handleNavigate).toHaveBeenCalledWith(\"resolved_or_closed\")` ตรงกับการแก้ไข ✓
  > 
  > 2. **การรองรับ `RESOLVED_OR_CLOSED` ใน Backend API (F-02):**
  >    - ใน `server/src/app.ts` บรรทัด 380–383 เพิ่ม branch `else if (upperStatus === \"RESOLVED_OR_CLOSED\" || upperStatus === \"COMPLETED\")` พร้อม Prisma filter `{ in: [TicketStatus.RESOLVED, TicketStatus.CLOSED] }` ตรงกับ logic ของ `dashboard.routes.ts` (L25–27) ✓
  >    - **อย่างไรก็ตาม ยังไม่มี Server-side Integration Test ครอบคลุม branch ใหม่นี้เลย** ตรวจ `server/tests/` ทั้งหมดด้วย pattern `RESOLVED_OR_CLOSED` — ไม่พบผลลัพธ์ใด Test ที่มีอยู่ใน `RequesterDashboard.test.tsx` เป็นเพียง Client-side Mock ไม่ได้ยิง HTTP จริง หาก Prisma query มีข้อผิดพลาดในอนาคตจะไม่มี Test ตรวจจับได้ ขัดต่อ AC-11
  > 
  > 3. **บันทึกการรีวิวรอบที่ 1 ใน `reviewer.md` (F-03):**
  >    - `docs/lab-04/reviewer.md` บันทึกคำวิจารณ์รอบที่ 1 แบบ verbatim พร้อม Response ของ author ครบ 3 ข้อเรียบร้อยแล้ว ✓
  > 
  > 4. **ประเด็นใหม่ที่พบจากการแก้ไข — alias \"resolved\" ขยายเป็น `RESOLVED_OR_CLOSED` โดยเงียบ:**
  >    - `MyTickets.tsx` L24: `if (s === \"resolved\" || s === \"resolved_or_closed\" || s === \"completed\") return \"RESOLVED_OR_CLOSED\";`
  >    - สตริง `\"resolved\"` ตัวเล็กตอนนี้ map ไปรวม `CLOSED` ด้วย Dropdown option ยังทำงานปกติ (ผ่าน `else` → `toUpperCase()`) จึงไม่มี Regression แต่ Deep-link URL `?status=resolved` หรือโค้ดในอนาคตที่ส่ง `\"resolved\"` อาจได้รับตั๋วมากกว่าที่คาดโดยไม่รู้ตัว รบกวนเพิ่ม comment อธิบาย intent หรือแยก alias ออกให้ชัดเจน
  > 
  > 5. **ชุดการทดสอบอัตโนมัติและความเข้ากันได้ย้อนหลัง (Regression Suite):**
  >    - ตรวจสอบแล้วไม่มี `.skip`, `.only`, `xtest`, หรือ `xdescribe` ในทุกไฟล์ที่แก้ไข ✓
  >    - รัน Full Test Suite ทั้งระบบ: Client ผ่าน 16 ไฟล์ (101/101 เทสต์) และ Server ผ่าน 22 ไฟล์ (207/207 เทสต์) รวมทั้งสิ้น **308 เทสต์ผ่าน 100%** Lab 1–3 Regression ผ่านครบ Zero Regression ✓
  > 
  > ---
  > 
  > **คำตัดสิน: Request Changes** — F-01 และ F-03 แก้ไขสมบูรณ์มีหลักฐานยืนยัน F-02 โค้ด Logic ถูกต้องแต่ขาด Server-side Integration Test (ข้อ 2) และพบ alias collision เล็กน้อย (ข้อ 4) รบกวนเพิ่ม Test 1 รายการและชี้แจง alias แล้วพุชคอมมิตใหม่"
- **Round 2 Reviewer Feedback Items & My Responses:**
  1. **Server-side Integration Test for `RESOLVED_OR_CLOSED` in `GET /api/tickets` (F-02):**
     - *Reviewer Feedback:* Logic in `app.ts` is correct, but lacked server-side integration tests in `server/tests/` to guarantee Prisma query correctness over HTTP against AC-11.
     - *My Action:* Added comprehensive server-side integration tests in `server/tests/lab-02/my-tickets.api.test.ts` and `server/tests/lab-04/requester-dashboard.api.test.ts` verifying that `GET /api/tickets?status=RESOLVED_OR_CLOSED` (and alias `COMPLETED`) queries Prisma with `{ in: [TicketStatus.RESOLVED, TicketStatus.CLOSED] }` and returns only resolved/closed tickets.
  2. **Alias Collision Clarification in `MyTickets.tsx` (F-04):**
     - *Reviewer Feedback:* In `MyTickets.tsx`, `s === "resolved"` was mapped together with `resolved_or_closed`, which could cause unexpected closed ticket returns if a deep-link passes lowercase `?status=resolved`.
     - *My Action:* Decoupled `s === "resolved"` so it strictly maps to single status `"RESOLVED"`, while `"resolved_or_closed"` and `"completed"` map to combined status `"RESOLVED_OR_CLOSED"`. Added explicit intent comments documenting the mapping behavior.
  3. **Regression Suite:**
     - *Reviewer Feedback:* Zero skipped tests, full regression pass required.
     - *My Action:* Ran full regression suite across client (101 tests, 16 files) and server (209 tests, 22 files) totaling 310 tests passing 100% with clean production build.
- **Status:** Round 2 fixes committed, pushed, and re-reviewed.
- **Round 3 Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-18T20:34:30Z):
  > "### ผลการตรวจประเมินรอบที่ 3 (Re-review Round 3) — Issue 34 / PR #76 (Commit `8f79375`)
  > 
  > ขอบคุณสำหรับการแก้ไขอย่างครบถ้วนและตรงประเด็นใน commit `8f79375` ได้ดำเนินการ Re-review ในระดับโค้ดจริงและรัน Full Regression Test Suite เรียบร้อยแล้ว มีผลการตรวจดังนี้:
  > 
  > 1. **เพิ่ม Server-side Integration Test สำหรับ `RESOLVED_OR_CLOSED` (NI-01 จากรอบที่ 2):**
  >    - เพิ่ม Test case `API-05 / AC-11` ใน `server/tests/lab-02/my-tickets.api.test.ts` และ Test describe `"Requester Ticket Drill-Down API Parity (AC-11, BR-16)"` ใน `server/tests/lab-04/requester-dashboard.api.test.ts` ครบถ้วนแล้ว
  >    - ทั้งสองชุดทดสอบใช้ Supertest ยิง HTTP จริงไปยัง `GET /api/tickets?status=RESOLVED_OR_CLOSED` และตรวจสอบ `capturedWhere.currentStatus` ว่าเท่ากับ `{ in: [TicketStatus.RESOLVED, TicketStatus.CLOSED] }` อย่างถูกต้อง
  >    - ไม่มี `.skip`, `.only`, `xtest` หรือ `xdescribe` ในไฟล์ทดสอบใหม่ ✓
  >    - หมายเหตุ: Test ยังไม่ได้ assert ว่าสถานะ `CANCELLED` ถูกตัดออก (ไม่อยู่ใน `in` list) อย่างชัดเจน แต่การตรวจสอบโค้ด `server/src/app.ts` L380–383 ยืนยันว่า `CANCELLED` ไม่ถูกรวมอยู่จริง เพียงแต่ถ้าต้องการ Test ที่สมบูรณ์ขึ้นในอนาคต อาจเพิ่ม negative assertion นี้ได้
  > 
  > 2. **แยก alias `"resolved"` ออกจากกลุ่ม `RESOLVED_OR_CLOSED` (NI-02 จากรอบที่ 2):**
  >    - ฟังก์ชัน `mapStatusFilter` ใน `client/src/components/MyTickets.tsx` (L22–29) แก้ไขแล้ว โดยแยก `s === "resolved"` ออกเป็น branch ของตัวเอง → map ไปยัง `"RESOLVED"` เดี่ยว ๆ
  >    - สงวน `"resolved_or_closed"` และ `"completed"` ไว้สำหรับ `"RESOLVED_OR_CLOSED"` เท่านั้น ป้องกันปัญหา Alias Collision สมบูรณ์
  >    - เพิ่ม JSDoc comment ที่ L18–21 อธิบาย Intent ชัดเจนว่า `"resolved_or_closed"` ใช้สำหรับ Dashboard Card 3 (AC-11) โดยเฉพาะ ✓
  > 
  > 3. **ชุดการทดสอบอัตโนมัติและความเข้ากันได้ย้อนหลัง (Regression Suite):**
  >    - ตรวจสอบแล้วไม่มี `.skip`, `.only`, `xtest`, หรือ `xdescribe` ในทุกไฟล์ที่แก้ไข ✓
  >    - รัน Full Test Suite ทั้งระบบ: Client ผ่าน 16 ไฟล์ (101/101 เทสต์) และ Server ผ่าน 22 ไฟล์ (209/209 เทสต์) รวมทั้งสิ้น **310 เทสต์ผ่าน 100%** Lab 1–3 Regression ผ่านครบ Zero Regression ✓
  > 
  > ---
  > 
  > **คำตัดสิน: Approve** — ข้อค้นพบทั้งหมดจากรอบที่ 1 และรอบที่ 2 ได้รับการแก้ไขสมบูรณ์มีหลักฐานยืนยันในโค้ดจริง งาน Requester Dashboard Frontend UI ของ Issue 34 มีคุณภาพ ถูกต้องตามข้อกำหนด AC-11 และ BR-16 ครบถ้วน"
- **Round 3 Reviewer Feedback Items & My Responses:**
  - *Reviewer Feedback:* All findings from Rounds 1 and 2 verified complete in code and tests. Full regression suite passed (310 tests, 0 skipped). Approved and merged.
  - *My Action:* Merged by @phatthidawadi into `lab4-staging` via PR #76. Closed Issue #66 on GitHub.
- **Status:** Approved and merged into `lab4-staging` by @phatthidawadi (2026-10-18T20:34:41Z).
 
 ---
 
### Issue 35 - End-to-End Automation, Responsive Visual Evidence & Accessibility Audit

- **Pull Request:** [#77](https://github.com/lmaybelgracel/TokTickit/pull/77)
- **Branch:** `feature/35-e2e-automation-and-audit`
- **Summary:** Delivers comprehensive automated Playwright E2E suites for Sprint 4 covering Actions Taken recording and authorization (`actions-taken-flow.spec.ts`), formal ticket resolution gate and concurrency conflicts (`ticket-resolution.spec.ts`), operational and personal dashboard drill-down navigation and mobile responsive layout audits (`dashboards.spec.ts`), multi-viewport screenshot evidence across Desktop (1280px), Tablet (768px), Mobile (375px), and Small Mobile (320px) under `artifacts/lab-04/screenshots/`, and WCAG 2.1 AA accessibility checks (`visual-evidence.spec.ts`).
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-19T13:53:36Z):
  > "### ผลการตรวจประเมิน Issue 35 - Sprint 4 End-to-End Automation, Responsive Visual Evidence & Accessibility Audit
  > 
  > จากการตรวจสอบโค้ดและผลการทดสอบอย่างละเอียดใน PR #77 (Commit `ab0bb01`) ครอบคลุมชุดทดสอบ Playwright E2E, การตรวจสอบ WCAG 2.1 AA Accessibility, Responsive Zero Horizontal Scrollbar Audit และการอัปเดต README.md พบว่าระบบทำงานได้อย่างถูกต้อง มีคุณภาพสูงมาก และรันชุดทดสอบผ่าน 100% ทั้งหมด อย่างไรก็ตาม ยังมีจุดบกพร่องด้าน Script และพาธการบันทึกภาพหลักฐานอัตโนมัติที่ต้องขอให้ปรับปรุงเพิ่มเติมก่อนจึงจะสามารถอนุมัติได้ ดังนี้:
  > 
  > 1. **[README.md:บรรทัด 188 & package.json] คำสั่ง `npm run test:full` ไม่มีอยู่ใน `package.json`:**
  >    - ใน `README.md` หัวข้อ 3. Full Regression Suite (310 Tests Passing) ระบุให้รันคำสั่ง `npm run test:full` เพื่อรันทั้ง server และ client พร้อมกัน
  >    - แต่ใน `package.json` (Root) มีเพียงคำสั่ง `"install:e2e"` และ `"test:e2e"` รวมถึงใน `client/package.json` และ `server/package.json` ก็ไม่มีสคริปต์ชื่อ `test:full`
  >    - หากผู้ตรวจประเมินหรืออาจารย์ clone โค้ดมาแล้วรันคำสั่งตาม README จะเกิดข้อผิดพลาด `npm ERR! Missing script: "test:full"`
  >    - **สิ่งที่ต้องแก้:** เพิ่ม script ใน Root `package.json` เช่น `"test:full": "npm --prefix server test && npm --prefix client test"` หรือปรับคำแนะนำใน `README.md` ให้ตรงกับคำสั่งที่ใช้งานได้จริง
  > 
  > 2. **[e2e/lab-04/visual-evidence.spec.ts] พาธบันทึกภาพหน้าจอของ Playwright ไม่ตรงกับโครงสร้างโฟลเดอร์ใน README และ Handout:**
  >    - ใน `visual-evidence.spec.ts` (บรรทัด 139–163, 233–257, 325–333) กำหนดพาธเซฟภาพหน้าจอไปยัง `artifacts/lab-04/screenshots/dashboards/` และ `artifacts/lab-04/screenshots/actions/`
  >    - แต่ตามโครงสร้างเอกสารใน `README.md` (บรรทัด 79–83) และที่ mirror เพิ่มเติมใน commit `19c5927` กำหนดให้จัดเก็บในโฟลเดอร์แยกตามหัวข้อ ได้แก่ `staff-dashboard/`, `requester-dashboard/`, และ `actions-taken/`
  >    - ส่งผลให้เมื่อรันคำสั่ง `npx playwright test e2e/lab-04/visual-evidence.spec.ts` ในรอบถัดไป ภาพหน้าจอในโฟลเดอร์หลักจะไม่ได้รับการอัปเดตอัตโนมัติ และยังต้องคอยย้ายไฟล์ด้วยตนเอง
  >    - **สิ่งที่ต้องแก้:** ปรับพาธเอาต์พุตใน `e2e/lab-04/visual-evidence.spec.ts` ให้บันทึกลงโฟลเดอร์ปลายทางที่ถูกต้องโดยตรง (`staff-dashboard/`, `requester-dashboard/`, และ `actions-taken/`) เพื่อให้เป็น Automated Pipeline สมบูรณ์
  > 
  > 3. **[docs/lab-04/reviewer.md] สถานะการรีวิว:**
  >    - บันทึกข้อเสนอแนะและอัปเดตสถานะการประเมินของ Issue 35 / PR #77 ลงในตารางประวัติการรีวิวของ `docs/lab-04/reviewer.md`
  > 
  > **คำตัดสิน: Request Changes** — รบกวนแก้ไข 3 จุดนี้และพุชคอมมิตใหม่"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Missing `test:full` Script in Root `package.json`:**
     - *Reviewer Feedback:* In `README.md`, instructions specified running `npm run test:full` for full regression testing, but the script was missing from root `package.json`, causing an error for evaluators.
     - *My Action:* Added `"test:server"`, `"test:client"`, `"test:full": "npm --prefix server test && npm --prefix client test"`, and `"build": "npm --prefix client run build"` into root `package.json`. Verified command runs both suites successfully (310/310 passing tests in 7.1s).
  2. **Comment on Screenshot Save Paths in Playwright Spec:**
     - *Reviewer Feedback:* In `e2e/lab-04/visual-evidence.spec.ts`, screenshots were saved to `dashboards/` and `actions/` rather than the canonical directories specified in README and Handout Section 12 (`staff-dashboard/`, `requester-dashboard/`, `actions-taken/`).
     - *My Action:* Updated all output screenshot paths in `e2e/lab-04/visual-evidence.spec.ts` to save directly into `artifacts/lab-04/screenshots/staff-dashboard/`, `artifacts/lab-04/screenshots/requester-dashboard/`, and `artifacts/lab-04/screenshots/actions-taken/` automatically during test execution.
  3. **Comment on Reviewer Tracking Record:**
     - *Reviewer Feedback:* Record Round 1 Changes Requested review and response actions in `docs/lab-04/reviewer.md`.
     - *My Action:* Recorded Round 1 review comments verbatim, updated summary table to `Changes Requested`, and detailed response actions in `docs/lab-04/reviewer.md`.
- **Round 1 Verdict:** Changes Requested
- **Round 2 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-19T15:09:24Z):
  > "### ข้อเสนอแนะเพิ่มเติม
  > 
  > จากการตรวจสอบความสมบูรณ์ของชุดทดสอบ E2E อย่างละเอียด พบจุดที่ต้องขอให้ปรับปรุงเพิ่มเติมก่อนอนุมัติ ดังนี้:
  > 
  > 1. **[False Positive Assertion ใน `dashboards.spec.ts`]:**
  >    - ในบรรทัด 154–157 มีการเขียน `if (await ownerFilterSelect.isVisible())` โดยค้นหาจาก `<select>` แต่เนื่องจากใน `StaffTicketQueue.tsx` ตัวกรอง Ownership เป็นปุ่ม `<button>` ไม่ใช่ `<select>` ทำให้เงื่อนไขนี้เป็น `false` เสมอ และข้ามการ Assert ไปโดยสิ้นเชิง
  >    - **สิ่งที่ต้องแก้:** ลบ `if` ออก และเปลี่ยนไปตรวจสอบปุ่ม Toggle เช่น:
  >      `await expect(page.getByRole("button", { name: "Unassigned" })).toHaveClass(/staff-queue__toggle-btn--active/);`
  > 
  > 2. **[ขาดการ Assert Matching Count ใน `dashboards.spec.ts`]:**
  >    - ตามสเปก `E2E-DASH-01` และ AC-11 กำหนดให้ทดสอบว่าคลิกการ์ดแล้วต้อง *"land on filtered queue matching count"* แต่ตัวเทสต์ยังไม่ได้ Assert ตรวจสอบจำนวนรายการในตารางคิวงานเลย
  >    - **สิ่งที่ต้องแก้:** ปรับ Mock ตั๋วให้มี 2 ใบตรงกับตัวเลขบนการ์ด และเพิ่ม Assertion นับจำนวนแถวในตาราง
  > 
  > 3. **[README ระบุการทดสอบ 409 Conflict เกินจริงใน `ticket-resolution.spec.ts`]:**
  >    - ใน `README.md` (บรรทัด 203) ระบุว่า `ticket-resolution.spec.ts` ครอบคลุม "409 Conflict handling on stale updates" แต่ในตัวเทสต์จริงมีเพียง Happy Path ของการ Resolve เท่านั้น
  >    - **สิ่งที่ต้องแก้:** เพิ่มขั้นตอนการทดสอบกรณี 409 หรือปรับข้อความใน README ให้ตรงกับพฤติกรรมจริงของเทสต์
  > 
  > รบกวนปรับปรุง 3 จุดนี้เพื่อให้ Test Suite มีความน่าเชื่อถือสมบูรณ์ 100%"
- **Reviewer Feedback Items & My Responses (Round 2):**
  1. **Comment on False-Positive Toggle Button Assertion (`dashboards.spec.ts`):**
     - *Reviewer Feedback:* Ownership filter was checked using conditional `select` check which always evaluated to false because `StaffTicketQueue.tsx` uses button toggles.
     - *My Action:* Removed conditional wrapper and asserted directly against button role: `await expect(page.getByRole("button", { name: "Unassigned" })).toHaveClass(/staff-queue__toggle-btn--active/)`.
  2. **Comment on Missing Matching Count Parity Assertion (`dashboards.spec.ts`):**
     - *Reviewer Feedback:* Spec required verifying landing on filtered queue matching count, but row count assertion was missing.
     - *My Action:* Updated mock to return 2 unassigned tickets when `ownerId=unassigned` and asserted `expect(page.locator(".staff-queue__table tbody tr")).toHaveCount(2)`, proving exact count parity with the unassigned metric card (`AC-11`).
  3. **Comment on 409 Conflict Handling Test in `ticket-resolution.spec.ts`:**
     - *Reviewer Feedback:* README claimed 409 conflict testing on stale updates, but spec only tested happy path resolution.
     - *My Action:* Added dedicated automated test case `E2E-RES-02` in `ticket-resolution.spec.ts` simulating concurrent stale update, verifying that HTTP 409 Conflict triggers the conflict alert banner in the resolution modal dialog and requests fresh ticket data (`AC-08`).
- **Round 2 Verdict:** Changes Requested
- **Round 3 Review Comments from @phatthidawadi (2026-10-19T15:30:27Z):**
  > "### คำตัดสินสุดท้าย (Final Verdict)
  > 
  > **คำตัดสิน: Approve**
  > 
  > **เหตุผล:** ข้อค้นพบและข้อสงสัยทั้งหมดจากรอบที่ 2 (REV2-01, REV2-02, REV2-03) ได้รับการแก้ไขที่ต้นเหตุอย่างครบถ้วนและประจักษ์ชัดในโค้ด:
  > - ตัวกรอง Unassigned ได้รับการตรวจสอบบน Active Toggle Button จริง ปราศจาก False Positive
  > - มีการ Assert ยืนยัน Matching Count Parity ตามข้อกำหนด `E2E-DASH-01` และ AC-11 ครบถ้วน
  > - เพิ่มชุดทดสอบ E2E สำหรับ HTTP 409 Stale Update Concurrency Guard (AC-08) ตรงตามที่ระบุใน README อย่างแท้จริง
  > - ชุดทดสอบทั้งหมด 310 Vitest tests และ 9 Playwright E2E tests ผ่าน 100% โค้ดมีคุณภาพและความน่าเชื่อถือสูงสุด"
- **Round 3 Verdict:** Approved
- **Status:** Approved and Merged into `lab4-staging` by @phatthidawadi on 2026-10-19.

---

## 2. Pull Requests I Reviewed for Partner (@chanya06)

**Partner author:** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

| PR | Issue / Branch | My Review Verdict | Status | Link |
|:---|:---------------|:------------------|:-------|:-----|
| [#72](https://github.com/chanya06/toktickit/pull/72) | docs(lab-04): establish Sprint 4 engineering contract and specifications / `feature/29-spec-and-tests` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #72](https://github.com/chanya06/toktickit/pull/72) |
| [#81](https://github.com/chanya06/toktickit/pull/81) | feat(db): Actions Taken Foundation - Schema, Prisma Migration & Seed Data (Issue #74) / `feature/30-db-schema-actions-taken` | Approved | Merged | [PR #81](https://github.com/chanya06/toktickit/pull/81) |
| [#82](https://github.com/chanya06/toktickit/pull/82) | feat(api): Actions Taken Backend REST APIs, Authorization & Concurrency (Issue #75) / `feature/31-actions-taken-api` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #82](https://github.com/chanya06/toktickit/pull/82) |
| [#83](https://github.com/chanya06/toktickit/pull/83) | feat(ui): Actions Taken UI on Ticket Detail Screen & Responsive Cards (Issue #76) / `feature/32-actions-taken-ui` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #83](https://github.com/chanya06/toktickit/pull/83) |
| [#84](https://github.com/chanya06/toktickit/pull/84) | feat(api): Role Dashboards REST APIs (Requester & IT Staff Metrics) (Issue #77) / `feature/33-dashboard-api` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #84](https://github.com/chanya06/toktickit/pull/84) |
| [#85](https://github.com/chanya06/toktickit/pull/85) | feat(ui): Role Dashboards UI: Metric Cards, Recent Activity & Drill-Down (Issue #78) / `feature/34-dashboard-ui` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #85](https://github.com/chanya06/toktickit/pull/85) |
| [#86](https://github.com/chanya06/toktickit/pull/86) | feat(workflow): Ticket Workflow Hardening, Resolution Gate & Concurrency Control (Issue #79) / `feature/35-ticket-workflow-hardening` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #86](https://github.com/chanya06/toktickit/pull/86) |

---

### Partner PR Detailed Review Logs

### docs(lab-04): establish Sprint 4 engineering contract and specifications

- **Pull Request:** [#72](https://github.com/chanya06/toktickit/pull/72)
- **Branch:** `feature/29-spec-and-tests`
- **Target Branch:** `lab4-staging`
- **Merged By:** @lmaybelgracel at 2026-10-30T10:53:48Z

#### Round 1 Review Verdict & Summary (2026-10-30T10:30:08Z)

- **Verdict:** **Changes Requested**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ### ผลการรีวิว Sprint 4 Engineering Contract (PR #72) - CHANGES REQUESTED
  > 
  > จากการตรวจสอบเอกสารสัญญาทางวิศวกรรมใน `docs/lab-04/` เทียบกับข้อกำ��นดในคู่มือปฏิบัติการ Lab 4 อย่างละเอียด พบข้อบกพร่องสำคัญ 4 จุดที่ขัดต่อเกณฑ์การประเมินของอาจารย์ เอกสารชุดนี้ยังไม่สามารถอนุมัติให้ผ่านได้ และต้องได้รับการแก้ไขในสาขา `feature/29-spec-and-tests` ให้ครบถ้วนก่อนการ Merge:
  > 
  > 1. **การขาดฟิลด์ผู้รับมอบหมายงาน (`assigneeId`) ในโมเดลและ API**
  >    - เกณฑ์บังคับ: Handout Section 9.1 (AC-01) ระบุว่าต้องบันทึกทั้ง authenticated creator และ approved assignee และ Handout Section 14 (Answer Part 6) ระบุให้ทดสอบ assign งานและ inactive-assignee rejection
  >    - ข้อผิดพลาด: ใน `specification.md` (หัวข้อ 7.1) และ `api-spec.md` (หัวข้อ 2) มีเฉพาะฟิลด์ `performedById String` ทำให้ไม่สามารถแยกผู้รับมอบหมายงาน และไม่สามารถทดสอ���กรณี Inactive Assignee Rejection ตามเกณฑ์ได้
  >    - สิ่งที่ต้องแก้ไข: เพิ่มฟิลด์ `assigneeId: String?` เชื่อมโยงกับโมเดล `User` ควบคู่กับ `performedById: String` ทั้งใน Prisma Schema และ API Payloads
  > 
  > 2. **การขาดขั้นตอน Rollback และแผนการกู้คืนฐานข้อมูล**
  >    - เกณฑ์บังคับ: Handout Section 5.2 กำหนดให้ต้องมีการระบุและทดสอบขั้นตอนการย้อนกลับสกีมา (Migration Rollback) และการกู้คืนข้อมูล (Recovery Approach)
  >    - ข้อผิดพลาด: ใน `specification.md` หัวข้อ 7 มีเพียงการอธิบายเหตุผลเรื่อง Nullable Legacy Support แต่ไม่มีเนื้อหาขั้นตอนการทำ Rollback หรือ Disaster Recovery หากการ Migration ล้มเหลว
  >    - สิ่งที่ต้องแก้ไข: เพิ่มหัวข้อย่อยใน Section 7 ของ `specification.md` ระบุคำสั่งและขั้นตอนการทำ Migration Rollback และแนวทางการกู้คืนฐานข้อมูล
  > 
  > 3. **การขาดเคสทดสอบบังคับในตาราง Traceability Matrix**
  >    - เกณฑ์บังคับ: Handout Section 10 กำหนดให้แผนการทดสอบต้องครอบคลุม Unit, Integration, UI Component, UI Style, Responsive, Authorization, Workflow, Migration/Regression และ Performance-Smoke
  >    - ข้อผิดพลาด: ตารางใน `tests.md` มีเฉพาะเคสฟังก์ชันทั่วไป แต่ขาดแถวการทดสอบเฉพาะทางที่อาจารย์ระบุ
  >    - สิ่งที่ต้องแก้ไข: เพิ่มแถวการทดสอบใน `tests.md` ให้ครบถ้วน:
  >      - UI Style & Responsive: การตรวจสอบ Zero Horizontal Overflow บนหน้าจอมือถือความกว้าง 375px
  >      - Accessibility: การตรวจสอบ Visible Focus Rings และการนำทางด้วยคีย์บอร์ดตามเกณฑ์ WCAG AA
  >      - Performance-Smoke: การตรวจสอบเวลาในการ Query และรวมข้อมูลของแดชบอร์ด
  >      - Migration & Rollback: การตรวจสอบความถูกต้องของการ Migration และการย้อนกลับข้อมูล
  > 
  > 4. **การขาดพฤติกรรมกรณีไร้ข้อมูล (Empty Behavior) และเงื่อนไข Resolution Gate**
  >    - เกณฑ์บังคับ: Handout Section 4.6 และ 6.2 ระบุว่าการ์ดแดชบอร์ดต้องระบุพฤติกรรมเมื่อไม่มีข้อมูล (Empty Behavior) และเป้าหมายการ Drill-down และ Section 4.5 ระบุว่าการเปลี่ยนสถานะตั๋วสู่ RESOLVED ต้องผ่านการตรวจสอบงานจริงของ IT Staff
  >    - ข้อผิดพลาด: ยังไม่ได้ระบุการแสดงผลของการ์ดเมตริกเมื่อค่าเป็น 0 หรือตารางแดชบอร์ดเมื่อไม่มีตั๋ว และกฎ `BR-08` ยังไม่ได้ระบุเงื่อนไขความสัมพันธ์ระหว่างการ Resolve ตั���วกับสถานะของ Actions Taken
  >    - สิ่งที่ต้องแก้ไข: ระบุ Empty State ของการ์ดและตารางแดชบอร์ดใน `specification.md` และ `ui-spec.md` และระบุเงื่อนไขในกฎ `BR-08` ให้ชัดเจนว่าการเปลี่ยนสถานะตั๋วเป็น `RESOLVED` จะต้องไม่มี Action Taken ค้างอยู่ในสถานะ `PENDING` หรือ `IN_PROGRESS`
  > 
  > ขอให้ดำเนินการแก้ไขเอกสารทั้ง 4 จุดนี้ให้เรียบร้อยแล้ว push commit อัปเดตเข้ามา เพื่อทำการตรวจทานซ้ำก่อนพิจารณาอนุมัติ

#### Round 2 Review Verdict & Summary (2026-10-30T10:50:47Z)

- **Verdict:** **Approved**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > จากการตรวจสอบความเปลี่ยนแปลงในคอมมิต ed5e118 ตามข้อกำหนดของ Handout Lab 4 พบว่าได้ทำกา��ปรับปรุงและแก้ไขเอกสารสัญญาทางวิศวกรรมครบถ้วนทุกประเด็น:
  > 
  > 1. การเพิ่มฟิลด์ผู้รับมอบหมายงาน (assigneeId):
  >    - เพิ่มฟิลด์ assigneeId: String? ควบคู่กับ performedById: String ใน Prisma Schema (specification.md หัวข้อ 7.1) พร้อมเชื่อมโยงความสัมพันธ์ @relation("ActionAssignee") กับโมเดล User และสร้าง Index ครบถ้วน
  >    - สัญญา REST API ใน api-spec.md ระบุการรับและส่งคืน assigneeId พร้อมกฎ Inactive Assignee Rejection ปฏิเสธด้วย HTTP 422 หากมอบหมายให้ผู้ใช้ที่ isActive เป็น false หรือบทบาท Requester
  >    - ส่วนติดต่อผู้ใช้ใน ui-spec.md มีการเพิ่มคอลัมน์ Assigned To และตัวเลือก Assignee ใน Create/Edit Modal
  > 
  > 2. ขั้นตอนการ Rollback และการกู้คืนฐานข้อมูล:
  >    - เพิ่มหัวข้อ 7.3 ใน specification.md ระ���ุคำสั่ง DDL Reverse Migration ในการ Drop ตาราง ActionTaken และ Enum Type ได้อย่างปลอดภัย
  >    - ระบุคำสั่ง npx prisma migrate resolve --rolled-back และแนวทาง Disaster Recovery ด้วย pg_dump / pg_restore พร้อมยืนยันการใช้ Outer Join ไม่กระทบตั๋วเดิมจาก Lab 1-3
  > 
  > 3. ตาราง Test Traceability Matrix และเคสทดสอบเฉพาะทาง:
  >    - เพิ่มเคสทดสอบ STYLE-01 (Zero Horizontal Overflow บนหน้าจอ 375px)
  >    - เพิ่มเคสทดสอบ A11Y-01 (Visible Focus Rings #006B3C และการนำทางด้วยคีย์บอร์ดตามเกณฑ์ WCAG AA)
  >    - เพิ่มเคสทดสอบ PERF-01 (การตอบสนองของแดชบอร์ดต่ำกว่า 100ms)
  >    - เพิ่มเคสทดสอบ MIGR-01 (การทดสอบ Migration และ Rollback โดยข้อมูลเดิมคงอยู่ครบถ้วน)
  >    - ปรับเป้าหมายการทดสอบครอบคลุมมากกว่า 370 เคส พร้อมคง Regression เดิม 277 ��คส
  > 
  > 4. การกำหนด Empty Behavior และเงื่อนไข Resolution Gate:
  >    - กำหนดพฤติกรรมเมื่อค่าของการ์ดเมตริกเป็น 0 และข้อความกล่อง Empty State เมื่อไม่มีตั๋วในคิวแดชบอร์ดอย่างชัดเจนใน specification.md (BR-09, BR-10) และ ui-spec.md
  >    - ระบุเงื่อนไขในกฎ BR-08, AC-10 และ api-spec.md ว่าการเปลี่ยนสถานะตั๋วสู่ RESOLVED จะต้องไม่มี Action Taken ค้างอยู่ในสถานะ PENDING หรือ IN_PROGRESS มิฉะนั้นจะถูกปฏิเสธด้วย HTTP 422 ทันที
  > 
  > 5. เอกสารกระบวนการพัฒนา (reviewer.md และ ai-use.md):
  >    - บันทึกข้อเสนอแนะจากการรีวิวและแผนการแก้ไขอย่างเป็นระบบ และบันทึก Prompt การใช้งาน AI ไว้อย่างสมบูรณ์
  > 
  > เอกสารสัญญาทางวิศวกรรมของ Lab 4 มีความครบถ้วน ถูกต้องตามข้อกำหนดทุกข้อ ขออนุมัติ (Approved) ให้ดำเนินการควบรวมเข้าสู่ lab4-staging เพื่อเริ่มงานขั้นตอนการพัฒนา (Implementation) ได้

---

### feat(db): Actions Taken Foundation - Schema, Prisma Migration & Seed Data (Issue #74)

- **Pull Request:** [#81](https://github.com/chanya06/toktickit/pull/81)
- **Branch:** `feature/30-db-schema-actions-taken`
- **Target Branch:** `lab4-staging`
- **Merged By:** @lmaybelgracel at 2026-10-30T13:01:27Z

#### Round 1 Review Verdict & Summary (2026-10-30T12:52:07Z)

- **Verdict:** **Approved**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ### ผลการตรวจทานการแก้ไข (Review Round 2: Verification & Approval)
  > 
  > จากการตรวจทานการปรับปรุงโค้ดและเอกสารในคอมมิต `daf44b3` บนสาขา `feature/30-db-schema-actions-taken` ตามข้อกำหนดของ Handout Lab 4 (Sections 4.5, 5.1, 5.2, 5.3, 10 และ 14) พบว่าผู้พัฒนาได้ดำเนินการแก้ไขข้อบกพร่องครบถ้วนทั้ง 4 ประเด็นอย่างสมบูรณ์:
  > 
  > 1. **การปรับปรุงชุดทดสอบการย้อนกลับสกีมา (MIGR-01d Rollback DDL Verification):**
  >    - มีการจำลองโครงสร้างสกีมาจริงอย่างสมบูรณ์ ประกอบด้���ยประเภทข้อมูล Enum `ActionTakenStatus_RollbackSim`, คอลัมน์ครบถ้วน, และข้อจำกัด Foreign Key Constraints ไปยังโมเดล `Ticket` (CASCADE) และ `User` (RESTRICT / SET NULL)
  >    - มีการทดสอบการแทรกข้อมูลจริงเพื่อยืนยันว่าข้อจำกัด Referential Integrity ทำงานอย่างถูกต้องก่อนรันคำสั่ง Down-migration DDL
  >    - คำสั่ง `DROP TABLE IF EXISTS "ActionTaken_RollbackSim" CASCADE;` และ `DROP TYPE IF EXISTS "ActionTakenStatus_RollbackSim";` ดำเนินการสำเร็จโดยสมบูรณ์ และได้รับการตรวจสอบยืนยันผ่านแคตตาล็อกระบบ `information_schema.tables` และ `pg_type` ว่าไม่มีอ็อบเจกต์หรือประเภทข้อมูลค้างอยู่ในระบบ
  > 
  > 2. **ความครอบคลุมของชุดข้อมูลตั้งต้น (Complete Ticket Lifecycle Seed Data):**
  >    - มีการเพิ่มตั๋วตัวอย่าง `TKT-2026-000007` ในสถานะ `REOPENED` ���ละ `TKT-2026-000008` ในสถานะ `CANCELLED` พร้อมทั้งระบุ Actions Taken ที่สอดคล้องกับบริบทการทำงานจริง
  >    - อัปเดตตัวแปร `seedTicketNumbers` ครอบคลุมตั๋วทั้ง 8 ใบ ทำให้ชุดข้อมูลตั้งต้นรองรับวงจรชีวิตของตั๋วครบทั้ง 8 สถานะตาม Handout Section 4.5 และยังคงรักษาคุณสมบัติความเป็น Idempotent สามารถรันซ้ำได้โดยไม่ก่อให้เกิดข้อมูลซ้ำซ้อน
  > 
  > 3. **การบันทึกเอกสารกระบวนการรีวิว (Review Evidence Tracking):**
  >    - มีการเพิ่มหัวข้อ `Review Round 2: PR #81 (feature/30-db-schema-actions-taken)` ใน `docs/lab-04/reviewer.md` บันทึกรายละเอียดข้อเสนอแนะของผู้ตรวจและแผนการแก้ไขของผู้พัฒนาไว้อย่างเป็นระเบียบ เป็นไปตามเกณฑ์การประเมินของ Handout Section 14 (Part 1)
  > 
  > 4. **การบันทึกเหตุผลการตัดสินใจทางสถาปัตยกรรม (Architectural Decision Records):**
  >    - มีการระบุข้อความชี้แจง "Decision 4: Application-Layer Enforcement of Conditional Follow-up Invariants over Database CHECK Constraints" ใน `docs/lab-04/specification.md` หัวข้อ 7.2 ไว้อย่างชัดเจน โดยให้เหตุผลเชิงวิศวกรรมเรื่องการส่งรหัสข้อผิดพลาดระดับ HTTP 400 ที่ระบุฟิลด์ได้เจาะจงเพื่อนำไปแสดงผลบน UI ควบคู่กับความยืดหยุ่นในการพกพาของ ORM Schema
  > 
  > **สรุปผลการประเมิน:**  
  > การดำเนินงานในส่วนโครงสร้างฐานข้อมูล การย้ายข้อมูล ข้อมูลตั้งต้น และชุดทดสอบ ได้มาตรฐานตามสัญญาทางวิศวกรรมทุกประการ  
  > **ผลการรีวิว:** อนุมัติ (Approved) ให้ควบ��วมสาขาเข้าสู่ `lab4-staging` เพื่อดำเนินงานพัฒนาในส่วน Actions Taken REST API ลำดับถัดไป

---

### feat(api): Actions Taken Backend REST APIs, Authorization & Concurrency (Issue #75)

- **Pull Request:** [#82](https://github.com/chanya06/toktickit/pull/82)
- **Branch:** `feature/31-actions-taken-api`
- **Target Branch:** `lab4-staging`
- **Merged By:** @lmaybelgracel at 2026-10-30T13:40:52Z

#### Round 1 Review Verdict & Summary (2026-10-30T13:27:29Z)

- **Verdict:** **Changes Requested**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ### ผลการตรวจทานสัญญาทางวิศวกรรมและการทำงานของระบบ (Review Round 3: Defect Inspection)
  > 
  > จากการตรวจทานโค้ดสถาปัตยกรร�� REST API การควบคุมการเข้าถึง และการจัดการความสอดคล้องของข้อมูลใน PR #82 (สาขา `feature/31-actions-taken-api`) เทียบกับเกณฑ์บังคับของอาจารย์ใน Handout Lab 4 (Sections 4.1, 4.2, 5.1, 6.1, 10 และ 14) พบข้อบกพร่องสำคัญ 4 จุดที่ต้องได้รับการแก้ไขก่อนการอนุมัติ:
  > 
  > 1. **การละเมิดกฎสถานะสิ้นสุดในคำสั่ง PUT (`PUT /api/tickets/:id/actions/:actionId`):**
  >    - *เกณฑ์บังคับ:* Handout Section 4.2 และ Business Rule `BR-03` กำหนดว่าสถานะ `COMPLETED` และ `CANCELLED` เป็นสถานะสิ้นสุดของประวัติการดำเนินงาน (Final read-only audit trail) ไม่สามารถเปิดใหม่ แก้ไข หรือเปลี่ยนสถานะกลับได้
  >    - *ข้อผิดพลาด:* โค้ดในเส้นทาง `actionsRouter.put` ไม่มีการตรวจสอบสถานะเดิมของ `existingAction.status` ทำ���ห้ไคลเอนต์สามารถส่งคำสั่ง `PUT` เพื่อแก้ไขเนื้อหาและเปลี่ยนสถานะของ Action ที่ `COMPLETED` หรือ `CANCELLED` ไปแล้วกลับมาเป็น `PENDING` หรือ `IN_PROGRESS` ได้ ซึ่งทำให้กลไกการป้องกันในคำสั่ง `PATCH` ถูกหลีกเลี่ยง
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเงื่อนไขตรวจสอบในคำสั่ง `PUT` ว่าหาก `existingAction.status` เป็น `COMPLETED` หรือ `CANCELLED` ให้ปฏิเสธคำขอด้วยรหัส HTTP 422 Unprocessable Entity ทันที
  > 
  > 2. **การบังคับใช้ Transition Matrix ของกฎ `BR-03` ในคำสั่ง PATCH ไม่ครบถ้วน:**
  >    - *เกณฑ์บังคับ:* ข้อกำหนด `BR-03 (Action Taken Status Machine)` ใน `specification.md` กำหนดให้สถานะ `PENDING` สามารถเปลี่ยนผ่านได้เฉพาะ `IN_PROGRESS` หรือ `CANCELLED` เท่านั้น (ห้ามเปลี่ยนข้ามขั้นเ���็น `COMPLETED` โดยไม่ผ่านการลงมือปฏิบัติงาน)
  >    - *ข้อผิดพลาด:* ใน `actionsRouter.patch` มีการดักจับเฉพาะกรณีสถานะเดิมเป็น `COMPLETED` หรือ `CANCELLED` แต่ยังขาดการตรวจสอบสถานะ `PENDING` ส่งผลให้สามารถส่งคำสั่งเปลี่ยนจาก `PENDING` ไปเป็น `COMPLETED` ได้โดยตรง
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเงื่อนไขตรวจสอบสถานะต้นทาง `PENDING` ไม่ให้อน��ญาตการเปลี่ยนสู่ `COMPLETED` โดยตรง และตอบกลับด้วย HTTP 422 เมื่อเกิดการเปลี่ยนผ่านที่ผิดกฎ
  > 
  > 3. **การขาดหัวข้อบันทึกการรีวิว PR #82 ในเอกสารกระบวนการวิศวกรรม (`docs/lab-04/reviewer.md`):**
  >    - *เกณฑ์บังคับ:* Handout Section 14 (Answer Part 1) กำหนดให้เอกสาร `reviewer.md` ต้องปรากฏหลักฐานการรีวิวของทุก Pull Request ประกอบด้วยลิงก์ PR, ข้อคิดเห็น/ข้อบกพร่องที่พบ (Comments), การตอบกลับ (Responses) และการอนุมัติ (Approvals)
  >    - *ข้อผิดพลาด:* ใน `docs/lab-04/reviewer.md` มีเพียงการระบุสถานะในตารางสรุป แต่ยังไม่มีหัวข้อเนื้อหา `Review Round 3: PR #82 (feature/31-actions-taken-api)` ที่บันทึกรายละเอียดข้อคิดเห็นการตรวจทาน
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มหัวข้อ `Review Round 3: PR #82` ใน `reviewer.md` บันทึกข้อเสนอแนะในการปรับปรุง และเปิดพื้นที่ให้ผู้พัฒนาตอบกลับแผนการแก้ไข
  > 
  > 4. **การขาดเคสทดสอบอัตโนมัติสำหรับ Terminal State Protection ในคำสั่ง PUT:**
  >    - *เกณฑ์บังคับ:* Handout Section 10 กำหนดให้การบังคับใช้กฎทางธุรกิจ (Business Rules) ต้องมีชุดทดสอบอัตโนมัติรองรับอย่างครอบคลุม
  >    - *ข้อผิดพลาด:* ในไฟล์ `server/tests/lab-04/actions-taken.api.test.ts` มีเฉพาะเคสทดสอบการปฏิเสธในคำสั่ง `PATCH` (`API-04`) แต่ยังขาดการทดสอบยืนยันว่าคำสั่ง `PUT` จะต้องปฏิเสธการแก้ไข Action ที่อยู่ในสถานะ `COMPLETED` หรือ `CANCELLED`
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเคสทดสอบอัตโนมัติใน `actions-taken.api.test.ts` เพื่อยืนยันว่าการส่ง `PUT` ไปยัง Action ที่ปิดงานแล้วจะได้รับรหัส HTTP 422 เสมอ
  > 
  > ขอให้ดำเนินการแก้ไขทั้ง 4 จุดนี้ในสาขา `feature/31-actions-taken-api` และ push commit อัปเดตเข้ามาเพื่อทำการตรวจทานซ้ำ

#### Round 2 Review Verdict & Summary (2026-10-30T13:39:54Z)

- **Verdict:** **Approved**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ### ผลการตรวจทานการแก้ไข (Review Round 3: Verification & Approval)
  > 
  > จากการตรวจทานการปรับปรุงโค้ดและชุดทดสอบในคอมมิต `f473fc2` บนสาขา `feature/31-actions-taken-api` ตามข้อกำหนดของ Handout Lab 4 (Sections 4.1, 4.2, 5.1, 6.1, 10 และ 14) พบว่าผู้พัฒนาได้ดำเนินการแก้ไขข้อบกพร่องครบถ้วนทั้ง 4 ประเด็นอย่างสมบูรณ์:
  > 
  > 1. **การป้องกัน Terminal State ในคำสั่ง PUT (Audit Trail Integrity):**
  >    - มีการเพิ่มกลไกตรวจสอบสถานะสิ้นสุดใน `actionsRouter.put` โดยปฏิเสธการแก้ไข Action ที่อยู่ในสถานะ `COMPLETED` หรือ `CANCELLED` ด้วยรหัส HTTP 422 Unprocessable Entity ช่วยคุ้มครองความถูกต้องของประวัติการดำเนินงาน (Audit Trail) และป้องกันการหลีกเลี่ยงกฎความปลอดภัยของระบบ
  > 2. **การบังคับใช้ Status Transition Matrix (BR-03 Enforcement):**
  >    - มีการเพิ่มเงื่อนไขตรวจสอบใน `actionsRouter.patch` ปฏิเสธการเปลี่ยนสถานะข้ามขั้นจาก `PENDING` ไปเป็น `COMPLETED` โดยตรงด้วยรหัส HTTP 422 ทำให้การไหลของสถานะงานเป็นไปตามลำดับขั้นตอนการปฏิบัติงานจริงอย่างเคร่งครัด
  > 3. **ความครบถ้วนของชุดทดสอบอัตโนมัติ (Automated Test Verification):**
  >    - เพิ่มเคสทดสอบใน `actions-taken.api.test.ts` ครอบคลุมการปฏิเสธคำสั่ง PUT บน Action ที่ปิดงานแล้วทั้งสองสถานะ และการปฏิเสธคำสั่ง PATCH ที่ข้ามขั้น โดยชุดทดสอบทั้ง 26 เคสผ่านการตรวจสอบทั้งหมด
  > 4. **การบันทึกเอกสารกระบวนการพัฒนา (Review Evidence):**
  >    - เอกสาร `docs/lab-04/reviewer.md` ได้รับการปรับปรุงบันทึกข้อเสนอแนะและผลการแก้ไขสำหรับ Review Round 3 ครบถ้วนตามเกณฑ์การประเมินของ Handout Section 14 (Part 1)
  > 
  > **สรุปผลการประเมิน:**  
  > การทำงานของระบบ Actions Taken REST API มีความสมบูรณ์ ถูกต้องตามสัญญาวิศวกรรม และมีระบบควบคุมความปลอดภัยที่รัดกุม  
  > **ผลการรี��ิว:** อนุมัติ (Approved) ให้ดำเนินการควบรวมสาขาเข้าสู่ `lab4-staging` เพื่อดำเนินงานพัฒนาในส่วนหน้าจอ Actions Taken UI ลำดับถัดไป

---

### feat(ui): Actions Taken UI on Ticket Detail Screen & Responsive Cards (Issue #76)

- **Pull Request:** [#83](https://github.com/chanya06/toktickit/pull/83)
- **Branch:** `feature/32-actions-taken-ui`
- **Target Branch:** `lab4-staging`
- **Merged By:** @lmaybelgracel at 2026-10-30T14:31:30Z

#### Round 1 Review Verdict & Summary (2026-10-30T14:16:26Z)

- **Verdict:** **Changes Requested**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ### ผลการตรวจทานสัญญาทางวิศวกรรมและส่วนติดต่อผู้ใช้ (Review Round 4: UI Defect Inspection)
  > 
  > จากการตรวจทานโค้ดส่วนติดต��อผู้ใช้ Actions Taken บนหน้าจอ Ticket Detail และชุดทดสอบใน PR #83 (สาขา `feature/32-actions-taken-ui`) เทียบกับเกณฑ์บังคับของอาจารย์ใน Handout Lab 4 (Sections 6, 8.3, 10 และ 14) พบข้อบกพร่องสำคัญ 4 จุดที่ต้องได้รับการแก้ไขก่อนการอนุมัติ:
  > 
  > 1. **ข้อจำกัดในการสาธิตและทดสอบการปฏิเสธผู้รับมอบหมายที่ถูกระงับสิทธิ์ (Inactive-Assignee Rejection):**
  >    - *เกณฑ์บังคับ:* Handout Section 14 (Answer Part 6: Working Actions Taken UI) กำหนดให้ต้องสาธิตการทำงานของ "inactive-assignee rejection, role restrictions, safe failures" บนหน้าจอ UI
  >    - *ข้อผิดพลาด:* ใน `ActionsTakenSection.tsx` ตัวเลือกใน Dropdown มอบหมายงาน (`#action-assignee`) มีการใส่แอตทริบิวต์ `disabled={assignee.isActive === false}` ทำให้ผู้ใช้ไม่สามารถคลิกเลือกผู้ใช้ที่ถูกปิดใช้งานเพื่อทดสอบการตอบสนองความผิดพลาด HTTP 422 ของระบบได้
  >    - *สิ่งที่ต้องแก้ไข:* ปลดแอตทริบิวต์ `disabled` ออก และแสดงป้ายกำกับให้ชัดเจน เช่น `(Staff - Inactive)` เพื่อให้สามารถคลิกเลือกส่งคำขอไปยังระบบ และเปิดให้ระบบแสดงการปฏิเสธ HTTP 422 Unprocessable Entity ตามเกณฑ์การประเมิน Answer Part 6
  > 
  > 2. **การขาดการไฮไลต์ฟิลด์ที่เกิดข้อผิดพลาดแบบเฉพาะเจาะจง (Field-Level Inline Error Highlighting):**
  >    - *เกณฑ์บังคับ:* Handout Section 14 (Answer Part 9) และ `ui-spec.md` กำหนดเรื่อง "validation placement, keyboard focus, and safe-failure feedback"
  >    - *ข้อผิดพลาด:* เมื่อเกิด Validation Error หรือ API ส่งข้อผิดพลาดแบบระบุฟิลด์กลับมา (`field: "followUpNote"` หรือ `field: "actionDescription"`) ใน Modal มีเพียงการแสดงกล่อง Alert ด้านบนรวมกันจุดเดียว แต่ไม่มีการทำขอบสีแดงหรือคลาส `is-invalid` ที่ตัว Input หรือ Textarea ของฟิลด์นั้นโดยตรง
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มการผูกคลาส `is-invalid` หรือขอบสีแดงที่ฟิลด์ที่ระบุ เพื่อความชัดเจนในการแก้ไขข้อมูลและสอดคล้องกับเกณฑ์ Accessibility และ UI Polish
  > 
  > 3. **การขาดหัวข้อบันทึกการรีวิว PR #83 ในเอกสารกระบวนการวิศวกรรม (`docs/lab-04/reviewer.md`):**
  >    - *เกณฑ์บังคับ:* Handout Section 14 (Answer Part 1: Git Use with Engineering Workflow) กำหนดให้เอกสาร `reviewer.md` ต้องปรากฏหลักฐานการรีวิวของทุก PR ประกอบด้วย ตัวตนผู้ตรวจ ลิงก์ PR ข้อคิดเห็น/ข้อบกพร่องที่พบ (Comments) การตอบกลับของผู้พัฒนา (Responses) และผลการอนุมัติ (Approvals)
  >    - *ข้อผิดพลาด:* ใน `docs/lab-04/reviewer.md` มีเพียงการอัปเดตบรรทัด PR #83 ในตารางสรุปด้านบน แต่ยังไม่มีหัวข้อเนื้อหา `Review Round 4: PR #83 (feature/32-actions-taken-ui)`
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มหัวข้อ Review Round 4 สำหรับ PR #83 ใน `reviewer.md` บันทึกข้อเสนอแนะและเปิดพื้นที่ให้ผู้พัฒนาตอบกลับแผนการดำเนินงาน
  > 
  > 4. **การขาดเคสทดสอบอัตโนมัติสำหรับ Inactive Assignee Rejection ในชุดทดสอบหน้าบ้าน (`ActionsTaken.test.tsx`):**
  >    - *เกณฑ์บังคับ:* Handout Section 10 กำหนดให้ Acceptance Criteria และ Safe Failure ต้องได้รับการทดสอบอย่างครอบคลุม
  >    - *ข้อผิดพลาด:* ใน `client/tests/lab-04/ActionsTaken.test.tsx` มีการจำลอง���ู้ใช้ `{ id: 99, fullName: "Inactive Staff", isActive: false }` ไว้ใน `mockAssignees` แล้ว แต่ยังไม่มีเคสทดสอบที่ยืนยันพฤติกรรมเมื่อเลือกผู้ใช้ที่ถูกปิดใช้งานหรือการจัดการกับข้อผิดพลาด 422 ของ Assignee
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเคสทดสอบอัตโนมัติใน `ActionsTaken.test.tsx` ยืนยันการแสดงผลแจ้งเตือนความผิดพลาดเมื่อเลือกผู้ใช้ที่ถูกระงับสิทธิ์
  > 
  > ขอให้ดำเนินการแก้ไขทั้ง 4 จุดนี้ในสาขา `feature/32-actions-taken-ui` และ push commit อัปเดตเข้ามาเพื่อทำการตรวจทานซ้ำ

#### Round 2 Review Verdict & Summary (2026-10-30T14:29:01Z)

- **Verdict:** **Approved**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ### ผลการตรวจทานการแก้ไข (Review Round 4: Verification & Approval)
  > 
  > จากการตรวจทานการปรับปรุงโค้ดและชุดทดสอบในคอมมิต `d63ae0d` บนสาขา `feature/32-actions-taken-ui` ตามข้อกำหนดของ Handout Lab 4 (Sections 6, 8.3, 10 และ 14) พบว่าผู้พัฒนาได้ดำเนินการแก้ไขข้อบกพร่องครบถ้วนทั้ง 4 ประเด็นอย่างสมบูรณ์:
  > 
  > 1. **การรองรับการสาธิต Inactive Assignee Safe Failure (Compliance with Answer Part 6):**
  >    - มีการปลดล็อกแอตทริบิวต์ `disabled` ในตัวเลือก Assignee Dropdown พร้อมระบุป้ายกำกับสถานะ `(Staff - Inactive)` อย่างชัดเจน ทำให้สามารถเลือกส่งคำขอเพื่อทดสอบการตอบสนองข้อผิดพลาด HTTP 422 จากระบบหลังบ้านได้จริงตามข้อกำหนดการสาธิต Safe Failure
  > 2. **การปรับปรุงระบบแจ้งเตือนข้อผิดพลาดระดับฟิลด์ (Field-Level Inline Validation & Accessibility):**
  >    - มีการผูกคลาส `is-invalid` ขอบสีแดงเข้ากับ Form Control ที่เกิดปัญหาโดยตรง ควบคู่กับการแสดงผลบล็อก Invalid Feedback แบบระบุฟิลด์ ช่วย��กระดับความชัดเจนในการป้อนข้อมูลตามมาตรฐาน WCAG AA และ UI Polish
  > 3. **ความครบถ้วนของชุดทดสอบหน้าบ้าน (Automated UI Test Verification):**
  >    - เพิ่มเคสทดสอบการจัดการกับข้อผิดพลาด Inactive Assignee Rejection (HTTP 422) ใน `client/tests/lab-04/ActionsTaken.test.tsx` โดยชุดทดสอบทั้ง 16 เคสผ่านการทดสอบทั้งหมด (100% Pass)
  > 4. **การบันทึกเอกสารกระบวนการพัฒนา (Review Evidence):**
  >    - เอกสา�� `docs/lab-04/reviewer.md` ได้รับการปรับปรุงบันทึกข้อเสนอแนะและผลการแก้ไขสำหรับ Review Round 4 ครบถ้วนตามเกณฑ์การประเมินของ Handout Section 14 (Part 1)
  > 
  > **สรุปผลการประเมิน:**  
  > ส่วนติดต่อผู้ใช้ Actions Taken บนหน้าจอ Ticket Detail มีความสมบูรณ์ สวยงามตามมาตรฐาน Zen Green และรองรับการจัดการข้อผิดพลาดอย่างปลอดภัย  
  > **ผลการรีวิว:** อนุมัติ (Approved) ให้ดำเนินการควบรวมสาขาเข้าสู่ `lab4-staging` เพื่อดำเนินงานพัฒนาในส่วนระบบแดชบอร์ด (Role Dashboards REST API) ลำดับถัดไป

---

### feat(api): Role Dashboards REST APIs (Requester & IT Staff Metrics) (Issue #77)

- **Pull Request:** [#84](https://github.com/chanya06/toktickit/pull/84)
- **Branch:** `feature/33-dashboard-api`
- **Target Branch:** `lab4-staging`
- **Merged By:** @lmaybelgracel at 2026-10-31T14:09:47Z

#### Round 1 Review Verdict & Summary (2026-10-31T05:16:33Z)

- **Verdict:** **Changes Requested**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ### ผลการตรวจทานสัญญาทางวิศวกรรมและการคำนวณแดชบอร์ด (Review Round 5: Dashboard Defect Inspection)
  > 
  > จากการตรวจทานโค้ดระบบคำ���วณเมตริกแดชบอร์ด (Requester & IT Staff Dashboard REST APIs) และชุดทดสอบวัดประสิทธิภาพใน PR #84 (สาขา `feature/33-dashboard-api`) เทียบกับเกณฑ์บังคับของอาจารย์ใน Handout Lab 4 (Sections 4.6, 5.3, 10 และ 14) พบข้อบกพร่องสำคัญ 4 จุดที่ต้องได้รับการแก้ไขก่อนการอนุมัติ:
  > 
  > 1. **การนับรวมตั๋วสถานะสิ้นสุดในเมตริก Unassigned และ My Assigned Tickets (ขัดต่อกฎ BR-10):**
  >    - *เกณฑ์บังคับ:* ข้อกำหนด Business Rule `BR-10 (IT Staff Dashboard Metric Boundaries)` ใน `specification.md` ระบุไว้อย่างชัดเจนว่า:
  >      - `Unassigned Tickets`: ต้องนับเฉพาะตั๋วที่ยัง Active และ `ownerId IS NULL` โดย `status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')`
  >      - `My Assigned Tickets`: ต้องนับเฉพาะตั๋วที่ยัง Active และ `ownerId === authUserId` โดย `status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')`
  >    - *ข้อผิดพ���าด:* ในไฟล์ `server/src/routes/dashboard.ts` (ฟังก์ชัน `computeStaffOperationalMetrics`) การคิวรี `unassignedTickets` และ `myAssignedTickets` มีเฉพาะเงื่อนไขตรวจสอบ `ownerId` แต่ขาดการกรองสถานะตั๋ว ส่งผลให้ตั๋วที่ถูกยกเลิก (เช่น `TKT-2026-000008`) หรือตั๋วที่ปิดไปแล้วถูกนับรวมเข้าไปในยอดงานค้างปฏิบัติงาน
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเงื่อนไข `status: { notIn: [TicketStatus.RESOLVED, TicketStatus.CLOSED, TicketStatus.CANCELLED] }` ในทั้งสองคิวรีให้ถูกต้องตามกฎ `BR-10`
  > 
  > 2. **การขาดการกรองสถานะตั๋วที่ยัง Active ในการคำนวณสถิติความสำคัญ (Priority Distribution):**
  >    - *เกณฑ์บังคับ:* กฎ `BR-10` กำหนดให้การแจกแจงสถิติตามความสำคัญ (`byPriority`) สะท้อนเฉพาะภาระงานปัจจุบันที่ต้องจัดการ (Active Operational Workload)
  >    - *ข้อผิดพลาด:* คิวรี `prisma.ticket.groupBy` สำหรับ `itPriority` ไม่ได้ระบุตัวกรองสถานะ ส่งผลให้สถิตินำเอาตั๋วในประวัติศาสตร์ที่ปิดเสร็จสิ้นไปแล้วมาคำนวณรวมด้วย
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเงื่อนไข `where: { status: { notIn: [TicketStatus.RESOLVED, TicketStatus.CLOSED, TicketStatus.CANCELLED] } }` ในคำสั่ง `groupBy` ของ `itPriority`
  > 
  > 3. **การขาดหัวข้อบันทึกการรีวิว PR #84 ในเอกสารกระบวนการวิศวกรรม (`docs/lab-04/reviewer.md`):**
  >    - *เกณฑ์บังคับ:* Handout Section 14 (Answer Part 1: Git Use with Engineering Workflow) กำหนดให้เอกสาร `reviewer.md` ต้องปรากฏหลักฐานการรีวิวของทุก PR ประกอบด้วย ตัวตนผู้ตรวจ ลิงก์ PR ข้อคิดเห็น/ข้อบกพร่องที่พบ (Comments) การตอบ���ลับของผู้พัฒนา (Responses) และผลการอนุมัติ (Approvals)
  >    - *ข้อผิดพลาด:* ใน `docs/lab-04/reviewer.md` มีเพียงการอัปเดตสถานะบรรทัด PR #84 ในตารางสรุปด้านบน แต่ยังไม่มีหัวข้อเนื้อหา `Review Round 5: PR #84 (feature/33-dashboard-api)`
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มหัวข้อ Review Round 5 สำหรับ PR #84 ใน `reviewer.md` บันทึกข้อเสนอแนะในการปรับปรุง และเปิดพื้นที่ให้ผู้พัฒนาตอบกลับแผนการแก้ไข
  > 
  > 4. **การขาดเคสทดสอบอัตโนมัติสำหรับ Terminal State Exclusion ใน `staff-dashboard.api.test.ts`:**
  >    - *เกณฑ์บังคับ:* Handout Section 10 กำหนดให้การบังคับใช้ Business Rules ต้องมีชุดทดสอบอัตโนมัติรองรับอย่างครอบคลุม
  >    - *ข้อผิดพลาด:* ในไฟล์ `server/tests/lab-04/staff-dashboard.api.test.ts` ยังไม่มีการทดสอบยืนยันว่าการสร้างตั๋วสถานะ `CLOSED`, `RESOLVED` หรือ `CANCELLED` จะต้องไม่ถูกนับเข้าไปเพิ่มในเมตริก `unassignedTickets`, `myAssignedTickets` และ `byPriority`
  >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเคสทดสอบอัตโนมัติใน `staff-dashboard.api.test.ts` เพื่อยืนยันการคัดกรองตั๋วสถานะสิ้นสุดออกจากเมตริกการดำเนินงาน
  > 
  > ขอให้ดำเนินการแก้ไขทั้ง 4 จุดนี้ในสาขา `feature/33-dashboard-api` และ push commit อัปเดตเข้ามาเพื่อทำการตรวจทานซ้ำ

#### Round 2 Review Verdict & Summary (2026-10-31T14:06:57Z)

- **Verdict:** **Approved**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ดำเนินการตรวจสอบการแก้ไขในคอมมิต `c356fd0` ซ้ำอย่างละเอียดเรียบร้อยแล้ว ทั้ง 4 ประเด็นได้รับการปรับปรุงครบถ้วนและถูกต้องตามข้อกำหนด:
  > 
  > 1. **การคัดกรองสถานะสิ้นสุดใน `unassignedTickets` และ `myAssignedTickets` (BR-10):**
  >    - มีการเพิ่มเงื่อนไข `status: { notIn: [TicketStatus.RESOLVED, TicketStatus.CLOSED, TicketStatus.CANCELLED] }` ครบ��้วนทั้งสองคิวรีใน `server/src/routes/dashboard.ts`
  > 
  > 2. **การจำกัดสถิติความสำคัญ (`byPriority`) เฉพาะ Active Workload (BR-10):**
  >    - เพิ่มตัวกรองคัดแยกสถานะสิ้นสุดออกจาก `groupBy` ของ `itPriority` ทำให้ตัวเลขสะท้อนภาระงานจริงที่ต้องจัดการในขณะนั้น โดย `byStatus` ยังคงเก็บสถิติครบถ้วนทุกสถานะ
  > 
  > 3. **เคสทดสอบอัตโนมัติ `API-08i`:**
  >    - ชุดทดสอบใน `server/tests/lab-04/staff-dashboard.api.test.ts` ครอบคลุมการยืนยันว่าตั๋วสถานะสิ้นสุดจะไม่ถูกนับรวมในเมตริกการดำเนินงาน และยืนยันความถูกต้องของ `API-08b` เรียบร้อย
  > 
  > 4. **เอกสารกระบวนการวิศวกรรม (`docs/lab-04/reviewer.md` และ `docs/lab-04/ai-use.md`):**
  >    - มีการบันทึกการตรวจทานรอบที่ 5 และ Prompt การใ��้งาน AI ครบถ้วนตามเกณฑ์ข้อกำหนด
  > 
  > โค้ดและชุดทดสอบมีความสมบูรณ์พร้อมรวมเข้าสู่สาขา `lab4-staging` อนุมัติการตรวจทาน (APPROVE)

---

### feat(ui): Role Dashboards UI: Metric Cards, Recent Activity & Drill-Down (Issue #78)

- **Pull Request:** [#85](https://github.com/chanya06/toktickit/pull/85)
- **Branch:** `feature/34-dashboard-ui`
- **Target Branch:** `lab4-staging`
- **Merged By:** @lmaybelgracel at 2026-10-31T15:35:15Z

#### Round 1 Review Verdict & Summary (2026-10-31T14:54:55Z)

- **Verdict:** **Changes Requested**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > > **Reviewer:** `@lmaybelgracel` — **Verdict:** CHANGES REQUESTED  
  > > จากการตรวจทานการออกแบบส่วนต่อประสานผู้ใช้ของแดชบอร์ด (Role Dashboards UI) และก��ไก Drill-down ใน PR #85 (สาขา feature/34-dashboard-ui) เทียบกับเกณฑ์บังคับของอาจารย์ใน Handout Lab 4 (Sections 6, 8.3, 10 และ 14) และสัญญาข้อกำหนด ui-spec.md พบข้อบกพร่องสำคัญ 4 จุดที่ต้องได้รับการปรับปรุงแก้ไขก่อนการอนุมัติ:  
  > > 
  > > 1. **การขาดตัวเลือกสถานะ WAITING_FOR_REQUESTER, REOPENED, และ CANCELLED ในฟิลเตอร์ของ MyTicketsView:**  
  > >    - *เกณฑ์บังคับ:* Handout Section 4.5, 6.2 และ ui-spec.md กำหนดว่าเมื่อคลิก Drill-down จากการ์ด "Waiting for Input" ใน Requester Dashboard ระบบต้องนำทางไปยังหน้ารายการตั๋วพร้อมคัดกรองสถานะ WAITING_FOR_REQUESTER ให้โดยอัตโนมัติ  
  > >    - *ข้อผิดพลาด:* ในไฟล์ `client/src/components/MyTicketsView.tsx` ตัวแปร `STATUSES` (บรรทัดที่ 21) มีเพียง 6 สถานะเดิม (`NEW`, `OPEN`, `IN_PROGRESS`, `PENDING`, `RESOLVED`, `CLOSED`) ขาด `WAITING_FOR_REQUESTER`, `REOPENED`, และ `CANCELLED` ส่งผลให้เมื่อรับค่า `initialStatusFilter: ["WAITING_FOR_REQUESTER"]` เข้ามา ตัวเลือกใน Dropdown ไม่สามารถจับคู่ป้ายกำกับได้ และผู้ใช้ไม่สามารถเลือกหรือยกเลิกตัวเลือกสถานะดังกล่าวบน UI ได้  
  > >    - *สิ่งที่ต้องแก้ไข:* เพิ่มสถานะ `WAITING_FOR_REQUESTER`, `REOPENED`, และ `CANCELLED` ในอาเรย์ `STATUSES` ของ `MyTicketsView.tsx` ให้ครอบคลุมครบทั้ง 9 สถานะของระบบ  
  > > 
  > > 2. **การขาดการซิงค์ State เมื่อค่า Props ฟิลเตอร์เริ่มต้นเปลี่ยนแปลง (Filter State Synchronization):**  
  > >    - *เกณฑ์บังคับ:* Handout Section 6.2 กำหนดให้การ์ดแดชบอร์ดทุกใบสามารถคลิก Drill-down สลับเงื่อนไขการกรองได้ตลอดเวลา  
  > >    - *ข้อผิดพลาด:* ใน `MyTicketsView.tsx` และ `StaffTicketQueue.tsx` มีการตั้งค่าเริ่มต้นของฟิลเตอร์ผ่าน `useState(initialStatusFilter || [])` และ `useState(initialFilters?.status || "")` เพียงครั้งเดียวขณะ Mount โดยไม่มี `useEffect` ดักจับการเปลี่ยนแปลงของ Props ส่งผลให้เมื่อผู้ใช้นำทางสลับไปมาระหว่างการ์ดต่าง ๆ บนแดชบอร์ด (เช่น จาก My Open Tickets ไปยัง Recently Resolved) ค่าฟิลเตอร์ใหม่จะไม่ถูกซิงค์ลงใน State ภายในของคอมโพเนนต์  
  > >    - *สิ่งที่ต้องแก้ไข:* เพิ่ม `useEffect` ใน `MyTicketsView.tsx` และ `StaffTicketQueue.tsx` เพื่อตรวจสอบและอัปเดต State ภายในเมื่อ `initialStatusFilter` หรือ `initialFilters` มีการเปลี่ยนแปลง  
  > > 
  > > 3. **การขาดหัวข้อบันทึกการรีวิว PR #85 ในเอกสารกระบวนการวิศวกรรม (`docs/lab-04/reviewer.md`):**  
  > >    - *เกณฑ์บังคับ:* Handout Section 14 (Answer Part 1: Git Use with Engineering Workflow) กำหนดให้เอกสาร reviewer.md ต้องปรากฏหลักฐานการรีวิวของทุก PR ประกอบด้วย ตัวตนผู้ตรวจ ลิงก์ PR ข้อคิดเห็น/ข้อบกพร่องที่พบ (Comments) การตอบกลับของผู้พัฒนา (Responses) และผลการอนุมัติ (Approvals)  
  > >    - *ข้อผิดพลาด:* ใน `docs/lab-04/reviewer.md` มีเพียงการอัปเดตบรรทัด PR #85 ในตารางสรุปด้านบน แต่ยังไม่มีหัวข้อเนื้อหา Review Round 6 สำหรับ PR #85 ที่บันทึกข้อคิดเห็นการตรวจทาน  
  > >    - *สิ่งที่ต้องแก้ไข:* เพิ่มหัวข้อ Review Round 6: PR #85 ใน `docs/lab-04/reviewer.md` บันทึกรายละเอียดข้อเสนอแนะและเปิดพื้นที่ให้ผู้พัฒนาตอบกลับแผนการดำเนินงาน  
  > > 
  > > 4. **การขาดเคสทดสอบอัตโนมัติสำหรับการ Drill-Down สถานะ WAITING_FOR_REQUESTER ใน MyTicketsView:**  
  > >    - *เกณฑ์บังคับ:* Handout Section 10 กำหนดให้การบูรณาการระบบนำทางและการ Drill-down ต้องได้รับการทดสอบอย่างครอบคลุม  
  > >    - *ข้อผิดพลาด:* ในชุดทดสอบหน้าบ้าน มีเพียงการทดสอบปุ่มในระดับคอมโพเนนต์ `RequesterDashboard.test.tsx` แต่ยังขาดเคสทดสอบใน `MyTicketsView.test.tsx` ที่ยืนยันว่าการส่ง `initialStatusFilter: ["WAITING_FOR_REQUESTER"]` สามารถกรองและแสดงผลตั๋วสถานะดังกล่าวได้อย่างถูกต้อง  
  > >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเคสทดสอบอัตโนมัติในชุดทดสอบฝั่งหน้าบ้านเพื่อยืนยันพฤติกรรมการกรองสถานะ `WAITING_FOR_REQUESTER` ผ่าน `initialStatusFilter`

#### Round 2 Review Verdict & Summary (2026-10-31T15:33:33Z)

- **Verdict:** **Approved**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ดำเนินการตรวจสอบการแก้ไขในคอมมิต `dea8951` ครบถ้วนทั้ง 4 ประเด็นเรียบร้อยแล้ว:
  > 
  > 1. **การรองรับสถานะครบ 9 สถานะใน MyTicketsView และ Server API:**
  >    - เพิ่มสถานะ `WAITING_FOR_REQUESTER`, `REOPENED`, และ `CANCELLED` ในอาเรย์ `STATUSES` ของ `MyTicketsView.tsx` และ `VALID_STATUSES` ใน `server/src/app.ts` เรียบร้อย รองรับการคัดกรองตั๋วและการแสดงผลป้าย Badge ครบถ้วนทุกสถานะ
  > 
  > 2. **การซิงค์ State เมื่อค่า Props ฟิลเตอร์เริ่มต้นเปลี่ยนแปลง (Filter State Synchronization):**
  >    - มีการเพิ่ม `useEffect` ดักจับการเปลี่ยนแปลงของ `initialStatusFilter` ใน `MyTicketsView.tsx` ���ละ `initialFilters` ใน `StaffTicketQueue.tsx` ทำให้การ Drill-down จากการ์ดแดชบอร์ดทำงานได้อย่างถูกต้องและต่อเนื่อง
  > 
  > 3. **เอกสารกระบวนการวิศวกรรม (`docs/lab-04/reviewer.md` และ `docs/lab-04/ai-use.md`):**
  >    - บันทึกการตรวจทานรอบที่ 6 และประวัติการใช้งาน AI ครบถ้วนตามเกณฑ์ Handout Section 14 (Answer Part 1)
  > 
  > 4. **ชุดทดสอบอัตโนมัติหน้าบ้าน:**
  >    - ชุดทดสอบใน `MyTickets.test.tsx` และ `StaffTicketQueue.test.tsx` ครอบคลุมพฤติกรรมการ Drill-down และการซิงค์ State ของฟิลเตอร์อย่างสมบูรณ์
  > 
  > โค้ดและชุดทดสอบมีความสมบูรณ์ อนุมัติให้รวมโค้ดเข้าสู่สาขา `lab4-staging` ได้ (APPROVE)

---

### feat(workflow): Ticket Workflow Hardening, Resolution Gate & Concurrency Control (Issue #79)

- **Pull Request:** [#86](https://github.com/chanya06/toktickit/pull/86)
- **Branch:** `feature/35-ticket-workflow-hardening`
- **Target Branch:** `lab4-staging`
- **Merged By:** @lmaybelgracel at 2026-10-31T16:47:56Z

#### Round 1 Review Verdict & Summary (2026-10-31T16:20:18Z)

- **Verdict:** **Changes Requested**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > > **Reviewer:** `@lmaybelgracel` — **Verdict:** CHANGES REQUESTED  
  > > จากการตรวจทานการบังคับใช้กฎวงจรสถานะตั๋ว (Ticket Workflow Hardening), กลไก Resolution Gate และก���รควบคุมการทำงานพร้อมกัน (Concurrency Control) ใน PR #86 (สาขา feature/35-ticket-workflow-hardening) เทียบกับเกณฑ์บังคับของอาจารย์ใน Handout Lab 4 (Sections 4.5, 6.2, 10 และ 14) และสัญญาข้อกำหนด specification.md / ui-spec.md พบข้อบกพร่องสำคัญ 4 จุดที่ต้องได้รับการปรับปรุงแก้ไขก่อนการอนุมัติ:  
  > > 
  > > 1. **การขาดปุ่มหรือส่วนควบคุมให้ Requester ทำการ Reopen ตั๋วที่สถานะเป็น RESOLVED บนหน้าจอ TicketDetailView (FR-13 / AC-10):**  
  > >    - *เกณฑ์บังคับ:* Handout Section 4.5, 6.2 และ specification.md (FR-13 / AC-10) กำหนดให้ผู้แจ้งตั๋ว (Requester) มีสิทธิ์เปิดตั๋วใหม่ (Reopen) จากสถานะ `RESOLVED` ได้เมื่อปัญหาเกิดขึ้นซ้ำ  
  > >    - *ข้อผิดพลาด:* ฝั่งเซิร์ฟเวอร์มีการสร้างเส้นทาง `PATCH /api/tickets/:id/status` อน���ญาตให้ Requester ส่งคำขอเปลี่ยนสถานะตั๋วจาก `RESOLVED` เป็น `REOPENED` เรียบร้อยแล้ว แต่ในฝั่งหน้าบ้าน `client/src/components/TicketDetailView.tsx` กล่องการจัดการตั๋ว (`staff-operations-panel`) ถูกจำกัดการแสดงผลเฉพาะ IT Staff และ Admin (`isStaffOrAdmin`) เท่านั้น โดยไม่มีปุ่มหรือการควบคุมใด ๆ ให้ Requester กด Reopen บนหน้าจอเมื่อตั๋วมีสถานะเป็น `RESOLVED`  
  > >    - *สิ่งที่ต้องแก้ไข:* เพิ่มปุ่ม "Reopen Ticket" (พร้อมช่องกรอกหรือคำยืนยันระบุเหตุผล) ให้แสดงผลสำหรับผู้ใช้ที่เป็นเจ้าของตั๋ว (Requester) เมื่อตั๋วอยู่ในสถานะ `RESOLVED` บน `TicketDetailView.tsx`  
  > > 
  > > 2. **การขาดช่องกรอกเหตุผลการปิดงาน (Resolution Note Input) เมื่อเปลี่ยนสถานะตั๋วสู่ RESOLVED บน UI:**  
  > >    - *เกณฑ์บังคับ:* Handout Section 4.5, 6.2 และ specification.md กำหนดว่าเมื่อเปลี่ยนสถานะตั๋วเป็น `RESOLVED` ต้องสามารถบันทึกข้อความสรุปการแก้ไขปัญหา (Resolution Note) ซึ่งจะถูกบันทึกเป็น Public Comment ต่อท้ายตั๋วโดยอัตโนมัติ  
  > >    - *ข้อผิดพลาด:* ใน `server/src/routes/staff.ts` และ `client/src/api.ts` ฟังก์ชัน `updateTicketStatus` รองรับพารามิเตอร์ `resolutionNote` เรียบร้อยแล้ว แต่ใน `TicketDetailView.tsx` เมื่อผู้ใช้เลือกสถานะถัดไปเป็น `RESOLVED` ไม่มีช่อง Input หรือ Modal ให้กรอก `resolutionNote` และฟังก์ชัน `handleExecuteStatusTransition` ไม่มีการส่ง `resolutionNote` ไปยัง API  
  > >    - *สิ่งที่ต้องแก้ไข:* เพิ่มช่องกรอก `resolutionNote` (หรือ Modal ยืนยันการปิดงาน) บน `TicketDetailView.tsx` เมื่อผู้ใช้เลือกเปลี่ยนสถานะเป็น `RESOLVED` และส่งค่านั้นไปยัง `updateTicketStatus`  
  > > 
  > > 3. **การขาดหัวข้อบันทึกการรีวิว PR #86 ในเอกสารกระบวนการวิศวกรรม (`docs/lab-04/reviewer.md`):**  
  > >    - *เกณฑ์บังคับ:* Handout Section 14 (Answer Part 1: Git Use with Engineering Workflow) กำหนดให้เอกสาร reviewer.md ต้องปรากฏหลักฐานการรีวิวของทุก PR ประกอบด้วย ตัวตนผู้ตรวจ ลิงก์ PR ข้อคิดเห็น/ข้อบกพร่องที่พบ (Comments) การตอบกลับของผู้พัฒนา (Responses) และผลการอนุมัติ (Approvals)  
  > >    - *ข้อผิดพลาด:* ใน `docs/lab-04/reviewer.md` มีเพียงการอัปเดตบรรทัด PR #86 ในตารางสรุปด้านบน (`Pending Review | In Review`) แต่ยังไม่มีหัวข้อเนื้อหา Review Round 7 สำหรับ PR #86 ที่บันทึกข้อคิดเห็นการ��รวจทาน  
  > >    - *สิ่งที่ต้องแก้ไข:* เพิ่มหัวข้อ Review Round 7: PR #86 ใน `docs/lab-04/reviewer.md` บันทึกรายละเอียดข้อเสนอแนะและเปิดพื้นที่ให้ผู้พัฒนาตอบกลับแผนการดำเนินงาน  
  > > 
  > > 4. **การขาดเคสทดสอบอัตโนมัติสำหรับ Requester Reopen Action ในชุดทดสอบหน้าบ้าน (`TicketWorkflow.test.tsx`):**  
  > >    - *เกณฑ์บังคับ:* Handout Section 10 กำหนดให้การทำงานของ Workflow และการอนุญาตตามบทบาทผู้ใช้บน UI ต้องมีชุดทดสอบอัตโนมัติรองรับอย่างครอบคลุม  
  > >    - *ข้อผิดพลาด:* ใน `client/tests/lab-04/TicketWorkflow.test.tsx` มีเฉพาะเคส `UI-06h` ที่ทดสอบว่าซ่อน `staff-operations-panel` เมื่อผู้ใช้เป็น Requester แต่ยังขาดเคสทดสอบยืนยันว่าเมื่อ Requester เปิดดูตั๋วสถานะ `RESOLVED` จะต้องมองเห็นและสามารถกดปุ่ม Reopen เพื่อเรียก API เปลี่ยนสถานะเป็น `REOPENED` ได้  
  > >    - *สิ่งที่ต้องแก้ไข:* เพิ่มเคสทดสอบอัตโนมัติใน `TicketWorkflow.test.tsx` ยืนยันการแสดงผลปุ่ม Reopen และการเรียกใช้ API ของ Requester สำหรับตั๋วสถานะ `RESOLVED`

#### Round 2 Review Verdict & Summary (2026-10-31T16:46:54Z)

- **Verdict:** **Approved**
- **Reviewer:** @lmaybelgracel
- **Verbatim Feedback:**

  > ### Peer Review: Ticket Workflow Hardening, Resolution Gate & Concurrency Control (PR #86) - Approved
  > 
  > ได้ทำการตรวจทานโค้ดและเอกสารใน commit ล่าสุด (`7b335bd`) หลังจากการแก้ไขข้อเสนอแนะใน Review Round 7 เรียบร้อยแล้ว:
  > 
  > 1. **Requester Reopen Action:** มีการเพิ่มปุ่ม Reopen Ticket, Requester Reopen Banner และ Reopen Modal บน `TicketDetailView.tsx` พร้อมเชื่อมต่อกับ Endpoint `PATCH /api/tickets/:id/status` ครบถ้วนตามข้อกำหนด FR-13 / AC-10
  > 2. **Resolution Note Input:** มีการเพิ่ม Textarea สำหรับกรอกบันทึกการปิดงานเมื่อเลือกสถานะ `RESOLVED` และส่งข้อมูลไปบันทึกเป็น Public Comment โดยอัตโนมัติตาม BR-08 / AC-09
  > 3. **Automated Test Coverage:** มีชุดทดสอบอัตโนมัติ `UI-06i`, `UI-06j`, `UI-06k` ใน `TicketWorkflow.test.tsx` ครอบคลุมการทำงานใหม่ทั้งหมด และผ��านการทดสอบครบถ้วน
  > 4. **Documentation Sync:** เอกสาร `docs/lab-04/reviewer.md`, `docs/lab-04/ai-use.md`, และ `docs/lab-04/tests.md` ได้รับการบันทึกหลักฐานการรีวิวและอัปเดตสถานะครบถ้วน
  > 
  > การดำเนินงานเป็นไปตามเกณฑ์มาตรฐานทางวิศวกรรมของ Lab 4 ครบถ้วน อนุมัติให้ Merge เข้าสู่สาขาหลักได้

---



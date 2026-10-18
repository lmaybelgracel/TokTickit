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
| [#75](https://github.com/lmaybelgracel/TokTickit/pull/75) | Issue 33: IT Staff & Administrator Dashboard Frontend UI / `feature/33-staff-dashboard-ui` | Changes Requested (Round 1: Changes Requested) | Under Review | [PR #75](https://github.com/lmaybelgracel/TokTickit/pull/75) |

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

---

## 2. Pull Requests I Reviewed for Partner (@chanya06)

**Partner author:** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

| Issue | PR | Partner Feature / Branch | My Review Verdict | Status | Link |
|:---|:---|:-------------------------|:------------------|:-------|:-----|
| *Pending* | *Pending* | Sprint 4 Engineering Contract & Specifications | Pending Review | Planned | [Partner Repo](https://github.com/chanya06/toktickit) |

---

### Partner PR Detailed Review Logs

*(To be populated as partner opens Sprint 4 Pull Requests on chanya06/toktickit)*

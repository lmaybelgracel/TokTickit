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
| [#70](https://github.com/lmaybelgracel/TokTickit/pull/70) | Issue 28: Database Evolution, Actions Taken Model, Migration & Idempotent Seed Data / `feature/28-database-and-seed` | Changes Requested / Feedback Addressed | In Review | [PR #70](https://github.com/lmaybelgracel/TokTickit/pull/70) |

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
- **Current Verdict:** Changes Requested / Feedback Addressed
- **Status:** Feedback addressed in commit, awaiting Round 2 Approval on PR #70.

---

## 2. Pull Requests I Reviewed for Partner (@chanya06)

**Partner author:** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

| Issue | PR | Partner Feature / Branch | My Review Verdict | Status | Link |
|:---|:---|:-------------------------|:------------------|:-------|:-----|
| *Pending* | *Pending* | Sprint 4 Engineering Contract & Specifications | Pending Review | Planned | [Partner Repo](https://github.com/chanya06/toktickit) |

---

### Partner PR Detailed Review Logs

*(To be populated as partner opens Sprint 4 Pull Requests on chanya06/toktickit)*

# Lab 4 - Peer Review Record

**Author:** Patitaya Kaewwichain 67070505220 — GitHub: [@lmaybelgracel](https://github.com/lmaybelgracel)

**Peer reviewer (reviewed my PRs):** Phatthidawadi — GitHub: [@phatthidawadi](https://github.com/phatthidawadi)

**Partner I reviewed (circle review):** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

**Feature PR target:** `lab4-staging`

---

## 1. Pull Requests I Authored (Reviewed by Peer Reviewer)

| PR | Issue / Branch | Reviewer Verdict | Status | Link |
|:---|:---------------|:-----------------|:-------|:-----|
| [#58](https://github.com/lmaybelgracel/TokTickit/pull/58) | Issue 27: Sprint 4 Engineering Contract & Specifications / `feature/27-sprint4-spec-and-tests` | Approved (Round 1: Changes Requested, Round 2: Approved) | Merged | [PR #58](https://github.com/lmaybelgracel/TokTickit/pull/58) |

---

### Issue 27 - Sprint 4 Engineering Contract & Specification

- **Pull Request:** [#58](https://github.com/lmaybelgracel/TokTickit/pull/58)
- **Branch:** `feature/27-sprint4-spec-and-tests`
- **Summary:** Establishes the complete Sprint 4 specification suite under `docs/lab-04/` covering `specification.md`, `ui-spec.md`, `api-spec.md`, `tests.md`, `reviewer.md`, and `ai-use.md`. Defines parent-child Actions Taken model, dashboard calculation rules, status transition matrix, resolution gate, and AC traceability.
- **Round 1 Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi (2026-10-15T16:03:38Z):
  > "ผลการประเมินภาพรวม (Overall Verdict)
  > คำตัดสิน: Request Changes (ขอให้แก้ไขก่อนอนุมัติ)
  > 
  > เหตุผล:
  > โครงสร้างข้อกำหนดของ Sprint 4 ได้รับการออกแบบมาอย่างเป็นระบบและครอบคลุมฟังก์ชันหลัก เช่น โมเดล Actions Taken แบบ 1:N และ State Transition Matrix พร้อม Resolution Gate ที่รัดกุม อย่างไรก็ตาม ยังมีประเด็นสำคัญที่ต้องได้รับการแก้ไขให้ถูกต้องก่อนจึงจะสามารถอนุมัติได้ ได้แก่ การขาดเมตริก "current-user Actions Taken" บน IT Staff Dashboard ซึ่งขัดกับเกณฑ์การให้คะแนน Part 5 ใน Handout, การระบุไวยากรณ์ความสัมพันธ์ย้อนกลับ (Inverse Relations) ของ Prisma บนโมเดล Ticket และ User ที่ยังไม่ครบถ้วนใน Section 7.1 ซึ่งจะทำให้ migration ล้มเหลว, และความไม่สอดคล้องกันระหว่างตาราง Traceability Matrix กับ Master Test Catalog ใน tests.md จึงขอให้ปรับปรุงแก้ไขจุดเหล่านี้ใน PR ก่อนทำการรวมเข้าสู่ lab4-staging"
- **Round 1 Reviewer Feedback Items & My Responses:**
  1. **Comment on Missing "current-user Actions Taken" on IT Staff Dashboard:**
     - *Reviewer Feedback:* Handout Part 5 requires demonstrating "current-user Actions Taken" on the IT Staff Dashboard, which was omitted from the dashboard specification.
     - *My Action:* Added `myActionsTakenCount` (total actions performed by authenticated caller `performedById = caller.id`) into `FR-13`, `BR-17`, `ui-spec.md` (5th metric card with drill-down link), and `api-spec.md` (`GET /api/dashboard/staff` response payload).
  2. **Comment on Incomplete Prisma Inverse Relations (Section 7.1):**
     - *Reviewer Feedback:* Only `model ActionTaken` was declared; missing inverse relations on `model Ticket` and `model User` would cause Prisma schema validation and migration failures.
     - *My Action:* Added inverse relation fields in `docs/lab-04/specification.md` Section 7.1: `actionsTaken ActionTaken[]` on `model Ticket` and `actionsTaken ActionTaken[] @relation("PerformedActions")` on `model User`, establishing valid two-way relations.
  3. **Comment on Discrepancy between Traceability Matrix and Master Test Catalog (`tests.md`):**
     - *Reviewer Feedback:* Traceability Matrix referenced IDs like `API-MIG-01`, `REG-ALL-01`, `E2E-ALL-01` that were missing from the Master Test Catalog.
     - *My Action:* Synchronized `docs/lab-04/tests.md` by adding explicit definitions for `API-MIG-01`, `REG-ALL-01`, `E2E-ALL-01`, and new dashboard test IDs (`API-DASH-04` and `UI-DASH-04`) to the Master Test Catalog, achieving 100% 1-to-1 parity.
- **Round 1 Verdict:** Changes Requested
- **Round 2 Reviewer Verdict & Summary:** Approved by @phatthidawadi (2026-10-16T13:06:33Z):
  > "### สรุปผลการตรวจสอบรอบที่ 2 (Round 2 Peer Review Verification)
  > 
  > - **Commit ที่ตรวจสอบ:** `2e3742a`
  > - **ผลการรันชุดทดสอบ Regression Labs 1–3:** **ผ่านทั้งหมด 29/29 ไฟล์ (204/204 เทสต์ ผ่าน 100% ไม่มีการข้ามเทสต์)**
  > 
  > #### ผลการตรวจติดตามข้อเสนอแนะจากรอบแรก:
  > - [x] **F-01 (Major - เมตริก Handout Part 5):** **RESOLVED (แก้ไขเรียบร้อย)** — ตรวจสอบพบการเพิ่ม `myActionsTakenCount` ใน `specification.md` (FR-13, BR-17), ใน `api-spec.md` (บรรทัด 180), และใน `ui-spec.md` (เพิ่มการ์ดใบที่ 3 "My Actions Recorded" พร้อมกฎ Responsive) รวมถึงเพิ่มรหัสทดสอบ `API-DASH-04` และ `UI-DASH-04` ครบถ้วน
  > - [x] **F-02 (Major - Prisma Inverse Relations):** **RESOLVED (แก้ไขเรียบร้อย)** — ตรวจสอบพบการระบุความสัมพันธ์ย้อนกลับใน `specification.md` Section 7.1 ครบถ้วน (`Ticket.actionsTaken` และ `User.actionsTaken @relation("PerformedActions")`) ไวยากรณ์ถูกต้องตามหลัก Prisma
  > - [x] **F-03 (Major - ตาราง Test Catalog):** **RESOLVED (แก้ไขเรียบร้อย)** — ตรวจสอบพบตาราง Master Test Catalog ใน `tests.md` ซิงค์กับ Traceability Matrix ครบทุกตัว 100% 1-to-1 รวมถึงมีนิยามของ `API-MIG-01`, `REG-ALL-01`, และ `E2E-ALL-01` เรียบร้อยแล้ว
  > - [x] **F-07 (Nit - ข้อมูลผู้ตรวจ):** **RESOLVED (แก้ไขเรียบร้อย)** — ระบุตัวตนผู้ตรวจจริงใน `reviewer.md` เรียบร้อย
  > 
  > #### ข้อแนะนำเพิ่มเติมสำหรับช่วงลงมือเขียนโค้ด (Implementation):
  > - ฐานข้อมูลและโค้ด Client เดิมใช้ชื่อฟิลด์ `currentStatus` อย่าลืมตรวจสอบให้แน่ใจว่า Controller ส่งค่าออกมาแบบ Backward-compatible หรือมี Data mapping ที่ปลอดภัย
  > - ใน Route Handler แนะนำให้เช็ค Validation บังคับส่ง `knownUpdatedAt` (`422 Unprocessable Entity`) เพื่อให้การดักจับ 409 Conflict ทำงานได้อย่างสมบูรณ์
  > 
  > **คำตัดสิน: APPROVE (อนุมัติ)** — ข้อกำหนดทางวิศวกรรมได้รับการแก้ไขอย่างถูกต้อง มีหลักฐานครบถ้วน"
- **Final Review Verdict:** Approved
- **Status:** Approved and Merged into `lab4-staging`

---

## 2. Pull Requests I Reviewed for Partner (@chanya06)

**Partner author:** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

| Issue | PR | Partner Feature / Branch | My Review Verdict | Status | Link |
|:---|:---|:-------------------------|:------------------|:-------|:-----|
| *Pending* | *Pending* | Sprint 4 Engineering Contract & Specifications | Pending Review | Planned | [Partner Repo](https://github.com/chanya06/toktickit) |

---

### Partner PR Detailed Review Logs

*(To be populated as partner opens Sprint 4 Pull Requests on chanya06/toktickit)*

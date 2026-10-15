# Lab 4 - Peer Review Record

**Author:** Patitaya Kaewwichain 67070505220 — GitHub: [@lmaybelgracel](https://github.com/lmaybelgracel)

**Peer reviewer (reviewed my PRs):** Phatthidawadi — GitHub: [@phatthidawadi](https://github.com/phatthidawadi)

**Partner I reviewed (circle review):** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

**Feature PR target:** `lab4-staging`

---

## 1. Pull Requests I Authored (Reviewed by Peer Reviewer)

| PR | Issue / Branch | Reviewer Verdict | Status | Link |
|:---|:---------------|:-----------------|:-------|:-----|
| [#58](https://github.com/lmaybelgracel/TokTickit/pull/58) | Issue 27: Sprint 4 Engineering Contract & Specifications / `feature/27-sprint4-spec-and-tests` | Changes Requested / Feedback Addressed | In Review | [PR #58](https://github.com/lmaybelgracel/TokTickit/pull/58) |

---

### Issue 27 - Sprint 4 Engineering Contract & Specification

- **Pull Request:** [#58](https://github.com/lmaybelgracel/TokTickit/pull/58)
- **Branch:** `feature/27-sprint4-spec-and-tests`
- **Summary:** Establishes the complete Sprint 4 specification suite under `docs/lab-04/` covering `specification.md`, `ui-spec.md`, `api-spec.md`, `tests.md`, `reviewer.md`, and `ai-use.md`. Defines parent-child Actions Taken model, dashboard calculation rules, status transition matrix, resolution gate, and AC traceability.
- **Reviewer Verdict & Summary:** Changes Requested by @phatthidawadi:
  > "ผลการประเมินภาพรวม (Overall Verdict)
  > คำตัดสิน: Request Changes (ขอให้แก้ไขก่อนอนุมัติ)
  > 
  > เหตุผล:
  > โครงสร้างข้อกำหนดของ Sprint 4 ได้รับการออกแบบมาอย่างเป็นระบบและครอบคลุมฟังก์ชันหลัก เช่น โมเดล Actions Taken แบบ 1:N และ State Transition Matrix พร้อม Resolution Gate ที่รัดกุม อย่างไรก็ตาม ยังมีประเด็นสำคัญที่ต้องได้รับการแก้ไขให้ถูกต้องก่อนจึงจะสามารถอนุมัติได้ ได้แก่ การขาดเมตริก "current-user Actions Taken" บน IT Staff Dashboard ซึ่งขัดกับเกณฑ์การให้คะแนน Part 5 ใน Handout, การระบุไวยากรณ์ความสัมพันธ์ย้อนกลับ (Inverse Relations) ของ Prisma บนโมเดล Ticket และ User ที่ยังไม่ครบถ้วนใน Section 7.1 ซึ่งจะทำให้ migration ล้มเหลว, และความไม่สอดคล้องกันระหว่างตาราง Traceability Matrix กับ Master Test Catalog ใน tests.md จึงขอให้ปรับปรุงแก้ไขจุดเหล่านี้ใน PR ก่อนทำการรวมเข้าสู่ lab4-staging"
- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Missing "current-user Actions Taken" on IT Staff Dashboard:**
     - *Reviewer Feedback:* Handout Part 5 requires demonstrating "current-user Actions Taken" on the IT Staff Dashboard, which was omitted from the dashboard specification.
     - *My Action:* Added `myActionsTakenCount` (total actions performed by authenticated caller `performedById = caller.id`) into `FR-13`, `BR-17`, `ui-spec.md` (5th metric card with drill-down link), and `api-spec.md` (`GET /api/dashboard/staff` response payload).
  2. **Comment on Incomplete Prisma Inverse Relations (Section 7.1):**
     - *Reviewer Feedback:* Only `model ActionTaken` was declared; missing inverse relations on `model Ticket` and `model User` would cause Prisma schema validation and migration failures.
     - *My Action:* Added inverse relation fields in `docs/lab-04/specification.md` Section 7.1: `actionsTaken ActionTaken[]` on `model Ticket` and `actionsTaken ActionTaken[] @relation("PerformedActions")` on `model User`, establishing valid two-way relations.
  3. **Comment on Discrepancy between Traceability Matrix and Master Test Catalog (`tests.md`):**
     - *Reviewer Feedback:* Traceability Matrix referenced IDs like `API-MIG-01`, `REG-ALL-01`, `E2E-ALL-01` that were missing from the Master Test Catalog.
     - *My Action:* Synchronized `docs/lab-04/tests.md` by adding explicit definitions for `API-MIG-01`, `REG-ALL-01`, `E2E-ALL-01`, and new dashboard test IDs (`API-DASH-04` and `UI-DASH-04`) to the Master Test Catalog, achieving 100% 1-to-1 parity.
- **First Review Verdict:** Changes Requested
- **Status:** Feedback addressed and updated in commit, awaiting Round 2 Approval.

---

## 2. Pull Requests I Reviewed for Partner (@chanya06)

**Partner author:** Chanya Poolketkij 67070501058 — GitHub: [@chanya06](https://github.com/chanya06)

| Issue | PR | Partner Feature / Branch | My Review Verdict | Status | Link |
|:---|:---|:-------------------------|:------------------|:-------|:-----|
| *Pending* | *Pending* | Sprint 4 Engineering Contract & Specifications | Pending Review | Planned | [Partner Repo](https://github.com/chanya06/toktickit) |

---

### Partner PR Detailed Review Logs

*(To be populated as partner opens Sprint 4 Pull Requests on chanya06/toktickit)*

# Lab 3 - Peer Review Record

**Author:** Patitaya Kaewwichain 67070505220 - GitHub: [@lmaybelgracel](https://github.com/lmaybelgracel)

**Peer reviewer:** Titaya - GitHub: [@titayaaa](https://github.com/titayaaa)

**Feature PR target:** `lab3-staging`

---

## 1. Pull Requests I Authored (Reviewed by @titayaaa)

| PR | Issue / Branch | Reviewer Verdict | Link |
|:---|:---------------|:-----------------|:-----|
| [#36](https://github.com/lmaybelgracel/TokTickit/pull/36) | Issue 17: Sprint 3 Engineering Contract & Specification / `feature/17-spec-and-tests` | Addressed Review Feedback (Ready for Approval) | [PR #36](https://github.com/lmaybelgracel/TokTickit/pull/36) |

### Issue 17 - Sprint 3 Engineering Contract & Specification

- **Summary:** Delivers the initial Sprint 3 specification suite under `docs/lab-03/` covering `specification.md`, `ui-spec.md`, `api-spec.md`, `tests.md`, `reviewer.md`, and `ai-use.md`.
- **Reviewer Verdict & Summary:** Commented by @titayaaa:
  > "นอกนั้นพวก Flow การทำงาน, แบ่ง Role 3 ระดับ, โทนสี UI Zen Green กับกล่อง Internal Notes สีเหลืองส้มอันนี้ทำมาดีมาก ชัดเจนดีแล้ว ฝากแก้จุดข้างบนนี้นิดนึง เดี๋ยวแก้เสร็จทักมาเลย เรามากด Approve ให้น้า"

- **Reviewer Feedback Items & My Responses:**
  1. **Comment on Data Leak in Ticket Detail Response (`docs/lab-03/api-spec.md`):**
     - *Reviewer Feedback:* In `GET /api/tickets/:id`, returning `internalNotes` to Requesters causes a confidential data leak. Requesters must only receive `publicComments`, while `internalNotes` must be restricted to IT Staff and Admin.
     - *My Action:* Updated `docs/lab-03/api-spec.md` under `GET /api/tickets/:id` with explicit data privacy rules: `internalNotes` is strictly stripped and omitted from the response when accessed by `REQUESTER`. IT Staff and Admins access notes via `GET /api/tickets/:id/notes`.
  2. **Comment on Status vs Resolve Endpoint Collision (`docs/lab-03/api-spec.md`):**
     - *Reviewer Feedback:* Using `PATCH /api/staff/tickets/:id/status` to set `status: "RESOLVED"` risks bypassing the mandatory `resolutionSummary` rule (BR-20).
     - *My Action:* Added explicit guard on `PATCH /api/staff/tickets/:id/status` returning `422 Unprocessable Entity` if `RESOLVED` is passed directly. Formally specified `PATCH /api/staff/tickets/:id/resolve` requiring non-empty `resolutionSummary` (3-500 characters).
  3. **Comment on Ticket Number Format (`docs/lab-03/api-spec.md`):**
     - *Reviewer Feedback:* Ticket Number was written as `TKT-2026-000142` instead of Lab 2's `TKT-YYYYMMDD-XXXX`.
     - *My Action:* Standardized Ticket Number generator in `docs/lab-03/api-spec.md` to `TKT-YYYYMMDD-XXXX` (e.g. `TKT-20260913-0001`) preserving Lab 2 compatibility.
  4. **Comment on Priority Enum missing URGENT (`docs/lab-03/specification.md`):**
     - *Reviewer Feedback:* `enum Priority` had only 3 levels (LOW, MEDIUM, HIGH), missing `URGENT` from Lab 3 specifications.
     - *My Action:* Updated Prisma Schema evolution and BR-17 in `docs/lab-03/specification.md` and `docs/lab-03/api-spec.md` to include all 4 levels: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
  5. **Comment on Role Badge Enum Mapping (`docs/lab-03/ui-spec.md`):**
     - *Reviewer Feedback:* UI shows `Requester`, `IT Staff`, `Administrator` while Prisma uses `REQUESTER`, `IT_STAFF`, `ADMINISTRATOR`. Suggested clarifying note for frontend component authoring.
     - *My Action:* Added an Enum Mapping Note in `docs/lab-03/ui-spec.md` Section 1.2 clarifying that backend database enums are SCREAMING_SNAKE_CASE and mapped to title case display labels in the UI.
  6. **Comment on Additional Security & Resolution Test Cases (`docs/lab-03/tests.md`):**
     - *Reviewer Feedback:* Add explicit test cases for Requester hitting `GET /api/tickets/:id/notes` getting 403 Forbidden, and resolving a ticket without `resolutionSummary` getting 422.
     - *My Action:* Added `SEC-04` (Requester hitting internal notes blocked with 403) and `STAFF-05` (Resolving ticket without resolution summary blocked with 422) in `docs/lab-03/tests.md`.

- **Current Status:** All 6 review items resolved and committed. Ready for @titayaaa final approval.

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

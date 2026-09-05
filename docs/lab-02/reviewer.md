# Lab 2 - Peer Review Record

**Author:** เกรซ - GitHub: [@lmaybelgracel](https://github.com/lmaybelgracel)

**Peer reviewer:** บิว - GitHub: [@phatthidawadi](https://github.com/phatthidawadi)

**Feature PR target:** `lab2-staging`

## Pull Requests I Authored (Reviewed by My Partner)

| PR | Issue / Branch | Reviewer verdict |
|----|----------------|------------------|
| [#23](https://github.com/lmaybelgracel/TokTickit/pull/23) | Issue 5 / `feature/lab2-engineering-spec` | Approved and merged by @phatthidawadi |
| [#24](https://github.com/lmaybelgracel/TokTickit/pull/24) | Issue 6 / `feature/lab2-ui-api-spec` | Approved and merged by @phatthidawadi |
| [#25](https://github.com/lmaybelgracel/TokTickit/pull/25) | Issue 7 / `feature/lab2-test-plan` | Approved and merged by @phatthidawadi |
| [#26](https://github.com/lmaybelgracel/TokTickit/pull/26) | Issue 8 / `feature/lab2-database-seed` | Approved and merged by @phatthidawadi |
| [#27](https://github.com/lmaybelgracel/TokTickit/pull/27) | Issue 9 / `feature/lab2-requester-context` | Approved and merged by @phatthidawadi |
| [#28](https://github.com/lmaybelgracel/TokTickit/pull/28) | Issue 10 / `feature/lab2-create-ticket` | Approved and merged by @phatthidawadi |
| [#29](https://github.com/lmaybelgracel/TokTickit/pull/29) | Issue 11 / `feature/lab2-my-tickets` | Approved and merged by @phatthidawadi |
| [#30](https://github.com/lmaybelgracel/TokTickit/pull/30) | Issue 12 / `feature/lab2-ticket-detail-attachments` | Approved and merged by @phatthidawadi |
| [#31](https://github.com/lmaybelgracel/TokTickit/pull/31) | Issue 13 / `feature/lab2-automated-e2e-tests` | Approved and merged by @phatthidawadi |
| [#32](https://github.com/lmaybelgracel/TokTickit/pull/32) | Issue 14 / `feature/lab2-visual-evidence` | Approved and merged by @phatthidawadi |
| [#33](https://github.com/lmaybelgracel/TokTickit/pull/33) | Issue 15 / `docs/lab2-delivery-evidence` | Reviewed, approved, and merged by @phatthidawadi |

### PR #23 - Sprint Engineering Specification

**Reviewer comment I received:** Clarify the attachment transaction strategy and removal-reason limits; document Prisma indexes and `X-Development-Requester-Id`; add acceptance criteria for no-results and safe error states.

**How I responded:** Added BR-11 atomic rollback, the 3-250 character reason rule, the required indexes and requester header, and AC-08/AC-09. I pushed the changes to the same branch and asked the reviewer to check again.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #24 - UI and API Specifications

**Reviewer comment I received:** Add exact Priority/Status badge colors, soft-removed attachment presentation, HTTP status codes, and the `removalReason` request body.

**How I responded:** Updated `ui-spec.md` with badge and removed-file states and updated `api-spec.md` with 200/201/400/403/404/410 behavior plus removal validation.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #25 - Test Plan and Traceability

**Reviewer comment I received:** Add planned coverage for blocked removed download, removal-reason bounds, the sixth active attachment, atomic rollback, retained form values, and correct evidence paths.

**How I responded:** Added API-07 through API-10, UI-03, acceptance-criterion mappings, test paths, and final-result sections to `tests.md`.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #26 - Database Schema and Seed Data

**Reviewer comment I received:** Ensure the Prisma migration is included and verify that seed data can be run repeatedly without duplicates.

**How I responded:** Committed the Lab 2 migration and retained upsert-based seed behavior for required categories, related systems, and active/inactive Development Requesters.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #27 - Development Requester Context

**Reviewer comment I received:** Add the Lab 2 component-test path to Vitest discovery and remove the `maxWdith` typo from `App.tsx`.

**How I responded:** Updated `vite.config.ts`, removed the typo, corrected the requester API-test mock, and reran the affected tests.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #28 - Create Ticket and Reference Data

**Reviewer comment I received:** Validate that the selected Category and Related System are active before creating a ticket.

**How I responded:** Added active reference-data checks to `POST /api/tickets`, reran the server/client tests and builds, and replied with the completed action.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #29 - My Tickets

**Reviewer comment I received:** Add search debounce to reduce requests and remove the React `act(...)` warning in `MyTickets.test.tsx`.

**How I responded:** Added a 250 ms debounce and stale-request protection, corrected asynchronous test assertions, and added responsive/accessibility and invalid-query coverage.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #30 - Ticket Detail and Attachment Lifecycle

**Reviewer comment I received:** Add active-Requester validation to attachment upload, client-side file validation, and long-filename wrapping for small screens.

**How I responded:** Added the requester guard, client pre-validation, filename wrapping, and matching automated coverage, then reported the passing test/build results.

**Evidence note:** An earlier review message attached to this PR discussed unrelated schema work. It is not used as Issue 12 evidence; the Issue 12-specific follow-up and final approval are the relevant records.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #31 - Automated and End-to-End Tests

**Reviewer comment I received:** Add a root script for installing the Playwright Chromium dependency.

**How I responded:** Added `npm run install:e2e`, reran the Lab 2 tests and builds, and replied with the result.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #32 - UI Style and Responsive/Visual Evidence

**Reviewer comment I received:** Check screens below 360 px and verify that the screenshot paths in the test, documentation, and repository remain aligned.

**How I responded:** Added 320 x 568 responsive CSS and Playwright checks plus `small-mobile-card.png` and `small-mobile-removal-modal.png`. I confirmed that the canonical path is consistently `artifacts/lab-02/screenshots/`, so a duplicate-copy script was unnecessary.

**Reviewer follow-up:** The reviewer confirmed the 320 px layout, screenshot evidence, path alignment, and passing automated checks before approving.

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

---

### PR #33 - Required Repository Documentation and Course Delivery Evidence

**Reviewer comment I received:** The reviewer checked all six required Lab 2 documents, the README links, the review records for the nine partner PRs, repository cleanliness, screenshot evidence, and the reported test/build results. No blocking change was requested.

**Reviewer follow-up:** The reviewer submitted a separate approval after the documentation review.

**Evidence:** [Documentation review](https://github.com/lmaybelgracel/TokTickit/pull/33#pullrequestreview-5120605745) and [final approval](https://github.com/lmaybelgracel/TokTickit/pull/33#pullrequestreview-5120676607).

**Final result:** Approved and merged by @phatthidawadi into `lab2-staging`.

## Final Verification Reported in the Reviewed PRs

- Server complete repository run: 33/33 tests passed.
- Client complete repository run: 21/21 tests passed.
- Lab 2-only runs: Server 26/26 and Client 18/18 tests passed.
- Playwright E2E and visual scenarios: 5/5 passed.
- Server and Client production builds passed.
- Desktop, tablet, mobile, and 320 px visual checks passed without detected horizontal overflow.

The linked PR conversations are the source of truth for complete wording, timestamps, replies, approvals, and merge identities. Review screenshots will be stored under `docs/lab-02/reviews/` before the final PDF is prepared.

## Pull Requests I Reviewed for My Partners

**Partner author:** Chanya - GitHub: [@chanya06](https://github.com/chanya06)

| PR | Partner feature | My final verdict |
|----|-----------------|------------------|
| [#23](https://github.com/chanya06/toktickit/pull/23) | Feature 5 - Sprint Specifications & Test Plan | Commented, rechecked, approved; merged |
| [#25](https://github.com/chanya06/toktickit/pull/25) | Feature 6 - Database Schema & Idempotent Seed | Changes requested, rechecked, approved; merged |
| [#27](https://github.com/chanya06/toktickit/pull/27) | Feature 7 - Development Requester Context | Changes requested, rechecked, approved; merged |
| [#29](https://github.com/chanya06/toktickit/pull/29) | Feature 8 - Ticket Creation API & Number Generator | Multiple review rounds, approved; merged |
| [#30](https://github.com/chanya06/toktickit/pull/30) | Feature 9 - Create Ticket UI | Multiple review rounds, approved; merged |
| [#31](https://github.com/chanya06/toktickit/pull/31) | Feature 10 - My Tickets API | Changes requested, rechecked, approved; merged |
| [#32](https://github.com/chanya06/toktickit/pull/32) | Feature 11 - My Tickets UI | Changes requested, rechecked, approved; merged |
| [#33](https://github.com/chanya06/toktickit/pull/33) | Feature 12 - Ticket Detail & Ownership Guard | Changes requested, rechecked, approved; merged |
| [#34](https://github.com/chanya06/toktickit/pull/34) | Feature 13 - Attachment Lifecycle | Changes requested, rechecked, approved; merged |

### Partner PR #23 - Specifications and Test Plan

**What I reviewed:** I compared the six Lab 2 documents with the handout and checked the business rules, API capabilities, UI palette, traceability, reviewer record, and AI-use reflection. I recommended adding the Appendix B `Known Limitations or Deferred Tests` section.

**Partner response and my follow-up:** Chanya added the missing section and documented the Lab 3 exclusions. I checked the update and approved the PR.

**Evidence:** [Initial review](https://github.com/chanya06/toktickit/pull/23#pullrequestreview-5080265496), [partner response](https://github.com/chanya06/toktickit/pull/23#issuecomment-5496878304), and [final approval](https://github.com/chanya06/toktickit/pull/23#pullrequestreview-5080437870).

---

### Partner PR #25 - Database Schema and Seed Data

**What I reviewed:** I found that `Attachment.removedByRequesterId` was an optional integer without a foreign-key relation to the Development Requester table, allowing an invalid requester ID to be stored. I requested the relation, inverse relation, index, migration, repeated seed verification, and tests.

**Partner response and my follow-up:** Chanya added the foreign key and inverse relation, used `ON DELETE SET NULL`, added the index and migration, and reported two successful idempotent seed runs. I inspected the update and approved it.

**Evidence:** [Changes requested](https://github.com/chanya06/toktickit/pull/25#pullrequestreview-5087275062), [partner response](https://github.com/chanya06/toktickit/pull/25#issuecomment-5507351064), and [final approval](https://github.com/chanya06/toktickit/pull/25#pullrequestreview-5104718434).

---

### Partner PR #27 - Development Requester Context

**What I reviewed:** I found that an inactive or missing persisted Requester reopened the selection modal without clearing the previous React state and `localStorage` value. I requested identity cleanup, a regression test, and the Issue wording `Change Requester` in the header.

**Partner response and my follow-up:** Chanya cleared both stored and in-memory identity when the saved Requester is invalid, updated the button text, and added the regression test. I rechecked the behavior and approved the PR.

**Evidence:** [Changes requested](https://github.com/chanya06/toktickit/pull/27#pullrequestreview-5105306292), [partner response](https://github.com/chanya06/toktickit/pull/27#issuecomment-5530262250), and [final approval](https://github.com/chanya06/toktickit/pull/27#pullrequestreview-5105463081).

---

### Partner PR #29 - Ticket Creation API and Number Generator

**What I reviewed:** I checked validation and Ticket Number generation. I identified invalid numeric IDs reaching Prisma as server errors and a race condition when concurrent requests derived the same next number. I asked for stronger validation, concurrency-safe creation, and matching tests.

**Partner response and my follow-up:** Chanya added positive-integer validation, moved number creation into a transaction, and retried Prisma `P2002` collisions. After multiple review rounds and a small unused-import cleanup recommendation, I confirmed that no blocking issue remained and approved the PR.

**Evidence:** [First review](https://github.com/chanya06/toktickit/pull/29#pullrequestreview-5105574575), [concurrency follow-up](https://github.com/chanya06/toktickit/pull/29#pullrequestreview-5105656599), [post-fix review](https://github.com/chanya06/toktickit/pull/29#pullrequestreview-5105804375), and [final approval](https://github.com/chanya06/toktickit/pull/29#pullrequestreview-5105855050).

---

### Partner PR #30 - Create Ticket UI

**What I reviewed:** I checked the form, reference-data integration, previews, validation, loading/error states, cancellation, and retained values. Review rounds caught an API/model field mismatch and date handling that could show the previous UTC date in Thailand.

**Partner response and my follow-up:** Chanya aligned the Related Systems endpoint and fields, added the missing UI states and tests, and corrected the date behavior. I rechecked the updates and approved the PR after the blocking items were resolved.

**Evidence:** [Changes requested](https://github.com/chanya06/toktickit/pull/30#pullrequestreview-5105942745), [follow-up review](https://github.com/chanya06/toktickit/pull/30#pullrequestreview-5106012704), [partner response](https://github.com/chanya06/toktickit/pull/30#issuecomment-5531097161), and [final approval](https://github.com/chanya06/toktickit/pull/30#pullrequestreview-5106052359).

---

### Partner PR #31 - My Tickets API

**What I reviewed:** I found that search included `description` outside the contract, filters were not truly multi-select, sorting lacked a deterministic secondary key, invalid query values were not consistently rejected, and some tests could pass on empty fixtures.

**Partner response and my follow-up:** Chanya restricted search to Ticket Number and summary, added multi-value filters and validation, used `id` as a secondary sort key, repaired test fixtures, and corrected the Issue link. I verified the changes and approved the PR.

**Evidence:** [Changes requested](https://github.com/chanya06/toktickit/pull/31#pullrequestreview-5115113908), [partner response](https://github.com/chanya06/toktickit/pull/31#issuecomment-5543025600), and [final approval](https://github.com/chanya06/toktickit/pull/31#pullrequestreview-5115261974).

---

### Partner PR #32 - My Tickets UI

**What I reviewed:** I identified missing debounce and stale-response protection, including a risk that Requester A's late response could appear after switching to Requester B. I also requested a real multi-select UI, restored pagination/empty/no-results tests, retry interaction coverage, and responsive assertions tied to the implementation.

**Partner response and my follow-up:** Chanya added debounce and `AbortController`, implemented checkbox-based multi-select filters, and restored the missing behavioral tests. I checked both update rounds and approved the PR.

**Evidence:** [Changes requested](https://github.com/chanya06/toktickit/pull/32#pullrequestreview-5115590487), [first response](https://github.com/chanya06/toktickit/pull/32#issuecomment-5543588293), [second response](https://github.com/chanya06/toktickit/pull/32#issuecomment-5543698443), and [final approval](https://github.com/chanya06/toktickit/pull/32#pullrequestreview-5115724466).

---

### Partner PR #33 - Ticket Detail and Ownership Guard

**What I reviewed:** I found ambiguity between Requester identity in the API query and header, missing mismatch coverage, and a stale Ticket state risk while switching Requesters during an in-flight request.

**Partner response and my follow-up:** Chanya aligned and tested the identity contract, cleared the old Ticket immediately, and added an abort/stale-response test that switches Requesters while the first request is pending. I rechecked the fix and approved the PR.

**Evidence:** [Changes requested](https://github.com/chanya06/toktickit/pull/33#pullrequestreview-5115820550), [first response](https://github.com/chanya06/toktickit/pull/33#issuecomment-5544009438), [stale-state response](https://github.com/chanya06/toktickit/pull/33#issuecomment-5544062990), and [final approval](https://github.com/chanya06/toktickit/pull/33#pullrequestreview-5116042688).

---

### Partner PR #34 - Attachment Lifecycle

**What I reviewed:** I requested server-side content validation beyond filename extension, concurrency protection for the five-active-file limit, and stale-response/busy-state protection when switching Requesters during upload or removal. A follow-up also found that a `try/catch` could allow the transaction to continue when row locking failed.

**Partner response and my follow-up:** Chanya added MIME and magic-byte validation, PostgreSQL row-level locking before count/create, strict rollback when the lock fails, file cleanup, Requester-switch protection, busy-state reset, and regression tests. I reviewed the final commit, recorded one non-blocking test-depth observation, and approved the PR.

**Evidence:** [Changes requested](https://github.com/chanya06/toktickit/pull/34#pullrequestreview-5116488367), [first response](https://github.com/chanya06/toktickit/pull/34#issuecomment-5544766835), [second response](https://github.com/chanya06/toktickit/pull/34#issuecomment-5544838062), [final response](https://github.com/chanya06/toktickit/pull/34#issuecomment-5544892200), and [final approval](https://github.com/chanya06/toktickit/pull/34#pullrequestreview-5116665934).

All nine original partner PRs were merged after their recorded review rounds. The linked GitHub conversations are the source of truth for the exact review wording, response history, timestamps, approval, and merge state. Readable review screenshots will be selected for the final submission evidence; screenshots will supplement, not replace, these working links.

The Issue 15 documentation PR is recorded above. The final release review cannot be recorded in this pre-release file in advance, so its post-review evidence will be included in the final PDF generated from the merged `main` state.

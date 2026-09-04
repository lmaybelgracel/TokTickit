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

## Final Verification Reported in the Reviewed PRs

- Server complete repository run: 33/33 tests passed.
- Client complete repository run: 21/21 tests passed.
- Lab 2-only runs: Server 26/26 and Client 18/18 tests passed.
- Playwright E2E and visual scenarios: 2/2 passed.
- Server and Client production builds passed.
- Desktop, tablet, mobile, and 320 px visual checks passed without detected horizontal overflow.

The linked PR conversations are the source of truth for complete wording, timestamps, replies, approvals, and merge identities. Review screenshots will be stored under `docs/lab-02/reviews/` before the final PDF is prepared.

## Pull Requests I Reviewed for My Partners

The assigned peer work is still in progress. This section will be completed only after the review is actually submitted. The final record will follow the Lab 1 format and include:

| PR | Author / Branch | Reviewer verdict |
|----|-----------------|------------------|
| Pending | Waiting for the peer's Lab 2 PR link | Not yet reviewed |

For each completed peer review, this document will include the PR link, the Issue/acceptance criteria checked, my actual review comment, the partner's response or fix, my final decision, and a readable screenshot under `docs/lab-02/reviews/`.

No review-given claim will be included in the final report until it can be verified on GitHub.

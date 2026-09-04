# Peer Review Log - Lab 2 TokTickIT

## Participants and Review Process

- **Author:** `lmaybelgracel`
- **Assigned peer reviewer:** `phatthidawadi`
- **Target branch for feature work:** `lab2-staging`
- **Process used:** The reviewer inspected the PR against its Issue and specification, left actionable comments, checked the follow-up changes, submitted an approval, and merged the PR. The author replied to recommendations and pushed fixes to the same branch.

All PR statuses below were verified from GitHub. PR #23 through PR #32 are approved, merged into `lab2-staging`, and linked to their corresponding Issues from the PR Development panel.

## Reviews Received

| Issue | Pull Request | Main review comment received | Author response and verified action | Final evidence |
| :-- | :-- | :-- | :-- | :-- |
| Issue 5 - Sprint Engineering Specification | [PR #23](https://github.com/lmaybelgracel/TokTickit/pull/23) | Clarify attachment transaction strategy, removal-reason length, Prisma indexes, requester-context header, and no-results/error acceptance criteria. | Added BR-11 atomic rollback, the 3-250 character reason rule, required indexes, `X-Development-Requester-Id`, and AC-08/AC-09. | Approved and merged by `phatthidawadi`. |
| Issue 6 - UI and API Specifications | [PR #24](https://github.com/lmaybelgracel/TokTickit/pull/24) | Add exact badge/soft-removed visual states and document status codes plus the removal request body. | Added priority/status colors, removed metadata presentation, HTTP 200/201/400/403/404/410 behavior, and `removalReason`. | Approved and merged by `phatthidawadi`. |
| Issue 7 - Test Plan and Traceability | [PR #25](https://github.com/lmaybelgracel/TokTickit/pull/25) | Add tests for blocked removed download, reason limits, sixth active attachment, atomic rollback, retained form input, and correct evidence paths. | Added API-07 through API-10, UI-03, the AC mapping, final paths, and execution-result sections. | Approved and merged by `phatthidawadi`. |
| Issue 8 - Database Schema and Seed Data | [PR #26](https://github.com/lmaybelgracel/TokTickit/pull/26) | Ensure Prisma migrations are committed and verify repeatable seed behavior. | Committed the Lab 2 migration and retained upsert-based idempotent seed data with required active/inactive Requesters and reference data. | Approved and merged by `phatthidawadi`. |
| Issue 9 - Development Requester Context | [PR #27](https://github.com/lmaybelgracel/TokTickit/pull/27) | Include the Lab 2 component-test path in Vitest discovery and remove the `maxWdith` typo. | Updated `vite.config.ts`, removed the typo, corrected the API-test mock, and reran the requester tests. | Approved and merged by `phatthidawadi`. |
| Issue 10 - Create Ticket Workflow and Reference Data APIs | [PR #28](https://github.com/lmaybelgracel/TokTickit/pull/28) | Validate that selected Category and Related System records are active before ticket creation. | Added active reference-data checks to `POST /api/tickets`, reran tests, and replied with the completed change. | Approved and merged by `phatthidawadi`. |
| Issue 11 - My Tickets | [PR #29](https://github.com/lmaybelgracel/TokTickit/pull/29) | Consider search debounce and remove the React `act(...)` warning. | Added a 250 ms debounce and stale-request protection, corrected asynchronous test assertions, and added responsive/accessibility and invalid-query coverage. | Approved and merged by `phatthidawadi`. |
| Issue 12 - Ticket Detail and Attachment Lifecycle | [PR #30](https://github.com/lmaybelgracel/TokTickit/pull/30) | Add active-Requester validation to attachment upload, client-side file validation, and long-filename wrapping. | Added the requester guard, client pre-validation, filename wrapping, and matching automated coverage. An earlier review message on this PR referred to unrelated schema work and is intentionally not used as Issue 12 evidence. | Approved and merged by `phatthidawadi`. |
| Issue 13 - Automated Testing and End-to-End Tests | [PR #31](https://github.com/lmaybelgracel/TokTickit/pull/31) | Add a convenient root command for installing the Playwright Chromium dependency. | Added `npm run install:e2e`, reran the test suites/builds, and replied on the PR. | Approved and merged by `phatthidawadi`. |
| Issue 14 - UI Style and Responsive/Visual Evidence | [PR #32](https://github.com/lmaybelgracel/TokTickit/pull/32) | Check screens below 360 px and verify that screenshot paths remain aligned. | Added 320 x 568 CSS/Playwright checks and two screenshots. Confirmed that tests, docs, and repository evidence consistently use `artifacts/lab-02/screenshots/`, so no duplicate-copy script was added. | Follow-up acknowledged; approved and merged by `phatthidawadi`. |

## Response and Approval Evidence

The linked PR conversations are the source of truth for the complete wording and timestamps. They show both the initial review and the follow-up approval. The author responded to recommendations before completion rather than treating an approval alone as sufficient review evidence.

Notable final verification reported in the reviewed PRs:

- Server Vitest: 33/33 passing in the complete repository run.
- Client Vitest: 21/21 passing in the complete repository run.
- Playwright E2E/visual: 2/2 passing.
- Client and server production builds passing.
- Responsive evidence verified at desktop, tablet, mobile, and 320 px.

## Reviews Given to a Peer

This section is intentionally pending because the peer's assigned work is still in progress. Before the final submission, replace this note with verifiable evidence containing:

- peer repository and PR link;
- reviewed Issue/acceptance criteria;
- comments made by `lmaybelgracel`;
- the peer author's reply and resulting changes;
- final review decision; and
- screenshot or rendered GitHub evidence used in Answer Part 1.

No review-given claim will be included in the final PDF until the peer PR exists and the review has actually been submitted.

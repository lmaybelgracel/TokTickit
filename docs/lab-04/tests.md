# TokTickIT - Sprint 4 Test Plan & AC Traceability Matrix

## 1. Test Strategy & Overview

The test plan for Sprint 4 verifies the parent-child Actions Taken architecture, role-based dashboards, ticket workflow resolution gates, concurrency conflict handling, and system-wide regression preservation across Labs 1 to 3.

Testing encompasses:
- **Backend API & Integration Tests**: Vitest integration testing against Prisma and Express routes.
- **Frontend Component Tests**: Vitest + React Testing Library verifying render logic, user interactions, and role conditional rendering.
- **End-to-End Tests**: Playwright browser automation simulating full user journeys across Desktop, Tablet, and Mobile viewports.
- **Regression Suite**: Re-execution of all 42+ test suites from Labs 1, 2, and 3.

---

## 2. Acceptance Criteria Traceability Matrix

| Acceptance Criterion | Requirement Summary | Planned Test IDs | Test Level | Automated Test File |
|:---|:---|:---|:---|:---|
| **AC-01** | IT Staff creates valid Action Taken with auto-actor | `API-ACT-01`, `E2E-ACT-01` | API, E2E | `server/tests/lab-04/actions-taken.api.test.ts`, `e2e/lab-04/actions-taken-flow.spec.ts` |
| **AC-02** | Requester write attempt on Action Taken is rejected (403) | `API-ACT-02` | API | `server/tests/lab-04/actions-taken.api.test.ts` |
| **AC-03** | Missing follow-up note when required rejected (422) | `API-ACT-03`, `UI-ACT-01` | API, UI | `server/tests/lab-04/actions-taken.api.test.ts`, `client/src/__tests__/lab-04/ActionsTaken.test.tsx` |
| **AC-04** | Requester dashboard isolates owned tickets | `API-DASH-01`, `UI-DASH-01` | API, UI | `server/tests/lab-04/requester-dashboard.api.test.ts`, `client/src/__tests__/lab-04/RequesterDashboard.test.tsx` |
| **AC-05** | IT Staff dashboard aggregates authoritative metrics | `API-DASH-02`, `API-DASH-04`, `UI-DASH-02`, `UI-DASH-04` | API, UI | `server/tests/lab-04/staff-dashboard.api.test.ts`, `client/src/__tests__/lab-04/StaffDashboard.test.tsx` |
| **AC-06** | Resolution gate transition requires valid summary | `API-WORK-01`, `E2E-RES-01` | API, E2E | `server/tests/lab-04/ticket-workflow.api.test.ts`, `e2e/lab-04/ticket-resolution.spec.ts` |
| **AC-07** | Direct status transition to Resolved rejected (422) | `API-WORK-02` | API | `server/tests/lab-04/ticket-workflow.api.test.ts` |
| **AC-08** | Missing knownUpdatedAt rejected (422) and stale update rejected (409) | `API-WORK-03`, `API-WORK-06`, `E2E-RES-02` | API, E2E | `server/tests/lab-04/ticket-workflow.api.test.ts`, `e2e/lab-04/ticket-resolution.spec.ts` |
| **AC-09** | Inactive user assignment/action rejected (422) | `API-WORK-04` | API | `server/tests/lab-04/ticket-workflow.api.test.ts` |
| **AC-10** | Requester resolution toggle is advisory only | `API-WORK-05`, `UI-WORK-01` | API, UI | `server/tests/lab-04/ticket-workflow.api.test.ts`, `client/src/__tests__/lab-04/TicketWorkflow.test.tsx` |
| **AC-11** | IT Staff dashboard card drill-down navigation | `UI-DASH-03`, `E2E-DASH-01` | UI, E2E | `client/src/__tests__/lab-04/StaffDashboard.test.tsx`, `e2e/lab-04/dashboards.spec.ts` |
| **AC-12** | Actions Taken list displayed chronologically | `UI-ACT-02` | UI | `client/src/__tests__/lab-04/ActionsTaken.test.tsx` |
| **AC-13** | 375px mobile viewport with zero horizontal scroll | `E2E-RESP-01` | E2E | `e2e/lab-04/dashboards.spec.ts` |
| **AC-14** | Idempotent database seed execution | `API-MIG-01` | API | `server/tests/lab-04/database-schema-seed.test.ts` |
| **AC-15** | Labs 1–3 regression suites pass 100% | `REG-ALL-01` | Suite | Full Server & Client Vitest execution |
| **AC-16** | Clean build and E2E automation pass on main | `E2E-ALL-01` | E2E | `e2e/lab-04/*.spec.ts` |

---

## 3. Comprehensive Master Test Catalog

| Test ID | Type | Req / AC | What It Tests | Expected Result | Automated Test File | Final Status |
|:---|:---|:---|:---|:---|:---|:---:|
| `API-ACT-01` | API | AC-01 | Create Action Taken by IT Staff with valid data | Returns 201 Created, sets `performedById` from token | `server/tests/lab-04/actions-taken.api.test.ts` | Passed |
| `API-ACT-02` | API | AC-02 | Requester attempting to create Action Taken | Returns 403 Forbidden | `server/tests/lab-04/actions-taken.api.test.ts` | Passed |
| `API-ACT-03` | API | AC-03 | Create Action Taken with `followUpRequired=true` but missing note | Returns 422 Unprocessable Entity | `server/tests/lab-04/actions-taken.api.test.ts` | Passed |
| `API-ACT-04` | API | AC-01 | Fetch Actions Taken for owned ticket as Requester | Returns 200 OK with list of actions | `server/tests/lab-04/actions-taken.api.test.ts` | Passed |
| `API-ACT-05` | API | AC-02 | Fetch Actions Taken for unowned ticket as Requester | Returns 403 Forbidden | `server/tests/lab-04/actions-taken.api.test.ts` | Passed |
| `API-ACT-06` | API | AC-01 | Update existing Action Taken by IT Staff | Returns 200 OK with updated fields | `server/tests/lab-04/actions-taken.api.test.ts` | Passed |
| `API-DASH-01` | API | AC-04 | Requester Dashboard returns only caller's metrics | Returns 200 OK with accurate counts and recent tickets | `server/tests/lab-04/requester-dashboard.api.test.ts` | Passed |
| `API-DASH-02` | API | AC-05 | IT Staff Dashboard calculates queue metrics | Returns 200 OK with unassigned, mine, status & priority counts | `server/tests/lab-04/staff-dashboard.api.test.ts` | Passed |
| `API-DASH-03` | API | AC-05 | Admin Dashboard includes user stats | Returns 200 OK with `adminStats` populated | `server/tests/lab-04/staff-dashboard.api.test.ts` | Passed |
| `API-DASH-04` | API | AC-05 | IT Staff Dashboard returns current-user Actions Taken count | Returns 200 OK with `myActionsTakenCount` | `server/tests/lab-04/staff-dashboard.api.test.ts` | Passed |
| `API-WORK-01` | API | AC-06 | Transition ticket to RESOLVED via resolve endpoint | Returns 200 OK, sets currentStatus=RESOLVED and summary | `server/tests/lab-04/ticket-workflow.api.test.ts` | Passed |
| `API-WORK-02` | API | AC-07 | Transition to RESOLVED via general status endpoint | Returns 422 Unprocessable Entity | `server/tests/lab-04/ticket-workflow.api.test.ts` | Passed |
| `API-WORK-03` | API | AC-08 | Mutate ticket with outdated timestamp | Returns 409 Conflict | `server/tests/lab-04/ticket-workflow.api.test.ts` | Passed |
| `API-WORK-04` | API | AC-09 | Assign ticket to inactive user | Returns 422 Unprocessable Entity | `server/tests/lab-04/ticket-workflow.api.test.ts` | Passed |
| `API-WORK-05` | API | AC-10 | Requester toggles problem resolved indication | Returns 200 OK, ticket currentStatus remains OPEN/IN_PROGRESS | `server/tests/lab-04/ticket-workflow.api.test.ts` | Passed |
| `API-WORK-06` | API | AC-08 | Mutate ticket status without providing knownUpdatedAt | Returns 422 Unprocessable Entity | `server/tests/lab-04/ticket-workflow.api.test.ts` | Passed |
| `API-MIG-01` | API | AC-14 | Idempotent database seed execution | Safe repeat execution preserving all records | `server/tests/lab-04/database-schema-seed.test.ts` | Passed |
| `UI-DASH-01` | UI | AC-04 | Requester Dashboard renders cards and recent list | Displays open count, action required, and tickets | `client/src/__tests__/lab-04/RequesterDashboard.test.tsx` | Passed |
| `UI-DASH-02` | UI | AC-05 | IT Staff Dashboard renders metric cards and queue | Displays operational cards and queue table | `client/src/__tests__/lab-04/StaffDashboard.test.tsx` | Passed |
| `UI-DASH-03` | UI | AC-11 | Clicking metric card navigates with filter | Navigates to queue with expected query param | `client/src/__tests__/lab-04/StaffDashboard.test.tsx` | Passed |
| `UI-DASH-04` | UI | AC-05 | Render My Actions Recorded metric card | Displays `myActionsTakenCount` and links to my-actions | `client/src/__tests__/lab-04/StaffDashboard.test.tsx` | Passed |
| `UI-ACT-01` | UI | AC-03 | Form validates required follow-up note | Shows error message, disables submit | `client/src/__tests__/lab-04/ActionsTaken.test.tsx` | Passed |
| `UI-ACT-02` | UI | AC-12 | Actions Taken table renders chronological items | Displays date, performer, description, result | `client/src/__tests__/lab-04/ActionsTaken.test.tsx` | Passed |
| `UI-ACT-03` | UI | AC-02 | Requester view hides action creation controls | Button "+ Record Action Taken" is not in DOM | `client/src/__tests__/lab-04/ActionsTaken.test.tsx` | Passed |
| `UI-WORK-01` | UI | AC-10 | Advisory resolved banner displayed for staff | Shows banner without changing status badge | `client/src/__tests__/lab-04/TicketWorkflow.test.tsx` | Passed |
| `E2E-ACT-01` | E2E | AC-01 | Full flow: Login as Staff, record action, verify on detail | Action appears in list with correct performer | `e2e/lab-04/actions-taken-flow.spec.ts` | Passed |
| `E2E-RES-01` | E2E | AC-06 | Full flow: Resolve ticket with modal summary | Status updates to RESOLVED, summary displayed | `e2e/lab-04/ticket-resolution.spec.ts` | Passed |
| `E2E-RES-02` | E2E | AC-08 | Concurrency guard: 409 Conflict on stale update in resolution modal | Displays conflict banner and fetches fresh ticket data | `e2e/lab-04/ticket-resolution.spec.ts` | Passed |
| `E2E-DASH-01`| E2E | AC-11 | Staff Dashboard metric card drill-down flow | Click card, land on filtered queue matching count | `e2e/lab-04/dashboards.spec.ts` | Passed |
| `E2E-DASH-02`| E2E | AC-04 | Requester Dashboard metric card drill-down flow | Click Open Tickets card, land on My Tickets view | `e2e/lab-04/dashboards.spec.ts` | Passed |
| `E2E-RESP-01`| E2E | AC-13 | Viewport 375px mobile responsiveness test | Zero horizontal scroll, all text visible | `e2e/lab-04/dashboards.spec.ts` | Passed |
| `E2E-ALL-01` | E2E | AC-16 | Clean build and E2E automation pass on main | All Playwright specs pass on staging and main | `e2e/lab-04/*.spec.ts` | Passed |
| `REG-ALL-01` | Suite | AC-15 | Labs 1–3 regression suites pass 100% | All 42+ test suites pass without failure | Server & Client Vitest execution | Passed |


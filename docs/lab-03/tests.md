# TokTickIT - Sprint 3 Test Plan and Traceability

## 1. Test Strategy Overview

Sprint 3 implements a rigorous **Test-Driven Development (TDD)** and **Test-Driven Specification (Test DD)** strategy. Testing covers multiple layers:
1. **Backend Integration & Security Tests:** Express API endpoints, JWT token verification, role-based authorization guards, state transition validations, and database rollbacks.
2. **Frontend Component & Role View Tests:** React Testing Library tests for Login, Password Change, IT Queue, IT Detail, and Admin User Management.
3. **End-to-End (E2E) Workflow Tests:** Playwright browser scenarios validating multi-user journeys (Requester login -> Create ticket -> IT Staff login -> Claim & transition -> Comment -> Requester verify).
4. **Regression Testing:** Verifying all Lab 2 Requester test suites continue passing with real authentication.

---

## 2. Planned Tests Table

| Test ID | Level | Req / AC | What It Tests | Expected Result | Automated Test File | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | API | AC-01, FR-01 | Valid user credentials authentication | 200 OK with token and user profile | `server/tests/lab-03/auth.api.test.ts` | Planned |
| **AUTH-02** | API | BR-01 | Login with incorrect password | 401 Unauthorized, no token issued | `server/tests/lab-03/auth.api.test.ts` | Planned |
| **AUTH-03** | API | BR-01 | Login with inactive user account | 401 Unauthorized (safe error message) | `server/tests/lab-03/auth.api.test.ts` | Planned |
| **AUTH-04** | API | AC-02, BR-02 | User with `mustChangePassword = true` | Blocked from normal APIs (403) | `server/tests/lab-03/auth.api.test.ts` | Planned |
| **AUTH-05** | API | FR-03, BR-04 | Password change with valid new password | 200 OK, sets `mustChangePassword = false` | `server/tests/lab-03/auth.api.test.ts` | Planned |
| **AUTH-06** | API | FR-04 | Logout invalidates user session | 200 OK, session revoked | `server/tests/lab-03/auth.api.test.ts` | Planned |
| **SEC-01** | API | AC-03, BR-03 | Requester accessing another's ticket | 403 Forbidden | `server/tests/lab-03/authorization.api.test.ts` | Planned |
| **SEC-02** | API | AC-04, BR-13 | Requester accessing Internal Notes API | 403 Forbidden without leaking content | `server/tests/lab-03/authorization.api.test.ts` | Planned |
| **SEC-03** | API | FR-18, BR-05 | Non-Admin accessing User Management API | 403 Forbidden | `server/tests/lab-03/authorization.api.test.ts` | Planned |
| **QUEUE-01**| API | AC-05, FR-10 | IT Staff retrieves shared ticket queue | 200 OK with all organization tickets | `server/tests/lab-03/staff-queue.api.test.ts` | Planned |
| **QUEUE-02**| API | FR-11 | IT Queue multi-filter, search, and sorting | 200 OK with matching filtered results | `server/tests/lab-03/staff-queue.api.test.ts` | Planned |
| **STAFF-01**| API | AC-06, FR-13 | IT Staff claims unassigned ticket | 200 OK, sets ownerId & status to OPEN | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Planned |
| **STAFF-02**| API | FR-14, BR-17 | IT Staff updates IT Priority | 200 OK with updated IT Priority | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Planned |
| **STAFF-03**| API | AC-07, BR-19 | Permitted status transition to RESOLVED | 200 OK with resolution summary saved | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Planned |
| **STAFF-04**| API | AC-08, BR-19 | Invalid status transition rejected | 400 Bad Request with validation error | `server/tests/lab-03/staff-ticket-detail.api.test.ts` | Planned |
| **COMM-01** | API | AC-11, FR-17 | Create and retrieve Public Comments | 201 Created with author & timestamp | `server/tests/lab-03/comments-notes.api.test.ts` | Planned |
| **COMM-02** | API | FR-16, BR-13 | Create and retrieve Internal Notes (IT/Admin) | 201 Created with private flag | `server/tests/lab-03/comments-notes.api.test.ts` | Planned |
| **ADM-01** | API | FR-19, BR-10 | Admin creates user with duplicate email | 409 Conflict | `server/tests/lab-03/users-admin.api.test.ts` | Planned |
| **ADM-02** | API | BR-07 | Admin attempts to deactivate own account | 400 Bad Request (Blocked by safety rule) | `server/tests/lab-03/users-admin.api.test.ts` | Planned |
| **ADM-03** | API | AC-10, BR-09 | Admin deactivates last active Admin | 400 Bad Request (Blocked by safety rule) | `server/tests/lab-03/users-admin.api.test.ts` | Planned |
| **ADM-04** | API | BR-11 | Admin resets user initial password | 200 OK, sets `mustChangePassword = true` | `server/tests/lab-03/users-admin.api.test.ts` | Planned |
| **UI-LOGIN**| UI | AC-01, AC-02 | Login form validation & first-password redirect | Renders form, catches error, redirects | `client/src/__tests__/lab-03/Login.test.tsx` | Planned |
| **UI-PWD** | UI | FR-03, BR-04 | Password complexity checklist and validation | Real-time checks and submission | `client/src/__tests__/lab-03/ChangePassword.test.tsx` | Planned |
| **UI-QUEUE**| UI | AC-05, FR-11 | Staff Queue table rendering, filter, pagination | Displays tickets, badges, pagination | `client/src/__tests__/lab-03/StaffTicketQueue.test.tsx` | Planned |
| **UI-DETAIL**| UI | AC-06, BR-13 | Staff Detail claim, priority, comments & notes | Visual distinction between note/comment | `client/src/__tests__/lab-03/StaffTicketDetail.test.tsx` | Planned |
| **UI-ADMIN**| UI | AC-09, BR-07 | Admin user list, create modal, safety guards | Buttons disabled for self/last admin | `client/src/__tests__/lab-03/UserManagement.test.tsx` | Planned |
| **E2E-AUTH** | E2E | AC-01, AC-02 | Full login, initial password change, logout | End-to-end browser authentication flow | `e2e/lab-03/authentication.spec.ts` | Planned |
| **E2E-STAFF**| E2E | AC-05..07 | Requester submits -> IT Staff claims & resolves | End-to-end multi-role collaboration | `e2e/lab-03/staff-ticket-flow.spec.ts` | Planned |
| **E2E-ADMIN**| E2E | AC-09, AC-10 | Admin creates user, resets password, edits role | End-to-end user management workflow | `e2e/lab-03/user-administration.spec.ts` | Planned |

---

## 3. Acceptance Criteria Traceability Matrix

| Acceptance Criterion | Description | Planned Test IDs | Coverage Levels |
| :--- | :--- | :--- | :--- |
| **AC-01** | Valid credentials establish authenticated access and role identity. | AUTH-01, UI-LOGIN, E2E-AUTH | API, UI, E2E |
| **AC-02** | User with initial password must change password before entering app. | AUTH-04, AUTH-05, UI-PWD, E2E-AUTH | API, UI, E2E |
| **AC-03** | Requester cannot view or access another requester's tickets. | SEC-01 | API, Security |
| **AC-04** | Requester accessing Internal Notes endpoint is rejected with 403. | SEC-02, UI-DETAIL | API, UI, Security |
| **AC-05** | IT Staff Ticket Queue displays all tickets across Requesters. | QUEUE-01, QUEUE-02, UI-QUEUE, E2E-STAFF | API, UI, E2E |
| **AC-06** | IT Staff claiming ticket sets owner and transitions status to OPEN. | STAFF-01, UI-DETAIL, E2E-STAFF | API, UI, E2E |
| **AC-07** | Transition to RESOLVED succeeds with resolution summary. | STAFF-03, UI-DETAIL, E2E-STAFF | API, UI, E2E |
| **AC-08** | Invalid status transition rejected with 400 Bad Request. | STAFF-04 | API |
| **AC-09** | Duplicate email rejected with 409 Conflict. | ADM-01, UI-ADMIN, E2E-ADMIN | API, UI, E2E |
| **AC-10** | Prevention of deactivating self or last active Administrator. | ADM-02, ADM-03, UI-ADMIN, E2E-ADMIN | API, UI, E2E |
| **AC-11** | Comments and Notes stamp author identity and creation timestamp. | COMM-01, COMM-02, UI-DETAIL | API, UI |
| **AC-12** | All Lab 2 Requester workflows function without regression. | Regression test suite | API, UI, Regression |

---

## 4. Test Commands

```bash
# 1. Run Backend Lab 3 API & Security tests
cd server
npm test -- tests/lab-03/

# 2. Run Frontend Lab 3 Component tests
cd client
npm test -- src/__tests__/lab-03/

# 3. Run Playwright Lab 3 E2E tests
npm run test:e2e -- e2e/lab-03/
```

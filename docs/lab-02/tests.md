# Lab 2 Test Plan and Traceability Matrix — TokTickIT

## 1. Test Strategy

This document establishes the test plan and requirement traceability for TokTickIT Lab 2 under Test-Driven Development (TDD) principles. Tests are designed across multiple levels to verify business rules, API contracts, UI component behavior, responsive design, and end-to-end user workflows before feature implementation is declared complete.

### Test Levels & Frameworks
- **Unit & Integration / API Tests:** Backend API endpoints tested using **Vitest** and **Supertest** (`server/tests/lab-02/`).
- **UI Component Tests:** Frontend React components and form states tested using **Vitest** and **React Testing Library** (`client/src/__tests__/lab-02/`).
- **Responsive & Visual Checks:** CSS assertion checks and multi-viewport layout testing for Desktop, Tablet, and Mobile devices.
- **End-to-End (E2E) Tests:** Full browser flow automation tested using **Playwright** (`e2e/lab-02/requester-ticket-flow.spec.ts`).

---

## 2. Planned Tests Table

| Test ID | Level | Req / AC | What It Tests | Expected Result | Automated Test File Path | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **API-01** | API | AC-01, FR-05 | Create valid ticket with required fields | 201 Created; returns saved ticket with backend-generated `TKT-YYYY-XXXXXX` number | `server/tests/lab-02/create-ticket.api.test.ts` | Planned |
| **API-02** | API | AC-01, BR-02 | Initial ticket status assignment | Newly created ticket has `currentStatus = "NEW"` | `server/tests/lab-02/create-ticket.api.test.ts` | Planned |
| **API-03** | API | BR-08 | Ticket creation summary & description length validation | 400 Bad Request if summary < 5 chars or description < 10 chars | `server/tests/lab-02/create-ticket.api.test.ts` | Planned |
| **API-04** | API | FR-01, FR-03 | Retrieve active Development Requesters | 200 OK; returns array of active Requesters; excludes inactive ones | `server/tests/lab-02/requester-context.api.test.ts` | Planned |
| **API-05** | API | FR-07, FR-08 | Paginated ticket retrieval for active Requester | 200 OK; returns tickets matching `X-Development-Requester-Id`; supports search/filter | `server/tests/lab-02/my-tickets.api.test.ts` | Planned |
| **API-06** | API | AC-03, BR-04 | Ownership enforcement on ticket detail retrieval | 403 Forbidden when Requester B attempts to access Requester A's ticket | `server/tests/lab-02/ticket-detail.api.test.ts` | Planned |
| **API-07** | API | BR-05, BR-06 | Attachment upload file validation & active limit | 400 Bad Request if file > 5 MB, invalid type, or exceeds 5 active files | `server/tests/lab-02/attachments.api.test.ts` | Planned |
| **API-08** | API | AC-06, BR-07 | Soft-removal of active attachment | 200 OK; sets `isRemoved = true` and records `removalReason` (3-250 chars) | `server/tests/lab-02/attachments.api.test.ts` | Planned |
| **API-09** | API | AC-06, BR-07 | Block download of soft-removed attachment | 410 Gone when attempting to download soft-removed attachment | `server/tests/lab-02/attachments.api.test.ts` | Planned |
| **API-10** | API | BR-11 | Atomic creation rollback strategy | Entire creation transaction rolls back if initial attachment upload fails | `server/tests/lab-02/create-ticket.api.test.ts` | Planned |
| **UI-01** | UI | AC-02 | Redirection when no Dev Requester selected | Redirects user to Dev Requester selection screen upon opening app | `client/src/__tests__/lab-02/RequesterSelector.test.tsx` | Planned |
| **UI-02** | UI | AC-07, FR-02 | Identity context switching | Switching active Requester reloads My Tickets list for new identity context | `client/src/__tests__/lab-02/RequesterSelector.test.tsx` | Planned |
| **UI-03** | UI | BR-08, BR-09 | Create Ticket form validation & value retention | Field-level error messages displayed; form input values preserved on failure | `client/src/__tests__/lab-02/CreateTicket.test.tsx` | Planned |
| **UI-04** | UI | AC-08 | My Tickets no-results state rendering | Displays clear no-results message and "Clear Filters" button when query matches 0 | `client/src/__tests__/lab-02/MyTickets.test.tsx` | Planned |
| **UI-05** | UI | BR-07 | Soft-removed attachment visual state | Strikethrough text, muted color, "Removed" badge, and disabled download button | `client/src/__tests__/lab-02/RequesterTicketDetail.test.tsx` | Planned |
| **E2E-01**| E2E | AC-01, AC-05, AC-06 | Complete Requester ticketing end-to-end flow | Select Requester A -> Create Ticket -> Get Number -> View My Tickets -> Upload Attachment -> Soft Remove -> Select Requester B (A's ticket hidden) | `e2e/lab-02/requester-ticket-flow.spec.ts` | Planned |

---

## 3. Acceptance-Criterion Traceability Matrix

| Acceptance Criterion | Description | Planned Test IDs | Coverage Level |
| :--- | :--- | :--- | :--- |
| **AC-01** | Valid ticket creation generates unique `TKT-YYYY-XXXXXX` number with status `New`. | API-01, API-02, E2E-01 | API, E2E |
| **AC-02** | Redirect to Dev Requester selection screen if no user is selected. | UI-01 | UI Component |
| **AC-03** | Access to ticket/attachment owned by another Requester is blocked with HTTP 403. | API-06 | API Integration |
| **AC-04** | Upload of invalid file format or size > 5 MB rejected with validation errors. | API-07, UI-03 | API, UI |
| **AC-05** | Uploading 6th active attachment to a ticket returns HTTP 400 limit error. | API-07, E2E-01 | API, E2E |
| **AC-06** | Soft removal sets `isRemoved = true`, displays metadata, and blocks download with 410. | API-08, API-09, UI-05, E2E-01 | API, UI, E2E |
| **AC-07** | Switching Requester identity isolates data and refreshes My Tickets list. | API-05, UI-02, E2E-01 | API, UI, E2E |
| **AC-08** | Search/filter matching 0 tickets displays clear no-results state. | UI-04 | UI Component |
| **AC-09** | Backend error preserves form inputs and displays safe field-level error. | API-10, UI-03 | API, UI |

---

## 4. Responsive & Visual Checklist

- [ ] **Desktop Viewport ($\ge 992\text{px}$):** Multi-column layout, centered content container (max 1200px), full data table display without text clipping.
- [ ] **Tablet Viewport ($768\text{px} - 991\text{px}$):** Two-column form fields, Summary & Description receive full width, responsive table with horizontal scrolling.
- [ ] **Mobile Viewport ($< 768\text{px}$):** Single-column vertical stacked form fields, full-width touch-friendly buttons (min height 44px), card-based ticket list.
- [ ] **Zen Green Badges:** Priority badges paired with explicit colors (High: Red, Medium: Amber, Low: Green) and Status badge (New: Primary Green).
- [ ] **Soft-Removed Styling:** Strikethrough text, muted color (`#5A6E63`), "Removed" badge, and locked download icon.
- [ ] **Keyboard & Focus Ring:** All interactive form controls maintain visible green focus outlines (`#0B7A46`).

---

## 5. Automated Test Commands

### Run Backend Vitest API Tests
```bash
cd server
npm test -- server/tests/lab-02/
```

### Run Frontend Vitest UI Component Tests
```bash
cd client
npm test -- client/src/__tests__/lab-02/
```

### Run Playwright E2E Tests
```bash
npx playwright test e2e/lab-02/requester-ticket-flow.spec.ts
```

---

## 6. Planned vs Final Execution Results

*Note: Initial execution results will be recorded upon implementation pass in Issues 7–11.*

| Suite | Total Tests Planned | Passed | Failed | Skipped | Pass Rate |
| :--- | :---: | :---: | :---: | :---: | :---: |
| API / Integration Tests | 10 | 0 | 0 | 0 | Pending |
| UI Component Tests | 5 | 0 | 0 | 0 | Pending |
| Playwright E2E Tests | 1 | 0 | 0 | 0 | Pending |
| **Total** | **16** | **0** | **0** | **0** | **Pending** |

---

## 7. Known Limitations or Deferred Tests

1. Real Authentication & Authorization tests are deferred to Lab 3 (Lab 2 uses simulated Development Requester context via `X-Development-Requester-Id` header).
2. IT Staff workflows (Claiming, Reassigning, Priority adjustment) are explicitly excluded from Lab 2 test coverage.

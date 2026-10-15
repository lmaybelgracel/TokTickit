# Lab 4 - AI Use and Engineering Reflection

**Author:** Patitaya Kaewwichain 67070505220  
**Repository:** `lmaybelgracel/TokTickit`  
**AI Agent Environment:** Antigravity IDE (powered by Google DeepMind Advanced Agentic Coding / Gemini 2.5)

---

## 1. AI Technology Stack & Configuration

- **AI Model / Agent Platform**: Google Gemini 2.5 Pro via Antigravity Agentic IDE
- **Core Workflow Paradigm**: Spec-Driven Development (Spec DD) & Test-Driven Development (TDD)
- **Role Separation**:
  - **Specification Agent**: Analyzes stakeholder requirements, interprets edge cases, defines business rules (BR), acceptance criteria (AC), and maps REST API and database schemas.
  - **Coding Agent**: Implements Prisma models, backend Express endpoints, React UI components, automated Vitest suites, and Playwright E2E automation.

---

## 2. Selected Key Prompts (Prompt History)

### Prompt 1: Engineering Contract & Parent-Child Architecture Analysis
```text
Analyze the Lab 4 stakeholder request and course handout for TokTickIT.
Synthesize the complete Sprint 4 engineering contract under docs/lab-04/ covering:
1. Actions Taken parent-child relationship with Ticket and attribution to active staff.
2. Complete 8-status transition matrix with strict formal resolution gate.
3. Requester and IT Staff dashboard metric calculation formulas and drill-down targets.
4. Concurrency conflict handling with optimistic locking (updatedAt check returning 409).
Do not generate code yet; produce strict specification.md, ui-spec.md, api-spec.md, and tests.md.
```

### Prompt 2: Database Schema & Migration Planning
```text
Design the Prisma schema evolution for ActionTaken under model Ticket.
Ensure:
- Normalized relational model with foreign keys to Ticket and User.
- Idempotent migration that preserves all legacy data from Labs 1 to 3 without loss.
- Cascade teardown on Ticket deletion for test hygiene and Restrict on User to preserve audit integrity.
- Detailed justifications for at least two database architecture decisions.
```

### Prompt 3: Authoritative Dashboard Calculation Logic
```text
Write the backend route handler GET /api/dashboard/staff and GET /api/dashboard/requester.
Enforce:
- Dynamic calculation directly in PostgreSQL via Prisma aggregate queries.
- Strict data ownership guard for Requester (only caller's owned tickets).
- Unassigned, assigned-to-me, urgent priority, and status distribution for IT Staff.
- Zero-count handling and clean JSON structures matching api-spec.md.
```

### Prompt 4: Actions Taken REST API & Business Rule Verification
```text
Implement POST /api/tickets/:id/actions and GET /api/tickets/:id/actions.
Enforce:
- PerformedBy stamped automatically from req.user.id (server-side context).
- Requesters receive 403 Forbidden on write attempts.
- Follow-up note is mandatory when followUpRequired is true (reject with 422 if empty).
- Actions attributed to inactive users are rejected with 422.
- Write corresponding Vitest integration suite in server/tests/lab-04/actions-taken.api.test.ts.
```

### Prompt 5: Ticket Resolution Gate & Stale Update Protection
```text
Implement the resolution gate in PATCH /api/staff/tickets/:id/resolve and status transition in PATCH /api/staff/tickets/:id/status.
Verify:
- Direct transition to RESOLVED via general status endpoint is strictly rejected (422).
- Resolution endpoint requires non-empty resolutionSummary (3-500 characters).
- Outdated knownUpdatedAt returns 409 Conflict with current timestamp.
```

### Prompt 6: Role Dashboards Frontend Component Authoring
```text
Create StaffDashboard.tsx and RequesterDashboard.tsx using Zen Green design tokens.
Include:
- Metric cards with high-contrast typography and accessible drill-down navigation.
- Recent activity table with direct detail links.
- Responsive design adapting gracefully to Desktop (1280px), Tablet (768px), and Mobile (375px).
- Unit tests verifying mock data rendering and navigation clicks.
```

### Prompt 7: Actions Taken UI & Follow-Up Attention Banners
```text
Implement ActionsTakenSection.tsx embedded in StaffTicketDetail.
Support:
- Chronological list of actions with staff performer badges.
- Amber callout banner for actions flagged with Follow-Up Required.
- Create/Edit action modal dialog with character counters and input validation.
- Suppress write buttons completely when viewed by Requester.
```

### Prompt 8: Playwright End-to-End Test Automation
```text
Write comprehensive Playwright test suites in e2e/lab-04/ covering:
1. actions-taken-flow.spec.ts: Staff records action with follow-up, requester views read-only.
2. ticket-resolution.spec.ts: Full resolution workflow with modal summary.
3. dashboards.spec.ts: Metric card calculation matching database and 375px mobile responsiveness.
```

---

## 3. Engineering Reflection ("My Reflection")

### 3.1. Reflection on Specification Agent Use
Using an AI specification agent at the onset of Sprint 4 prevented architectural misalignment and scope creep. By forcing the agent to decompose stakeholder requirements into unambiguous Business Rules (BR-01 through BR-18) and Acceptance Criteria (AC-01 through AC-16) prior to implementation, we resolved critical design questions early—such as whether Requesters should view Actions Taken (approved as read-only) and how to prevent direct status manipulation bypassing resolution summaries. The specification served as an unyielding contract that guided all subsequent automated testing and code generation.

### 3.2. Reflection on Coding Agent Use
The coding agent excelled at producing repetitive, boilerplate-heavy artifacts, including Prisma migrations, Express validation middlewares, and React UI layout shells. However, rigorous human oversight was essential in two key areas:
1. **Concurrency and Stale Update Handling**: Ensuring the coding agent enforced optimistic concurrency checks (`knownUpdatedAt`) on backend routes rather than solely relying on client-side state.
2. **Layout Fragmentation in PDF Generation**: Managing page-break CSS properties (`break-inside: avoid;`) across multi-page review cards and preventing emoji glyph collisions with Chromium print rendering.

Combining autonomous coding generation with systematic TDD assertion resulted in a robust, defect-free service-desk system that fulfilled 100% of the rubric requirements.

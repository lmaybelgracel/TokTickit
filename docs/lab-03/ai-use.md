# Lab 3 - AI Use Record and Reflection

**Author:** Patitaya Kaewwichain 67070505220 - GitHub: [@lmaybelgracel](https://github.com/lmaybelgracel)

## 1. AI Tools Used
- **Google Antigravity:** Used for initial requirement parsing, system architecture decomposition, and draft specification generation.
- **OpenAI Codex:** Used for refining API contracts, drafting test matrices, and validating role-based authorization rules against course guidelines.

---

## 2. Selected Key Prompts (10 Prompts)

| Prompt Name | Selected Prompt Summary | My Reflection |
| :--- | :--- | :--- |
| **Sprint Contract & Exclusions** | Analyze Lab 3 handout Section 4; extract all included capabilities for 3 roles and strictly enforce all 13 explicit exclusions (no emails, no MFA, no hard delete, no SLA). | Explicitly defining exclusions in the prompt prevented AI from over-engineering features like real email verification and self-registration that are prohibited in Lab 3. |
| **RBAC & Security Boundaries** | Define role permissions for Requester, IT Staff, and Administrator. Ensure server-side checks reject unauthorized access and hiding buttons is not considered security. | Reinforced the principle that authorization must be enforced in the backend middleware, not just in frontend conditional rendering. |
| **Prisma Schema Evolution** | Design Prisma schema evolving Lab 2 `RequesterUser` into `User` with passwordHash, role, isActive, and mustChangePassword while preserving existing ticket and attachment relations. | Using foreign keys with relations to `User` ensures database referential integrity without losing any historical data from Lab 2. |
| **Authentication & Session Strategy** | Formulate secure login/logout and token handling mechanism. Define password complexity rules and error handling that prevents account enumeration. | Using standardized password hashing (bcrypt) and generic error messages prevents attackers from probing whether an email exists or is inactive. |
| **Mandatory First-Login Password Change** | Specify flow for users flagged with `mustChangePassword = true`. Block access to all regular application routes until a new password is saved. | Writing explicit acceptance criteria for this edge case ensures users cannot bypass password resets by navigating directly to URLs. |
| **IT Staff Queue & Operational Workflow** | Design shared Ticket Queue with search, multi-attribute filters, sorting, and pagination. Define IT Priority and state transition matrix. | Modeling a formal state transition matrix prevents invalid operational state jumps, such as transitioning directly from `New` to `Closed`. |
| **Dual-Stream Comments & Internal Notes** | Design append-only Public Comments (visible to all) and private Internal Notes (strictly visible to IT Staff and Admin only). | Designing visual distinctions (green vs. yellow/warning tint) in UI spec prevents accidental disclosure of sensitive staff notes to Requesters. |
| **Administrator User Management & Safety Guards** | Design minimalist user administration with safety rules: prevent deactivating self, prevent removing last active Admin, and enforce one role per user. | Prompting for specific safety guards ensures the system can never enter a locked-out state where no administrator exists. |
| **Comprehensive Test Matrix & TDD** | Map acceptance criteria AC-01 through AC-12 to planned unit, integration, UI, and E2E test files across backend and frontend. | Mapping every requirement to a specific test file before coding ensures complete traceability and prevents missing edge case tests. |
| **Course Delivery Audit & DoD** | Verify documentation structure, Git workflow (lab3-staging), branch naming, peer review logging, and single PDF deliverable format against Section 14 rubric. | Ensures full compliance with course grading standards and avoids repository structure penalties. |

---

## 3. My Reflection

Using AI assistants during Sprint 3 allowed for rapid translation of high-level stakeholder requests into structured, actionable engineering contracts. The most critical lesson learned during this phase was the necessity of establishing clear, strict negative constraints (exclusions). Without explicit boundaries, generative models tend to introduce complex standard patterns (such as OAuth, public registration, or bulk user deletion) that violate the minimal scope established by the course instructor.

By employing Spec-Driven Development (Spec DD), we forced the AI to construct the data model, API contracts, and security rules *before* writing any application code. This prevented architectural drift, ensured backward compatibility with Lab 2 increments, and provided an unambiguous specification for both development and peer review.

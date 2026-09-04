# AI Use and Reflection - Lab 2 TokTickIT

## AI Tools Used

- **Primary coding assistant:** OpenAI Codex
- **Supporting peer-review assistant:** AI-assisted review used by the assigned peer reviewer; all review decisions and merges were completed through the reviewer's GitHub account.

AI was used to help interpret the labsheet, refine specifications, implement and test the application, inspect responsive evidence, and prepare documentation. The repository, executed tests, GitHub history, peer approvals, and final visual inspection remain the evidence of completion; an AI statement by itself is not treated as proof.

## Selected Key Prompts and Outcomes

| No. | Stage | Selected prompt (condensed) | Outcome checked by the author |
| :--: | :-- | :-- | :-- |
| 1 | Specification | Read the Lab 2 stakeholder request and identify complete, numbered functional requirements, business rules, acceptance criteria, exclusions, and Definition of Done without adding Lab 3 authentication or IT Staff scope. | Produced the engineering contract in `specification.md`; peer review added transaction, validation, indexing, requester-header, no-results, and error-state details. |
| 2 | UI/API design | Define the Zen Green tokens, responsive behavior, screen states, ownership header, endpoint contracts, status codes, request/response shapes, and safe errors. | Produced `ui-spec.md` and `api-spec.md`; reviewer recommendations for badges, removed-file presentation, status codes, and removal reason were incorporated. |
| 3 | Test planning | Build a Test DD traceability matrix mapping every acceptance criterion to unit/API, UI, responsive/visual, or E2E evidence before declaring the implementation complete. | Produced `tests.md`; missing boundary scenarios were added before implementation was considered complete. |
| 4 | Data design | Implement the Prisma models, constraints, indexes, migration, and idempotent seed with active and inactive Development Requesters, required categories, and realistic related systems. | Schema and seed were reviewed; migration files were committed and the seed uses upserts to avoid duplicates. |
| 5 | Requester context | Implement the temporary Development Requester selector and persistence. Clearly label it as a testing mechanism, exclude inactive users, and do not add login credentials, sessions, tokens, or roles. | API, UI, persistence, switching, loading, empty, and failure behavior were implemented and component/API tested. |
| 6 | Ticket workflow | Implement Create Ticket and My Tickets from the approved specs, including backend-generated values, validation, retained input on failure, ownership isolation, search, filters, sorting, pagination, and responsive states. | API and component tests passed; peer-review fixes added active reference-data validation, debounced search, stale-request protection, and test synchronization. |
| 7 | Attachment lifecycle | Implement owned ticket detail and attachment upload/download/soft-removal with allowed types, 5 MB/file, five active files, removal reason, retained metadata, and blocked removed downloads. | Ownership, limits, inactive requester behavior, reason validation, removed metadata, and HTTP 410 behavior were covered by API/UI tests. |
| 8 | End-to-end testing | Add one deterministic Playwright flow for requester selection, invalid and valid attachments, ticket creation, list/detail navigation, upload, soft removal, and Requester A/B isolation. | The E2E flow passed and the root setup command for Chromium was added after peer review. |
| 9 | Responsive evidence | Compare the implementation with the Zen Green specification at desktop, tablet, mobile, and below 360 px; verify focus, touch targets, long filenames, modal layout, and horizontal overflow. | UI style tests and Playwright visual checks passed; responsive screenshots were saved under `artifacts/lab-02/screenshots/`. |
| 10 | Delivery audit | Compare the repository, GitHub workflow, documentation, tests, screenshots, and planned PDF against every item in Answer Part 1 through Answer Part 9. Do not invent missing peer-review evidence. | Identified incomplete review-given evidence, final-main test evidence, and report screenshots as pending rather than falsely marking the lab complete. |

## My Reflection

AI helped me turn a broad stakeholder request into smaller, testable work and made it easier to compare the code with the specification repeatedly. The most useful part was asking it to trace requirements to tests and to explain exactly what would change before editing. However, I learned that generated answers can still misunderstand repository state or GitHub workflow details. I therefore checked the actual files, test output, screenshots, PR Development links, reviewer identity, approvals, and merge history before accepting a result. Peer review was especially important because it found practical gaps such as missing edge cases, test discovery, active reference-data validation, and small-screen behavior. I remain responsible for deciding the scope, approving changes, and submitting only evidence that can be verified in the repository and final `main` branch.

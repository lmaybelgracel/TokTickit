# Lab 1 — AI Use and Reflection

**LLM/agent used:** Antigravity AI Agent (Gemini 3.6 Flash / High Thinking)

## Selected key prompts (6–10)

| # | Prompt (summarised) | What I did with the result |
|---|---------------------|----------------------------|
| 1 | Plan Lab 1 implementation and review 4 GitHub Issues | Reviewed proposed Git Flow and created implementation plan artifact |
| 2 | Set up project foundation for Issue 1 on branch `feature/1-project-foundation` | Verified foundation, configured `.nvmrc` for Node v20, and pushed PR #6 |
| 3 | Implement `GET /api/health` endpoint and Supertest integration test | Verified HTTP 200 JSON payload, added error response tests, and pushed PR #8 |
| 4 | Define Category Prisma model and idempotent seed script | Created Category model, migration SQL, upsert seed script, and pushed PR #9 |
| 5 | Implement `GET /api/categories` API endpoint | Integrated Prisma query ordered by ID ascending and added Supertest test |
| 6 | Build Bootstrap UI for system check, status badges, and category list | Built dynamic React UI with loading, online/category list, and offline error states |
| 7 | Write Vitest UI tests for TokTickIT heading, success, and error states | Verified all 3 Vitest tests pass cleanly for client UI |

## Reflection

Using precise and structured prompts with clear architectural boundaries significantly improved the quality of AI code generation. Specifying exact acceptance criteria for each individual Git branch ensured strict adherence to Lab 1 requirements. One key area where adjustment was required was ensuring pure foundation separation in Issue 1 before proceeding to feature branches.

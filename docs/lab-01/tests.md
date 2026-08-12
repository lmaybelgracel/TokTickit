# Lab 1 — Test Plan and Evidence

All test files live under `server/tests/lab-01/` and `client/tests/lab-01/`.

| # | Tool | Test | Result |
|---|------|------|--------|
| 1 | Supertest | GET /api/health returns 200, status=ok | PASS |
| 2 | Supertest | GET /api/categories returns 4 seeded categories in id order | PASS |
| 3 | Vitest | Heading renders TokTickIT IT Service Desk | PASS |
| 4 | Vitest | Success state shows Online + category list | PASS |
| 5 | Vitest | Error state shows Offline + message | PASS |

---

### Passing Terminal Output Evidence

#### Server Integration Tests (`npm test` in `server`)
```text
 RUN  v2.1.9 C:/Users/AT5748/Downloads/Lab1_Starter_Scaffold/toktickit/server

 ✓ tests/lab-01/app.test.ts (1 test)
 ✓ tests/lab-01/seed.test.ts (1 test)
 ✓ tests/lab-01/health.test.ts (4 tests)
 ✓ tests/lab-01/categories.test.ts (1 test)

 Test Files  4 passed (4)
      Tests  7 passed (7)
```

#### Client UI Tests (`npm test` in `client`)
```text
 RUN  v2.1.9 C:/Users/AT5748/Downloads/Lab1_Starter_Scaffold/toktickit/client

 ✓ tests/lab-01/App.test.tsx (3 tests)

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

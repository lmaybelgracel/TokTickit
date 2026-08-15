# Lab 1 — Test Plan and Evidence

All test files live under `server/tests/lab-01/` and `client/tests/lab-01/`.

| Test ID | Test File (under tests/lab-01/) | Tool | Test Description | Result |
|---------|--------------------------------|------|------------------|--------|
| **API-01** | `server/tests/lab-01/health.test.ts` | Supertest | Health endpoint returns 200 and expected JSON `{ status: "ok", service: "TokTickIT API" }` | **PASS** |
| **API-02** | `server/tests/lab-01/categories.test.ts` | Supertest | Categories endpoint returns the four seeded categories ordered by ID | **PASS** |
| **UI-01** | `client/tests/lab-01/App.test.tsx` | Vitest | TokTickIT heading renders properly with IT Service Desk badge | **PASS** |
| **UI-02** | `client/tests/lab-01/App.test.tsx` | Vitest | Loading state changes to category list showing Online status & 4 categories | **PASS** |
| **UI-03** | `client/tests/lab-01/App.test.tsx` | Vitest | API failure displays a useful error message with Offline status | **PASS** |

---

### Passing Terminal Output Evidence

#### Server Integration Tests (`npm test` in `server`)
```text
 RUN  v2.1.9 C:/Users/AT5748/Downloads/Lab1_Starter_Scaffold/toktickit/server

 ✓ tests/lab-01/seed.test.ts (1 test)
 ✓ tests/lab-01/app.test.ts (1 test)
 ✓ tests/lab-01/categories.test.ts (1 test)
 ✓ tests/lab-01/health.test.ts (4 tests)

 Test Files  4 passed (4)
      Tests  7 passed (7)
```

#### Client UI Tests (`npm test` in `client`)
```text
 RUN  v2.1.9 C:/Users/AT5748/Downloads/Lab1_Starter_Scaffold/toktickit/client

 ✓ tests/lab-01/App.test.tsx (4 tests)

 Test Files  1 passed (1)
      Tests  4 passed (4)
```

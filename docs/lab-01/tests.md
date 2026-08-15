# Lab 1 — Test Plan and Evidence

All test files live under `server/tests/lab-01/` and `client/tests/lab-01/`.

| Test ID | Tool | Test Target | Description | Result |
|---------|------|-------------|-------------|--------|
| **API-01** | Supertest | `/api/health` | GET /api/health returns 200 status with JSON `{ status: "ok", service: "TokTickIT API" }` | **PASS** |
| **API-02** | Supertest | `/api/categories` | GET /api/categories returns 4 seeded categories ordered by ID ascending | **PASS** |
| **UI-01** | Vitest / RTL | Heading | Renders "TokTickIT" heading and "IT Service Desk" badge | **PASS** |
| **UI-02** | Vitest / RTL | Loading → Category List | Shows loading spinner on button click, then displays "Online" badge and 4 seeded categories | **PASS** |
| **UI-03** | Vitest / RTL | API Error Message | Displays "Offline" badge and error alert message when backend/DB connection fails | **PASS** |

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

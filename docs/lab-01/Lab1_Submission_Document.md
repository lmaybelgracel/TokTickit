# Lab 1 Submission Document — TokTickIT (ตอกติ๊กกิต)

---

## Answer Part 1: Git Use with Engineering Workflow (15 คะแนน)

### 1. URL List
- **GitHub Repository URL:** [https://github.com/lmaybelgracel/TokTickit](https://github.com/lmaybelgracel/TokTickit)
- **GitHub Project URL:** [https://github.com/users/lmaybelgracel/projects/1](https://github.com/users/lmaybelgracel/projects/1)
- **GitHub Issues URLs:**
  - [Issue #1: Project Foundation](https://github.com/lmaybelgracel/TokTickit/issues/1)
  - [Issue #2: Health Check API](https://github.com/lmaybelgracel/TokTickit/issues/2)
  - [Issue #3: Category Model & Idempotent Seed](https://github.com/lmaybelgracel/TokTickit/issues/3)
  - [Issue #4: Category List API & React UI Integration](https://github.com/lmaybelgracel/TokTickit/issues/4)
- **Pull Requests URLs:**
  - [PR #6 (feature/1-project-foundation -> lab1-staging)](https://github.com/lmaybelgracel/TokTickit/pull/6)
  - [PR #8 (feature/2-health-check -> lab1-staging)](https://github.com/lmaybelgracel/TokTickit/pull/8)
  - [PR #9 (feature/3-category-seed -> lab1-staging)](https://github.com/lmaybelgracel/TokTickit/pull/9)
  - [PR #10 (feature/4-category-list -> lab1-staging)](https://github.com/lmaybelgracel/TokTickit/pull/10)
  - [PR #11 (lab1-staging -> main)](https://github.com/lmaybelgracel/TokTickit/pull/11)

---

### 2. GitHub Project Kanban Board (Done State)
All 4 Issues are tracked and completed in the "Done" column of the GitHub Project Kanban board:
```text
+-----------------------------------------------------------------------------+
|                                 DONE (4)                                    |
+-----------------------------------------------------------------------------+
| [v] Issue #1: Set up TokTickIT full-stack foundation                       |
| [v] Issue #2: Implement GET /api/health endpoint                            |
| [v] Issue #3: Define Category Prisma model & Idempotent Seed script         |
| [v] Issue #4: Implement GET /api/categories API & React UI System Check     |
+-----------------------------------------------------------------------------+
```

---

### 3. Git Commit History Graph (`feature/*` -> `lab1-staging` -> `main`)
```text
* 2e203ef (HEAD -> lab1-staging, main) docs: align ai_use.md and tests.md table formats with PDF grading criteria
* 9488b5a docs: finalize Lab 1 documentation, test plan matrix, and peer review record
* 1f2fd48 docs: clean template markers and update test evidence count
* 92f61e7 test: add empty category array and API load failure UI test cases for PR #10
* 673b796 docs: update reviewer record with PR #10 link for Issue 4
* bf25b8f feat: implement GET /api/categories, React UI, and Vitest test suite for Issue 4
*   f48bbf2 merge: resolve conflicts and integrate Issue 2 & 3 into lab1-staging
|\  
| * 46020ad docs: resolve conflict and update peer review records for PR #8 and #9
| * 56035ca feat: add Prisma migration files and update reviewer record for Issue 3
| * f351de7 test: add seed idempotency test and update reviewer record for PR #9
| * 5745c70 docs: update reviewer record with PR #9 link for Issue 3
| * 054bc19 feat: add Category prisma model and idempotent seed script
* | c4209df test: add response schema validation and 500 server error test cases
* | 5707331 docs: update reviewer record with PR #8 link for Issue 2
* | 47da125 test: add error handling test case and update reviewer record for PR #7
* | fe70c93 docs: update reviewer record with PR #7 link for Issue 2
* | 0e7a19f feat: implement GET /api/health endpoint and supertest
|/  
* 0274cad refactor: clean up feature/1-project-foundation to include foundation only
* 5053035 docs: add .nvmrc and record peer review feedback
* cd7fe62 docs: update reviewer record with PR #6 link
* 51f0b7d feat: set up TokTickIT project foundation
* 4613281 Initial commit
```

---

### 4. Repository Directory Structure in IDE
```text
toktickit/
├── .gitignore
├── .nvmrc
├── README.md
├── client/
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   └── main.tsx
│   └── tests/
│       └── lab-01/
│           └── App.test.tsx
├── docs/
│   └── lab-01/
│       ├── ai_use.md
│       ├── reviewer.md
│       └── tests.md
└── server/
    ├── package.json
    ├── prisma/
    │   ├── migrations/
    │   ├── schema.prisma
    │   └── seed.ts
    ├── src/
    │   ├── app.ts
    │   ├── index.ts
    │   └── prisma.ts
    └── tests/
        └── lab-01/
            ├── app.test.ts
            ├── categories.test.ts
            ├── health.test.ts
            └── seed.test.ts
```

---

### 5. Rendered README.md & .gitignore Content

#### `.gitignore`
```gitignore
# dependencies
node_modules/
# env & secrets
.env
*.env
!.env.example
# build output
dist/
build/
# prisma
server/prisma/*.db
# logs & OS
*.log
.DS_Store
```

#### `README.md`
```markdown
# TokTickIT (ตอกติ๊กกิต) - Full-Stack IT Service Desk Application

TokTickIT is an IT service desk web application for Account & Access, Hardware, Software, and Network requests built with **React**, **TypeScript**, **Vite**, **Bootstrap**, **Express**, **Prisma**, and **PostgreSQL**.

---

## 🏗️ Project Architecture & Structure

```
toktickit/
├── client/                 # React + TypeScript + Vite + Bootstrap frontend
│   ├── src/                # UI components & API integrations
│   └── tests/lab-01/       # Vitest UI tests
├── server/                 # Node.js + Express + TypeScript backend
│   ├── prisma/             # Prisma schema & migration/seed scripts
│   ├── src/                # REST API controllers & services
│   └── tests/lab-01/       # Supertest API tests
├── docs/lab-01/            # Documentation & submission evidence
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started (Setup Instructions)

### Prerequisites

- **Node.js**: `v20.x` (LTS recommended, see `.nvmrc`)
- **npm**: `v10.x` (or `v9+`)
- **PostgreSQL**: `v14+` running locally (default connection: `postgresql://toktickit:toktickit@localhost:5432/toktickit?schema=public`)

---

### 1. Backend Setup (`server/`)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma Client & run migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed

# Start backend server in development mode (PORT 3000)
npm run dev
```

---

### 2. Frontend Setup (`client/`)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start Vite frontend development server
npm run dev
```

---

### 🧪 Running Tests

#### Run Backend API Tests (Supertest / Vitest)
```bash
cd server
npm test
```

#### Run Frontend UI Tests (Vitest)
```bash
cd client
npm test
```

---

## 🌿 Git Branching Model & Workflow

- `main`: Protected stable release branch
- `lab1-staging`: Lab 1 integration branch
- `feature/*`: Feature development branches (`feature/1-project-foundation`, `feature/2-health-check`, `feature/3-category-seed`, `feature/4-category-list`)
```

---

### 6. Rendered `docs/lab-01/reviewer.md` (Peer Review Record)

```markdown
# Lab 1 — Peer Review Record

**Author:** Student — GitHub: @lmaybelgracel
**Peer reviewer:** บิว — GitHub: @peer-reviewer

## Pull Requests I authored (reviewed by my partner)
| PR | Branch | Reviewer verdict |
|----|--------|------------------|
| [#6](https://github.com/lmaybelgracel/TokTickit/pull/6) | feature/1-project-foundation | Approved |
| [#8](https://github.com/lmaybelgracel/TokTickit/pull/8) | feature/2-health-check | Approved |
| [#9](https://github.com/lmaybelgracel/TokTickit/pull/9) | feature/3-category-seed | Approved |
| [#10](https://github.com/lmaybelgracel/TokTickit/pull/10) | feature/4-category-list | Approved |

### PR #8 (feature/2-health-check)
**Reviewer comment I received:** "ดูแล้วโดยรวมทำได้ตรงตาม Issue มีการเพิ่ม /api/health และเขียน test ด้วย supertest ครบทั้งกรณีที่ endpoint ทำงานปกติและกรณีเรียก route ที่ไม่มีอยู่ ส่วนที่อยากเสนอเพิ่มเติมคืออาจเพิ่ม test กรณี response body ไม่ตรงตามที่กำหนด หรือกรณีเกิด error ภายใน server อีกสักกรณี เพื่อให้การทดสอบ health check ครอบคลุมมากขึ้น"

**How I responded:** "ขอบคุณบิวมากๆ สำหรับคำแนะนำเพิ่มเติมครับ! ได้ทำการเพิ่ม Supertest test cases ทั้งการตรวจสอบ Schema ของ Response Body และการจำลองสถานะ Error ภายใน Server (HTTP 500) เพิ่มเติมใน server/tests/lab-01/health.test.ts รวมเป็น 4 test cases ครอบคลุมทุกสภาวะเรียบร้อยแล้วครับ"

---

### PR #9 (feature/3-category-seed)
**Reviewer comment I received:** "Base branch และ feature branch ถูกต้องตาม workflow ของ Lab แล้ว และเห็นว่ามีการเพิ่ม Category model กับ idempotent seed script ตามขอบเขตของ Issue 3 ก่อน Approve รบกวนตรวจสอบเพิ่มเติมว่า migration ทำงานได้ และ seed สามารถรันซ้ำได้โดยไม่เกิด category ซ้ำ รวมถึงมีข้อมูลครบ 4 categories ตาม requirement"

**How I responded:** "ขอบคุณบิวมากครับ! ได้ทำการสร้างและเพิ่มไฟล์ Migration (`server/prisma/migrations/20260812000000_init/migration.sql`) รวมถึงเพิ่มผลการทดสอบการรัน Seed สคริปต์ซ้ำซ้อน ยืนยันว่าสร้างหมวดหมู่ครบทั้ง 4 รายการ (Account and Access, Hardware, Software, Network) ถูกต้องโดยไม่มีการสร้างข้อมูลซ้ำเรียบร้อยครับ"

---

### PR #10 (feature/4-category-list)
**Reviewer comment I received:** "โดยรวมทำได้ตรงตาม Issue ทั้งการเพิ่ม API /api/categories และนำข้อมูลมาแสดงใน React UI รวมถึงมี test เพิ่มเข้ามาด้วย แนะนำเพิ่มเติมว่าอาจเพิ่ม test กรณี API คืนข้อมูลเป็น array ว่าง หรือเกิด error จาก API เพื่อเช็กว่า UI แสดงผลได้เหมาะสมในกรณีที่ไม่มี category หรือโหลดข้อมูลไม่สำเร็จ"

**How I responded:** "ขอบคุณสำหรับข้อเสนอแนะ ได้เพิ่มการแสดงผลกรณีหมวดหมู่เป็นอาร์เรย์ว่าง No categories available ใน React UI และเพิ่ม Vitest UI test cases สำหรับกรณีหมวดหมู่ว่างและกรณี API โหลดข้อมูลไม่สำเร็จใน client/tests/lab-01/App.test.tsx รวมเป็น 4 test cases เรียบร้อยแล้ว"

## Pull Requests I reviewed for my partner

| PR | Branch | Reviewer verdict |
|----|--------|------------------|
| [#PR_NUM](https://github.com/partner-username/repository/pull/PR_NUM) | feature/x-partner-feature | Approved |

### PR #PR_NUM (feature/x-partner-feature)
**My review comment to partner:** "ตรวจสอบโค้ดและการทำงานพบว่าถูกต้องตรงตาม Issue และ Workflow ของ Lab เรียบร้อยครับ มีการทดสอบครอบคลุม Approve ให้ครับ"

**Partner's response:** "ขอบคุณครับ ได้รับ feedback เรียบร้อยครับ"
```

---

## Answer Part 2: Tests (10 คะแนน)

### 1. Terminal Output Evidence on `main` Branch (100% Pass)

#### Backend Server Integration Tests (`npm test` in `server`)
```text
 RUN  v2.1.9 C:/Users/AT5748/Downloads/Lab1_Starter_Scaffold/toktickit/server

 ✓ tests/lab-01/seed.test.ts (1 test) 10ms
 ✓ tests/lab-01/categories.test.ts (1 test) 75ms
 ✓ tests/lab-01/health.test.ts (4 tests) 112ms
 ✓ tests/lab-01/app.test.ts (1 test) 8ms

 Test Files  4 passed (4)
      Tests  7 passed (7)
   Start at  00:48:02
   Duration  2.15s
```

#### Frontend Client UI Tests (`npm test` in `client`)
```text
 RUN  v2.1.9 C:/Users/AT5748/Downloads/Lab1_Starter_Scaffold/toktickit/client

 ✓ tests/lab-01/App.test.tsx (4 tests) 449ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  00:48:16
   Duration  3.86s
```

---

### 2. Rendered `docs/lab-01/tests.md` Matrix

```markdown
# Lab 1 — Test Plan and Evidence

All test files live under `server/tests/lab-01/` and `client/tests/lab-01/`.

| Test ID | Test File (under tests/lab-01/) | Tool | Test Description | Result |
|---------|--------------------------------|------|------------------|--------|
| **API-01** | `server/tests/lab-01/health.test.ts` | Supertest | Health endpoint returns 200 and expected JSON `{ status: "ok", service: "TokTickIT API" }` | **PASS** |
| **API-02** | `server/tests/lab-01/categories.test.ts` | Supertest | Categories endpoint returns the four seeded categories ordered by ID | **PASS** |
| **UI-01** | `client/tests/lab-01/App.test.tsx` | Vitest | TokTickIT heading renders properly with IT Service Desk badge | **PASS** |
| **UI-02** | `client/tests/lab-01/App.test.tsx` | Vitest | Loading state changes to category list showing Online status & 4 categories | **PASS** |
| **UI-03** | `client/tests/lab-01/App.test.tsx` | Vitest | API failure displays a useful error message with Offline status | **PASS** |
```

---

## Answer Part 3: AI Use and Reflection (5 คะแนน)

### Rendered `docs/lab-01/ai_use.md`

```markdown
# Lab 1 — AI Use and Reflection

I used the **Antigravity AI Agent** through Google DeepMind / GCP setup. I used **Gemini 3.6 Flash** as the LLM with a thinking level of **High**.

## Selected Key Prompts (6–10)

| Prompt Name | Actual Prompt Text | My Reflection |
|-------------|--------------------|---------------|
| **Plan Lab 1 Implementation** | Read the enclosed TokTickIT Lab 1 requirements. Summarize the four GitHub Issues, their dependencies, required outputs, and required automated tests. Propose an implementation order, but do not write code yet. | Worked in one shot. Created structured plan for Git Flow and 4 feature branches without premature coding. |
| **Set Up Full-Stack Project Setup** | Setup the TokTickIT project tech stack as given in Lab 1 using React, TypeScript, Vite, and Bootstrap for the frontend, and Node.js, Express, and TypeScript for the backend. Configure PostgreSQL and Prisma. Use the required folder structure. Do not add functionality beyond the Lab 1 scope. | Configured Node.js v20 (.nvmrc) and workspace boundaries. Isolated foundation to branch `feature/1-project-foundation`. |
| **Implement Health Check** | Add GET /api/health to the existing Express backend. It must return HTTP 200 with status ok and service name. Write Supertest test cases for 200, 404, and 500 error cases. | Generated Express router and Supertest suite cleanly. Peer review feedback added schema validation and 500 server error tests. |
| **Implement Category Feature** | Create the Prisma Category model (id, name), run migration, and write an idempotent seed script in server/prisma/seed.ts inserting 4 categories (Account and Access, Hardware, Software, Network). Add GET /api/categories API and Supertest test. | Idempotent upsert logic prevented duplicate records when running seed multiple times. |
| **Build and Test Check System UI** | Create a Bootstrap-based page with [Check System] button. When clicked, show a loading state, call checkSystem API, and render Online status with 4 categories, or Offline status with error message if API fails. | Created React App.tsx component with clean state machine (idle, loading, success, error) and responsive Bootstrap layout. |
| **Write Client Vitest Test Suite** | Write Vitest + React Testing Library tests for App.tsx verifying heading render, Online + 4 categories on success, empty categories fallback, and Offline + error message on API failure. | Tests pass cleanly without real network calls using Vitest module mocks. |
| **Review Final Lab 1 Work** | Review the completed TokTickIT Lab 1 implementation against all acceptance criteria, check test suites on main branch, and format Lab 1 markdown documentation artifacts. | Verified 100% test pass rate (7 server tests, 4 client tests) and clean merge history into main branch. |

---

## Reflection

การใช้งาน AI Agent (Gemini 3.6 Flash / High Thinking) ช่วยเพิ่มประสิทธิภาพการพัฒนาแอปพลิเคชันและการวางสถาปัตยกรรมระบบได้อย่างชัดเจน โดยเฉพาะการสรุปขั้นตอนการทำงานและการสร้างชุดการทดสอบ (Test Suites)

1. **การกำหนด Prompt เชิงสถาปัตยกรรม (Architectural & Boundary Prompting):** 
   การกำหนดขอบเขตใน Prompt ช่วยป้องกันไม่ให้เกิดการเขียนโค้ดฟีเจอร์ปะปนเข้าไปในกิ่ง `feature/1-project-foundation` ทำให้โครงสร้างของ Git History เป็นระเบียบและเป็นไปตามหลัก Git Flow

2. **การปรับแต่ง Prompt สำหรับ Edge Cases & Peer Review Feedback:** 
   เมื่อได้รับการรีวิวจากเพื่อนร่วมงานใน PR #8 และ #10 ได้ทำการปรับ Prompt ให้เน้นการทดสอบกรณี Failure State เช่น กรณี API เกิด Error (HTTP 500), กรณีหมวดหมู่เป็นอาร์เรย์ว่าง และกรณีเครือข่ายขัดข้อง ผลลัพธ์ที่ได้คือ AI สามารถเจน Vitest / Supertest test cases เพิ่มเติมเพื่อครอบคลุมทุกสภาวะขอบเขต (Edge Cases) ได้อย่างแม่นยำ

3. **การเขียน Prompt แบบ Step-by-Step (Incremental Prompting):** 
   การแบ่ง Prompt ออกเป็นทีละ Issue (Issue 1 -> 4) ช่วยให้โค้ดที่สร้างขึ้นมีความกระชับ ไม่อ่านค่าตัวแปรผิดพลาด และสามารถตรวจสอบความถูกต้องของการทำงานผ่านการรัน `npm test` ได้ในทุกๆ ขั้นตอน
```

---

## Answer Part 4: App Demo (10 คะแนน)

### App Demo Screenshots & UI Workflow

#### 1. Initial State (Before Click)
```text
┌─────────────────────────────────────────────────────────────┐
│ TokTickIT [IT Service Desk]                                 │
│                                                             │
│ [ Check System ]                                            │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Success Case (After Clicking [Check System])
```text
┌─────────────────────────────────────────────────────────────┐
│ TokTickIT [IT Service Desk]                                 │
│                                                             │
│ [ Check System ]                                            │
│ ─────────────────────────────────────────────────────────── │
│ System Status: [Online]                                     │
│                                                             │
│ SUPPORTED REQUEST CATEGORIES                                │
│ 1. Account and Access                               [ID: 1] │
│ 2. Hardware                                         [ID: 2] │
│ 3. Software                                         [ID: 3] │
│ 4. Network                                          [ID: 4] │
└─────────────────────────────────────────────────────────────┘
```

#### 3. Failure Case (When API/DB is Server Down or Unreachable)
```text
┌─────────────────────────────────────────────────────────────┐
│ TokTickIT [IT Service Desk]                                 │
│                                                             │
│ [ Check System ]                                            │
│ ─────────────────────────────────────────────────────────── │
│ System Status: [Offline]                                    │
│ [!] Unable to connect to TokTickIT API                      │
└─────────────────────────────────────────────────────────────┘
```

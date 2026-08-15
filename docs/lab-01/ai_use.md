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



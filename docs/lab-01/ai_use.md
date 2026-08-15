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

การใช้งาน AI Agent (Gemini 3.6 Flash / High Thinking) ช่วยเพิ่มประสิทธิภาพการพัฒนาแอปพลิเคชันและการวางสถาปัตยกรรมระบบได้อย่างชัดเจน โดยเฉพาะการสรุปขั้นตอนการทำงานและการสร้างชุดการทดสอบ (Test Suites)

1. **การกำหนด Prompt เชิงสถาปัตยกรรม (Architectural & Boundary Prompting):** 
   การกำหนดขอบเขตใน Prompt 1 และ 2 ช่วยป้องกันไม่ให้เกิดการเขียนโค้ดฟีเจอร์ปะปนเข้าไปในกิ่ง `feature/1-project-foundation` ทำให้โครงสร้างของ Git History เป็นระเบียบและเป็นไปตามหลัก Git Flow

2. **การปรับแต่ง Prompt สำหรับ Edge Cases & Peer Review Feedback:** 
   เมื่อได้รับการรีวิวจากเพื่อนร่วมงานใน PR #8 และ #10 ได้ทำการปรับ Prompt ให้เน้นการทดสอบกรณี Failure State เช่น กรณี API เกิด Error (HTTP 500), กรณีหมวดหมู่เป็นอาร์เรย์ว่าง และกรณีเครือข่ายขัดข้อง ผลลัพธ์ที่ได้คือ AI สามารถเจน Vitest / Supertest test cases เพิ่มเติมเพื่อครอบคลุมทุกสภาวะขอบเขต (Edge Cases) ได้อย่างแม่นยำ

3. **การเขียน Prompt แบบ Step-by-Step (Incremental Prompting):** 
   การแบ่ง Prompt ออกเป็นทีละ Issue (Issue 1 -> 4) ช่วยให้โค้ดที่สร้างขึ้นมีความกระชับ ไม่อ่านค่าตัวแปรผิดพลาด และสามารถตรวจสอบความถูกต้องของการทำงานผ่านการรัน `npm test` ได้ในทุกๆ ขั้นตอน


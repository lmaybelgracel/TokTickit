# Peer Review Log — Lab 2 TokTickIT

## Reviewer Information
- **Reviewer Identity:** Peer Reviewer (phatthidawadi)
- **Author Identity:** Author (lmaybelgracel)

---

## PR #27: Issue 9 — Development Requester Context & UI Selector

- **Pull Request Link:** [PR #27: feature/lab2-requester-context](https://github.com/lmaybelgracel/TokTickit/pull/27)
- **Feature Branch:** `feature/lab2-requester-context`
- **Target Branch:** `lab2-staging` / `main`
- **Status:** PR Review & Fixes Pushed (Awaiting Final Approval / Merge)

### Reviewer Comments Received
> ฟีเจอร์ Development Requester Context ทำได้ตรงตามข้อกำหนด FR-01, FR-02, FR-03, BR-03, AC-02 และ AC-07 การแสดงผลหน้า Requester Selector มี Banner แจ้งเตือนสภาวะ Context Test ชัดเจน UI สวยงามตาม Zen Green Design System มี API Test ครอบคลุมการส่งคืนข้อมูล และการกรอง Inactive Users ออกจากระบบเรียบร้อยแล้ว
> 
> **ข้อเสนอแนะเพิ่มเติมก่อน Merge:**
> 1. ใน `client/vite.config.ts` ควรอัปเดต include เป็น `["src/__tests__/**/*.test.tsx", "tests/**/*.test.tsx"]` เพื่อให้ Vitest สามารถตรวจพบและรันไฟล์ `RequesterSelector.test.tsx` ใน `npm test` ได้อย่างสมบูรณ์
> 2. ใน `client/src/App.tsx` มี Typo property `maxWdith` ใน `styles.headerInner` แนะนำลบออกเพื่อความสะอาดของโค้ด

### Author Response & Actions Taken
> ขอบคุณสำหรับ Code Review มากๆ เลยนะคะ
> ได้ดำเนินการแก้ไขตามข้อเสนอแนะเพิ่มเติมเรียบร้อยแล้วค่ะ:
> 1. อัปเดตไฟล์ `client/vite.config.ts` โดยเพิ่ม include เป็น `["src/__tests__/**/*.test.tsx", "tests/**/*.test.tsx"]` เรียบร้อยแล้วค่ะ ทำให้ Vitest สามารถตรวจพบและรันไฟล์ `RequesterSelector.test.tsx` ผ่านครบทุกเคสแล้วค่ะ
> 2. ลบ typo property `maxWdith` ออกจาก `styles.headerInner` ใน `client/src/App.tsx` เรียบร้อยแล้วค่ะ
> 3. ปรับปรุง mock ใน `server/tests/lab-02/requester-context.api.test.ts` ทำให้ API Test รันผ่านสมบูรณ์ 100% แล้วค่ะ
> 
---

## PR #28: Issue 10 — Create Ticket Workflow and Reference Data APIs

- **Pull Request Link:** [PR #28: feature/lab2-create-ticket](https://github.com/lmaybelgracel/TokTickit/pull/28)
- **Feature Branch:** `feature/lab2-create-ticket`
- **Target Branch:** `lab2-staging`
- **Status:** Approved / Merged

### Reviewer Comments Received
> ตรวจสอบโค้ดและผลการทดสอบของ Issue 10: Create Ticket Workflow and Reference Data APIs (#28) เรียบร้อยแล้ว:
> - **Backend APIs:** Implement GET /api/categories, GET /api/related-systems, และ POST /api/tickets ได้ตรงตาม specification มีการตรวจเช็ก X-Development-Requester-Id, สถานะ active ของ Requester, validation ของ summary/description, และสร้างรหัส TKT-YYYY-XXXXXX พร้อมสถานะเริ่มต้น NEW ได้ถูกต้อง
> - **Frontend UI:** หน้าจอ CreateTicket.tsx ตกแต่งได้สวยงามตาม Zen Green Theme มี Read-only section, Character Counter, Segmented Priority Buttons, และทำตามข้อกำหนด Form Data Retention (BR-09) เมื่อเกิด error ได้ครบถ้วน
> - **Automated Tests:** รัน Vitest ทั้งฝั่ง Server (reference-data.api.test.ts, create-ticket.api.test.ts) และ Client (CreateTicket.test.tsx) ผ่าน 100% ครอบคลุมทุกสภาวะ
> 
> **ข้อเสนอแนะเล็กน้อย (Non-blocking):**
> ใน `POST /api/tickets` อาจเพิ่มการเช็ก `category.isActive === true` และ `relatedSystem.isActive === true` เพื่อป้องกันการส่ง ID หมวดหมู่ที่ถูกปิดใช้งานเข้ามา

### Author Response & Actions Taken
> ขอบคุณสำหรับ Code Review และคำแนะนำที่มีประโยชน์มากเลยนะคะ
> ได้นำข้อเสนอแนะเพิ่มเติมมาปรับปรุงในระบบเรียบร้อยแล้วค่ะ:
> 1. อัปเดต API `POST /api/tickets` ใน `server/src/app.ts` ให้ตรวจสอบ `category.isActive === true` และ `relatedSystem.isActive === true` ก่อนสร้าง Ticket เพื่อป้องกันไม่ให้ผู้ใช้ส่ง ID ของหมวดหมู่หรือระบบที่ปิดใช้งานอยู่เข้ามาได้อย่างรัดกุม 100% ค่ะ
> 2. พุชโค้ดที่ปรับปรุงเพิ่มเติมขึ้น PR #28 เรียบร้อยแล้วค่ะ ขอบคุณมากนะคะ

---


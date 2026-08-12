# Lab 1 — Peer Review Record  (fill this in)

**Author:** <your name> — <student id> — GitHub: @<username>
**Peer reviewer:** <partner name> — <student id> — GitHub: @<username>

## Pull Requests I authored (reviewed by my partner)
| PR | Branch | Reviewer verdict |
|----|--------|------------------|
| [#6](https://github.com/lmaybelgracel/TokTickit/pull/6) | feature/1-project-foundation | Approved |
| [#8](https://github.com/lmaybelgracel/TokTickit/pull/8) | feature/2-health-check | Pending Peer Review |
|    | feature/3-category-seed |  |
|    | feature/4-category-list |  |

Reviewer comment I received (PR #8 by บิว): "ดูแล้วโดยรวมทำได้ตรงตาม Issue มีการเพิ่ม /api/health และเขียน test ด้วย supertest ครบทั้งกรณีที่ endpoint ทำงานปกติและกรณีเรียก route ที่ไม่มีอยู่ ส่วนที่อยากเสนอเพิ่มเติมคืออาจเพิ่ม test กรณี response body ไม่ตรงตามที่กำหนด หรือกรณีเกิด error ภายใน server อีกสักกรณี เพื่อให้การทดสอบ health check ครอบคลุมมากขึ้น"

How I responded: "ขอบคุณบิวมากๆ สำหรับคำแนะนำเพิ่มเติมครับ! ได้ทำการเพิ่ม Supertest test cases ทั้งการตรวจสอบ Schema ของ Response Body และการจำลองสถานะ Error ภายใน Server (HTTP 500) เพิ่มเติมใน server/tests/lab-01/health.test.ts รวมเป็น 4 test cases ครอบคลุมทุกสภาวะเรียบร้อยแล้วครับ (โดยยังคงเปิด PR #8 ไว้เพื่อรอการตรวจสอบ และยังไม่ได้ทำการ Merge ครับ)"

## Pull Requests I reviewed for my partner
My comment: <...>
Partner's response: <...>

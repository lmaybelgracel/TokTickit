# Lab 1 — Peer Review Record  (fill this in)

**Author:** <your name> — <student id> — GitHub: @<username>
**Peer reviewer:** <partner name> — <student id> — GitHub: @<username>

## Pull Requests I authored (reviewed by my partner)
| PR | Branch | Reviewer verdict |
|----|--------|------------------|
| [#6](https://github.com/lmaybelgracel/TokTickit/pull/6) | feature/1-project-foundation | Approved |
| [#8](https://github.com/lmaybelgracel/TokTickit/pull/8) | feature/2-health-check | Pending Peer Review |
| [#9](https://github.com/lmaybelgracel/TokTickit/pull/9) | feature/3-category-seed | Approved |
|    | feature/4-category-list |  |

Reviewer comment I received (PR #9): "ดูโค้ดแล้วโดยรวมทำได้ตรงตาม Issue มีการเพิ่ม Category model และ seed ข้อมูลครบ 4 categories และใช้ upsert ซึ่งช่วยป้องกันข้อมูลซ้ำเวลารัน seed หลายครั้งได้ดี แนะนำเพิ่มเติมว่าอาจลองรัน seed ซ้ำ 2 รอบแล้วเช็กใน database ว่ายังมีแค่ 4 categories เพื่อยืนยันว่า upsert ทำงานตามที่ต้องการ"

How I responded: "ขอบคุณสำหรับข้อเสนอแนะครับ! ได้ทำการรันและเพิ่มการทดสอบยืนยันการรัน Seed ซ้ำ 2 รอบ (Multiple seed executions test) ใน server/tests/lab-01/seed.test.ts ซึ่งยืนยันว่าข้อมูลหมวดหมู่ยังคงมีอยู่เพียง 4 หมวดหมู่เท่านั้น โดยไม่มีข้อมูลซ้ำซ้อนตามการทำงานของ Prisma upsert เรียบร้อยครับ"

## Pull Requests I reviewed for my partner
My comment: <...>
Partner's response: <...>

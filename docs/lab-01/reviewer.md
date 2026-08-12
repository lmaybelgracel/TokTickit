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

Reviewer comment I received (PR #9 by บิว): "Base branch และ feature branch ถูกต้องตาม workflow ของ Lab แล้ว และเห็นว่ามีการเพิ่ม Category model กับ idempotent seed script ตามขอบเขตของ Issue 3 ก่อน Approve รบกวนตรวจสอบเพิ่มเติมว่า migration ทำงานได้ และ seed สามารถรันซ้ำได้โดยไม่เกิด category ซ้ำ รวมถึงมีข้อมูลครบ 4 categories ตาม requirement"

How I responded: "ขอบคุณบิวมากครับ! ได้ทำการสร้างและเพิ่มไฟล์ Migration (`server/prisma/migrations/20260812000000_init/migration.sql`) รวมถึงเพิ่มผลการทดสอบการรัน Seed สคริปต์ซ้ำซ้อน ยืนยันว่าสร้างหมวดหมู่ครบทั้ง 4 รายการ (Account and Access, Hardware, Software, Network) ถูกต้องโดยไม่มีการสร้างข้อมูลซ้ำเรียบร้อยครับ"

## Pull Requests I reviewed for my partner
My comment: <...>
Partner's response: <...>

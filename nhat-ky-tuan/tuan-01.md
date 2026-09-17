# Nhật ký tuần 01 · 14/09 – 20/09/2026

**Lead tuần này:** 2A202602199 (dothanhlong166@gmail.com) — là assignee của cả task
**Dữ liệu / task CVAT:** Ảnh giao thông đô thị (bbox) — [Task #128 · W1-BBOX-G2-T1](https://cvat.note.transformerlabs.ai/tasks/128)
**Guideline áp dụng:** Annotation_Guideline_BBox_Polygon_Polyline_v1.pdf (trong Downloads)

## Thành viên và phân công

| Thành viên | Vị trí | Phân công tuần này |
|---|---|---|
| 2A202602199 (tôi) | Lead | Assignee tổng của task #128, theo dõi tiến độ 4 job |
| 2A202602249 | Annotator | Job #1362 — frame 0–24 |
| 2A202602074 | Annotator | Job #1363 — frame 25–49 |
| 2A202602309 | Annotator | Job #1364 — frame 50–74 |
| 2A202602177 | Annotator | Job #1365 — frame 75–99 |

Cả 4 job hiện đều ở stage `annotation` (chưa job nào chuyển sang `validation`), nên tuần này chưa phát sinh vòng review riêng của lead.

## Công việc

Số liệu lấy qua API `/api/jobs/{id}/annotations` (đếm số frame có ít nhất 1 object) — chính xác hơn stage/state hiển thị trên UI.

| # | Job | Annotator | Frame range | Frame đã gán / tổng | % thật | Object (rect / polygon / polyline) | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | #1362 | 2A202602249 | 0–24 | 9 / 25 | ⛔ 36% | 111 / 33 / 2 | Frame 1 chưa có object nào — cần kiểm tra|
| 2 | #1363 | 2A202602074 | 25–49 | 15 / 25 | 🟡 60% | 171 / 17 / 44 | |
| 3 | #1364 | 2A202602309 | 50–74 | 18 / 25 | 🟡 72% | 204 / 0 / 29 | Chưa có polygon nào dù guideline yêu cầu bbox+polygon |
| 4 | #1365 | 2A202602177 | 75–99 | 25 / 25 | ✅ 100% | 197 / 0 / 0 | Xong hết frame nhưng job vẫn ở stage `annotation`, chưa được đẩy sang `validation` để lead review |

## Tổng kết

- Task #128 (W1-BBOX-G2-T1): 67 / 100 ảnh đã có annotation (67%).
- Job #1364 có 0 polygon dù guideline BBox/Polygon/Polyline yêu cầu cả 2 loại — cần xác nhận có object nào lẽ ra phải là polygon mà bị vẽ nhầm thành rectangle không.

## Vướng mắc

- Job #1362, frame 1: không có object nào trong khi các frame lân cận (0, 2–9) đều có — cần lead hoặc 2A202602249 kiểm tra lại, có thể là ảnh thật sự trống hoặc annotator bỏ sót.
- Job #1364 chưa có polygon nào — cần đối chiếu guideline để chắc chắn không có case nào lẽ ra phải dùng polygon.

## Kế hoạch tuần 02

- Hỗ trợ 2A202602249 đẩy nhanh job #1362 — kiểm tra luôn frame 1 còn trống.
- Theo dõi job #1363, #1364 đến khi đạt 100% rồi chuyển validation.
- Rà lại job #1364 xem có case nào cần vẽ polygon mà đang bị vẽ nhầm thành bbox không.

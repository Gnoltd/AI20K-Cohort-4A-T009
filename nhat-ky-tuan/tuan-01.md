# Nhật ký tuần 01 · 14/09 – 20/09/2026

**Lead tuần này:** Đỗ Thành Long (2A202602199, dothanhlong166@gmail.com) — assignee của task bbox/polygon #128. Tưởng Đức Tâm (2A202602249) là assignee của task segmentation #182 
**Dữ liệu / task CVAT:** Ảnh giao thông đô thị (bbox/polygon) — [Task #128 · W1-BBOX-G2-T1](https://cvat.note.transformerlabs.ai/tasks/128)
**Guideline áp dụng:** Annotation_Guideline_BBox_Polygon_Polyline_v1.pdf (trong Downloads)

## Thành viên và phân công

| Thành viên | Vị trí | Phân công tuần này |
|---|---|---|
| Long (2A202602199) | Lead task bbox/polygon | Assignee tổng của task #128, theo dõi tiến độ 4 job |
| Tâm (2A202602249) | Annotator (task #128) · Lead/assignee task segmentation #182 | Job #1362 — frame 0–24 |
| Minh (2A202602074) | Annotator | Job #1363 — frame 25–49 |
| Hà (2A202602309) | Annotator | Job #1364 — frame 50–74 |
| Tùng (2A202602177) | Annotator | Job #1365 — frame 75–99 |

Cả 4 job hiện đều ở stage `annotation` (chưa job nào chuyển sang `validation`), nên tuần này chưa phát sinh vòng review riêng của lead.

## Công việc

Số liệu Task #128 lấy qua API `/api/jobs/{id}/annotations` (đếm số frame có ít nhất 1 object) — chính xác hơn stage/state hiển thị trên UI. Số liệu Task #182 (segmentation): Long chỉ có quyền API cho job #1578 (job của chính mình), các job #1579–1581 bị 403 Forbidden nên ghi theo số annotator báo tay.

| # | Job | Loại | Annotator | Frame range | Frame đã gán / tổng | % | Object | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 1 | #1362 | Bbox (#128) | Tâm (2249) | 0–24 | 9 / 25 | ⛔ 36%  | | |
| 2 | #1363 | Bbox (#128) | Minh (2074) | 25–49 | 15 / 25 | 🟡 60%  | | |
| 3 | #1364 | Bbox (#128) | Hà (2309) | 50–74 | 18 / 25 | 🟡 72%  | | |
| 4 | #1365 | Bbox (#128) | Tùng (2177) | 75–99 | 25 / 25 | ✅ 100% ) | |
| 5 | #1578 | Seg (#182) | Long (2199) | 0–24 | 25 / 25 | ✅ 100% | |
| 6 | #1579 | Seg (#182) | Minh (2074) | 25–49 | 15 / 25 | 🟡 60% |  | |
| 7 | #1580 | Seg (#182) | Hà (2309) | 50–74 | 1 / 25 | ⛔ 4% | | |
| 8 | #1581 | Seg (#182) | Tùng (2177) | 75–99 | 1 / 25 | ⛔ 4% |  | |

## Tổng kết

- **Task #128 (bbox/polygon):** 67 / 100 ảnh đã có annotation (67%).
- **Task #182 (segmentation) :** 42 / 100 ảnh tức 42%.
- Cộng cả 2 task: 109 / 200 ảnh (55%) 

## Vướng mắc

- Job #1364 chưa có polygon nào — cần đối chiếu guideline để chắc chắn không có case nào lẽ ra phải dùng polygon.

## Kế hoạch tuần 02

- Đẩy job #1365 sang stage `validation` để lead review (đã xong 100%, đang bị treo).
- Theo dõi job #1363 (Minh), #1364 (Hà) đến khi đạt 100% rồi chuyển validation.
- Rà lại job #1364 xem có case nào cần vẽ polygon mà đang bị vẽ nhầm thành bbox không.

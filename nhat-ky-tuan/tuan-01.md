# Nhật ký tuần 01 · 14/09 – 20/09/2026

> Dữ liệu lấy trực tiếp từ CVAT (https://cvat.note.transformerlabs.ai) lúc 17/09/2026.
> % hoàn thành ở bảng "Công việc" lấy qua API `/api/jobs/{id}/annotations` (đếm frame
> có object thật) — không phải số CVAT hiển thị sẵn trên UI danh sách task/job.

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

- **Task #128 (bbox/polygon, Long lead):** 67 / 100 ảnh đã có annotation (67%).
- **Task #182 (segmentation, Tâm lead — chỉ liệt kê vì Long có tham gia job #1578, không thuộc phạm vi Long lead):** 42 / 100 ảnh (25+15+1+1), tức 42%.
- Cộng cả 2 task: 109 / 200 ảnh (55%) — không tính chung vào % của task #128 vì hai task khác nhau.
- **Đính chính so với ghi nhận trước đó (chỉ dựa vào "cập nhật gần nhất" trên UI):** job #1365 (Tùng) thực ra đã xong 100% từ 15/09, không hề chậm — job chậm nhất trong task #128 là **#1362 (Tâm), mới 36%**, dù có vẻ "mới cập nhật" (16/09 23:27). Timestamp cập nhật không phản ánh đúng tiến độ thật.
- Job #1365 đã xong nhưng bị "kẹt" ở stage annotation — cần lead chuyển sang validation để review, không nên để tồn.
- Job #1364 có 0 polygon dù guideline BBox/Polygon/Polyline yêu cầu cả 2 loại — cần xác nhận có object nào lẽ ra phải là polygon mà bị vẽ nhầm thành rectangle không.
- Bên task #182 (ngoài phạm vi lead nhưng đáng chú ý): job #1580 (Hà) và #1581 (Tùng) mới 1/25 (4%) — rất chậm so với #1578 (Long, 100%) và #1579 (Minh, 60%).

## Vướng mắc

- Job #1364 chưa có polygon nào — cần đối chiếu guideline để chắc chắn không có case nào lẽ ra phải dùng polygon.

## Kế hoạch tuần 02

- Đẩy job #1365 sang stage `validation` để lead review (đã xong 100%, đang bị treo).
- Theo dõi job #1363 (Minh), #1364 (Hà) đến khi đạt 100% rồi chuyển validation.
- Rà lại job #1364 xem có case nào cần vẽ polygon mà đang bị vẽ nhầm thành bbox không.

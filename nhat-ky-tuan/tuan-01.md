# Nhật ký tuần 01 · 14/09 – 20/09/2026

> Dữ liệu lấy trực tiếp từ CVAT (https://cvat.note.transformerlabs.ai) lúc 17/09/2026.
> CVAT không hiển thị % hoàn thành trong khung nhìn danh sách task/job, nên các mục
> dưới đây ghi theo *stage / state* thực tế thay vì phần trăm ước lượng.

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

| # | Job | Annotator | Frame range | Stage / State | Cập nhật gần nhất | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | #1362 | 2A202602249 | 0–24 (25 ảnh) | annotation · in progress | 16/09 23:27 | |
| 2 | #1363 | 2A202602074 | 25–49 (25 ảnh) | annotation · in progress | 17/09 09:05 | |
| 3 | #1364 | 2A202602309 | 50–74 (25 ảnh) | annotation · in progress | 17/09 09:09 | |
| 4 | #1365 | 2A202602177 | 75–99 (25 ảnh) | annotation · in progress | 15/09 17:08 | Không có cập nhật mới nhất trong 3 job còn lại — có thể đang chậm hơn |

## Tổng kết

- Task #128 (W1-BBOX-G2-T1): 100 ảnh / 4 job, mỗi job 25 ảnh.
- Cả 4 job đều đang `annotation · in progress` — chưa job nào hoàn thành hay được đẩy sang review.

## Vướng mắc

- 

## Kế hoạch tuần 02

- Xong annotation, chuyển stage sang `validation` để lead review.
- Đối chiếu case chưa rõ với Annotation_Guideline_BBox_Polygon_Polyline_v1.pdf.

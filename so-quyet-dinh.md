# Sổ quyết định

Ghi lại những gì đội đã chốt, và **vì sao**. Ba tuần sau không ai còn nhớ vì sao box lại vẽ
kiểu này — người mới vào đội lại càng không.

**Quyết định đã ghi thì không sửa nội dung.** Đổi ý thì ghi một quyết định mới, và chuyển
trạng thái quyết định cũ thành *Bị thay bởi QĐ-xxx*. Nhờ vậy vẫn truy được vì sao các job
cũ được gán theo cách cũ.

> Các mục bên dưới là **ví dụ**. Mẫu trống để copy nằm cuối file.

## Danh sách

| Mã | Quyết định | Ngày | Xuất phát từ | Trạng thái |
|---|---|---|---|---|
| [QĐ-001](#qđ-001) | Người ngồi sau xe máy có box `nguoi` riêng | 17/09/2026 | [P-001](problem-backlog.md#p-001) | Hiệu lực |
| [QĐ-002](#qđ-002) | Reviewer trả nguyên job khi mẫu kiểm có trên 10% ảnh sai | 19/09/2026 | Họp tuần 01 | Hiệu lực |

**Trạng thái:** Hiệu lực · Bị thay bởi QĐ-xxx · Huỷ (ghi lý do)

---

## QĐ-001

**Người ngồi sau xe máy có box `nguoi` riêng**

- **Ngày:** 17/09/2026
- **Người tham gia:** @thanh-vien-a (chốt), @thanh-vien-b, @thanh-vien-c, @thanh-vien-d
- **Xuất phát từ:** [P-001](problem-backlog.md#p-001)
- **Bối cảnh:** §3.2 của guideline nói mỗi người một box, nhưng hình minh hoạ lại vẽ chung một box.
  Hai annotator đang làm theo hai cách khác nhau.
- **Các phương án đã cân nhắc:**
  1. *Gộp chung một box với xe* — nhanh hơn, nhưng mất số người trên xe, trong khi dữ liệu dùng để
     đếm người tham gia giao thông. Loại.
  2. *Box `nguoi` riêng cho từng người* — đúng câu chữ §3.2 và giữ được số người. **Chọn.**
- **Quyết định:** Mỗi người trên xe máy, kể cả người ngồi sau chỉ lộ đầu, có một box `nguoi` riêng.
  Box xe máy vẫn vẽ như bình thường.
- **Việc phải làm theo:**
  - [x] Rà lại job 101, sửa 37 ảnh đã gộp (@thanh-vien-b)
  - [x] Báo cả đội, ghim trong kênh chat của đội
- **Trạng thái:** Hiệu lực

## QĐ-002

**Reviewer trả nguyên job khi mẫu kiểm có trên 10% ảnh sai**

- **Ngày:** 19/09/2026
- **Người tham gia:** @thanh-vien-a (chốt), @thanh-vien-d
- **Xuất phát từ:** Họp tổng kết tuần 01 — không phải từ backlog
- **Bối cảnh:** Job 101 bị sửa rải rác từng ảnh qua ba vòng review, tốn thời gian của cả hai bên.
- **Các phương án đã cân nhắc:**
  1. *Sửa từng ảnh như cũ* — ổn khi lỗi lẻ tẻ, nhưng khi lỗi có hệ thống thì reviewer đang làm hộ
     annotator. Loại.
  2. *Kiểm mẫu 20%, trên 10% sai thì trả nguyên job* — annotator tự rà cả job theo lỗi đã chỉ ra.
     **Chọn.**
- **Quyết định:** Reviewer kiểm ngẫu nhiên 20% ảnh của mỗi job. Trên 10% số ảnh kiểm bị sai thì trả
  nguyên job kèm danh sách lỗi mẫu; từ 10% trở xuống thì sửa từng ảnh.
- **Việc phải làm theo:**
  - [ ] Áp dụng từ job 106 trở đi (@thanh-vien-d)
- **Trạng thái:** Hiệu lực

---

## Mẫu để copy

```markdown
## QĐ-NNN

**Quyết định trong một dòng**

- **Ngày:** dd/mm/yyyy
- **Người tham gia:** @ (chốt), @, @
- **Xuất phát từ:** [P-NNN](problem-backlog.md#p-nnn) | Họp tuần NN | …
- **Bối cảnh:** vì sao phải quyết định
- **Các phương án đã cân nhắc:**
  1. *Phương án* — ưu / nhược. Loại hoặc **Chọn.**
  2. *Phương án* — ưu / nhược. Loại hoặc **Chọn.**
- **Quyết định:** đủ rõ để người không dự họp vẫn làm đúng
- **Việc phải làm theo:**
  - [ ] việc (@người phụ trách)
- **Trạng thái:** Hiệu lực
```

Nhớ thêm một dòng vào bảng **Danh sách** ở đầu file, và đóng mục P-xxx tương ứng trong backlog.

# source-tool

Chỗ để source code **công cụ đội tự viết** nhằm gỡ những pain point gặp phải trong lúc gán nhãn.

Lúc đầu thư mục này chỉ có README. Đó là cố ý: **tool được viết sau khi đã xác định được pain
point**, không viết trước. Tool làm từ tưởng tượng thường giải một vấn đề không ai gặp.

## Khi nào thì nên làm tool

Làm khi đủ cả bốn điều:

1. Pain point đã được ghi trong [`problem-backlog.md`](../problem-backlog.md) với loại **Pain point công cụ**.
2. Nó lặp lại — nhiều người gặp, ở nhiều job — chứ không phải một lần.
3. Ước được lợi ích: tiết kiệm bao nhiêu thời gian, hoặc bớt được kiểu lỗi nào.
4. CVAT chưa có sẵn cách làm được. Kiểm tra trước: phím tắt, chế độ Track, auto-annotation,
   import/export.

Khi bắt đầu làm, đổi trạng thái mục P-xxx trong backlog sang 🛠️ và trỏ về đây.

## Cấu trúc khi đã có tool

Mỗi tool một thư mục con, có README riêng:

```
source-tool/
├── README.md              ← file này, giữ bảng danh sách tool
└── nhan-box-qua-frame/    ← ví dụ
    ├── README.md
    └── …source code…
```

Thêm tool thì thêm một dòng vào bảng:

| Tool | Giải quyết | Người viết | Trạng thái |
|---|---|---|---|
| *(chưa có)* |  |  |  |

## Mẫu README cho từng tool

````markdown
# <tên tool>

**Giải quyết:** [P-NNN](../../problem-backlog.md#p-nnn) — tóm tắt pain point

## Pain point
Trước khi có tool: làm thế nào, mất bao lâu, hay sai kiểu gì. Link CVAT tới ca điển hình.

## Tool làm gì
Một đoạn ngắn.

## Cài đặt và chạy
```bash
# lệnh cài
# lệnh chạy, kèm ví dụ tham số
```

## Đầu vào / đầu ra
- Vào: ví dụ file export của CVAT, định dạng nào
- Ra: file gì, import lại vào CVAT thế nào

## Đã thử trên
Job nào, bao nhiêu ảnh, kết quả đo được (thời gian trước / sau, số lỗi trước / sau).

## Giới hạn
Những ca tool chưa xử lý đúng — annotator vẫn phải tự kiểm.

## Người viết
@
````

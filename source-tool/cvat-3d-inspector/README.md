# CVAT 3D Inspector

**Giải quyết:** bước 0 của tool "vẽ box 2D trên ảnh → sinh box 3D": kiểm tra một job CVAT 3D có đủ
point cloud, ảnh camera và calib hay không, trước khi làm tiếp.

## Tool làm gì

Extension Chrome (Manifest V3), thêm nút **3D check** ở góc phải dưới của trang CVAT. Bấm vào job đang
mở, tool gọi REST API của CVAT bằng chính phiên đăng nhập của bạn (chỉ **đọc**, không ghi gì) và báo:

| Mục | API gọi |
|---|---|
| Phiên bản CVAT | `GET /api/server/about` |
| Đăng nhập / kết nối API | `GET /api/users/self` |
| Task có phải 3D, job gồm frame nào | `GET /api/jobs/{id}`, `GET /api/tasks/{id}` |
| Mỗi frame có bao nhiêu ảnh camera | `GET /api/jobs/{id}/data/meta` |
| Header point cloud của frame đầu (số điểm, FIELDS) | `GET /api/jobs/{id}/data?type=frame&number=N&quality=original` |
| Tên và kích thước ảnh camera của frame đầu | `GET /api/jobs/{id}/data?type=context_image&number=N&quality=original` |
| Danh sách nhãn | `GET /api/labels?job_id={id}` |
| Annotation có sẵn (dùng làm ground truth) | `GET /api/jobs/{id}/annotations` |
| Calib hợp lệ, khớp tên camera và cỡ ảnh, vùng phủ | file calib JSON bạn nạp vào |

## Cài đặt

1. Chrome → `chrome://extensions` → bật **Developer mode**.
2. **Load unpacked** → chọn thư mục `source-tool/cvat-3d-inspector`.
3. Mở CVAT, vào một job 3D (`.../tasks/<id>/jobs/<id>`), bấm **3D check**.
4. Bấm **Nạp calib…** chọn file calib JSON, rồi **Kiểm tra job này**.
5. **Copy báo cáo** để dán vào backlog hoặc gửi cho đội.

Muốn dùng trên CVAT khác: thêm domain vào `content_scripts.matches` trong `manifest.json`, rồi bấm
nút reload của extension trong `chrome://extensions`.

## Định dạng calib đang hỗ trợ

```json
{
  "pcd_frame": "lidar",
  "lidar": { "sensor2ego": [[4×4]] },
  "cameras": {
    "CAM_P_F": { "K": [[3×3]], "dist": [k1, k2, p1, p2, k3], "ego2cam": [[4×4]], "image_size": [w, h] }
  }
}
```

Tên camera (`CAM_P_F`) phải nằm trong tên file ảnh camera trên CVAT thì tool mới ghép được.

## Dữ liệu đi đâu

- Point cloud, ảnh, annotation tải về **chỉ nằm trong bộ nhớ tab**, không lưu ra đĩa, không gửi đi đâu ngoài
  server CVAT đang mở.
- File calib lưu trong `chrome.storage.local` của extension (chỉ trên máy bạn) để không phải nạp lại.
- Báo cáo in ra Console (F12) và copy được dạng JSON.

## Giới hạn

- Chưa thử trên server thật của BTC: nếu mục nào báo lỗi `404`/`400`, xem tab **Network** trong F12
  để biết CVAT bản đó dùng đường dẫn API nào, rồi sửa `content.js`.
- Chỉ đọc point cloud và ảnh của **frame đầu** trong job.

## Người viết
@

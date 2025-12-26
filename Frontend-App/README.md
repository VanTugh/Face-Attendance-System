
# 💻 Face Attendance - Frontend Client

Đây là giao diện người dùng (Client-side) cho hệ thống Điểm danh Khuôn mặt, được xây dựng bằng **ReactJS (Vite)** và **Tailwind CSS**.

Ứng dụng cung cấp 2 giao diện chính:
1.  **Màn hình Check-in:** Dành cho nhân viên chấm công qua Webcam.
2.  **Màn hình Admin:** Dành cho quản trị viên quản lý nhân viên và xem lịch sử.

---

## 🛠 Yêu cầu hệ thống
* **Node.js**: Phiên bản 18 trở lên.
* **Backend API**: Phải đang chạy tại `http://localhost:3000`.

---

## 🚀 Hướng dẫn cài đặt và chạy (Môi trường Dev)

### Bước 1: Cài đặt thư viện
Mở terminal tại thư mục `Frontend-App` và chạy:

```bash
npm install

```

### Bước 2: Chạy ứng dụng

```bash
npm run dev

```

Sau khi chạy, truy cập vào đường dẫn hiện trên terminal (thường là **http://localhost:5173**).

---

## 📂 Cấu trúc thư mục (`src/`)

* **`App.jsx`**: Quản lý định tuyến (Routing) và bảo mật luồng đi (Protected Routes).
* **`components/`**: Chứa các màn hình chính:
* `Login.jsx`: Đăng nhập, xử lý token và phân quyền.
* `CheckIn.jsx`: Xử lý Webcam, chụp ảnh tự động và gửi về API.
* `Admin.jsx`: Dashboard quản lý, thêm nhân viên, xem bảng lịch sử.


* **`main.jsx`**: Điểm khởi đầu của ứng dụng React.
* **`index.css`**: Cấu hình Tailwind CSS toàn cục.

---

## 🔧 Các thư viện chính đã sử dụng

| Thư viện | Tác dụng |
| --- | --- |
| **react-router-dom** | Chuyển trang không cần load lại (SPA). |
| **axios** | Gọi API sang Backend (Node.js). |
| **react-webcam** | Truy cập và xử lý Webcam trên trình duyệt. |
| **react-toastify** | Hiển thị thông báo đẹp mắt (Toast notification). |
| **tailwindcss** | Framework CSS giúp thiết kế giao diện nhanh. |

---

## 🐳 Chạy bằng Docker (Khuyên dùng)

Nếu bạn không muốn cài Node.js, bạn có thể chạy thông qua Docker từ thư mục gốc của dự án lớn:

```bash
# Tại thư mục gốc Face-Attendance-System
docker-compose up --build

```

Lúc này Frontend vẫn sẽ chạy tại cổng **5173**.

---

## ⚠️ Lưu ý quan trọng

* Nếu bạn đổi cổng của Backend (không phải 3000), hãy tìm và sửa lại đường dẫn API trong các file `Login.jsx`, `Admin.jsx`, và `CheckIn.jsx`.
* Mặc định tài khoản đăng nhập lần đầu (nếu dùng Seed Data) là `ADMIN01` / `123`.

```

### Tại sao nên đổi?
1.  **Chuyên nghiệp:** Người khác (hoặc chính bạn sau này) nhìn vào sẽ biết ngay folder này chứa gì, chạy như thế nào.
2.  **Dễ nhớ:** Liệt kê các thư viện chính giúp bạn nhớ mình đã cài cái gì.
3.  **Hướng dẫn cụ thể:** Thay vì hướng dẫn chung chung của Vite, nó chỉ dẫn cách kết nối với Backend của bạn.

```

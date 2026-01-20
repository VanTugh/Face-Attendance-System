
# Face Attendance System (Hệ thống Điểm danh Khuôn mặt)

> Hệ thống điểm danh tự động sử dụng công nghệ nhận diện khuôn mặt AI, tích hợp trang quản trị (Admin Dashboard) và phân quyền người dùng.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-supported-blue)
![React](https://img.shields.io/badge/frontend-React-orange)
![NodeJS](https://img.shields.io/badge/backend-NodeJS-green)
![Python](https://img.shields.io/badge/AI-Python-yellow)

## Giới thiệu
Dự án này là một giải pháp Full-stack nhằm giải quyết bài toán chấm công thủ công. Hệ thống cho phép nhân viên check-in bằng khuôn mặt thông qua Webcam và tự động lưu lịch sử. Quản trị viên có thể quản lý danh sách nhân viên và xem báo cáo.

### Tính năng chính
* **Điểm danh AI:** Nhận diện khuôn mặt thời gian thực, độ chính xác cao.
* **Phân quyền (RBAC):**
    * **Admin:** Quản lý nhân viên (Thêm/Sửa/Xóa), xem lịch sử chấm công toàn bộ.
    * **User:** Chỉ được phép chấm công.
* **Bảo mật:**
    * Mã hóa mật khẩu bằng **Bcrypt**.
    * Bảo vệ các Route quan trọng (Protected Routes).
* **Giao diện hiện đại:**
    * Thiết kế với **Tailwind CSS**.
    * Chế độ xem mật khẩu (Eye icon).
    * Thông báo Toastify thân thiện.
* **Đóng gói:** Hỗ trợ **Docker** & **Docker Compose** để triển khai nhanh chóng.

---

## Công nghệ sử dụng

### 1. Frontend (Client)
* **React (Vite):** Xây dựng giao diện người dùng.
* **Tailwind CSS:** Styling giao diện.
* **Axios:** Gọi API.
* **React Webcam:** Xử lý luồng Camera.

### 2. Backend (Server)
* **Node.js & Express:** RESTful API.
* **PostgreSQL:** Cơ sở dữ liệu quan hệ.
* **Bcrypt:** Mã hóa bảo mật.
* **Multer:** Xử lý upload hình ảnh.

### 3. AI Service (Core)
* **Python (FastAPI):** API xử lý hình ảnh.
* **Face Recognition & Dlib:** Thư viện nhận diện khuôn mặt.
* **NumPy:** Xử lý tính toán vector.

---

## Cấu trúc dự án

```bash
Face-Attendance-System/
├── frontend/           # Source code ReactJS
├── backend/            # Source code Node.js API
├── ai-service/         # Source code Python AI
├── docker-compose.yml  # File cấu hình Docker toàn bộ hệ thống
└── README.md           # Tài liệu dự án

```

---

## Cài đặt và Chạy (Sử dụng Docker - Khuyên dùng)

Chỉ cần 1 câu lệnh để chạy toàn bộ hệ thống (Database, Backend, Frontend, AI).

### Yêu cầu

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã được cài đặt.

### Bước 1: Clone dự án

```bash
git clone [https://github.com/username-cua-ban/Face-Attendance-System.git](https://github.com/username-cua-ban/Face-Attendance-System.git)
cd Face-Attendance-System

```

### Bước 2: Chạy Docker Compose

Mở terminal tại thư mục gốc và chạy:

```bash
docker-compose up --build

```

*Lần đầu chạy sẽ mất vài phút để tải image và cài thư viện.*

### Bước 3: Truy cập hệ thống

* **Frontend (Web App):** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
* **Backend API:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* **AI Docs (Swagger):** [http://localhost:8000/docs](https://www.google.com/search?q=http://localhost:8000/docs)
* **PostgreSQL:** Port `5432` (User: `postgres`, Pass: `123`, DB: `face_attendance`).

---

## Cài đặt thủ công (Dành cho Dev)

Nếu bạn muốn chạy từng phần riêng lẻ để sửa code:

### 1. Database

Cần cài đặt PostgreSQL và tạo Database tên `face_attendance`.
Chạy các lệnh SQL tạo bảng trong `database.sql` (nếu có) hoặc tự tạo bảng `users`, `face_embeddings`, `attendance_logs`.

### 2. AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

```

### 3. Backend

```bash
cd backend
npm install
# Tạo file .env và cấu hình DB_HOST=localhost
node server.js

```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev

```

---

## Hình ảnh demo



* Màn hình Đăng nhập 
<img width="653" height="467" alt="image" src="https://github.com/user-attachments/assets/7ed91397-710e-4651-8619-18e9351c0a90" />

* Màn hình Chấm công
<img width="1916" height="855" alt="image" src="https://github.com/user-attachments/assets/66639c74-d2f5-4789-b1d0-721620349879" />


* Dashboard Admin
<img width="1903" height="861" alt="image" src="https://github.com/user-attachments/assets/b14a877c-82ce-4d6c-a520-2f774068dd44" />

* Lịch sử chấm công
<img width="1885" height="859" alt="image" src="https://github.com/user-attachments/assets/516725eb-f07e-4b4b-850c-4c096c1e1ad2" />

---

## 🛡 Tài khoản mặc định (Seed Data)

Nếu bạn sử dụng script tạo dữ liệu mẫu, tài khoản Admin mặc định là:

* **Tài khoản:** `ADMIN01`
* **Mật khẩu:** `123` (Hoặc mật khẩu bạn đã config trong `create_admin.js`)

---

##  Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng mở Pull Request hoặc tạo Issue nếu bạn tìm thấy lỗi.

## License


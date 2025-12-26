const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");
const fs = require("fs");
const pool = require("./db");
require("dotenv").config();

const bcrypt = require("bcrypt"); // Import thư viện bảo mật

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình Multer để lưu ảnh tạm thời
const upload = multer({ dest: "uploads/" });

// --- API 1: ĐĂNG KÝ NHÂN VIÊN MỚI (ĐÃ CẬP NHẬT BCRYPT) ---
// Luồng: Mã hóa Pass -> Lưu User -> Gửi ảnh sang AI -> Lưu Vector -> Reload AI
app.post("/api/register", upload.single("image"), async (req, res) => {
  const client = await pool.connect();
  try {
    // 1. Lấy dữ liệu từ Frontend (thêm password)
    const { employee_code, full_name, department, password } = req.body;
    const imagePath = req.file.path;

    console.log(`📝 Đang đăng ký: ${full_name} (${employee_code})`);

    // --- BƯỚC MỚI: MÃ HÓA MẬT KHẨU ---
    const plainPassword = password || "123456"; // Mặc định là 123456 nếu không nhập
    const saltRounds = 10; // Độ khó mã hóa
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    // ---------------------------------

    // 2. Lưu thông tin nhân viên vào bảng 'users' (Thêm cột password và role)
    // Mặc định role là 'user'. Nếu muốn tạo admin thì sửa tay trong DB sau.
    const userRes = await client.query(
      `INSERT INTO users (employee_code, full_name, department, password, role) 
       VALUES ($1, $2, $3, $4, 'user') RETURNING id`,
      [employee_code, full_name, department, hashedPassword]
    );
    const userId = userRes.rows[0].id;

    // 3. Gọi sang AI Service để lấy vector (Extract Vector)
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const aiRes = await axios.post(
      `${process.env.AI_SERVICE_URL}/extract-vector`,
      formData,
      {
        headers: { ...formData.getHeaders() },
      }
    );

    const vector = aiRes.data.vector; // Nhận mảng 128 số

    // 4. Lưu vector vào bảng 'face_embeddings'
    await client.query(
      "INSERT INTO face_embeddings (user_id, embedding_vector) VALUES ($1, $2)",
      [userId, vector]
    );

    // 5. Gọi AI Service reload lại dữ liệu RAM
    await axios.post(`${process.env.AI_SERVICE_URL}/reload`);

    // Xóa ảnh tạm
    fs.unlinkSync(imagePath);

    res.json({
      success: true,
      message: "Đăng ký thành công!",
      user_id: userId,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  } finally {
    client.release();
  }
});

// --- API 2: CHẤM CÔNG (CHECK-IN) ---
app.post("/api/check-in", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Gửi ảnh sang AI Service
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const aiRes = await axios.post(
      `${process.env.AI_SERVICE_URL}/identify`,
      formData,
      {
        headers: { ...formData.getHeaders() },
      }
    );

    fs.unlinkSync(imagePath); // Xóa ảnh tạm

    const { status, user_id, confidence } = aiRes.data;

    if (status === "success" && user_id) {
      // Lấy tên nhân viên
      const userRes = await pool.query(
        "SELECT full_name FROM users WHERE id = $1",
        [user_id]
      );
      const userName = userRes.rows[0]?.full_name || "Không rõ";

      // Lưu log
      await pool.query(
        "INSERT INTO attendance_logs (user_id, confidence_score, status) VALUES ($1, $2, $3)",
        [user_id, confidence, "OnTime"]
      );

      console.log(`✅ Chấm công: ${userName}`);
      res.json({
        success: true,
        message: `Xin chào ${userName}`,
        data: { name: userName, time: new Date() },
      });
    } else {
      console.log("❌ Không nhận diện được");
      res.json({ success: false, message: "Không nhận diện được khuôn mặt" });
    }
  } catch (error) {
    console.error("Lỗi chấm công:", error.message);
    res.status(500).json({ success: false, message: "Lỗi kết nối AI Service" });
  }
});

// --- API 3: LẤY LỊCH SỬ CHẤM CÔNG ---
app.get("/api/history", async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT users.full_name, users.employee_code, attendance_logs.check_in_time, attendance_logs.status 
            FROM attendance_logs 
            JOIN users ON attendance_logs.user_id = users.id 
            ORDER BY attendance_logs.check_in_time DESC 
            LIMIT 50
        `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi lấy lịch sử" });
  }
});

// --- API 4: ĐĂNG NHẬP (ĐÃ CẬP NHẬT BCRYPT) ---
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  // username chính là employee_code (VD: NV001)

  try {
    // 1. Tìm trong DB xem có nhân viên nào mã như thế không
    const result = await pool.query(
      "SELECT * FROM users WHERE employee_code = $1",
      [username]
    );

    // Nếu không tìm thấy ai
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Tài khoản không tồn tại!" });
    }

    const user = result.rows[0];

    // 2. SO SÁNH MẬT KHẨU BẰNG BCRYPT
    // (So sánh password nhập vào với chuỗi mã hóa trong DB)
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // 3. Nếu đúng, trả về thông tin kèm Role
      res.json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          name: user.full_name,
          role: user.role, // Trả về 'admin' hoặc 'user'
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Sai mật khẩu!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
});

// Chạy Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Core Backend đang chạy tại http://localhost:${PORT}`);
});

const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createAdmin = async () => {
  try {
    const password = "123"; // Mật khẩu bạn muốn
    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await pool.query(
      `INSERT INTO users (employee_code, full_name, department, password, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      ["ADMIN01", "Quản Trị Viên", "IT", hashedPassword, "admin"]
    );

    console.log("Tạo Admin thành công:", res.rows[0].full_name);
  } catch (err) {
    console.error("Lỗi:", err.message);
  } finally {
    pool.end();
  }
};

createAdmin();

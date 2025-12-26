import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <--- 1. Biến trạng thái ẩn/hiện
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        username: username,
        password: password,
      });

      if (res.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", res.data.data.role);
        localStorage.setItem("userName", res.data.data.name);

        toast.success(`Xin chào ${res.data.data.name}!`);

        setTimeout(() => {
          if (res.data.data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/checkin");
          }
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đăng nhập");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Đăng Nhập Hệ Thống
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Ô TÀI KHOẢN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã Nhân Viên
            </label>
            <input
              type="text"
              placeholder="VD: NV001"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Ô MẬT KHẨU (CÓ ICON MẮT) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              {" "}
              {/* Class relative để làm mốc tọa độ cho icon */}
              <input
                // 2. Logic đổi kiểu input: Nếu show=true thì là text, false thì là password
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none pr-10" // pr-10 để chữ không đè lên icon
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* 3. Nút bấm hình con mắt */}
              <button
                type="button" // Quan trọng: type="button" để không bị submit form khi bấm
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  // Icon Mắt mở (Hiện)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  // Icon hiển thị mật khẩu
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold transition"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

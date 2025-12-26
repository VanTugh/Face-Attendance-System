import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("add"); // Tab mặc định là 'add' hoặc 'history'
  const navigate = useNavigate();

  // --- LOGIC ĐĂNG XUẤT ---
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* --- SIDEBAR (MENU BÊN TRÁI) --- */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        {/* Logo / Header */}
        <div className="p-6 border-b border-gray-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            A
          </div>
          <h1 className="text-xl font-bold tracking-wide">Quản Trị Viên</h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("add")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "add"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Thêm Nhân Viên
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "history"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Lịch Sử Chấm Công
          </button>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-4 px-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.818v6.364a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Về Máy Chấm Công</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600/20 text-red-400 py-2 rounded border border-red-600/50 hover:bg-red-600 hover:text-white transition"
          >
            Đăng Xuất
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA (CỘT PHẢI) --- */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* VIEW 1: FORM THÊM NHÂN VIÊN */}
        {activeTab === "add" && <AddEmployeeForm />}

        {/* VIEW 2: BẢNG LỊCH SỬ */}
        {activeTab === "history" && <HistoryTable />}
      </div>
    </div>
  );
};

// --- COMPONENT CON: FORM THÊM NHÂN VIÊN ---
const AddEmployeeForm = () => {
  // 1. THÊM password VÀO ĐÂY
  const [formData, setFormData] = useState({
    employee_code: "",
    full_name: "",
    department: "",
    password: "", // <--- Mặc định rỗng
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("⚠️ Vui lòng chọn ảnh!");

    const data = new FormData();
    data.append("employee_code", formData.employee_code);
    data.append("full_name", formData.full_name);
    data.append("department", formData.department);
    data.append("image", file);

    // 2. GỬI PASSWORD XUỐNG (Nếu không nhập thì gửi chuỗi rỗng, Backend sẽ tự hiểu lấy 123456)
    if (formData.password) {
      data.append("password", formData.password);
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/register", data);
      if (res.data.success) {
        toast.success("✅ Đăng ký thành công!");
        // Reset form (nhớ reset cả password)
        setFormData({
          employee_code: "",
          full_name: "",
          department: "",
          password: "",
        });
        setFile(null);
        document.getElementById("fileInput").value = "";
      }
    } catch (err) {
      toast.error("❌ Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Thêm Nhân Viên Mới
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã NV
            </label>
            <input
              type="text"
              placeholder="VD: NV001"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.employee_code}
              onChange={(e) =>
                setFormData({ ...formData, employee_code: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và Tên
            </label>
            <input
              type="text"
              placeholder="Nguyen Van A"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* --- 3. Ô NHẬP MẬT KHẨU (MỚI THÊM) --- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phòng Ban
            </label>
            <input
              type="text"
              placeholder="IT / Kế toán..."
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="Mặc định: 123456"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>
        {/* ------------------------------------- */}

        <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="text-gray-500">
              {file ? (
                <span className="text-green-600 font-bold">{file.name}</span>
              ) : (
                "📁 Bấm để chọn ảnh chân dung"
              )}
            </div>
          </label>
        </div>
        <button
          disabled={loading}
          type="submit"
          className={`w-full p-3 text-white rounded-lg font-bold shadow-md transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "⏳ Đang xử lý..." : "➕ Lưu Hồ Sơ"}
        </button>
      </form>
    </div>
  );
};

// --- COMPONENT CON: BẢNG LỊCH SỬ ---
const HistoryTable = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tự động lấy dữ liệu khi bật Tab này lên
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/history");
        if (res.data.success) {
          setHistory(res.data.data);
        }
      } catch (error) {
        toast.error("Không tải được lịch sử");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lịch Sử Chấm Công</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          50 lượt gần nhất
        </span>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">
          ⏳ Đang tải dữ liệu...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 border-b">Thời gian</th>
                <th className="p-4 border-b">Mã NV</th>
                <th className="p-4 border-b">Họ Tên</th>
                <th className="p-4 border-b">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">
                    Chưa có dữ liệu chấm công
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-700 font-mono">
                      {new Date(item.check_in_time).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-4 text-blue-600 font-semibold">
                      {item.employee_code}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {item.full_name}
                    </td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">
                        {item.status || "Check-in"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;

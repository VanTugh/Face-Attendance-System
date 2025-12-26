import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Admin from "./components/Admin";
import CheckIn from "./components/CheckIn";
import Login from "./components/Login";

// Component Bảo vệ (Check Login + Check Quyền)
const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuth = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");

  if (!isAuth) return <Navigate to="/" />; // Chưa đăng nhập thì đá về Login (Trang chủ)

  if (requiredRole && userRole !== requiredRole) {
    alert("⛔ Bạn không có quyền!");
    return <Navigate to="/checkin" />; // Sai quyền thì đá về trang chấm công
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          {/* 1. TRANG CHỦ LÀ LOGIN */}
          <Route path="/" element={<Login />} />

          {/* 2. TRANG CHẤM CÔNG (Dành cho User & Admin) */}
          <Route
            path="/checkin"
            element={
              <ProtectedRoute>
                <CheckIn />
              </ProtectedRoute>
            }
          />

          {/* 3. TRANG ADMIN (Chỉ dành cho Admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                {/* Layout riêng của Admin nằm trong component Admin luôn hoặc bọc ở đây đều được */}
                <div className="min-h-screen bg-gray-100 flex flex-col">
                  <nav className="p-4 bg-white shadow flex justify-between items-center z-10">
                    <h1 className="font-bold text-xl text-blue-800">
                      Trang Quản Trị
                    </h1>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/"; // Logout về Login
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold"
                    >
                      Đăng Xuất
                    </button>
                  </nav>
                  <div className="flex-1 overflow-hidden">
                    <Admin />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom"; // Nhớ import useNavigate
import axios from "axios";

const CheckIn = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); // Thông báo hiển thị đè lên
  const [isProcessing, setIsProcessing] = useState(false);

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const captureAndCheckIn = useCallback(async () => {
    if (!webcamRef.current || isProcessing || notification) return; // Nếu đang hiện thông báo thì không quét tiếp

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const file = dataURLtoFile(imageSrc, "capture.jpg");
    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsProcessing(true);
      const res = await axios.post(
        "http://localhost:3000/api/check-in",
        formData
      );

      if (res.data.success) {
        const userData = res.data.data;

        // Hiện thông báo chào mừng
        setNotification({
          name: userData.name,
          time: new Date().toLocaleTimeString(),
          status: "success",
        });

        // Đọc giọng nói
        const msg = new SpeechSynthesisUtterance(`Xin chào ${userData.name}`);
        window.speechSynthesis.speak(msg);

        // Tự tắt thông báo sau 3 giây để người khác vào chấm
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }
    } catch (err) {
      // Không làm gì nếu không nhận diện được
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, notification]);

  useEffect(() => {
    const interval = setInterval(captureAndCheckIn, 2000); // Quét nhanh hơn (2s/lần)
    return () => clearInterval(interval);
  }, [captureAndCheckIn]);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Quay về màn login
  };
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* --- NÚT ĐĂNG XUẤT (Góc trên phải) --- */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 z-50 bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold backdrop-blur-sm transition flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
          />
        </svg>
        Đăng Xuất
      </button>

      {/* HEADER */}
      <div className="absolute top-0 w-full bg-gradient-to-b from-black to-transparent p-6 z-10 text-center">
        <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
          Máy Chấm Công Tự Động
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Vui lòng nhìn thẳng vào Camera
        </p>
      </div>

      {/* CAMERA AREA - Full Screen hoặc Căn giữa đẹp mắt */}
      <div className="relative border-4 border-gray-800 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl aspect-video bg-gray-900">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          videoConstraints={{ facingMode: "user" }}
        />

        {/* Khung ngắm giả lập */}
        <div className="absolute inset-0 border-[100px] border-black/50 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-dashed border-white/30 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* POPUP THÔNG BÁO KẾT QUẢ (Hiện đè lên khi thành công) */}
      {notification && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-black p-10 rounded-3xl shadow-2xl text-center transform scale-110 transition-all border-b-8 border-green-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Xin chào,</h2>
            <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
              {notification.name}
            </h1>
            <div className="bg-gray-100 px-6 py-2 rounded-full inline-block">
              <span className="text-gray-500 font-medium">Thời gian: </span>
              <span className="text-xl font-bold text-gray-800">
                {notification.time}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="absolute bottom-6 text-gray-500 text-xs">
        Powered by AI System • Phiên bản 1.0
      </div>
    </div>
  );
};

export default CheckIn;

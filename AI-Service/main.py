from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import face_recognition
import numpy as np
import cv2
from core.vector_engine import engine_instance
from core.database import save_embedding

app = FastAPI()

# Hàm phụ trợ: Đọc ảnh upload thành format mà face_recognition hiểu
async def read_image(file: UploadFile):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # Chuyển BGR (OpenCV) sang RGB (Face Recognition cần) [cite: 680]
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

@app.get("/")
def health_check():
    return {"status": "AI Service is running"}

# API 1: Trích xuất vector (Dùng khi Đăng ký nhân viên mới)
@app.post("/extract-vector")
async def extract_vector(file: UploadFile = File(...)):
    rgb_img = await read_image(file)
    
    # Phát hiện khuôn mặt
    boxes = face_recognition.face_locations(rgb_img, model="hog")
    if not boxes:
        raise HTTPException(status_code=400, detail="Không tìm thấy khuôn mặt nào")
    
    # Mã hóa thành vector 128 số
    encoding = face_recognition.face_encodings(rgb_img, boxes)[0]
    
    # Trả về vector dạng list để Node.js lưu vào DB
    return {"vector": encoding.tolist()}

# API 2: Nhận diện (Dùng khi Chấm công)
@app.post("/identify")
async def identify_face(file: UploadFile = File(...)):
    rgb_img = await read_image(file)
    
    boxes = face_recognition.face_locations(rgb_img, model="hog")
    if not boxes:
        return {"status": "failed", "message": "No face found"}
    
    # Lấy vector của mặt trong ảnh
    query_vector = face_recognition.face_encodings(rgb_img, boxes)[0]
    
    # So khớp với kho dữ liệu trong RAM
    match = engine_instance.search(query_vector)
    
    if match:
        return {"status": "success", "user_id": match["user_id"], "confidence": match["confidence"]}
    else:
        return {"status": "unknown", "message": "Person not recognized"}

# API 3: Reload lại RAM khi có nhân viên mới
@app.post("/reload")
def reload_vectors():
    engine_instance.reload_data()
    return {"message": "Data reloaded"}
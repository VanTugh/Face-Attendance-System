import os
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv


# Lấy đường dẫn tới thư mục gốc (AI-Service)
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

# Load file .env
load_dotenv(dotenv_path=ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")

# Kiểm tra xem đã load được chưa (Debug)
if not DATABASE_URL:
    print(f" LỖI: Không tìm thấy biến DATABASE_URL trong file {ENV_PATH}")
    print("   Hãy kiểm tra lại tên file .env và nội dung bên trong.")
    exit(1)
else:
    print(f" Đã tìm thấy cấu hình Database: {DATABASE_URL.split('@')[-1]}") # Chỉ in phần đuôi để bảo mật
# ------------------------------------------

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_connection():
    return engine.connect()

# Hàm lưu vector vào PostgreSQL (Thay thế hàm add_encodings_for_user trong báo cáo [cite: 697])
# Dự phòng (Fallback) & Tooling: Hàm này cực kỳ hữu ích 
# khi bạn muốn viết một Script Python chạy ngầm để thêm dữ liệu hàng loạt mà không qua Web/Node.js.
def save_embedding(user_id: int, vector: list):
    query = text("""
        INSERT INTO face_embeddings (user_id, embedding_vector)
        VALUES (:user_id, :vector)
    """)
    with get_db_connection() as conn:
        conn.execute(query, {"user_id": user_id, "vector": vector})
        conn.commit()

# Hàm lấy toàn bộ vector để nạp vào RAM lúc khởi động
def load_all_embeddings():
    query = text("SELECT user_id, embedding_vector FROM face_embeddings")
    with get_db_connection() as conn:
        result = conn.execute(query).fetchall()
        # Trả về list dạng: [(1, [0.1, 0.2...]), (2, [...])]
        return [(row[0], row[1]) for row in result]
#
#
#khi muốn mở rộng hệ thống, ta sẽ thay hàm load_all_embeddings() bằng pgvector nếu số lượng user cao
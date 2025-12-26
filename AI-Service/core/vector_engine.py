import numpy as np
from core.database import load_all_embeddings

class VectorEngine:
    def __init__(self):
        self.known_vectors = []
        self.known_ids = []
        self.reload_data()

    def reload_data(self):
        """Load toàn bộ vector từ DB lên RAM"""
        print(" Đang tải dữ liệu khuôn mặt từ DB...")
        data = load_all_embeddings()
        if data:
            # Tách ID và Vector ra 2 list riêng
            self.known_ids = [item[0] for item in data]
            # Chuyển list vector thành numpy array để tính toán nhanh
            self.known_vectors = np.array([item[1] for item in data])
        else:
            self.known_vectors = np.empty((0, 128))
            self.known_ids = []
        print(f" Đã tải {len(self.known_ids)} khuôn mặt.")

    def search(self, query_vector, threshold=0.5):
        """Tìm người giống nhất. Threshold càng nhỏ càng khắt khe (0.4 - 0.5 là tốt)"""
        if len(self.known_vectors) == 0:
            return None

        # Tính khoảng cách Euclid giữa query_vector và TẤT CẢ known_vectors
        # Công thức: sqrt(sum((a - b)^2))
        distances = np.linalg.norm(self.known_vectors - query_vector, axis=1)
        
        # Tìm khoảng cách nhỏ nhất
        min_distance_index = np.argmin(distances)
        min_distance = distances[min_distance_index]

        if min_distance <= threshold:
            return {
                "user_id": self.known_ids[min_distance_index],
                "confidence": 1 - min_distance # Tự quy đổi ra %
            }
        return None

# Khởi tạo 1 instance duy nhất để dùng chung
engine_instance = VectorEngine()
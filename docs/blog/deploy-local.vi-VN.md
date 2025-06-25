# 🚀 Xây dựng cơ sở tri thức DeepSeek của riêng bạn trong 10 phút! Giải pháp triển khai hoàn toàn mã nguồn mở và offline

## 💡 Lời mở đầu

Còn đang lo lắng về phí đăng ký ChatGPT Plus đắt đỏ? Lo ngại về việc tải tài liệu bí mật công ty lên đám mây? Hướng dẫn này sẽ đưa bạn sử dụng các công cụ hoàn toàn mã nguồn mở để xây dựng một hệ thống cơ sở tri thức thông minh dựa trên công nghệ RAG (Retrieval-Augmented Generation) tại máy cục bộ. Không chỉ hoàn toàn offline mà còn bảo vệ quyền riêng tư, làm cho bí mật tài liệu của bạn được bảo vệ tốt hơn!

## 🛠️ Chuẩn bị môi trường

Trước khi bắt đầu, vui lòng đảm bảo hệ thống của bạn đáp ứng các yêu cầu sau:

- Hệ điều hành: Linux/macOS/Windows
- RAM: Ít nhất 8GB (khuyến nghị 16GB trở lên)
- Dung lượng ổ cứng: Ít nhất 20GB dung lượng trống
- Đã cài đặt:
  - [Docker & Docker Compose v2.0+](https://docs.docker.com/get-docker/)
  - [Ollama](https://ollama.com/)

### 1. Cài đặt Ollama

1. Truy cập [trang web chính thức Ollama](https://ollama.com/) để tải xuống và cài đặt phiên bản tương ứng với hệ thống
2. Xác minh cài đặt:

````bash
ollama --version
````

### 2. Tải xuống các mô hình cần thiết

Chúng ta cần hai mô hình:

- deepseek-r1:7b dùng cho tạo sinh đối thoại
- nomic-embed-text dùng cho vector hóa văn bản

Thực hiện các lệnh sau để tải xuống mô hình:

````bash
# Tải xuống mô hình đối thoại
ollama pull deepseek-r1:7b

# Tải xuống mô hình vector  
ollama pull nomic-embed-text
````

## 🔧 Triển khai hệ thống cơ sở tri thức

### 1. Clone dự án

````bash
git clone https://github.com/rag-web-ui/rag-web-ui.git
cd rag-web-ui
````

### 2. Cấu hình biến môi trường

Sao chép template biến môi trường và chỉnh sửa:

````bash
cp .env.example .env
````

Chỉnh sửa tệp .env, cấu hình như sau:

````env
# Cấu hình LLM
CHAT_PROVIDER=ollama
OLLAMA_API_BASE=http://host.docker.internal:11434
OLLAMA_MODEL=deepseek-r1:7b
# Cấu hình Embedding
EMBEDDINGS_PROVIDER=ollama
OLLAMA_EMBEDDINGS_MODEL=nomic-embed-text

# Cấu hình cơ sở dữ liệu vector
VECTOR_STORE_TYPE=chroma
CHROMA_DB_HOST=chromadb
CHROMA_DB_PORT=8000

# Cấu hình MySQL
MYSQL_SERVER=db
MYSQL_USER=ragwebui
MYSQL_PASSWORD=ragwebui
MYSQL_DATABASE=ragwebui

# Cấu hình MinIO
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=documents
````

Lưu ý: Ở đây sử dụng tên dịch vụ của Docker Compose thay vì localhost, để các container có thể giao tiếp chính xác với nhau.

### 3. Khởi động dịch vụ

Sử dụng Docker Compose để khởi động tất cả dịch vụ:

````bash
docker compose up -d --build
````

Điều này sẽ khởi động các dịch vụ sau:

- Giao diện frontend (Next.js)
- API backend (FastAPI)
- Cơ sở dữ liệu MySQL
- Cơ sở dữ liệu vector ChromaDB
- Lưu trữ đối tượng MinIO
- Dịch vụ Ollama

### 4. Xác minh triển khai

Sau khi dịch vụ khởi động, có thể truy cập qua các địa chỉ sau:

- Giao diện frontend: <http://localhost:3000>
- Tài liệu API: <http://localhost:8000/redoc>
- Console MinIO: <http://localhost:9001>

## 📚 Hướng dẫn sử dụng

### 1. Tạo cơ sở tri thức

1. Truy cập <http://localhost:3000>
2. Sau khi đăng nhập, nhấp "Tạo cơ sở tri thức"
3. Điền tên và mô tả cơ sở tri thức
4. Tải lên tài liệu, chọn cách cắt và kích thước
5. Nhấp "Tạo"
6. Đợi xử lý tài liệu hoàn thành

Hỗ trợ các định dạng sau:

- PDF
- DOCX
- Markdown
- Text
- ...

### 2. Bắt đầu đối thoại

1. Nhấp "Bắt đầu đối thoại"
2. Nhập câu hỏi
3. Hệ thống sẽ tự động:
   - Truy xuất các đoạn tài liệu liên quan
   - Sử dụng mô hình deepseek-r1:7b để tạo câu trả lời
   - Hiển thị nguồn trích dẫn

## ❓ Câu hỏi thường gặp

1. Không thể kết nối dịch vụ Ollama
   - Kiểm tra Ollama có chạy bình thường không: `ollama list`
   - Kiểm tra cấu hình mạng Docker có đúng không

2. Xử lý tài liệu thất bại
   - Kiểm tra định dạng tài liệu có được hỗ trợ không
   - Xem log backend: `docker compose logs -f backend`

3. Không đủ bộ nhớ
   - Điều chỉnh giới hạn bộ nhớ container Docker
   - Cân nhắc sử dụng mô hình nhỏ hơn

> 💡 Lời khuyên về hiệu suất và bảo mật: Khuyến nghị mỗi tài liệu không quá 10MB, sao lưu dữ liệu định kỳ, và thay đổi mật khẩu mặc định kịp thời để đảm bảo an toàn hệ thống.

## 🎯 Kết luận

Thông qua các bước trên, bạn đã thành công xây dựng một hệ thống cơ sở tri thức cục bộ dựa trên công nghệ RAG. Hệ thống này được triển khai hoàn toàn cục bộ, không cần lo lắng về vấn đề quyền riêng tư dữ liệu, đồng thời nhờ vào khả năng của Ollama, có thể thực hiện dịch vụ hỏi đáp tri thức chất lượng cao.

Cần lưu ý rằng, hệ thống này chủ yếu dành cho học tập và sử dụng cá nhân, nếu muốn sử dụng trong môi trường sản xuất, cần thực hiện thêm nhiều tối ưu về bảo mật và ổn định.

## 📚 Tài nguyên tham khảo

- [Tài liệu chính thức Ollama](https://ollama.com/)
- [Dự án RAG Web UI](https://github.com/rag-web-ui/rag-web-ui)
- [Tài liệu Docker](https://docs.docker.com/)

Hy vọng hướng dẫn này hữu ích cho việc xây dựng cơ sở tri thức cá nhân của bạn! Nếu gặp vấn đề, hãy tham khảo tài liệu dự án hoặc tạo issue trên GitHub. 

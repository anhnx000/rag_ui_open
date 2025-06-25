<div align="center">
  <img src="./docs/images/github-cover-new.png" alt="RAG Web UI">
  <br />
  <p>
    <strong>Quản lý cơ sở tri thức dựa trên RAG (Retrieval-Augmented Generation)</strong>
  </p>

  <p>
    <a href="https://github.com/rag-web-ui/rag-web-ui/blob/main/LICENSE"><img src="https://img.shields.io/github/license/rag-web-ui/rag-web-ui" alt="License"></a>
    <a href="#"><img src="https://img.shields.io/badge/python-3.9+-blue.svg" alt="Python"></a>
    <a href="#"><img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node"></a>
    <a href="#"><img src="https://github.com/rag-web-ui/rag-web-ui/actions/workflows/test.yml/badge.svg" alt="CI"></a>
    <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  </p>

  <p>
    <a href="#tính-năng">Tính năng</a> •
    <a href="#bắt-đầu-nhanh">Bắt đầu nhanh</a> •
    <a href="#hướng-dẫn-triển-khai">Hướng dẫn triển khai</a> •
    <a href="#kiến-trúc-kỹ-thuật">Kiến trúc kỹ thuật</a> •
    <a href="#hướng-dẫn-phát-triển">Hướng dẫn phát triển</a> •
    <a href="#hướng-dẫn-đóng-góp">Hướng dẫn đóng góp</a>
  </p>

  <h4>
    <a href="README.md">English</a> |
    <a href="README.zh-CN.md">简体中文</a> |
    <span>Tiếng Việt</span>
  </h4>
</div>

## 📖 Giới thiệu

RAG Web UI là một hệ thống đối thoại thông minh dựa trên công nghệ RAG (Retrieval-Augmented Generation), giúp xây dựng hệ thống hỏi đáp thông minh dựa trên cơ sở tri thức riêng. Thông qua việc kết hợp truy xuất tài liệu và mô hình ngôn ngữ lớn, hệ thống cung cấp dịch vụ hỏi đáp tri thức chính xác và đáng tin cậy.

Hệ thống hỗ trợ nhiều cách triển khai mô hình ngôn ngữ lớn, có thể sử dụng các dịch vụ đám mây như OpenAI, DeepSeek, cũng như hỗ trợ triển khai mô hình cục bộ thông qua Ollama, đáp ứng nhu cầu về quyền riêng tư và chi phí trong các tình huống khác nhau.

Đồng thời cung cấp giao diện OpenAPI, thuận tiện cho người dùng gọi cơ sở tri thức thông qua API.

Bạn có thể tìm hiểu quy trình thực hiện của toàn bộ dự án thông qua [Hướng dẫn RAG](./docs/tutorial/README.md).

## ✨ Tính năng
- 📚 **Quản lý tài liệu thông minh**
  - Hỗ trợ nhiều định dạng tài liệu (PDF, DOCX, Markdown, Text)
  - Tự động phân đoạn và vector hóa tài liệu
  - Hỗ trợ xử lý tài liệu bất đồng bộ và tăng trưởng

- 🤖 **Công cụ đối thoại tiên tiến**
  - Truy xuất và tạo sinh chính xác dựa trên RAG
  - Hỗ trợ đối thoại đa vòng có ngữ cảnh
  - Hỗ trợ xem văn bản gốc thông qua chỉ số tham chiếu trong đối thoại

- 🎯 **Kiến trúc hợp lý**
  - Thiết kế tách biệt frontend và backend
  - Lưu trữ tệp phân tán
  - Cơ sở dữ liệu vector hiệu suất cao: hỗ trợ ChromaDB, Qdrant, thông qua mô hình Factory, có thể dễ dàng chuyển đổi cơ sở dữ liệu vector

## 🖼️ Ảnh chụp màn hình

<div align="center">
  <img src="./docs/images/screenshot1.png" alt="Knowledge Base Management" width="800">
  <p><em>Dashboard Quản lý Cơ sở Tri thức</em></p>
  
  <img src="./docs/images/screenshot2.png" alt="Chat Interface" width="800">
  <p><em>Dashboard Xử lý Tài liệu</em></p>
  
  <img src="./docs/images/screenshot3.png" alt="Document Processing" width="800">
  <p><em>Danh sách Tài liệu</em></p>
  
  <img src="./docs/images/screenshot4.png" alt="System Settings" width="800">
  <p><em>Giao diện Đối thoại Thông minh với Số thứ tự Tham chiếu</em></p>
  
  <img src="./docs/images/screenshot5.png" alt="Analytics Dashboard" width="800">
  <p><em>Quản lý API Key</em></p>

  <img src="./docs/images/screenshot6.png" alt="Analytics Dashboard" width="800">
  <p><em>Tham khảo API</em></p>
</div>

 
## Sơ đồ quy trình dự án

```mermaid
graph TB
    %% Role Definitions
    client["Người gọi/Người dùng"]
    open_api["Open API"]
    
    subgraph import_process["Quy trình Nhập Tài liệu"]
        direction TB
        %% File Storage and Document Processing Flow
        docs["Đầu vào Tài liệu<br/>(PDF/MD/TXT/DOCX)"]
        job_id["Trả về Job ID"]
        
        nfs["NFS"]

        subgraph async_process["Xử lý Tài liệu Bất đồng bộ"]
            direction TB
            preprocess["Tiền xử lý Tài liệu<br/>(Trích xuất/Làm sạch Văn bản)"]
            split["Phân đoạn Văn bản<br/>(Phân đoạn/Chồng lấp)"]
            
            subgraph embedding_process["Dịch vụ Embedding"]
                direction LR
                embedding_api["Embedding API"] --> embedding_server["Embedding Server"]
            end
            
            store[(Cơ sở dữ liệu Vector)]
            
            %% Internal Flow of Asynchronous Processing
            preprocess --> split
            split --> embedding_api
            embedding_server --> store
        end
        
        subgraph job_query["Truy vấn Trạng thái Job"]
            direction TB
            job_status["Trạng thái Job<br/>(Đang xử lý/Hoàn thành/Thất bại)"]
        end
    end
    
    %% Query Service Flow  
    subgraph query_process["Dịch vụ Truy vấn"]
        direction LR
        user_history["Lịch sử Người dùng"] --> query["Truy vấn Người dùng<br/>(Dựa trên Lịch sử Người dùng)"]
        query --> query_embed["Query Embedding"]
        query_embed --> retrieve["Truy xuất Vector"]
        retrieve --> rerank["Sắp xếp lại<br/>(Cross-Encoder)"]
        rerank --> context["Lắp ráp Ngữ cảnh"]
        context --> llm["Tạo sinh LLM"]
        llm --> response["Phản hồi Cuối cùng"]
        query -.-> rerank
    end
    
    %% Main Flow Connections
    client --> |"1.Tải lên Tài liệu"| docs
    docs --> |"2.Tạo"| job_id
    docs --> |"3a.Kích hoạt"| async_process
    job_id --> |"3b.Trả về"| client
    docs --> nfs
    nfs --> preprocess

    %% Open API Retrieval Flow
    open_api --> |"Truy xuất Ngữ cảnh"| retrieval_service["Dịch vụ Truy xuất"]
    retrieval_service --> |"Truy cập"| store
    retrieval_service --> |"Trả về Ngữ cảnh"| open_api

    %% Status Query Flow
    client --> |"4.Poll"| job_status
    job_status --> |"5.Trả về Tiến độ"| client
    
    %% Database connects to Query Service
    store --> retrieve

    %% Style Definitions (Adjusted to match GitHub theme colors)
    classDef process fill:#d1ecf1,stroke:#0077b6,stroke-width:1px
    classDef database fill:#e2eafc,stroke:#003566,stroke-width:1px
    classDef input fill:#caf0f8,stroke:#0077b6,stroke-width:1px
    classDef output fill:#ffc8dd,stroke:#d00000,stroke-width:1px
    classDef rerank fill:#cdb4db,stroke:#5a189a,stroke-width:1px
    classDef async fill:#f8edeb,stroke:#7f5539,stroke-width:1px,stroke-dasharray: 5 5
    classDef actor fill:#fefae0,stroke:#606c38,stroke-width:1px
    classDef jobQuery fill:#ffedd8,stroke:#ca6702,stroke-width:1px
    classDef queryProcess fill:#d8f3dc,stroke:#40916c,stroke-width:1px
    classDef embeddingService fill:#ffe5d9,stroke:#9d0208,stroke-width:1px
    classDef importProcess fill:#e5e5e5,stroke:#495057,stroke-width:1px

    %% Applying classes to nodes
    class docs,query,retrieval_service input
    class preprocess,split,query_embed,retrieve,context,llm process
    class store,nfs database
    class response,job_id,job_status output
    class rerank rerank
    class async_process async
    class client,open_api actor
    class job_query jobQuery
    style query_process fill:#d8f3dc,stroke:#40916c,stroke-width:1px
    style embedding_process fill:#ffe5d9,stroke:#9d0208,stroke-width:1px
    style import_process fill:#e5e5e5,stroke:#495057,stroke-width:1px
    style job_query fill:#ffedd8,stroke:#ca6702,stroke-width:1px
```

## 🚀 Bắt đầu nhanh

### Yêu cầu môi trường

- Docker & Docker Compose v2.0+
- Node.js 18+
- Python 3.9+
- 8GB+ RAM

### Các bước cài đặt

1. Clone dự án
```bash
git clone https://github.com/rag-web-ui/rag-web-ui.git
cd rag-web-ui
```
2. Cấu hình biến môi trường

Lưu ý cấu hình môi trường trong tệp cấu hình, xem bảng cấu hình chi tiết bên dưới～

```bash
cp .env.example .env
```

3. Khởi động dịch vụ (cấu hình môi trường phát triển)
```bash
docker compose up -d --build
```

### Xác minh cài đặt

Sau khi dịch vụ khởi động, có thể truy cập qua các địa chỉ sau:

- 🌐 Giao diện frontend: http://127.0.0.1.nip.io
- 📚 Tài liệu API: http://127.0.0.1.nip.io/redoc
- 💾 Console MinIO: http://127.0.0.1.nip.io:9001

## 🏗️ Kiến trúc kỹ thuật

### Stack công nghệ backend

- 🐍 **Python FastAPI**: Framework Web bất đồng bộ hiệu suất cao
- 🗄️ **MySQL + ChromaDB**: Cơ sở dữ liệu quan hệ + Cơ sở dữ liệu vector
- 📦 **MinIO**: Lưu trữ đối tượng
- 🔗 **Langchain**: Framework phát triển ứng dụng LLM
- 🔒 **JWT + OAuth2**: Xác thực danh tính

### Stack công nghệ frontend

- ⚛️ **Next.js 14**: Framework ứng dụng React
- 📘 **TypeScript**: An toàn kiểu
- 🎨 **Tailwind CSS**: CSS nguyên tử
- 🎯 **Shadcn/UI**: Thư viện component chất lượng cao
- 🤖 **Vercel AI SDK**: Tích hợp chức năng AI

## 📈 Tối ưu hiệu suất

Hệ thống đã được tối ưu hiệu suất trong các khía cạnh sau:

- ⚡️ Xử lý tài liệu tăng trưởng và phân đoạn bất đồng bộ
- 🔄 Phản hồi streaming và phản hồi thời gian thực
- 📑 Tối ưu hiệu suất cơ sở dữ liệu vector
- 🎯 Xử lý tác vụ phân tán

## 📖 Hướng dẫn phát triển

Sử dụng docker compose để khởi động môi trường phát triển, có thể cập nhật nóng
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Địa chỉ truy cập: http://127.0.0.1.nip.io

## 🔧 Giải thích cấu hình

### Các mục cấu hình cốt lõi

| Mục cấu hình                | Giải thích               | Giá trị mặc định | Bắt buộc |
| --------------------------- | ------------------------ | ---------------- | -------- |
| MYSQL_SERVER                | Địa chỉ máy chủ MySQL    | localhost        | ✅        |
| MYSQL_USER                  | Tên người dùng MySQL     | postgres         | ✅        |
| MYSQL_PASSWORD              | Mật khẩu MySQL           | postgres         | ✅        |
| MYSQL_DATABASE              | Tên cơ sở dữ liệu MySQL  | ragwebui         | ✅        |
| SECRET_KEY                  | Khóa mã hóa JWT          | -                | ✅        |
| ACCESS_TOKEN_EXPIRE_MINUTES | Thời gian hết hạn JWT token (phút) | 30     | ✅        |

### Cấu hình LLM

| Mục cấu hình      | Giải thích                | Giá trị mặc định          | Tình huống áp dụng                     |
| ----------------- | ------------------------- | ------------------------- | -------------------------------------- |
| CHAT_PROVIDER     | Nhà cung cấp dịch vụ LLM  | openai                    | ✅                                      |
| OPENAI_API_KEY    | Khóa API OpenAI           | -                         | Bắt buộc khi sử dụng OpenAI            |
| OPENAI_API_BASE   | URL cơ sở API OpenAI      | https://api.openai.com/v1 | Tùy chọn khi sử dụng OpenAI            |
| OPENAI_MODEL      | Tên mô hình OpenAI        | gpt-4                     | Bắt buộc khi sử dụng OpenAI            |
| DEEPSEEK_API_KEY  | Khóa API DeepSeek         | -                         | Bắt buộc khi sử dụng DeepSeek          |
| DEEPSEEK_API_BASE | URL cơ sở API DeepSeek    | -                         | Bắt buộc khi sử dụng DeepSeek          |
| DEEPSEEK_MODEL    | Tên mô hình DeepSeek      | -                         | Bắt buộc khi sử dụng DeepSeek          |
| OLLAMA_API_BASE   | URL cơ sở API Ollama      | http://localhost:11434    | Bắt buộc khi sử dụng Ollama, lưu ý cần pull mô hình trước |
| OLLAMA_MODEL      | Tên mô hình Ollama        | -                         | Bắt buộc khi sử dụng Ollama            |

### Cấu hình Embedding

| Mục cấu hình                | Giải thích                   | Giá trị mặc định       | Tình huống áp dụng                   |
| --------------------------- | ---------------------------- | ---------------------- | ------------------------------------ |
| EMBEDDINGS_PROVIDER         | Nhà cung cấp dịch vụ Embedding | openai              | ✅                                    |
| OPENAI_API_KEY              | Khóa API OpenAI              | -                      | Bắt buộc khi sử dụng OpenAI Embedding |
| OPENAI_EMBEDDINGS_MODEL     | Mô hình OpenAI Embedding     | text-embedding-ada-002 | Bắt buộc khi sử dụng OpenAI Embedding |
| DASH_SCOPE_API_KEY          | Khóa API DashScope           | -                      | Bắt buộc khi sử dụng DashScope       |
| DASH_SCOPE_EMBEDDINGS_MODEL | Mô hình DashScope Embedding  | -                      | Bắt buộc khi sử dụng DashScope       |
| OLLAMA_EMBEDDINGS_MODEL     | Mô hình Ollama Embedding     | -                      | Bắt buộc khi sử dụng Ollama Embedding |

### Cấu hình cơ sở dữ liệu vector

| Mục cấu hình       | Giải thích                    | Giá trị mặc định      | Tình huống áp dụng           |
| ------------------ | ----------------------------- | --------------------- | ---------------------------- |
| VECTOR_STORE_TYPE  | Loại lưu trữ vector           | chroma                | ✅                            |
| CHROMA_DB_HOST     | Địa chỉ máy chủ ChromaDB      | localhost             | Bắt buộc khi sử dụng ChromaDB |
| CHROMA_DB_PORT     | Cổng ChromaDB                 | 8000                  | Bắt buộc khi sử dụng ChromaDB |
| QDRANT_URL         | URL lưu trữ vector Qdrant     | http://localhost:6333 | Bắt buộc khi sử dụng Qdrant  |
| QDRANT_PREFER_GRPC | Qdrant ưu tiên kết nối gRPC   | true                  | Tùy chọn khi sử dụng Qdrant  |

### Cấu hình lưu trữ đối tượng

| Mục cấu hình      | Giải thích               | Giá trị mặc định   | Bắt buộc |
| ----------------- | ------------------------ | ------------------ | -------- |
| MINIO_ENDPOINT    | Địa chỉ máy chủ MinIO    | localhost:9000     | ✅        |
| MINIO_ACCESS_KEY  | Khóa truy cập MinIO      | minioadmin         | ✅        |
| MINIO_SECRET_KEY  | Khóa bí mật MinIO        | minioadmin         | ✅        |
| MINIO_BUCKET_NAME | Tên bucket lưu trữ MinIO | documents          | ✅        |

### Cấu hình khác

| Mục cấu hình | Giải thích   | Giá trị mặc định | Bắt buộc |
| ------------ | ------------ | ---------------- | -------- |
| TZ           | Cài đặt múi giờ | Asia/Shanghai | ❌        |

## 🤝 Hướng dẫn đóng góp

Chúng tôi rất hoan nghênh sự đóng góp từ cộng đồng!

### Quy trình đóng góp

1. Fork repository này
2. Tạo nhánh tính năng (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên nhánh (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Quy chuẩn phát triển

- Tuân thủ quy chuẩn mã [Python PEP 8](https://pep8.org/)
- Tuân thủ quy chuẩn commit [Conventional Commits](https://www.conventionalcommits.org/)

### 🚧 Roadmap

- [x] Tích hợp API cơ sở tri thức
- [ ] Workflow ngôn ngữ tự nhiên
- [ ] Truy xuất đa đường
- [x] Hỗ trợ đa mô hình
- [x] Hỗ trợ đa cơ sở dữ liệu vector
- [x] Hỗ trợ mô hình cục bộ

## Bổ sung

Dự án này chỉ dùng để học tập và trao đổi về RAG, vui lòng không sử dụng cho mục đích thương mại, không có điều kiện sử dụng trong môi trường sản xuất, vẫn đang trong quá trình phát triển liên tục.

## 🔧 Câu hỏi thường gặp

Để thuận tiện cho mọi người sử dụng, chúng tôi đã tổng hợp các câu hỏi thường gặp và giải pháp, vui lòng tham khảo [Hướng dẫn Khắc phục sự cố](docs/troubleshooting.md).

## 📄 Giấy phép

Dự án này sử dụng [Giấy phép Apache-2.0](LICENSE)

## 🙏 Lời cảm ơn

Cảm ơn các dự án mã nguồn mở sau:

- [FastAPI](https://fastapi.tiangolo.com/)
- [Langchain](https://python.langchain.com/)
- [Next.js](https://nextjs.org/)
- [ChromaDB](https://www.trychroma.com/)


![star history](https://api.star-history.com/svg?repos=rag-web-ui/rag-web-ui&type=Date)

---

<div align="center">
  Nếu dự án này hữu ích cho bạn, hãy cân nhắc cho nó một ⭐️
</div> 

# Hướng Dẫn Sử Dụng Tính Năng Create Blog

## 📋 Tổng Quan

Tính năng tạo blog đã được tích hợp hoàn chỉnh với backend API. Hệ thống hỗ trợ:

- ✅ Upload thumbnail qua API
- ✅ Upload ảnh trong content qua Quill editor
- ✅ Tạo blog post với validation đầy đủ
- ✅ Lưu draft và publish
- ✅ Loading states và error handling
- ✅ Redirect sau khi tạo thành công

## 🚀 Cách Sử Dụng

### 1. Đảm Bảo Backend Đang Chạy

Trước khi sử dụng, đảm bảo backend API đang chạy tại `http://localhost:3002`:

```bash
# Trong thư mục backend
npm run start:dev
```

### 2. Tạo Blog Post Mới

1. **Truy cập trang create**: Đi đến `/blog/create`

2. **Upload Thumbnail** (Bắt buộc):
   - Click vào khu vực upload hoặc kéo thả ảnh
   - Hệ thống sẽ tự động upload lên server
   - Ảnh phải là JPEG, PNG, GIF hoặc WebP (≤ 2MB)

3. **Điền Thông Tin**:
   - **Post name** (Bắt buộc): Tiêu đề bài viết
   - **Language** (Bắt buộc): Chọn ngôn ngữ
   - **Tags** (Bắt buộc): Thêm ít nhất 1 tag
   - **Short description** (Bắt buộc): Mô tả ngắn cho SEO

4. **Viết Nội Dung**:
   - Sử dụng Quill editor để viết nội dung
   - Để chèn ảnh: Click icon image trong toolbar
   - Ảnh sẽ tự động upload lên server

5. **Preview**: Click nút "Preview" để xem trước

6. **Publish hoặc Save Draft**:
   - **Save as draft**: Lưu nháp (status = "draft")
   - **Create**: Tạo bài viết (status = "waiting" - chờ duyệt)

## 📁 Cấu Trúc File

```
src/
├── services/
│   └── blogApi.ts          # Service xử lý API calls
└── pages/
    └── blog/
        └── create.vue      # Trang tạo blog
```

## 🔧 API Endpoints

### 1. Upload Image
```
POST http://localhost:3002/blog/upload-image
Content-Type: multipart/form-data

Response:
{
  "imageId": "image-abc123",
  "url": "http://...",
  "secureUrl": "https://..."
}
```

### 2. Create Blog
```
POST http://localhost:3002/blog
Content-Type: application/json

Body:
{
  "name": "Blog title",
  "lang": "vi",
  "thumbnail": "image-abc123",
  "shortDescription": "Short desc",
  "content": "<p>HTML content</p>",
  "tags": ["tag1", "tag2"],
  "numWords": 100,
  "status": "waiting" | "draft" | "published"
}

Response:
{
  "id": "uuid",
  "slug": "blog-title",
  ...
}
```

## ⚠️ Lưu Ý Quan Trọng

1. **Thumbnail bắt buộc**: Phải upload thumbnail trước khi publish
2. **Validation**: Tất cả các trường bắt buộc phải được điền
3. **Image Upload**: 
   - Ảnh trong content tự động upload khi chèn vào editor
   - Sử dụng `secureUrl` để hiển thị preview
   - Lưu `imageId` trong database
4. **Word Count**: Tự động tính số từ từ HTML content
5. **Status**:
   - `draft`: Bản nháp
   - `waiting`: Chờ duyệt (mặc định khi publish)
   - `published`: Đã xuất bản

## 🐛 Xử Lý Lỗi

### Lỗi Upload Image
- **File quá lớn**: Giảm kích thước ảnh xuống ≤ 2MB
- **File type không hợp lệ**: Chỉ chấp nhận JPEG, PNG, GIF, WebP
- **Server error**: Kiểm tra backend có đang chạy không

### Lỗi Create Blog
- **Validation error**: Kiểm tra tất cả trường bắt buộc
- **Duplicate name**: Tên blog đã tồn tại, đổi tên khác
- **Server error**: Kiểm tra backend logs

## 📝 Ví Dụ Workflow

```javascript
// 1. User upload thumbnail
// → API: POST /blog/upload-image
// → Response: { imageId: "image-abc123", secureUrl: "https://..." }

// 2. User chèn ảnh vào content
// → API: POST /blog/upload-image
// → Response: { imageId: "image-xyz789", secureUrl: "https://..." }
// → Editor hiển thị ảnh với secureUrl

// 3. User click "Create"
// → Validate form
// → Count words
// → API: POST /blog
// → Response: { id: "...", slug: "blog-title" }
// → Redirect to /blog/blog-title
```

## 🎯 Tính Năng Đã Implement

- [x] Upload thumbnail với loading state
- [x] Quill editor với image upload handler
- [x] Form validation
- [x] Word counting
- [x] Save draft functionality
- [x] Publish functionality
- [x] Preview mode
- [x] Error handling
- [x] Loading states
- [x] Auto redirect sau khi tạo thành công
- [x] Dark mode support

## 🔜 Tính Năng Có Thể Mở Rộng

- [ ] Auto-save draft mỗi 30 giây
- [ ] Rich text formatting options
- [ ] SEO preview
- [ ] Schedule publish
- [ ] Multiple language versions
- [ ] Image optimization
- [ ] Video embed support

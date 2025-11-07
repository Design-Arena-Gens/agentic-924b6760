# Thần Số Học Pro

Ứng dụng web Next.js cho phép người dùng đăng nhập bằng Google, hoàn tất hồ sơ với ngày sinh và họ tên đầy đủ, từ đó nhận báo cáo thần số học chuyên sâu. Báo cáo được tạo đồng thời dưới dạng PDF, DOCX và gửi về email người dùng với file PDF đính kèm.

## 🌟 Tính năng chính
- Đăng nhập một chạm bằng Google với NextAuth và Prisma.
- Thu thập, lưu trữ họ tên và ngày sinh của người dùng.
- Thuật toán thần số học phân tích các chỉ số quan trọng (Đường đời, Sứ mệnh, Linh hồn, Nhân cách, Trưởng thành, Nợ nghiệp).
- Sinh báo cáo định dạng PDF & DOCX, hiển thị trực tiếp trên giao diện.
- Email tự động gửi file PDF báo cáo qua Resend.

## 🚀 Bắt đầu

### 1. Cấu hình biến môi trường
Sao chép file mẫu:

```bash
cp .env.example .env.local
```

Điền đầy đủ các biến:

- `DATABASE_URL`: kết nối PostgreSQL (có thể dùng Vercel Postgres hoặc Supabase).
- `NEXTAUTH_SECRET`: chuỗi ngẫu nhiên bảo mật, tạo bằng `openssl rand -base64 32`.
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: tạo tại [Google Cloud Console](https://console.cloud.google.com/).
- `RESEND_API_KEY`: khóa API từ [Resend](https://resend.com/).
- `NEXT_PUBLIC_APP_NAME`: tên thương hiệu hiển thị trên giao diện/email.

### 2. Cài đặt & migrate

```bash
npm install
npm run prisma:generate
npm run prisma:push
```

### 3. Chạy ứng dụng

```bash
npm run dev
```

Truy cập `http://localhost:3000`.

## 🧰 Kiến trúc
- **Next.js 14 (App Router)** với TailwindCSS.
- **Prisma + PostgreSQL** lưu trữ người dùng và lịch sử báo cáo.
- **NextAuth** (Google Provider) quản lý đăng nhập.
- **docx / pdf-lib** tạo tài liệu.
- **Resend** gửi email kèm file PDF.

## 📦 Triển khai
1. Đảm bảo đã cấu hình biến môi trường trong Vercel.
2. Build & test cục bộ:
   ```bash
   npm run build
   ```
3. Deploy sản phẩm:
   ```bash
   vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-924b6760
   ```

## 🔒 Bảo mật & quyền riêng tư
- Thông tin người dùng lưu trong cơ sở dữ liệu với các trường bắt buộc.
- Email chỉ gửi tới địa chỉ Google đã xác thực.
- Resend được sử dụng cho transactional email, nên bật DMARC/SPF/DKIM nếu dùng domain tùy chỉnh.

## 🧪 Kiểm thử
- `npm run lint` - đảm bảo chuẩn hoá code.
- Thực hiện test tạo báo cáo để kiểm tra render PDF, DOCX và email gửi ra.

## 📝 Ghi chú
- Ứng dụng yêu cầu Google OAuth 2.0 kiểu "Web application" với redirect `https://<domain>/api/auth/callback/google`.
- Nếu chưa cấu hình Resend, email sẽ bị bỏ qua nhưng báo cáo vẫn tạo để tải về.

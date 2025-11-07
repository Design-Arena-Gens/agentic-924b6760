import { getServerSession } from "next-auth";
import { authOptions, isAuthConfigured } from "@/lib/auth";
import { ReportForm } from "@/components/report-form";
import { SignInButton } from "@/components/sign-in-button";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Thần Số Học Pro";

export default async function Home() {
  const session = isAuthConfigured ? await getServerSession(authOptions) : null;
  const authDisabledMessage =
    "Hệ thống hiện chưa được cấu hình Google OAuth hoặc cơ sở dữ liệu. Hãy bổ sung biến môi trường để kích hoạt đăng nhập và tạo báo cáo.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[420px] w-[420px] rounded-full bg-primary-700/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-16 px-6 pb-16 pt-20 md:px-12">
        <header className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center justify-center rounded-full border border-primary-400/40 bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
              Báo cáo thần số học chuyên nghiệp
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              {appName} - Khai mở bản đồ tâm linh của riêng bạn
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300">
              Kết nối với Google trong vài giây, khỏi mất thời gian nhập liệu. Thuật toán độc quyền
              phân tích hơn 70 yếu tố từ họ tên và ngày sinh, xuất báo cáo tức thì ở định dạng PDF, DOCX
              và gửi email kèm hướng dẫn chiêm nghiệm chi tiết.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            {session ? (
              <SignInButton type="logout" />
            ) : isAuthConfigured ? (
              <SignInButton className="shadow-primary-500/30 md:self-start" />
            ) : (
              <div className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300">
                Đang chờ cấu hình hệ thống
              </div>
            )}
          </div>
        </header>

        {session ? (
          <section className="flex justify-center">
            <ReportForm />
          </section>
        ) : isAuthConfigured ? (
          <section className="glass relative mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-10 py-12 text-center">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent opacity-50 blur-2xl" />
            <h2 className="text-3xl font-semibold text-white">Đăng nhập để bắt đầu</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
              Tài khoản Google giúp chúng tôi xác thực danh tính và gửi báo cáo trực tiếp về email của
              bạn. Mọi thông tin đều được mã hóa và bảo mật theo chuẩn doanh nghiệp.
            </p>
            <SignInButton />
          </section>
        ) : (
          <section className="glass relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-10 py-12 text-center">
            <h2 className="text-3xl font-semibold text-white">Cần cấu hình thêm</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">{authDisabledMessage}</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Thiết lập biến môi trường GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET</li>
              <li>• Cung cấp DATABASE_URL trỏ tới PostgreSQL và NEXTAUTH_SECRET bảo mật</li>
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

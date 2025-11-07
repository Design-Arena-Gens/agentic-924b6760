"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

type ReportFiles = {
  docx: string;
  pdf: string;
};

type Profile = {
  fullName: string;
  formattedBirthDate: string;
  age: number;
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  maturityNumber: number;
  karmicDebtNumbers: number[];
  sections: { title: string; content: string }[];
};

export function ReportForm() {
  const { data: session } = useSession();
  const [fullName, setFullName] = useState(session?.user?.fullName ?? session?.user?.name ?? "");
  const [birthDate, setBirthDate] = useState(() => {
    if (session?.user?.birthDate) {
      return session.user.birthDate.slice(0, 10);
    }
    return "";
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [files, setFiles] = useState<ReportFiles | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, birthDate }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error?.error ?? "Không thể tạo báo cáo.");
        }

        const data = (await response.json()) as { profile: Profile; files: ReportFiles };
        setProfile(data.profile);
        setFiles(data.files);
        setMessage("Báo cáo đã sẵn sàng. Bạn cũng sẽ nhận được bản PDF qua email.");
      } catch (error) {
        console.error(error);
        setMessage(error instanceof Error ? error.message : "Đã xảy ra lỗi.");
      }
    });
  };

  const download = (base64: string, filename: string, contentType: string) => {
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      array[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([array], { type: contentType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="glass relative w-full max-w-6xl overflow-hidden p-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-2xl font-semibold text-white">Thông tin cá nhân</h2>
            <p className="mt-2 text-sm text-slate-300">
              Điền đầy đủ họ tên và ngày sinh để hệ thống xây dựng báo cáo chính xác nhất.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-medium text-slate-200">
              <span>Họ và tên đầy đủ</span>
              <input
                className="w-full rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                placeholder="Ví dụ: Nguyễn Thị Anh Linh"
                required
                minLength={3}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-200">
              <span>Ngày sinh</span>
              <input
                type="date"
                className="w-full rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                required
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Đang xử lý..." : "Báo cáo thần số học"}
          </button>

          {message && (
            <div className="rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-200">
              {message}
            </div>
          )}

          {files && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  download(
                    files.pdf,
                    `bao-cao-than-so-hoc-${format(new Date(birthDate), "yyyyMMdd")}.pdf`,
                    "application/pdf"
                  )
                }
                className="inline-flex items-center justify-center rounded-lg border border-primary-400/60 bg-transparent px-4 py-2 text-sm font-semibold text-primary-200 transition hover:bg-primary-500/10"
              >
                Tải về PDF
              </button>
              <button
                type="button"
                onClick={() =>
                  download(
                    files.docx,
                    `bao-cao-than-so-hoc-${format(new Date(birthDate), "yyyyMMdd")}.docx`,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  )
                }
                className="inline-flex items-center justify-center rounded-lg border border-primary-400/60 bg-transparent px-4 py-2 text-sm font-semibold text-primary-200 transition hover:bg-primary-500/10"
              >
                Tải về DOCX
              </button>
            </div>
          )}
        </form>

        <div className="glass bg-slate-900/30 p-6 md:p-8">
          {!profile ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Báo cáo toàn diện</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Hệ thống sẽ phân tích và tính toán những chỉ số cốt lõi trong thần số học bao gồm Đường
                đời, Sứ mệnh, Linh hồn, Nhân cách, Trưởng thành và kiểm tra các khoản nợ nghiệp tiềm
                ẩn. Báo cáo đầy đủ sẽ được gửi về email của bạn ngay sau khi hoàn tất.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Tài liệu chuyên sâu định dạng PDF và DOCX</li>
                <li>• Số hóa trải nghiệm cá nhân hóa theo Hồ sơ Google</li>
                <li>• Phân tích đa lớp giúp bạn hiểu rõ tiềm năng và bài học cuộc đời</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-6">
              <header>
                <h3 className="text-xl font-semibold text-white">Kết quả của bạn</h3>
                <p className="text-sm text-slate-300">
                  {profile.fullName} • Sinh ngày {profile.formattedBirthDate} • {profile.age} tuổi
                </p>
              </header>

              <div className="grid gap-4 sm:grid-cols-2">
                <Stat label="Đường đời" value={profile.lifePathNumber} />
                <Stat label="Sứ mệnh" value={profile.destinyNumber} />
                <Stat label="Linh hồn" value={profile.soulUrgeNumber} />
                <Stat label="Nhân cách" value={profile.personalityNumber} />
                <Stat label="Trưởng thành" value={profile.maturityNumber} />
                <Stat
                  label="Nợ nghiệp"
                  value={
                    profile.karmicDebtNumbers.length > 0
                      ? profile.karmicDebtNumbers.join(", ")
                      : "Không có"
                  }
                />
              </div>

              <div className="space-y-5">
                {profile.sections.map((section) => (
                  <section key={section.title} className="rounded-2xl border border-white/5 bg-slate-900/50 p-5">
                    <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{section.content}</p>
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 text-center shadow-inner shadow-slate-950/60">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

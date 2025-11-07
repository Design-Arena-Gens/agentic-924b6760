import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/session-provider";
import { getServerSession } from "next-auth";
import { authOptions, isAuthConfigured } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Thần Số Học Pro";

export const metadata: Metadata = {
  title: `${appName} | Báo cáo thần số học cá nhân`,
  description:
    "Nền tảng phân tích thần số học chuyên sâu giúp bạn hiểu rõ bản thân và định hướng tương lai.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = isAuthConfigured ? await getServerSession(authOptions) : null;

  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50`}>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
      </body>
    </html>
  );
}

"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Thần Số Học Pro";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-900/60 p-8 backdrop-blur">
        <div className="flex flex-col items-center text-center">
          <Image src="/logo.svg" alt={appName} width={72} height={72} className="mb-4" />
          <h1 className="text-3xl font-bold">{appName}</h1>
          <p className="mt-2 text-sm text-slate-300">
            Đăng nhập bằng Google để khám phá bản đồ thần số học cá nhân chính xác nhất.
          </p>
        </div>
        <button
          className="flex w-full items-center justify-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          onClick={() => signIn("google")}
        >
          Đăng nhập bằng Google
        </button>
      </div>
    </main>
  );
}

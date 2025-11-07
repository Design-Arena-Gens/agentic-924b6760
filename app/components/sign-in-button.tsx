"use client";

import { signIn, signOut } from "next-auth/react";

type Props = {
  type?: "login" | "logout";
  className?: string;
};

export function SignInButton({ type = "login", className }: Props) {
  if (type === "logout") {
    return (
      <button
        onClick={() => signOut()}
        className={`rounded-full bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/80 ${className ?? ""}`}
      >
        Đăng xuất
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className={`rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${className ?? ""}`}
    >
      Đăng nhập bằng Google
    </button>
  );
}

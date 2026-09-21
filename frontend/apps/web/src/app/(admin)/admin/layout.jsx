import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <header className="border-b border-neutral-800 bg-neutral-950 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="font-extrabold text-base tracking-wide">SERVIO PLATFORM ADMIN</h1>
              <p className="text-[10px] text-neutral-400">Tenant verification, hygiene compliance, & platform ranking</p>
            </div>
          </div>
          <nav className="flex gap-4 text-xs font-bold text-neutral-400">
            <Link href="/admin/verification" className="text-orange-400 hover:text-white">
              Verification Queue
            </Link>
            <Link href="/" className="hover:text-white">
              Public App
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}

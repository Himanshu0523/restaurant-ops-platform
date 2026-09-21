"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { Input } from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResetDone(true);
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Set your new secure account password."
      footer={
        <Link href="/login" className="text-orange-600 font-semibold hover:underline">
          Return to Sign In
        </Link>
      }
    >
      {!resetDone ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">New Password</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">Confirm New Password</label>
            <Input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
          >
            Save New Password
          </button>
        </form>
      ) : (
        <div className="text-center space-y-3 p-4 bg-green-50 rounded-2xl border border-green-200 text-xs">
          <p className="font-bold text-green-900">Password successfully reset!</p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 rounded-xl bg-orange-600 text-white font-bold transition"
          >
            Sign In Now →
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
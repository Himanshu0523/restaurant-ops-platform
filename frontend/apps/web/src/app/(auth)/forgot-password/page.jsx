"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset OTP / link."
      footer={
        <>
          Remembered your password?{" "}
          <Link href="/login" className="text-orange-600 font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">Email Address</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
          >
            Send Reset Instructions
          </button>
        </form>
      ) : (
        <div className="text-center space-y-3 p-4 bg-green-50 rounded-2xl border border-green-200 text-xs">
          <p className="font-bold text-green-900">Reset instructions sent!</p>
          <p className="text-neutral-600">Check <strong>{email}</strong> for your reset link or OTP token.</p>
        </div>
      )}
    </AuthCard>
  );
}

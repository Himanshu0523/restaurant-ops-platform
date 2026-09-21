"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { Input } from "@/components/ui/Input";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setVerified(true);
  };

  return (
    <AuthCard
      title="Verify Account OTP"
      subtitle="Enter the 6-digit OTP sent to your registered phone or email."
      footer={
        <p className="text-xs text-neutral-500">
          Didn&apos;t receive code?{" "}
          <button onClick={() => alert("Resent OTP!")} className="text-orange-600 font-semibold hover:underline">
            Resend OTP
          </button>
        </p>
      }
    >
      {!verified ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700">6-Digit Verification Code</label>
            <Input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="text-center tracking-widest text-lg font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
          >
            Verify & Continue
          </button>
        </form>
      ) : (
        <div className="text-center space-y-3 p-4 bg-green-50 rounded-2xl border border-green-200 text-xs">
          <p className="font-bold text-green-900">Account verified successfully! 🎉</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-xl bg-orange-600 text-white font-bold transition"
          >
            Go to Home →
          </Link>
        </div>
      )}
    </AuthCard>
  );
}

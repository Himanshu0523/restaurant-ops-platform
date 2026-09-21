"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { verifyEmailSchema } from "@/features/auth/schemas/auth.schema";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const verify = useVerifyEmail();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "" },
  });

  return (
    <AuthCard
      title="Verify your email"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}.`
          : "Enter the 6-digit code we emailed you."
      }
    >
      <form
        onSubmit={handleSubmit((v) => verify.mutate({ ...v, email }))}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <label htmlFor="code" className="text-sm font-medium">Verification code</label>
          <input
            id="code"
            inputMode="numeric"
            maxLength={6}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-center text-lg tracking-[0.5em] outline-none focus:ring-2 focus:ring-ring"
            {...register("code")}
          />
          {errors.code && (
            <p className="text-xs text-destructive">{errors.code.message}</p>
          )}
        </div>

        {verify.isError && (
          <p className="text-sm text-destructive">
            {verify.error?.response?.data?.message || "Invalid or expired code"}
          </p>
        )}

        <button
          type="submit"
          disabled={verify.isPending}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {verify.isPending ? "Verifying…" : "Verify email"}
        </button>
      </form>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
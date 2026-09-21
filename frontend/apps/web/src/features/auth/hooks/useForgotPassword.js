"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (_, variables) => {
      toast.success("If an account exists with that email, a reset link has been sent!");
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to request password reset");
    },
  });
}
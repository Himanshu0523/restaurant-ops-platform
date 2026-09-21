"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data, variables) => {
      const token = data?.accessToken || data?.access_token;
      const refreshToken = data?.refreshToken || data?.refresh_token;

      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }
      if (refreshToken && typeof window !== "undefined") {
        localStorage.setItem("refreshToken", refreshToken);
      }

      toast.success("Account created successfully!");
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to register account");
    },
  });
}
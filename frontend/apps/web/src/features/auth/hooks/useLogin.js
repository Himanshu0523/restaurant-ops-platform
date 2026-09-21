"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const token = data?.accessToken || data?.access_token;
      const refreshToken = data?.refreshToken || data?.refresh_token;

      if (token && typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
      }
      if (refreshToken && typeof window !== "undefined") {
        localStorage.setItem("refreshToken", refreshToken);
      }

      toast.success("Successfully logged in!");
      router.push(redirect);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Invalid email or password");
    },
  });
}
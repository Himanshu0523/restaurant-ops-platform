"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";


export function useResetPassword() {
    const router = useRouter();

    return useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: () => router.push("/login?reset=1"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to reset password"),
    })
}
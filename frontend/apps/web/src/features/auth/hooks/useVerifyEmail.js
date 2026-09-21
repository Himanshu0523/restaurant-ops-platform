"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";


export function useVerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    return useMutation({
        mutationFn: authService.verifyEmail,
        onSuccess: () => router.push("/login?verified=1"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to verify email"),
    })
}
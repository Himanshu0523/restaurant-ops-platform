import { apiClient } from "@/lib/api-client";

export const authService = {
    login: (payload) => apiClient.post("/auth/login", payload).then((r) => r.data),
    register: (payload) =>
    apiClient.post("/auth/register", {
        ...payload,
        fname: payload.fname || payload.firstName,
        lname: payload.lname || payload.lastName,
        firstName: payload.firstName || payload.fname,
        lastName: payload.lastName || payload.lname,
    }).then((r) => r.data),
    forgotPassword: (payload) => apiClient.post("/auth/forgot-password", payload).then((r) => r.data),
    resetPassword: (token, payload) =>
        apiClient.post("/auth/reset-password", payload, {
        headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.data),
    verifyEmail: (payload) => apiClient.post("/auth/verify-email", payload).then((r) => r.data),
    resendVerification: (email) => apiClient.post("/auth/resend-verification", { email }).then((r) => r.data),
};
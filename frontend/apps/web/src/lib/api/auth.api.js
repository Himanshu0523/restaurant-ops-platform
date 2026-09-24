import { apiClient } from "@/lib/api-client";

/** POST /auth/register */
export async function registerUser(data) {
  const res = await apiClient.post("/auth/register", data);
  return res.data;
}

/** POST /auth/login */
export async function loginUser(data) {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
}

/** POST /auth/logout */
export async function logoutUser() {
  const res = await apiClient.post("/auth/logout");
  return res.data;
}

/** POST /auth/refresh */
export async function refreshToken(data) {
  const res = await apiClient.post("/auth/refresh", data);
  return res.data;
}

/** POST /auth/forgot-password */
export async function forgotPassword(data) {
  const res = await apiClient.post("/auth/forgot-password", data);
  return res.data;
}

/** POST /auth/reset-password */
export async function resetPassword(data) {
  const res = await apiClient.post("/auth/reset-password", data);
  return res.data;
}

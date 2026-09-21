import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 20_000,
});

function handleLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
}

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    const isAuthCall = 
      original?.url?.includes('/auth/refresh') || 
      original?.url?.includes('/auth/login') || 
      original?.url?.includes('/auth/register') || 
      original?.url?.includes('/auth/forgot-password') || 
      original?.url?.includes('/auth/reset-password') || 
      original?.url?.includes('/auth/verify-email') || 
      original?.url?.includes('/auth/resend-verification');

    if (status === 401 && !original._retry && !isAuthCall && typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        original._retry = true;
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const newAccessToken = response.data?.accessToken || response.data?.access_token;
        const newRefreshToken = response.data?.refreshToken || response.data?.refresh_token;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          original.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(original);
        } else {
          handleLogout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
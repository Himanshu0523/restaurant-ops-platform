"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLogin, useLogout, useRegister } from "@/hooks/api/useAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  // Restore user from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      const stored = localStorage.getItem("user");
      if (token && stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      /* ignore parse errors */
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await loginMutation.mutateAsync(credentials);
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    },
    [loginMutation]
  );

  const register = useCallback(
    async (payload) => {
      const data = await registerMutation.mutateAsync(payload);
      return data;
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [logoutMutation]);

  const isAuthenticated = !!user && !!localStorage.getItem?.("accessToken");

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        loginPending: loginMutation.isPending,
        registerPending: registerMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthProvider;

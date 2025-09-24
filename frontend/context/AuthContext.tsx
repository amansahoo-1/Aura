"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import { Role } from "@/hooks/useAuth";

interface UserType {
  id: number;
  email: string;
  name?: string;
  brandName?: string;
}

export interface AuthContextType {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string,
    role: Role
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as UserType);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, role: Role) => {
    try {
      const response = await api.post(`/auth/login/${role}`, {
        email,
        password,
      });
      const { token, ...userDataResponse } = response.data.data;
      const userData = userDataResponse[role] as UserType;

      setToken(token);
      setUser(userData);

      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(userData));

      router.push(role === "user" ? "/" : "/dashboard");

      return { success: true };
    } catch (error: unknown) {
      console.error(`Login failed for role ${role}:`, error);

      let message = "An unknown error occurred.";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data?.message || "Login failed";
      } else if (error instanceof Error) {
        message = error.message;
      }

      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    router.push("/login");
  };

  const authContextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

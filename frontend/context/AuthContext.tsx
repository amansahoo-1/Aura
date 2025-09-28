"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback, // Import useCallback
} from "react";
import { Admin, AuthenticatedUser, KycStatus, Role, UserStatus } from "@/types";
import { setToken, removeToken, getToken } from "@/utils/cookies";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";

// ... (interface AuthContextType and getRoleFromToken remain the same) ...
interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const getRoleFromToken = (token: string): Role | null => {
  try {
    const decoded: { role: Role } = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // FIX 1: Memoize logout to make it a stable dependency
  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setIsLoading(false);
  }, []);

  // FIX 2: Memoize fetchProfile and declare its dependency on the stable `logout` function
  const fetchProfile = useCallback(
    async (token: string) => {
      setIsLoading(true);
      const role = getRoleFromToken(token);
      if (!role) {
        logout();
        return;
      }

      let profileEndpoint = "";
      if (role === Role.USER) profileEndpoint = "/users/profile";
      if (role === Role.SELLER) profileEndpoint = "/sellers/profile/me";
      if ([Role.ADMIN, Role.SUPERADMIN, Role.OPERATIONS].includes(role)) {
        try {
          const decoded: Admin = jwtDecode(token);
          setUser({
            ...decoded,
            role: decoded.role,
            status: UserStatus.ACTIVE,
            kycStatus: KycStatus.VERIFIED,
            createdAt: "",
            updatedAt: "",
          });
        } catch (e) {
          logout();
        }
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(profileEndpoint);
        setUser({ ...response.data.data, role });
      } catch (error) {
        console.error("Failed to fetch profile", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    },
    [logout] // Dependency array for useCallback
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        await fetchProfile(token);
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, [fetchProfile]); // FIX 3: Add the memoized fetchProfile as a dependency

  const login = async (token: string) => {
    setToken(token);
    await fetchProfile(token);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/context/AuthContext";

export type Role = "user" | "seller" | "admin";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

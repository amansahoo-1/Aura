"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // FIX: Determine the display name safely by checking for property existence.
  // This helps TypeScript narrow the union type correctly.
  const getDisplayName = () => {
    if (!user) return "";
    if ("name" in user) return user.name; // For User and Admin
    if ("brandName" in user) return user.brandName; // For Seller
    return "User";
  };

  return (
    <div>
      <header className="p-4 bg-white shadow">
        <h1 className="text-xl">
          Welcome, {getDisplayName()} ({user?.role})
        </h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}

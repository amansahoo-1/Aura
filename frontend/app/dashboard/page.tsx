"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case Role.USER:
          router.replace("/dashboard/user");
          break;
        case Role.SELLER:
          router.replace("/dashboard/seller");
          break;
        case Role.ADMIN:
        case Role.SUPERADMIN:
        case Role.OPERATIONS:
          router.replace("/dashboard/admin");
          break;
        default:
          router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
      <p className="ml-4">Redirecting to your dashboard...</p>
    </div>
  );
}

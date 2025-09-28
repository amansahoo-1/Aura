"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Spinner } from "@/components/ui/Spinner";
import { UserStatus, KycStatus, AdminViewUserDetail } from "@/types"; // Import the detailed type
import { UpdateStatusForm } from "@/components/dashboard/admin/UpdateStatusForm"; // Import the shared component

export default function ManageUserPage() {
  const params = useParams();
  const userId = params.userId;
  // ✅ Use the detailed type, removing 'any'
  const [user, setUser] = useState<AdminViewUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Ensure userId is a string before fetching
    if (typeof userId !== "string") {
      setIsLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admins/users/${userId}`);
        setUser(response.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Add a guard here. After this point, TypeScript knows userId is a string.
  if (typeof userId !== "string") {
    return <p>Invalid User ID.</p>;
  }

  if (isLoading) return <Spinner />;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <h1 className="text-3xl text-black font-bold mb-2">
        Manage User: {user.name}
      </h1>
      <p className="text-gray-700 mb-8">Email: {user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-cyan-900">
        <UpdateStatusForm
          entityId={userId as string}
          currentStatus={user.status}
          apiPath={`/admins/users/${userId}/status`}
          statusEnum={UserStatus}
          title="Account Status"
          fieldName="status"
        />
        <UpdateStatusForm
          entityId={userId as string}
          currentStatus={user.kycStatus}
          apiPath={`/admins/users/${userId}/kyc`}
          statusEnum={{
            // Pass a partial object for specific options
            VERIFIED: KycStatus.VERIFIED,
            REJECTED: KycStatus.REJECTED,
          }}
          title="KYC Status"
          fieldName="kycStatus"
        />
      </div>
    </div>
  );
}

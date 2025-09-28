"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Spinner } from "@/components/ui/Spinner";
import { KycStatus, AdminViewSellerDetail } from "@/types"; // Import the detailed type
import { UpdateStatusForm } from "@/components/dashboard/admin/UpdateStatusForm"; // Import the shared component

export default function ManageSellerPage() {
  const params = useParams();
  const sellerId = params.sellerId;
  // ✅ Use the detailed type, removing 'any'
  const [seller, setSeller] = useState<AdminViewSellerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure sellerId is a string before fetching
    if (typeof sellerId !== "string") {
      setIsLoading(false);
      return;
    }
    const fetchSeller = async () => {
      try {
        const response = await api.get(`/admins/sellers/${sellerId}`);
        setSeller(response.data.data);
      } catch (err) {
        console.error("Failed to fetch seller", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeller();
  }, [sellerId]);

  // Add a guard here. After this point, TypeScript knows sellerId is a string.
  if (typeof sellerId !== "string") {
    return <p>Invalid Seller ID.</p>;
  }

  if (isLoading) return <Spinner />;
  if (!seller) return <p>Seller not found.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Manage Seller: {seller.brandName}
      </h1>
      <p className="text-gray-500 mb-8">
        Contact: {seller.contactPerson} ({seller.email})
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UpdateStatusForm
          entityId={sellerId}
          currentStatus={seller.kycStatus}
          apiPath={`/admins/sellers/${sellerId}/kyc`}
          statusEnum={{
            VERIFIED: KycStatus.VERIFIED,
            REJECTED: KycStatus.REJECTED,
          }}
          title="KYC Status"
          fieldName="kycStatus"
        />
        {/* You can add another UpdateStatusForm for the seller's Account Status here if needed */}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { AdminViewSeller } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

export const SellerList = () => {
  const [sellers, setSellers] = useState<AdminViewSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await api.get("/admins/sellers");
        setSellers(response.data.data);
      } catch (err) {
        console.error("Failed to fetch sellers", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSellers();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Platform Sellers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KYC
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {seller.brandName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{seller.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{seller.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {seller.kycStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Discount } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await api.get("/discounts");
        setDiscounts(response.data.data);
      } catch (err) {
        console.error("Failed to fetch discounts", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl text-black font-bold mb-4">Manage Discounts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-500">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Percentage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Valid Until
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-500">
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-black">
                  {discount.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {discount.percentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {new Date(discount.validTill).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

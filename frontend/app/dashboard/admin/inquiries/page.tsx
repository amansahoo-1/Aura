"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Inquiry } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        // This is a protected admin endpoint
        const response = await api.get("/inquiries");
        setInquiries(response.data.data.inquiries);
      } catch (err) {
        console.error("Failed to fetch inquiries", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl text-black font-bold mb-4">Customer Inquiries</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Received
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="px-6 py-4 whitespace-pre-wrap max-w-md text-black">
                  {inquiry.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {inquiry.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

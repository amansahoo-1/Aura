"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { AdminViewUser } from "@/types";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";

export const UserList = () => {
  const [users, setUsers] = useState<AdminViewUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // This is a protected admin endpoint
        const response = await api.get("/admins/users");
        setUsers(response.data.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl text-black font-bold mb-4">Platform Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                KYC
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-500">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {user.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-black">
                  {user.kycStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {" "}
                  <Link
                    href={`/dashboard/admin/users/${user.id}`}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

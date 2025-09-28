"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types";

const AdminNavLink = ({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="block bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition-colors"
  >
    <h3 className="font-bold text-lg text-purple-700">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </Link>
);

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl text-black font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminNavLink
          href="/dashboard/admin/users-sellers"
          title="Manage Users & Sellers"
          description="View, verify, and manage all users and sellers."
        />
        <AdminNavLink
          href="/dashboard/admin/rentals"
          title="Manage Rentals"
          description="View and update status of all rentals."
        />
        <AdminNavLink
          href="/dashboard/admin/inquiries"
          title="Customer Inquiries"
          description="View and respond to user messages."
        />
        <AdminNavLink
          href="/dashboard/admin/discounts"
          title="Manage Discounts"
          description="Create and manage promotional codes."
        />
        <AdminNavLink
          href="/dashboard/admin/subscriptions"
          title="Subscription Plans"
          description="Create and edit user subscription tiers."
        />
        {/* Conditionally render the link for SuperAdmins */}
        {user?.role === Role.SUPERADMIN && (
          <AdminNavLink
            href="/dashboard/admin/manage-admins"
            title="Manage Admins"
            description="[SuperAdmin Only] Add or remove admin accounts."
          />
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { UserList } from "@/components/dashboard/admin/UserList";
import { SellerList } from "@/components/dashboard/admin/SellerList";

// A reusable component for the admin navigation links
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
  return (
    <div>
      <h1 className="text-3xl text-black font-bold mb-8">Admin Dashboard</h1>

      {/* --- Management Links --- */}
      <div className="mb-10">
        <h2 className="text-xl text-black font-semibold mb-4 border-b pb-2">
          Control Panel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </div>

      {/* --- User & Seller Lists --- */}
      <div className="space-y-8">
        <UserList />
        <SellerList />
      </div>
    </div>
  );
}

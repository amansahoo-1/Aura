import Link from "next/link";
import { MyProductsList } from "@/components/dashboard/seller/MyProductsList";
import { KycManager } from "@/components/dashboard/user/KycManager";

export default function SellerDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-black font-bold">Seller Dashboard</h1>
        <Link
          href="/dashboard/seller/products/new"
          className="px-6 py-3 text-white font-semibold bg-purple-600 rounded-lg shadow hover:bg-purple-700 transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MyProductsList />
        </div>

        <div className="space-y-8">
          <KycManager />
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl text-black font-bold mb-2">My Payouts</h2>
            <p className="text-gray-500 text-sm mb-4">
              View your earnings and payment history.
            </p>
            <Link
              href="/dashboard/seller/payouts"
              className="font-semibold text-purple-600 hover:underline"
            >
              View Payout History &rarr;
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl text-black font-bold mb-2">
              Seller Profile
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Update your brand and contact info.
            </p>
            <Link
              href="/dashboard/seller/profile"
              className="font-semibold text-purple-600 hover:underline"
            >
              Edit Profile &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { MyProductsList } from "@/components/dashboard/seller/MyProductsList";

export default function SellerDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <Link
          href="/dashboard/seller/products/new"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add New Product
        </Link>
      </div>
      <MyProductsList />
    </div>
  );
}

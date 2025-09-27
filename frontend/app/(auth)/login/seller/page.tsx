import { SellerLoginForm } from "@/components/auth/SellerLoginForm";
import Link from "next/link";

export default function SellerLoginPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Seller Login</h2>
        <p className="text-gray-600">Manage your products and payouts.</p>
      </div>
      <SellerLoginForm />
      <p className="mt-4 text-sm text-center">
        Want to sell?{" "}
        <Link
          href="/register/seller"
          className="font-medium text-green-600 hover:underline"
        >
          Register your brand
        </Link>
      </p>
    </>
  );
}

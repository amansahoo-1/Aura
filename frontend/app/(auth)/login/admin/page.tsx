import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Admin Login</h2>
        <p className="text-gray-600">Access the management dashboard.</p>
      </div>
      <AdminLoginForm />
    </>
  );
}

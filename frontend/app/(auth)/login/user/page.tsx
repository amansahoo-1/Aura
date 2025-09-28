import { UserLoginForm } from "@/components/auth/UserLoginForm";
import Link from "next/link";

export default function UserLoginPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl text-cyan-950 font-bold">User Login</h2>
        <p className="text-gray-600">Access your account and rentals.</p>
      </div>
      <UserLoginForm />
      <p className="mt-4 text-sm text-center text-black">
        New here?{" "}
        <Link
          href="/register/user"
          className="font-medium text-blue-600 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}

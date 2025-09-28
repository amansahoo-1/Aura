import { UserRegisterForm } from "@/components/auth/UserRegistrationForm";
import Link from "next/link";

export default function UserRegisterPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl text-black font-bold">Create a New Account</h2>
        <p className="text-gray-600">
          Join us to start renting beautiful jewellery.
        </p>
      </div>
      <UserRegisterForm />
      <p className="mt-4 text-sm text-black text-center">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-purple-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}

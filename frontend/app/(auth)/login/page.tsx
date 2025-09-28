import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="text-center">
      <h2 className="text-2xl  text-black font-bold">Login</h2>
      <div className="mt-6 space-y-4">
        <Link
          href="/login/user"
          className="block w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Login as User
        </Link>
        <Link
          href="/login/seller"
          className="block w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Login as Seller
        </Link>
        <Link
          href="/login/admin"
          className="block w-full px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-800"
        >
          Login as Admin
        </Link>
      </div>
      <p className="mt-4 text-sm text-black">
        Do not have an account?{" "}
        <Link
          href="/register/user"
          className="font-medium text-blue-600 hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}

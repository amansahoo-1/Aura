"use client";
import { useState, FormEvent } from "react";
import { useAuth, Role } from "@/hooks/useAuth";

export default function OfficialLoginForm() {
  const [role, setRole] = useState<Role>("seller");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password, role);
    if (!result.success) {
      setError(result.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center p-1 space-x-1 bg-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => setRole("seller")}
          className={`w-full py-2 rounded-md text-sm font-medium ${
            role === "seller"
              ? "bg-white text-purple-700 shadow"
              : "text-gray-600"
          }`}
        >
          I am a Seller
        </button>
        <button
          type="button"
          onClick={() => setRole("admin")}
          className={`w-full py-2 rounded-md text-sm font-medium ${
            role === "admin"
              ? "bg-white text-purple-700 shadow"
              : "text-gray-600"
          }`}
        >
          I am an Admin
        </button>
      </div>

      <input
        type="email"
        placeholder={`${role === "seller" ? "Seller" : "Admin"} Email`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-300 transition-colors duration-300"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}

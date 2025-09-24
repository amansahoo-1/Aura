"use client";

import { useState } from "react";
import UserLoginForm from "@/components/auth/UserLoginForm";
import OfficialLoginForm from "@/components/auth/OfficialLoginForm";

type ActiveTab = "user" | "official";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("user");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Aura</h1>
          <p className="text-gray-500">Rent Exquisite Jewellery</p>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("user")}
            className={`flex-1 py-2 font-semibold text-center transition-colors duration-300 ${
              activeTab === "user"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-purple-500"
            }`}
          >
            Customer Login
          </button>
          <button
            onClick={() => setActiveTab("official")}
            className={`flex-1 py-2 font-semibold text-center transition-colors duration-300 ${
              activeTab === "official"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-purple-500"
            }`}
          >
            Admin / Seller Login
          </button>
        </div>

        <div>
          {activeTab === "user" ? <UserLoginForm /> : <OfficialLoginForm />}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  const getDisplayName = () => {
    if (!user) return "";
    if ("name" in user) return user.name;
    if ("brandName" in user) return user.brandName;
    return "User";
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          Swarnkart
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/products"
            className="text-gray-600 hover:text-purple-600"
          >
            Collection
          </Link>
          <Link
            href="/cart"
            className="relative text-gray-600 hover:text-purple-600"
          >
            Cart
            {isAuthenticated && itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hi, {getDisplayName()}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Login / Register
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

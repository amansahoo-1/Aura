"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import { Spinner } from "@/components/ui/Spinner";
import Image from "next/image";

export const MyProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        // This endpoint is protected and will only return products for the logged-in seller
        const response = await api.get("/sellers/products");
        setProducts(response.data.data);
      } catch (err) {
        setError("Failed to fetch your products.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl text-black font-bold mb-4">My Products</h2>
      {products.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id} className="py-3 flex items-center space-x-4">
              <Image
                src={product.imageUrls[0]}
                alt={product.name}
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
              <div className="flex-grow">
                <p className="font-semibold text-black">{product.name}</p>
                <p className="text-sm text-gray-950">
                  Fee: ₹{product.oneTimeRentalFee}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  product.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {product.isAvailable ? "Available" : "Unavailable"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-black">You have not added any products yet.</p>
      )}
    </div>
  );
};

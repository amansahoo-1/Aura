// src/app/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { Product, Pagination } from "@/types";
import api from "@/lib/axios";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Example with query params, you can make this dynamic with filters
        const params = new URLSearchParams({ page: "1", limit: "12" });
        const response = await api.get(`/products?${params.toString()}`);

        setProducts(response.data.data.data);
        setPagination(response.data.data.pagination);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-black font-bold mb-6">
        Explore Our Collection
      </h1>
      {products.length > 0 ? (
        <div className=" text-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-black">No products found.</p>
      )}
      {/* You can add pagination controls here using the `pagination` state */}
    </div>
  );
}

// src/app/products/[productId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@/components/ui/Spinner";
import { Product } from "@/types";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { isAxiosError } from "axios";

export default function ProductDetailPage() {
  const params = useParams();
  const { productId } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data.data);
      } catch (err) {
        // Catch the error without a type
        // Now, check the error's type before using it
        let errorMessage = "Failed to load product details.";
        if (isAxiosError(err) && err.response) {
          // If it's an Axios error, we can safely access its properties
          errorMessage = err.response.data?.message || errorMessage;
        }
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="relative w-full h-96">
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Product Info */}
        <div>
          <p className="text-lg text-gray-600">{product.seller.brandName}</p>
          <h1 className="text-4xl font-bold mt-2">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              ₹{product.oneTimeRentalFee.toLocaleString("en-IN")}
            </span>
            <span className="text-gray-500">per rental</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Insured Value: ₹
            {product.insuredDeclaredValue.toLocaleString("en-IN")}
          </p>

          <div className="mt-6">
            <Button className="w-full md:w-auto">Add to Cart</Button>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-xl">Description</h3>
            <p className="mt-2 text-gray-700">{product.description}</p>
          </div>
          <div className="mt-6 border-t pt-4">
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Material:</strong> {product.material}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

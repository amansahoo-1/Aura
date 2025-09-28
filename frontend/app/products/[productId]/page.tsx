// src/app/products/[productId]/page.tsx
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@/components/ui/Spinner";
import { Product } from "@/types";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { isAxiosError } from "axios";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { ReviewSection } from "@/components/products/ReviewSection";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.productId);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // to be used below
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

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

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product.id, 1);
    } else {
      // Redirect to login or show message
      alert("Please log in to add items to your cart.");
    }
  };

  const handleToggleWishlist = () => {
    if (isAuthenticated) {
      toggleWishlist(product.id);
    } else {
      alert("Please log in to manage your wishlist.");
    }
  };

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
          <p className="text-lg text-black">{product.seller.brandName}</p>
          <h1 className="text-4xl font-bold mt-2 text-black">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-black">
              ₹{product.oneTimeRentalFee.toLocaleString("en-IN")}
            </span>
            <span className="text-gray-700">per rental</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Insured Value: ₹
            {product.insuredDeclaredValue.toLocaleString("en-IN")}
          </p>

          <div className="mt-6">
            <Button className="w-full md:w-auto">Add to Cart</Button>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-xl text-black">Description</h3>
            <p className="mt-2 text-gray-700">{product.description}</p>
          </div>
          <div className="mt-6 border-t pt-4">
            <p className="text-blue-900">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="text-blue-900">
              <strong>Material:</strong> {product.material}
            </p>
          </div>
        </div>
        {/* add to cart */}
        <div className="mt-6 flex items-center space-x-4">
          <Button onClick={handleAddToCart} className="w-full md:w-auto">
            Add to Cart
          </Button>
          <button onClick={handleToggleWishlist} aria-label="Toggle Wishlist">
            {/* A simple heart icon example */}
            <svg
              className={`w-8 h-8 ${
                isInWishlist(product.id)
                  ? "text-red-500 fill-current"
                  : "text-gray-400"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>
      <ReviewSection productId={productId} />
    </div>
  );
}

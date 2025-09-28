// src/components/products/ProductCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full h-64 bg-gray-200">
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500">{product.seller.brandName}</p>
          <h3 className="mt-1 font-semibold text-lg truncate">
            {product.name}
          </h3>
          <p className="mt-2 text-md font-bold">
            ₹{product.oneTimeRentalFee.toLocaleString("en-IN")} / rental
          </p>
        </div>
      </div>
    </Link>
  );
};

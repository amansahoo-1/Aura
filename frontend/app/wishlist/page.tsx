"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext"; // Import useCart
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function WishlistPage() {
  // Use the correct variables from the Wishlist context
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart(); // Get addToCart function

  // A loading state can be inferred if wishlistItems is not yet populated
  // For a more robust solution, consider adding isLoading to your WishlistContext
  if (!wishlistItems) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  // Check if the wishlist is empty
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-black">
          Your Wishlist is Empty
        </h1>
        <p className="text-gray-600 mt-2">
          Explore our products and save your favorites!
        </p>
        <Link href="/products" passHref>
          <Button className="mt-6">Discover Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-black font-bold mb-6">
        Your Wishlist ({wishlistItems.length} items)
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.product.id}
            className="border rounded-lg overflow-hidden shadow-sm flex flex-col"
          >
            <Link href={`/products/${item.product.id}`} passHref>
              <div className="relative w-full h-64 bg-gray-200">
                <Image
                  src={item.product.imageUrls[0]}
                  alt={item.product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="font-semibold text-lg text-black flex-grow">
                {item.product.name}
              </h2>
              <p className="font-bold my-2 text-black">
                ₹{item.product.oneTimeRentalFee.toLocaleString("en-IN")}
              </p>
              <div className="mt-auto space-y-2">
                <Button
                  onClick={() => addToCart(item.product.id, 1)}
                  className="w-full"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => toggleWishlist(item.product.id)}
                  variant="outline"
                  className="w-full"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

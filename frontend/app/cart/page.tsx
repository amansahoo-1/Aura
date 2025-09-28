"use client";

import { useCart } from "@/context/CartContext";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { cart, isLoading, removeFromCart, clearCart } = useCart();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-black">Your Cart is Empty</h1>
        <Link
          href="/products"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-black font-bold mb-6">
        Your Cart ({cart.meta.itemCount} items)
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ul className="divide-y divide-gray-200">
            {cart.items.map((item) => (
              <li key={item.id} className="py-4 flex">
                <Image
                  src={item.product.imageUrls[0]}
                  alt={item.product.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
                <div className="ml-4 flex-grow">
                  <h2 className="font-semibold text-black">
                    {item.product.name}
                  </h2>
                  <p className="text-sm text-black">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-bold mt-2 text-black">
                    ₹{item.product.oneTimeRentalFee.toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={clearCart}
            className="mt-4 text-sm text-gray-600 hover:text-red-600"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg self-start">
          <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-black">Subtotal</span>
              <span className="text-black">
                ₹{cart.meta.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Tax (10%)</span>
              <span className="text-black">
                ₹{cart.meta.tax.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span className="text-black">Total</span>
              <span className="text-black">
                ₹{cart.meta.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <Button className="w-full mt-6 text-black">
            Proceed to Checkout
          </Button>
        </div>
      </div>
      <Link href="/checkout" passHref>
        <Button className="w-full mt-6 text-black">Proceed to Checkout</Button>
      </Link>
    </div>
  );
}

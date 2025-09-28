"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { Address, InitiatedRental } from "@/types";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { isAxiosError } from "axios";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await api.get("/users/addresses");
        setAddresses(response.data.data);
        // Pre-select the default address or the first one
        const defaultAddress =
          response.data.data.find((a: Address) => a.isDefault) ||
          response.data.data[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (err) {
        setError("Could not load your addresses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, router]);

  const handleInitiateRental = async () => {
    if (!selectedAddressId || !cart?.items) {
      setError("Please select a shipping address.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const productIds = cart.items.map((item) => item.product.id);
      const response = await api.post("/rentals/initiate", {
        productIds,
        addressId: selectedAddressId,
      });
      const rental: InitiatedRental = response.data.data;
      // Redirect to the payment confirmation page
      router.push(`/checkout/${rental.id}/confirm`);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Checkout failed. Please check your credentials."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  if (!cart || cart.items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Select Shipping Address</h2>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedAddressId === address.id
                    ? "border-purple-600 ring-2 ring-purple-200"
                    : "border-gray-300"
                }`}
              >
                <p className="font-semibold">{address.addressLine}</p>
                <p>
                  {address.city}, {address.state} - {address.postalCode}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg self-start">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cart.meta.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{cart.meta.tax.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>₹{cart.meta.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <Button
            className="w-full mt-6"
            onClick={handleInitiateRental}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Place Order & Proceed to Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { isAxiosError } from "axios";

export default function ConfirmPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const rentalId = Number(params.rentalId);
  const { clearCart } = useCart();

  const handleConfirmPayment = async () => {
    try {
      // In a real app, this data would come from a payment provider like Stripe or Razorpay
      const paymentData = {
        paymentGatewayId: `pi_${new Date().getTime()}`,
        paymentMethod: "CARD",
      };

      await api.post(`/rentals/${rentalId}/confirm-payment`, paymentData);

      // Clear the cart on the frontend after successful payment
      await clearCart();

      alert("Payment successful! Your rental is confirmed.");
      router.push("/dashboard/user/rentals");
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        alert(err.response?.data?.message || "Payment confirmation failed.");
      }
    }
  };

  // In a real app, you would fetch the initiated rental details here to show the fee breakdown
  // For this example, we'll just show the confirmation button.

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Confirm Your Rental</h1>
      <p className="text-gray-600 mb-8">
        Your items are reserved. Please confirm your payment to complete the
        rental process.
      </p>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        {/* Display fee breakdown here by fetching rental details */}
        <h2 className="text-xl font-bold mb-4">Final Payment</h2>
        <p className="mb-6">
          Clicking below will simulate a successful payment and activate your
          rental.
        </p>
        <Button className="w-full" onClick={handleConfirmPayment}>
          Confirm Payment & Activate Rental
        </Button>
      </div>
    </div>
  );
}

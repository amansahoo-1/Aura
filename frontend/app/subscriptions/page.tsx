"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { SubscriptionPlan } from "@/types";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/subscriptions/plans");
        setPlans(response.data.data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = (planId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    // Simulate payment and subscription
    const paymentData = {
      planId,
      paymentGatewayId: `sub_${new Date().getTime()}`,
      paymentMethod: "CARD",
    };
    api
      .post("/subscriptions/subscribe", paymentData)
      .then(() => {
        alert("Successfully subscribed!");
        router.push("/dashboard/user");
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Subscription failed.")
      );
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Our Subscription Plans
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border rounded-lg p-6 text-center flex flex-col"
          >
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="text-4xl font-extrabold my-4">₹{plan.price}</p>
            <p className="text-gray-500">per month</p>
            <ul className="my-6 space-y-2 text-gray-600 flex-grow">
              <li>Rent up to {plan.itemLimit} items</li>
              {plan.description && <li>{plan.description}</li>}
            </ul>
            <Button onClick={() => handleSubscribe(plan.id)}>
              Subscribe Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

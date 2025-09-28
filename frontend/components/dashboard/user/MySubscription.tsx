"use client";

import React, { useState, useEffect } from "react";
import { UserSubscription } from "@/types";
import api from "@/lib/axios";
import { Spinner } from "@/components/ui/Spinner";
import { isAxiosError } from "axios";

export const MySubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/subscriptions/me");
      setSubscription(response.data.data);
    } catch (err) {
      // ✅ 2. Catch the error as 'unknown'
      // 404 is expected if user has no subscription, so we only log other errors.
      // ✅ 3. Use the type guard to safely check the error status
      if (isAxiosError(err) && err.response?.status !== 404) {
        console.error("Failed to fetch subscription", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-cyan-800">My Subscription</h2>
      {subscription ? (
        <div>
          <p>
            <strong>Plan:</strong> {subscription.plan.name}
          </p>
          <p>
            <strong>Status:</strong> {subscription.status}
          </p>
          <p>
            <strong>Renews on:</strong>{" "}
            {new Date(subscription.currentPeriodEndDate).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p className="text-black">You do not have an active subscription.</p>
      )}
    </div>
  );
};

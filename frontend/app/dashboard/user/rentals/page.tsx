"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Rental } from "@/types";
import { Spinner } from "@/components/ui/Spinner";

export default function RentalHistoryPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        // NOTE: The backend doesn't have a getMyRentals endpoint yet.
        // We are assuming one will be created at '/users/rentals/me'
        const response = await api.get("/users/rentals/me");
        setRentals(response.data.data);
      } catch (err) {
        console.error("Failed to fetch rental history.", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRentals();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-black">My Rental History</h2>
      {rentals.length > 0 ? (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div key={rental.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Rental #{rental.id}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(rental.rentalDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-semibold">{rental.status}</span>
              </div>
              <p className="text-sm mt-2 text-amber-950">
                Due Date: {new Date(rental.dueDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-black">You have no past rentals.</p>
      )}
    </div>
  );
}

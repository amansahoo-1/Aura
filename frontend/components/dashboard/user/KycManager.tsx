"use client";

import React, { useState, useEffect } from "react";
import { KycStatus } from "@/types";
import api from "@/lib/axios";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { isAxiosError } from "axios";

const KycStatusBadge = ({ status }: { status: KycStatus }) => {
  const styles = {
    NOT_VERIFIED: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    VERIFIED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export const KycManager = () => {
  const [status, setStatus] = useState<KycStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await api.get("/kyc/status");
        setStatus(response.data.data.kycStatus);
      } catch (err) {
        console.error("Failed to get KYC status", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKycStatus();
  }, []);

  const handleInitiateKyc = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      // In a real app, you would collect document info here
      const mockKycData = {
        documentType: "AADHAAR",
        documentNumber: "123456789012",
      };
      const response = await api.post("/kyc/initiate", mockKycData);
      setStatus(response.data.data.kycStatus);
    } catch (err) {
      // Catch the error as 'unknown'
      let errorMessage = "Could not start KYC process.";
      // Check if it's an Axios error
      if (isAxiosError(err) && err.response) {
        // Safely access the server's error message
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-cyan-800">
        Identity Verification (KYC)
      </h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-black">Your Status:</span>
            {status ? (
              <KycStatusBadge status={status} />
            ) : (
              <p className="text-black">Could not load status.</p>
            )}
          </div>
          {status === "NOT_VERIFIED" || status === "REJECTED" ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {status === "REJECTED"
                  ? "Your previous submission was rejected. Please try again."
                  : "Please complete your identity verification to access all features."}
              </p>
              <Button onClick={handleInitiateKyc} disabled={isLoading}>
                Start Verification
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          ) : null}
          {status === "PENDING" && (
            <p className="text-sm text-yellow-700">
              Your documents are under review. This may take up to 24 hours.
            </p>
          )}
          {status === "VERIFIED" && (
            <p className="text-sm text-green-700">
              Your account is verified. Thank you!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

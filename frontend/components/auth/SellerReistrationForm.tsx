"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isAxiosError } from "axios";
import { SellerRegistrationPayload } from "@/types";

export const SellerRegisterForm = () => {
  const [formData, setFormData] = useState<SellerRegistrationPayload>({
    brandName: "",
    contactPerson: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create a payload copy and remove the phone field if it's empty
      const payload: Partial<SellerRegistrationPayload> = { ...formData };
      if (!payload.phone) {
        delete payload.phone;
      }

      await api.post("/auth/register/seller", payload);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <Input
        className="text-black"
        name="brandName" // ✅ Corrected: Was "BrandName"
        type="text"
        placeholder="Brand Name"
        value={formData.brandName}
        onChange={handleChange}
        required
      />
      <Input
        className="text-black"
        name="contactPerson" // ✅ Corrected: Was "Contact Person"
        type="text"
        placeholder="Contact Person"
        value={formData.contactPerson}
        onChange={handleChange}
        required
      />
      <Input
        className="text-black"
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        className="text-black"
        name="phone" // ✨ Added: Optional phone input
        type="tel"
        placeholder="Phone Number (Optional)"
        value={formData.phone}
        onChange={handleChange}
      />
      <Input
        className="text-black"
        name="password"
        type="password"
        placeholder="Password (min 8 characters)"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={8}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

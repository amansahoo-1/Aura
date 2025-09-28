"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isAxiosError } from "axios";
import { UserRegistrationPayload } from "@/types";

export const UserRegisterForm = () => {
  const [formData, setFormData] = useState<UserRegistrationPayload>({
    name: "",
    email: "",
    password: "",
    phone: "",
    initialAddress: {
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle nested state for address fields
    if (Object.keys(formData.initialAddress!).includes(name)) {
      setFormData((prev) => ({
        ...prev,
        initialAddress: { ...prev.initialAddress!, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Clean up optional fields before sending to the API
      const payload: Partial<UserRegistrationPayload> = { ...formData };
      if (!payload.phone) delete payload.phone;
      if (!payload.initialAddress?.addressLine) delete payload.initialAddress;

      await api.post("/auth/register/user", payload);
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
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 ">
      <Input
        name="name"
        className="text-black"
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        name="email"
        className="text-black"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        name="phone" // ✨ Added phone input
        className="text-black"
        type="tel"
        placeholder="Phone Number (Optional)"
        value={formData.phone}
        onChange={handleChange}
      />
      <Input
        name="password"
        className="text-black"
        type="password"
        placeholder="Password (min 8 characters)"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={8}
      />

      <div className="pt-4 mt-4 border-t">
        <h3 className="text-md font-semibold text-gray-700">
          Shipping Address (Optional)
        </h3>
        <div className="space-y-4 mt-2">
          <Input
            name="addressLine"
            className="text-black"
            type="text"
            placeholder="Address Line"
            value={formData.initialAddress?.addressLine}
            onChange={handleChange}
          />
          <Input
            name="city"
            className="text-black"
            type="text"
            placeholder="City"
            value={formData.initialAddress?.city}
            onChange={handleChange}
          />
          <Input
            name="state"
            className="text-black"
            type="text"
            placeholder="State / Province"
            value={formData.initialAddress?.state}
            onChange={handleChange}
          />
          <Input
            name="postalCode"
            className="text-black"
            type="text"
            placeholder="Postal Code"
            value={formData.initialAddress?.postalCode}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

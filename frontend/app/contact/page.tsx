"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { isAxiosError } from "axios";

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/inquiries/create", { message });
      setSuccess(
        "Your message has been sent successfully! We will get back to you soon."
      );
      setMessage("");
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to send message.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Contact Us</h1>
        <p className="text-gray-600 text-center mb-8">
          Have a question? We Would love to hear from you.
        </p>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-8 rounded-lg shadow-md"
        >
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your inquiry in detail..."
              required
              minLength={10}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Submit Inquiry"}
          </Button>
        </form>
      </div>
    </div>
  );
}

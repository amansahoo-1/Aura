// frontend/components/dashboard/seller/products/new/page.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { isAxiosError } from "axios";
import { NewProduct } from "@/types/index";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button"; // Assuming you have a styled Button
import { Spinner } from "@/components/ui/Spinner"; // Assuming a Spinner component

// Initial state for the form
const initialState: NewProduct = {
  name: "",
  description: "",
  imageUrls: [],
  category: "",
  material: "",
  oneTimeRentalFee: 0,
  insuredDeclaredValue: 0,
};

export default function AddProductPage() {
  const [product, setProduct] = useState<NewProduct>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Clear feedback messages on new input
    setError(null);
    setSuccess(null);

    // Handle special cases for numbers and the image URL array
    if (name === "oneTimeRentalFee" || name === "insuredDeclaredValue") {
      setProduct({ ...product, [name]: parseFloat(value) || 0 });
    } else if (name === "imageUrls") {
      // Split comma-separated string into an array of URLs
      const urls = value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
      setProduct({ ...product, imageUrls: urls });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // API call to the backend endpoint defined in your sellerRouter
      await api.post("/sellers/products", product);

      setSuccess("Product created successfully! It is now pending approval.");
      setProduct(initialState); // Reset form on success
    } catch (err) {
      if (isAxiosError(err)) {
        // Use the error message from the backend if available
        setError(err.response?.data?.message || "Failed to create product.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-black mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className=" text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={3}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={4}
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={20}
          />
        </div>

        {/* Image URLs */}
        <div>
          <label
            htmlFor="imageUrls"
            className="block text-sm font-medium text-gray-700"
          >
            Image URLs (comma-separated)
          </label>
          <input
            type="text"
            id="imageUrls"
            name="imageUrls"
            value={product.imageUrls.join(", ")}
            onChange={handleChange}
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Category & Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="material"
              className="block text-sm font-medium text-gray-700"
            >
              Material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              value={product.material}
              onChange={handleChange}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="oneTimeRentalFee"
              className="block text-sm font-medium text-gray-700"
            >
              One-Time Rental Fee (₹)
            </label>
            <input
              type="number"
              id="oneTimeRentalFee"
              name="oneTimeRentalFee"
              value={product.oneTimeRentalFee}
              onChange={handleChange}
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>
          <div>
            <label
              htmlFor="insuredDeclaredValue"
              className="block text-sm font-medium text-gray-700"
            >
              Insured Declared Value (₹)
            </label>
            <input
              type="number"
              id="insuredDeclaredValue"
              name="insuredDeclaredValue"
              value={product.insuredDeclaredValue}
              onChange={handleChange}
              className=" text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>
        </div>

        {/* Feedback Messages */}
        {error && <p className="text-red-600 text-sm ">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center"
          >
            {isLoading ? <Spinner /> : "Add Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

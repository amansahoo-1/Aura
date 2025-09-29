"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { NewProduct } from "@/types/index";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

const initialState: Omit<NewProduct, "imageUrls"> = {
  name: "",
  description: "",
  category: "",
  material: "",
  oneTimeRentalFee: 0,
  insuredDeclaredValue: 0,
};

export default function AddProductForm() {
  const [product, setProduct] = useState(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setError(null);
    setSuccess(null);

    if (name === "oneTimeRentalFee" || name === "insuredDeclaredValue") {
      setProduct({ ...product, [name]: parseFloat(value) || 0 });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select an image to upload.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Upload the image to Cloudinary
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadResponse = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = uploadResponse.data.data.url;

      // Step 2: Create the product with the uploaded image URL
      const finalProductData: NewProduct = {
        ...product,
        imageUrls: [imageUrl],
      };

      await api.post("/sellers/products", finalProductData);

      setSuccess("Product created successfully! It is now pending approval.");
      setProduct(initialState);
      setImageFile(null);
      // Optional: Redirect after a delay
      setTimeout(() => router.push("/dashboard/seller"), 2000);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create product.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-black mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          minLength={3}
          className="w-full p-2 text-black border rounded"
        />
        {/* Description */}
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          required
          minLength={20}
          rows={4}
          className="w-full p-2 text-black border rounded"
        />

        {/* Image Upload Input */}
        <div>
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-gray-700"
          >
            Product Image
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleFileChange}
            accept="image/*"
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>

        {/* Category & Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="w-full p-2 text-black border rounded"
          />
          <input
            name="material"
            value={product.material}
            onChange={handleChange}
            placeholder="Material"
            required
            className="w-full p-2 text-black border rounded"
          />
        </div>

        {/* Fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="oneTimeRentalFee"
            type="number"
            value={product.oneTimeRentalFee}
            onChange={handleChange}
            placeholder="Rental Fee (₹)"
            required
            min="1"
            className="w-full p-2 text-black border rounded"
          />
          <input
            name="insuredDeclaredValue"
            type="number"
            value={product.insuredDeclaredValue}
            onChange={handleChange}
            placeholder="Insured Value (₹)"
            required
            min="1"
            className="w-full p-2 text-black border rounded"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

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

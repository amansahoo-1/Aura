// will solve later using axios error solution

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { Review } from "@/types";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { isAxiosError } from "axios";

interface ReviewSectionProps {
  productId: number;
}

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating?: (rating: number) => void;
}) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        title="Rate {star} star"
        key={star}
        onClick={() => setRating?.(star)}
        disabled={!setRating}
      >
        <svg
          className={`w-6 h-6 ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </button>
    ))}
  </div>
);

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for submitting a new review
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      setReviews(response.data.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      setComment("");
      setRating(5);
      await fetchReviews(); // Refresh reviews list
    } catch (error) {
      let errorMessage = "Failed to submit review.";
      if (isAxiosError(error) && error.response) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-black">Customer Reviews</h2>
      {isAuthenticated && (
        <form
          onSubmit={handleReviewSubmit}
          className="mb-8 bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg text-black font-semibold mb-2">
            Leave a Review
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            You can only review products you have rented.
          </p>
          <div className="mb-4">
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-md text-cyan-800"
            placeholder="Share your experience..."
          />
          {formError && (
            <p className="text-red-500 text-sm mt-2">{formError}</p>
          )}
          <Button type="submit" disabled={isSubmitting} className="mt-4">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.user.name}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="my-2">
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-black">
              No reviews yet. Be the first to leave one!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

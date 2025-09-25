"use client";
import { useEffect, useState } from "react";
import { useProduct } from "@/hooks/useProduct";
import api from "@/lib/api";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
};

export default function ReviewsSection() {
  const { id: productId } = useProduct();
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    api
      .get(`/products/${productId}/reviews`)
      .then((res) => setReviews(res.data.data))
      .catch(() => setReviews([]));
  }, [productId]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-2 text-gray-800">Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev.id} className="border-b pb-3 mb-3">
            <div className="font-semibold">{rev.user.name}</div>
            <div className="text-yellow-500 text-sm mb-1">
              {"★".repeat(rev.rating)}
            </div>
            <div className="text-gray-700 text-sm">{rev.comment}</div>
          </div>
        ))
      )}
    </div>
  );
}

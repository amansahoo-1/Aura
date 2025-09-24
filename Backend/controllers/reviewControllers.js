// backend/controllers/reviewController.js

import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

/**
 * @desc    Create a new review for a product
 * @route   POST /api/products/:productId/reviews
 * @access  Private/User
 */
export const createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId, 10);
  const { rating, comment } = req.body;

  // --- Business Logic Validation ---
  // 1. Check if the user has already reviewed this product.
  const existingReview = await prisma.review.findFirst({
    where: { userId, productId },
  });
  if (existingReview) {
    return errorResponse(res, "You have already reviewed this product.", 400);
  }

  // 2. IMPORTANT: Check if the user has completed a rental for this product.
  const validRental = await prisma.rental.findFirst({
    where: {
      userId,
      status: "COMPLETE",
      items: {
        some: {
          item: { productId: productId },
        },
      },
    },
  });

  if (!validRental) {
    return errorResponse(
      res,
      "You can only review products you have rented.",
      403
    );
  }
  // --- End Validation ---

  const newReview = await prisma.review.create({
    data: {
      rating,
      comment,
      userId,
      productId,
    },
  });

  return successResponse(res, newReview, "Thank you for your review!", 201);
});

/**
 * @desc    Get all reviews for a specific product
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
export const getReviewsForProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } }, // Include the reviewer's name
    },
  });

  return successResponse(
    res,
    reviews,
    `Reviews for product ${productId} retrieved.`
  );
});

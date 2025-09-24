// backend/controllers/wishlistController.js

import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

/**
 * @desc    Get the logged-in user's wishlist
 * @route   GET /api/wishlist
 * @access  Private/User
 */
export const getMyWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { addedAt: "desc" },
        include: {
          product: {
            // Include full product details for each wishlist item
            include: { seller: { select: { brandName: true } } },
          },
        },
      },
    },
  });

  if (!wishlist) {
    // This should ideally not happen if wishlist is created on user registration
    return errorResponse(res, "Wishlist not found.", 404);
  }

  return successResponse(res, wishlist, "Wishlist retrieved successfully.");
});

/**
 * @desc    Add a product to the user's wishlist
 * @route   POST /api/wishlist
 * @access  Private/User
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });

  // Using upsert is efficient and prevents duplicates. If the item already exists, it does nothing.
  const wishlistItem = await prisma.wishlistItem.upsert({
    where: {
      wishlistId_productId: { wishlistId: wishlist.id, productId },
    },
    create: { wishlistId: wishlist.id, productId },
    update: {}, // No action needed if it already exists
  });

  return successResponse(res, wishlistItem, "Product added to wishlist.", 201);
});

/**
 * @desc    Remove a product from the user's wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private/User
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId, 10);

  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });

  await prisma.wishlistItem.delete({
    where: {
      wishlistId_productId: { wishlistId: wishlist.id, productId },
    },
  });

  return successResponse(res, null, "Product removed from wishlist.");
});

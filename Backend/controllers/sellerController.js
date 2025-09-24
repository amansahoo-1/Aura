// backend/controllers/sellerController.js

import prisma from "../client/prismaClient.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateSellerToken } from "../utils/jwt.js"; // You will need to create this
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

// --- Seller Profile Management ---

export const getSellerProfile = asyncHandler(async (req, res) => {
  const sellerId = req.user.id; // From auth token
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    select: {
      id: true,
      brandName: true,
      contactPerson: true,
      email: true,
      phone: true,
      address: true,
      status: true,
      kycStatus: true,
      bankDetails: true,
    },
  });
  return successResponse(res, seller, "Profile retrieved successfully");
});

export const updateSellerProfile = asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const updatedSeller = await prisma.seller.update({
    where: { id: sellerId },
    data: req.body,
    select: { id: true, contactPerson: true, phone: true, address: true },
  });
  return successResponse(res, updatedSeller, "Profile updated successfully");
});

// --- Seller Product Management (CRUD) ---

export const createProduct = asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const newProduct = await prisma.product.create({
    data: {
      ...req.body,
      sellerId: sellerId,
    },
  });
  return successResponse(
    res,
    newProduct,
    "Product created and awaiting approval",
    201
  );
});

export const getMyProducts = asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const products = await prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });
  return successResponse(res, products, "Your products retrieved successfully");
});

export const updateMyProduct = asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const productId = parseInt(req.params.productId, 10);

  // Security check: Ensure the product belongs to the logged-in seller
  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId: sellerId },
  });

  if (!product) {
    return errorResponse(
      res,
      "Product not found or you do not have permission to edit it.",
      404
    );
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: req.body,
  });
  return successResponse(res, updatedProduct, "Product updated successfully");
});

// --- Seller Financials ---

export const getMyPayouts = asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const payouts = await prisma.payout.findMany({
    where: { sellerId },
    orderBy: { payoutDate: "desc" },
  });
  return successResponse(res, payouts, "Payout history retrieved successfully");
});

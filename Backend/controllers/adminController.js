// backend/controllers/adminController.js

import prisma from "../client/prismaClient.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { generateAdminToken } from "../utils/jwt.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";
import { Role, UserStatus, KycStatus } from "@prisma/client";

export const adminSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

// --- Admin Account Management ---
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return errorResponse(res, "Email already exists", 409);

  const hashedPassword = await hashPassword(password);
  const newAdmin = await prisma.admin.create({
    data: { name, email, password: hashedPassword, role },
    select: adminSelectFields,
  });

  return successResponse(res, newAdmin, "Admin created", 201);
});

// ⚠️ MAJOR CHANGE: This now performs a HARD DELETE.
export const deleteAdmin = asyncHandler(async (req, res) => {
  const adminId = parseInt(req.params.adminId, 10);
  if (req.user.id === adminId) {
    return errorResponse(res, "Admins cannot delete their own account.", 403);
  }

  await prisma.admin.delete({ where: { id: adminId } });
  return successResponse(res, null, "Admin deleted permanently");
});

// --- User Management by Admin ---

// ✨ NEW: Get all users with status and KYC info
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      kycStatus: true,
      createdAt: true,
    },
  });
  return successResponse(res, users, "Users retrieved successfully");
});

// ✨ NEW: Update a user's account status (e.g., suspend them)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { status } = req.body; // Expects "ACTIVE", "SUSPENDED", "DELETED"

  if (!Object.values(UserStatus).includes(status)) {
    return errorResponse(res, "Invalid status provided", 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, status: true },
  });
  return successResponse(res, updatedUser, "User status updated");
});

// --- Seller Management by Admin ---

// ✨ NEW: Get all sellers for review
export const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await prisma.seller.findMany({
    select: {
      id: true,
      brandName: true,
      email: true,
      status: true,
      kycStatus: true,
      createdAt: true,
    },
  });
  return successResponse(res, sellers, "Sellers retrieved successfully");
});

// ✨ NEW: Update a seller's KYC status after verification
export const updateSellerKycStatus = asyncHandler(async (req, res) => {
  const sellerId = parseInt(req.params.sellerId, 10);
  const { kycStatus } = req.body; // Expects "VERIFIED", "REJECTED"

  if (![KycStatus.VERIFIED, KycStatus.REJECTED].includes(kycStatus)) {
    return errorResponse(res, "Invalid KYC status provided", 400);
  }

  const updatedSeller = await prisma.seller.update({
    where: { id: sellerId },
    data: { kycStatus },
    select: { id: true, brandName: true, kycStatus: true },
  });
  return successResponse(res, updatedSeller, "Seller KYC status updated");
});

// ✨ NEW: Update a user's KYC status after verification
export const updateUserKycStatus = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { kycStatus } = req.body; // Expects "VERIFIED", "REJECTED"

  if (![KycStatus.VERIFIED, KycStatus.REJECTED].includes(kycStatus)) {
    return errorResponse(res, "Invalid KYC status provided", 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { kycStatus },
    select: { id: true, name: true, kycStatus: true },
  });
  return successResponse(res, updatedUser, "User KYC status updated");
});

// Add these two new functions to your adminController.js file

// ... other functions like getAllUsers, etc.

/**
 * @desc    Get a single user's details for an admin
 * @route   GET /api/admins/users/:userId
 * @access  Private/Admin
 */
export const getUserByIdForAdmin = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    // Select all relevant fields an admin would need
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      kycStatus: true,
      createdAt: true,
      _count: { select: { rentals: true, addresses: true } },
    },
  });

  if (!user) {
    return errorResponse(res, "User not found", 404);
  }
  return successResponse(res, user, "User details retrieved");
});

/**
 * @desc    Get a single seller's details for an admin
 * @route   GET /api/admins/sellers/:sellerId
 * @access  Private/Admin
 */
export const getSellerByIdForAdmin = asyncHandler(async (req, res) => {
  const sellerId = parseInt(req.params.sellerId, 10);
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    select: {
      id: true,
      brandName: true,
      contactPerson: true,
      email: true,
      phone: true,
      status: true,
      kycStatus: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
  });

  if (!seller) {
    return errorResponse(res, "Seller not found", 404);
  }
  return successResponse(res, seller, "Seller details retrieved");
});

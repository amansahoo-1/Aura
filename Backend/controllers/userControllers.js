// backend/controllers/userController.js

import prisma from "../client/prismaClient.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateUserToken } from "../utils/jwt.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

// --- User Authentication & Profile ---

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Get ID from auth token
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      kycStatus: true,
      createdAt: true,
      // ✨ NEW: Include related data in the user's profile
      addresses: true,
      subscription: true,
    },
  });
  if (!user) return errorResponse(res, "User not found", 404);
  successResponse(res, user, "Profile retrieved successfully");
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, phone } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, phone },
    select: { id: true, name: true, email: true, phone: true },
  });
  successResponse(res, updatedUser, "Profile updated successfully");
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // ✅ FIX: Add check to prevent deleting users with rentals
  const rentalCount = await prisma.rental.count({ where: { userId } });
  if (rentalCount > 0) {
    return errorResponse(
      res,
      "Cannot delete account with existing rental history.",
      400
    );
  }

  // ✅ FIX: Transaction now correctly deletes payments before deleting the user
  await prisma.$transaction([
    prisma.payment.deleteMany({ where: { userId } }),
    // Other deletes like Cart, Wishlist, Address are handled by `onDelete: Cascade`
    prisma.user.delete({ where: { id: userId } }),
  ]);

  successResponse(
    res,
    { deletedUserId: userId },
    "User account deleted successfully"
  );
});

// --- Address Management ---

//  NEW: Controller to add a new address for the logged-in user
export const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressData = req.body;
  const newAddress = await prisma.address.create({
    data: { userId, ...addressData },
  });
  successResponse(res, newAddress, "Address added successfully", 201);
});

//  NEW: Controller to list all addresses for the logged-in user
export const listAddresses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addresses = await prisma.address.findMany({ where: { userId } });
  successResponse(res, addresses, "Addresses retrieved successfully");
});

//  NEW: Controller to update an existing address
export const updateAddress = asyncHandler(async (req, res) => {
  const addressId = parseInt(req.params.addressId, 10);
  const updatedAddress = await prisma.address.update({
    where: { id: addressId },
    data: req.body,
  });
  successResponse(res, updatedAddress, "Address updated successfully");
});

//  NEW: Controller to delete an address
export const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = parseInt(req.params.addressId, 10);
  await prisma.address.delete({ where: { id: addressId } });
  successResponse(
    res,
    { deletedAddressId: addressId },
    "Address deleted successfully"
  );
});

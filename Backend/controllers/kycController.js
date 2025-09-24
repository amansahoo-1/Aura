// backend/controllers/kycController.js

import prisma from "../client/prismaClient.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";

/**
 * @desc    Get the KYC status for the logged-in user or seller
 * @route   GET /api/kyc/status
 * @access  Private (User or Seller)
 */
export const getMyKycStatus = asyncHandler(async (req, res) => {
  const entityId = req.user.id;
  const role = req.user.role; // Assuming role is in the JWT payload

  let kycStatus;

  if (role === "SELLER") {
    const seller = await prisma.seller.findUnique({
      where: { id: entityId },
      select: { kycStatus: true },
    });
    kycStatus = seller?.kycStatus;
  } else {
    // Default to User
    const user = await prisma.user.findUnique({
      where: { id: entityId },
      select: { kycStatus: true },
    });
    kycStatus = user?.kycStatus;
  }

  if (!kycStatus) {
    return errorResponse(
      res,
      "Could not find KYC status for this account.",
      404
    );
  }

  return successResponse(res, { kycStatus }, "KYC status retrieved.");
});

/**
 * @desc    Initiate the KYC verification process
 * @route   POST /api/kyc/initiate
 * @access  Private (User or Seller)
 */
export const initiateKycVerification = asyncHandler(async (req, res) => {
  const entityId = req.user.id;
  const role = req.user.role;
  const model = role === "SELLER" ? "seller" : "user";

  const entity = await prisma[model].findUnique({
    where: { id: entityId },
    select: { kycStatus: true },
  });

  if (entity.kycStatus === "PENDING" || entity.kycStatus === "VERIFIED") {
    return errorResponse(
      res,
      `Your KYC status is already ${entity.kycStatus}.`,
      400
    );
  }

  // This is where you would integrate with a third-party KYC provider
  // or generate a secure URL for the user to upload their documents to a service like AWS S3.
  // For now, we simply update the status to PENDING.

  await prisma[model].update({
    where: { id: entityId },
    data: { kycStatus: "PENDING" },
  });

  return successResponse(
    res,
    { kycStatus: "PENDING" },
    "KYC verification process initiated. Our team will review your submission."
  );
});

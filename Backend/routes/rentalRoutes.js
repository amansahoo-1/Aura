// backend/routes/rentalRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  initiateRental,
  confirmRentalPayment,
  updateRentalStatus,
  updateRentalLogistics,
  // getRentalHistory, // Assuming this will be on a user-specific route
  // getRentalById,
} from "../controllers/rentalControllers.js";
import {
  rentalInitiateSchema,
  rentalConfirmPaymentSchema,
  rentalStatusUpdateSchema,
  rentalUpdateLogisticsSchema,
  rentalIdParamSchema,
} from "../validations/rental.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAuth,
  checkAccountStatus,
  checkRole,
} from "../middleware/authMiddleware.js";
import { Role } from "@prisma/client/index.js";

const rentalRouter = express.Router();

// All routes below require an authenticated, active user
rentalRouter.use(authenticate, requireAuth(), checkAccountStatus);

// --- User-Facing Routes ---
const userOnly = checkRole(["USER"]);

// Step 1 - User initiates a rental checkout
rentalRouter.post(
  "/initiate",
  userOnly,
  validateRequest({ body: rentalInitiateSchema }),
  asyncHandler(initiateRental)
);

// Step 2 - User confirms the rental after payment
rentalRouter.post(
  "/:rentalId/confirm-payment",
  userOnly,
  validateRequest({
    params: rentalIdParamSchema,
    body: rentalConfirmPaymentSchema,
  }),
  asyncHandler(confirmRentalPayment)
);

// --- Admin & Operations Routes ---
const adminAndOpsRoles = [Role.ADMIN, Role.SUPERADMIN, Role.OPERATIONS];

// Admin updates the status of a rental
rentalRouter.patch(
  "/:rentalId/status",
  checkRole(adminAndOpsRoles),
  validateRequest({
    params: rentalIdParamSchema,
    body: rentalStatusUpdateSchema,
  }),
  asyncHandler(updateRentalStatus)
);

// Admin updates logistics info for a rental
rentalRouter.patch(
  "/:rentalId/logistics",
  checkRole(adminAndOpsRoles),
  validateRequest({
    params: rentalIdParamSchema,
    body: rentalUpdateLogisticsSchema,
  }),
  asyncHandler(updateRentalLogistics)
);

export default rentalRouter;

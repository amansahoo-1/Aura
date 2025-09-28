// backend/routes/adminRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createAdmin,
  deleteAdmin,
  getAllUsers,
  updateUserStatus,
  getAllSellers,
  updateSellerKycStatus,
  updateUserKycStatus,
  getUserByIdForAdmin,
  getSellerByIdForAdmin,
} from "../controllers/adminController.js";
import {
  adminCreateSchema,
  adminIdParamSchema,
} from "../validations/admin.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAuth,
  checkAccountStatus,
  checkRole,
} from "../middleware/authMiddleware.js";
import { Role, UserStatus, KycStatus } from "@prisma/client";
import { z } from "zod";

const adminRouter = express.Router();

// --- Protected Admin Routes ---
// ✅ FIX: The router now correctly assumes a user is already authenticated.
adminRouter.use(authenticate, requireAuth(), checkAccountStatus);

// --- SuperAdmin Only: Admin User Management ---
const superAdminOnly = checkRole([Role.SUPERADMIN]);

adminRouter.post(
  "/",
  superAdminOnly,
  validateRequest({ body: adminCreateSchema }),
  asyncHandler(createAdmin)
);
adminRouter.delete(
  "/:adminId",
  superAdminOnly,
  validateRequest({ params: adminIdParamSchema }),
  asyncHandler(deleteAdmin)
);

// --- Admin & Ops: Marketplace Management ---
const managementRoles = [Role.SUPERADMIN, Role.ADMIN, Role.OPERATIONS];

// Routes for managing Users
adminRouter.get(
  "/users",
  checkRole(managementRoles),
  asyncHandler(getAllUsers)
);

adminRouter.patch(
  "/users/:userId/status",
  checkRole(managementRoles),
  validateRequest({
    params: z.object({ userId: z.coerce.number() }),
    body: z.object({ status: z.nativeEnum(UserStatus) }),
  }),
  asyncHandler(updateUserStatus)
);

adminRouter.patch(
  "/users/:userId/kyc",
  checkRole(managementRoles),
  validateRequest({
    params: z.object({ userId: z.coerce.number() }),
    body: z.object({ kycStatus: z.nativeEnum(KycStatus) }),
  }),
  asyncHandler(updateUserKycStatus)
);

// routes of managing individual seller and users
adminRouter.get(
  "/users/:userId",
  checkRole(managementRoles),
  validateRequest({ params: z.object({ userId: z.coerce.number() }) }),
  asyncHandler(getUserByIdForAdmin)
);

adminRouter.get(
  "/sellers/:sellerId",
  checkRole(managementRoles),
  validateRequest({ params: z.object({ sellerId: z.coerce.number() }) }),
  asyncHandler(getSellerByIdForAdmin)
);

// Routes for managing Sellers
adminRouter.get(
  "/sellers",
  checkRole(managementRoles),
  asyncHandler(getAllSellers)
);

adminRouter.patch(
  "/sellers/:sellerId/kyc",
  checkRole(managementRoles),
  validateRequest({
    params: z.object({ sellerId: z.coerce.number() }),
    body: z.object({ kycStatus: z.nativeEnum(KycStatus) }),
  }),
  asyncHandler(updateSellerKycStatus)
);

export default adminRouter;

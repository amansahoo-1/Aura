// routes/dashboardRouter.js
import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getDashboardMetrics,
  getPlatformAnalytics, // ✅ FIX: Renamed for clarity
  exportData,
  getSellerDashboardMetrics, // ✨ NEW: Import seller dashboard controller
} from "../controllers/dashboardControllers.js";
import {
  dashboardFilterSchema,
  dashboardExportSchema,
} from "../validations/dashboard.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  authenticate,
  checkAccountStatus,
  checkRole,
} from "../middleware/authMiddleware.js";
import { Role } from "@prisma/client/index.js";

const dashboardRouter = express.Router();

// ✨ NEW: Route for sellers to access their own dashboard
dashboardRouter.get(
  "/seller/metrics",
  authenticate,
  checkAccountStatus,
  // This would be a new checkRole function that checks for a 'SELLER' role
  // checkRole(["SELLER"]),
  asyncHandler(getSellerDashboardMetrics)
);

// --- Admin Routes ---
const adminRoles = [Role.ADMIN, Role.SUPERADMIN, Role.OPERATIONS];

dashboardRouter.get(
  "/metrics",
  authenticate,
  checkAccountStatus,
  checkRole(adminRoles),
  validateRequest({ query: dashboardFilterSchema }),
  asyncHandler(getDashboardMetrics)
);

dashboardRouter.get(
  "/analytics",
  authenticate,
  checkAccountStatus,
  checkRole(adminRoles),
  validateRequest({ query: dashboardFilterSchema }), // ✅ FIX: Corrected typo
  asyncHandler(getPlatformAnalytics)
);

dashboardRouter.post(
  "/export",
  authenticate,
  checkAccountStatus,
  checkRole(adminRoles),
  validateRequest({ body: dashboardExportSchema }),
  asyncHandler(exportData)
);

export default dashboardRouter;

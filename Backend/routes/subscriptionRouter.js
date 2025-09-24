// backend/routes/subscriptionRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  // User-facing
  listActivePlans,
  subscribeToPlan,
  getMySubscription,
  cancelMySubscription,
  // Admin-facing
  createPlan,
  updatePlan,
} from "../controllers/subscriptionController.js";
import {
  planSchema,
  planUpdateSchema,
  userSubscribeSchema,
  planIdParamSchema,
} from "../validations/subscription.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAuth,
  checkRole,
} from "../middleware/authMiddleware.js";
import { Role } from "@prisma/client/index.js";

const subscriptionRouter = express.Router();

// --- Public Route ---

// Anyone can see the available subscription plans
subscriptionRouter.get("/plans", asyncHandler(listActivePlans));

// --- User-Protected Routes ---
// All routes below require a logged-in user
subscriptionRouter.use(authenticate, requireAuth(), checkRole(["USER"]));

subscriptionRouter.post(
  "/subscribe",
  validateRequest({ body: userSubscribeSchema }),
  asyncHandler(subscribeToPlan)
);

subscriptionRouter.get("/me", asyncHandler(getMySubscription));

subscriptionRouter.patch("/me/cancel", asyncHandler(cancelMySubscription));

// --- Admin-Only Plan Management Routes ---
// These routes are namespaced under /plans/manage for clarity
const adminOnly = [
  authenticate,
  requireAuth(),
  checkRole([Role.ADMIN, Role.SUPERADMIN]),
];

subscriptionRouter.post(
  "/plans/manage",
  ...adminOnly,
  validateRequest({ body: planSchema }),
  asyncHandler(createPlan)
);

subscriptionRouter.put(
  "/plans/manage/:planId",
  ...adminOnly,
  validateRequest({ params: planIdParamSchema, body: planUpdateSchema }),
  asyncHandler(updatePlan)
);

// You can add more admin routes here to get all plans (including inactive) or delete them.

export default subscriptionRouter;

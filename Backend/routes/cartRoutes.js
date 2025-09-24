// backend/routes/cartRouter.js
import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getCart,
  updateCart,
  addCartItem,
  removeCartItem,
  clearCart,
  getCartItemCount,
  // ❌ REMOVED: applyDiscount function
} from "../controllers/cartControllers.js"; // Corrected filename for consistency
import {
  cartItemSchema,
  cartUpdateSchema,
} from "../validations/cart.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAuth,
  checkAccountStatus,
  authorizeUserAccess,
} from "../middleware/authMiddleware.js";
import { Role } from "@prisma/client/index.js";

const cartRouter = express.Router();

// Apply authentication middleware to all cart routes
cartRouter.use(authenticate, requireAuth(), checkAccountStatus);

// Cart Routes (User-specific and authorized)
cartRouter.get("/:userId", authorizeUserAccess, asyncHandler(getCart));

cartRouter.get(
  "/:userId/count",
  authorizeUserAccess,
  asyncHandler(getCartItemCount)
);

cartRouter.put(
  "/:userId",
  authorizeUserAccess,
  validateRequest({ body: cartUpdateSchema }),
  asyncHandler(updateCart)
);

cartRouter.post(
  "/:userId/items",
  authorizeUserAccess,
  validateRequest({ body: cartItemSchema }),
  asyncHandler(addCartItem)
);

cartRouter.delete(
  "/:userId/items/:productId",
  authorizeUserAccess,
  asyncHandler(removeCartItem)
);

cartRouter.delete(
  "/:userId/clear",
  authorizeUserAccess,
  asyncHandler(clearCart)
);

// ❌ REMOVED: The /apply-discount route is removed as discounts are handled at checkout.

export default cartRouter;

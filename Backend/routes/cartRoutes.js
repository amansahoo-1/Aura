// backend/routes/cartRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getCart,
  addCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartControllers.js";
import { cartItemSchema } from "../validations/cart.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAuth,
  checkAccountStatus,
  checkRole, // We will use this for authorization now
} from "../middleware/authMiddleware.js";
import { Role } from "@prisma/client";
import { productIdParamSchema } from "../validations/product.validation.js";

const cartRouter = express.Router();

// Apply authentication and ensure the user is a 'USER' for all cart routes
cartRouter.use(
  authenticate,
  requireAuth(),
  checkAccountStatus,
  checkRole(["USER"])
);

cartRouter.get("/", asyncHandler(getCart));

cartRouter.post(
  "/items",
  validateRequest({ body: cartItemSchema }),
  asyncHandler(addCartItem)
);

cartRouter.delete(
  "/items/:productId",
  validateRequest({ params: productIdParamSchema }),
  asyncHandler(removeCartItem)
);

cartRouter.delete("/clear", asyncHandler(clearCart));

export default cartRouter;

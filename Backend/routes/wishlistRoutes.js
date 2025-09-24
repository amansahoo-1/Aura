// backend/routes/wishlistRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistControllers.js";
import { wishlistItemSchema } from "../validations/wishlist.validation.js";
import { productIdParamSchema } from "../validations/product.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAuth,
  checkRole,
} from "../middleware/authMiddleware.js";

const wishlistRouter = express.Router();

// All wishlist routes are protected and for users only
wishlistRouter.use(authenticate, requireAuth(), checkRole(["USER"]));

wishlistRouter
  .route("/")
  .get(asyncHandler(getMyWishlist))
  .post(
    validateRequest({ body: wishlistItemSchema }),
    asyncHandler(addToWishlist)
  );

wishlistRouter
  .route("/:productId")
  .delete(
    validateRequest({ params: productIdParamSchema }),
    asyncHandler(removeFromWishlist)
  );

export default wishlistRouter;

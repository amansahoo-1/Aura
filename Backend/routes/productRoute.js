// backend/routes/productRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getProducts,
  getProductById,
  searchProducts,
} from "../controllers/productControllers.js";
import {
  productFilterSchema,
  productIdParamSchema,
  productSearchSchema,
} from "../validations/product.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
// Note: No authentication middleware is needed here as these are public routes.
import {
  createReview,
  getReviewsForProduct,
} from "../controllers/reviewControllers.js";
import { reviewCreateSchema } from "../validations/review.validation.js";
import {
  authenticate,
  requireAuth,
  checkRole,
} from "../middleware/authMiddleware.js";

const productRouter = express.Router();

// Route to get a list of all products with filtering
productRouter.get(
  "/",
  validateRequest({ query: productFilterSchema }),
  asyncHandler(getProducts)
);

// Route to search for products
productRouter.get(
  "/search",
  validateRequest({ query: productSearchSchema }),
  asyncHandler(searchProducts)
);

// Route to get a single product by its ID
productRouter.get(
  "/:productId",
  validateRequest({ params: productIdParamSchema }),
  asyncHandler(getProductById)
);

// --- Review Routes ---

// Public route to get all reviews for a product
productRouter.get(
  "/:productId/reviews",
  validateRequest({ params: productIdParamSchema }),
  asyncHandler(getReviewsForProduct)
);

// Protected route for a logged-in user to create a review
productRouter.post(
  "/:productId/reviews",
  authenticate,
  requireAuth(),
  checkRole(["USER"]), // Protect the route
  validateRequest({ params: productIdParamSchema, body: reviewCreateSchema }),
  asyncHandler(createReview)
);

export default productRouter;

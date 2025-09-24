// backend/routes/sellerRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getSellerProfile,
  updateSellerProfile,
  createProduct,
  getMyProducts,
  updateMyProduct,
  getMyPayouts,
} from "../controllers/sellerController.js";
import {
  sellerRegisterSchema,
  sellerLoginSchema,
  sellerUpdateProfileSchema,
  productCreateSchema,
  productUpdateSchema,
  productIdParamSchema,
} from "../validations/seller.validation.js";
import { registerSeller, loginSeller } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { authenticate, checkRole } from "../middleware/authMiddleware.js"; // Assuming a checkRole('SELLER') check

const sellerRouter = express.Router();

// // --- Public Seller Authentication Routes ---
// sellerRouter.post(
//   "/register",
//   validateRequest({ body: sellerRegisterSchema }),
//   asyncHandler(registerSeller)
// );
// sellerRouter.post(
//   "/login",
//   validateRequest({ body: sellerLoginSchema }),
//   asyncHandler(loginSeller)
// );

// --- Protected Routes (All routes below require a seller to be logged in) ---
// Note: You would create a role check for 'SELLER' in your authMiddleware
sellerRouter.use(authenticate /*, checkRole('SELLER')*/);

// --- Profile Management ---
sellerRouter
  .route("/profile/me")
  .get(asyncHandler(getSellerProfile))
  .put(
    validateRequest({ body: sellerUpdateProfileSchema }),
    asyncHandler(updateSellerProfile)
  );

// --- Product Management ---
sellerRouter
  .route("/products")
  .post(
    validateRequest({ body: productCreateSchema }),
    asyncHandler(createProduct)
  )
  .get(asyncHandler(getMyProducts));

sellerRouter.route("/products/:productId").put(
  validateRequest({
    params: productIdParamSchema,
    body: productUpdateSchema,
  }),
  asyncHandler(updateMyProduct)
);
// You can add a .delete() route here as well for deleting products.

// --- Financials ---
sellerRouter.get("/payouts/me", asyncHandler(getMyPayouts));

export default sellerRouter;

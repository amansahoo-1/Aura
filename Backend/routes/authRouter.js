// backend/routes/authRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  registerUser,
  loginUser,
  registerSeller,
  loginSeller,
  loginAdmin,
} from "../controllers/authController.js";
import {
  loginSchema,
  userRegisterSchema,
  sellerRegisterSchema,
} from "../validations/auth.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const authRouter = express.Router();

// --- User Authentication ---
authRouter.post(
  "/register/user",
  validateRequest({ body: userRegisterSchema }),
  asyncHandler(registerUser)
);
authRouter.post(
  "/login/user",
  validateRequest({ body: loginSchema }),
  asyncHandler(loginUser)
);

// --- Seller Authentication ---
authRouter.post(
  "/register/seller",
  validateRequest({ body: sellerRegisterSchema }),
  asyncHandler(registerSeller)
);
authRouter.post(
  "/login/seller",
  validateRequest({ body: loginSchema }),
  asyncHandler(loginSeller)
);

// --- Admin Authentication ---
authRouter.post(
  "/login/admin",
  validateRequest({ body: loginSchema }),
  asyncHandler(loginAdmin)
);

export default authRouter;

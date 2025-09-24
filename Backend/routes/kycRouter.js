// backend/routes/kycRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getMyKycStatus,
  initiateKycVerification,
} from "../controllers/kycController.js";
import { kycSubmitSchema } from "../validations/kyc.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { authenticate, requireAuth } from "../middleware/authMiddleware.js";

const kycRouter = express.Router();

// All KYC routes require an authenticated user or seller
kycRouter.use(authenticate, requireAuth());

// Route for a user/seller to check their own KYC status
kycRouter.get("/status", asyncHandler(getMyKycStatus));

// Route for a user/seller to submit their documents and start the process
kycRouter.post(
  "/initiate",
  validateRequest({ body: kycSubmitSchema }),
  asyncHandler(initiateKycVerification)
);

export default kycRouter;

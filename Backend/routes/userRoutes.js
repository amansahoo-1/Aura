// backend/routes/userRouter.js

import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  // ❌ Login/Register functions are no longer imported here
  getProfile,
  updateProfile,
  deleteUser,
  addAddress,
  listAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/userControllers.js";
import {
  userUpdateProfileSchema,
  addressCreateSchema,
  addressUpdateSchema,
  addressIdParamSchema,
} from "../validations/user.validation.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { authenticate, requireAuth } from "../middleware/authMiddleware.js";
import { getMyRentals } from "../controllers/rentalControllers.js";
// ❌ The loginSchema import is no longer needed here

const userRouter = express.Router();

// ❌ The public login and register routes are removed.
// They are now handled by authRouter.js

// ✅ FIX: All routes are now protected and assume a user is already logged in.
userRouter.use(authenticate, requireAuth());

// --- Profile Routes ---
userRouter
  .route("/profile")
  .get(asyncHandler(getProfile))
  .put(
    validateRequest({ body: userUpdateProfileSchema }),
    asyncHandler(updateProfile)
  )
  .delete(asyncHandler(deleteUser));

// --- Address Routes ---
userRouter
  .route("/addresses")
  .get(asyncHandler(listAddresses))
  .post(
    validateRequest({ body: addressCreateSchema }),
    asyncHandler(addAddress)
  );

userRouter
  .route("/addresses/:addressId")
  .put(
    validateRequest({
      params: addressIdParamSchema,
      body: addressUpdateSchema,
    }),
    asyncHandler(updateAddress)
  )
  .delete(
    validateRequest({ params: addressIdParamSchema }),
    asyncHandler(deleteAddress)
  );

userRouter.get("/rentals/me", asyncHandler(getMyRentals));
export default userRouter;

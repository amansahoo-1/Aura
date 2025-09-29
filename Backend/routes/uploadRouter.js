import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { uploadImage } from "../controllers/uploadControllers.js";
import { multerUpload } from "../middleware/multer_middleware.js";
import { authenticate, requireAuth } from "../middleware/authMiddleware.js";

const uploadRouter = express.Router();

// Protect the upload route
uploadRouter.use(authenticate, requireAuth());

// This route expects a single file in a form field named 'image'
uploadRouter.post(
  "/image",
  multerUpload.single("image"),
  asyncHandler(uploadImage)
);

export default uploadRouter;

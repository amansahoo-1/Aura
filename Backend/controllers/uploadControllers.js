import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  successResponse,
  errorResponse,
} from "../middleware/errorMiddleware.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/**
 * @desc    Upload a single image
 * @route   POST /api/upload/image
 * @access  Private (e.g., Seller or User)
 */
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, "No image file provided.", 400);
  }

  // The folder name can be dynamic, e.g., 'products', 'avatars', etc.
  const result = await uploadToCloudinary(req.file.buffer, "aura_images");

  return successResponse(
    res,
    { url: result.secure_url, public_id: result.public_id },
    "Image uploaded successfully."
  );
});

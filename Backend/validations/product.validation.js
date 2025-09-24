// validations/product.validation.js
import { z } from "zod";
import { idSchema, paginationSchema } from "./common.validation.js";

// Schema for filtering the main product list (e.g., GET /api/products)
export const productFilterSchema = paginationSchema.extend({
  category: z.string().optional(),
  material: z.string().optional(),
  minFee: z.coerce.number().positive().optional(),
  maxFee: z.coerce.number().positive().optional(),
  sortBy: z.enum(["newest", "fee_asc", "fee_desc"]).default("newest"),
});

// Schema for the product search endpoint (e.g., GET /api/products/search)
export const productSearchSchema = paginationSchema.extend({
  q: z.string().min(2, "Search query must be at least 2 characters"),
});

// Schema for validating a product ID in the URL params
export const productIdParamSchema = z.object({
  productId: idSchema,
});

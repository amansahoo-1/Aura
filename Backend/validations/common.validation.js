// validations/common.validation.js
import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const emailSchema = z.string().email();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

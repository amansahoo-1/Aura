// validations/dashboard.validation.js
import { z } from "zod";
import { idSchema } from "./common.validation.js"; // Assuming you have this

export const dashboardFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  interval: z.enum(["day", "week", "month", "year"]).optional(),
  category: z.string().optional(),
  //NEW: Added sellerId for filtering
  sellerId: idSchema.optional(),
  limit: z.coerce.number().int().positive().max(1000).default(100),
});

export const dashboardExportSchema = z.object({
  //Expanded enum with new models
  type: z.enum(["rentals", "products", "users", "items", "sellers", "payouts"]),
  filters: dashboardFilterSchema.optional(),
});

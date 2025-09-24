// validations/subscription.validation.js
import { z } from "zod";
import { idSchema } from "./common.validation.js";

// Schema for Admins to create or update subscription plans
export const planSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  price: z.number().positive("Price must be a positive number"),
  itemLimit: z.number().int().positive("Item limit must be a positive integer"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const planUpdateSchema = planSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  });

// Schema for a User subscribing to a plan
export const userSubscribeSchema = z.object({
  planId: idSchema,
  paymentGatewayId: z.string().min(5, "A valid payment ID is required"),
  paymentMethod: z.string().default("CARD"),
});

// Schema for validating a planId in the URL
export const planIdParamSchema = z.object({
  planId: idSchema,
});

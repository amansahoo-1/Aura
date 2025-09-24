// backend/validations/rental.validation.js
import { z } from "zod";
import { idSchema } from "./common.validation.js";
import { RentalStatus } from "@prisma/client/index.js";

// ✅ FIX: Schema for initiating a rental checkout.
// The user selects products and a pre-saved address.
export const rentalInitiateSchema = z.object({
  productIds: z.array(idSchema).min(1, "At least one product is required"),
  addressId: idSchema,
});

// ✨ NEW: Schema for confirming a rental after a successful payment.
export const rentalConfirmPaymentSchema = z.object({
  paymentGatewayId: z.string().min(5, "A valid payment ID is required"),
  paymentMethod: z.string().min(3, "Payment method is required"), // e.g., "CARD", "UPI"
});

// ✨ NEW: Schema for an admin/ops member to update logistics info.
export const rentalUpdateLogisticsSchema = z.object({
  shippingProvider: z.string().optional(),
  outboundTrackingNumber: z.string().optional(),
  returnTrackingNumber: z.string().optional(),
});

// ✅ FIX: Schema for updating a rental's status, using the new enum.
export const rentalStatusUpdateSchema = z.object({
  status: z.nativeEnum(RentalStatus),
});

export const rentalQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(RentalStatus).optional(),
});

export const rentalIdParamSchema = z.object({
  rentalId: z.coerce.number().int().positive(),
});

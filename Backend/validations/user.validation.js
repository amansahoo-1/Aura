// validations/user.validation.js
import { z } from "zod";
import {
  idSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
} from "./common.validation.js";

export const addressSchema = z.object({
  addressLine: z.string().min(5, "Address line is too short"),
  city: z.string().min(2, "City name is too short"),
  state: z.string().min(2, "State name is too short"),
  postalCode: z.string().min(5, "Invalid postal code"),
  country: z.string().optional().default("India"),
});

export const userRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  initialAddress: addressSchema.optional(),
});

export const userUpdateProfileSchema = z
  .object({
    name: z.string().min(2).optional(),
    phone: phoneSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

//Schemas for dedicated address management
export const addressCreateSchema = addressSchema;
export const addressUpdateSchema = addressSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const userIdParamSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export const addressIdParamSchema = z.object({
  addressId: z.coerce.number().int().positive(),
});

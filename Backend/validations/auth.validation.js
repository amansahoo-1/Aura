// validations/auth.validation.js
import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
} from "./common.validation.js";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// A schema for the new Address model structure
const addressSchema = z.object({
  addressLine: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(5),
  country: z.string().optional().default("India"),
});

// The registration schema now accepts an optional 'initialAddress' object
export const userRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  initialAddress: addressSchema.optional(),
});

export const sellerRegisterSchema = z.object({
  brandName: z.string().min(2, "Brand name is required"),
  contactPerson: z.string().min(2, "Contact person's name is required"),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
});

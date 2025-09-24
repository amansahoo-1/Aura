// validations/seller.validation.js
import { z } from "zod";
import {
  idSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
} from "./common.validation.js";

// For a new seller signing up
export const sellerRegisterSchema = z.object({
  brandName: z.string().min(2, "Brand name is required"),
  contactPerson: z.string().min(2, "Contact person's name is required"),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
});

// For an existing seller to log in
export const sellerLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// For a seller to update their public profile information
export const sellerUpdateProfileSchema = z
  .object({
    contactPerson: z.string().min(2).optional(),
    phone: phoneSchema.optional(),
    address: z.string().min(10).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  });

// For a seller to update their private bank details for payouts
export const sellerUpdateBankDetailsSchema = z.object({
  accountHolderName: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
  bankName: z.string(),
});

// For a seller creating a new product listing
export const productCreateSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  imageUrls: z
    .array(z.string().url("Each image URL must be a valid URL"))
    .min(1, "At least one image is required"),
  category: z.string(),
  material: z.string(),
  oneTimeRentalFee: z.number().positive("Rental fee must be a positive number"),
  insuredDeclaredValue: z.number().positive("IDV must be a positive number"),
});

// For a seller updating their product listing
export const productUpdateSchema = productCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one product field must be provided for an update.",
  });

// For URL params like /products/:productId
export const productIdParamSchema = z.object({
  productId: idSchema,
});

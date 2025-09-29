// validations/admin.validation.js
import { z } from "zod";
import { Role } from "@prisma/client/index.js";
import { idSchema, emailSchema, passwordSchema } from "./common.validation.js";

//Schema simplified to match the new Admin model in prisma.schema
export const adminCreateSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  password: passwordSchema,
  role: z.nativeEnum(Role), // Now includes ADMIN, SUPERADMIN, OPERATIONS
});

export const adminUpdateSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: emailSchema.optional(),
    role: z.nativeEnum(Role).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const adminIdParamSchema = z.object({
  adminId: idSchema,
});

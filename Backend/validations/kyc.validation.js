// validations/kyc.validation.js
import { z } from "zod";

// A basic schema to simulate the submission of KYC data.
// In a real app, this would be part of a multi-part form data request with file uploads.
export const kycSubmitSchema = z.object({
  documentType: z.enum(["AADHAAR", "PASSPORT", "GSTIN"]),
  documentNumber: z.string().min(5, "A valid document number is required"),
});

// For an admin to update a user or seller's KYC status.
export const kycUpdateStatusSchema = z.object({
  kycStatus: z.enum(["VERIFIED", "REJECTED"]),
  // Optional: Admin can add a note, especially for rejections.
  rejectionReason: z.string().optional(),
});

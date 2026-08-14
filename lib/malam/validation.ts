// lib/malam/validation.ts

import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Strict 5 MB file size ceiling
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

/**
 * Structural validator for checking raw physical binary files server-side.
 * Matches your exact file size limit and accepted format types.
 */
const fileUploadSchema = z
  .instanceof(File, { message: "A valid document file is required" })
  .refine((file) => file.size > 0, "File cannot be empty")
  .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be 5 MB or less")
  .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), "Only JPG, PNG, or PDF files are allowed");

/**
 * 🔒 Ingestion validation schema derived from your live server architecture.
 * Ensures data integrity across form inputs without adding any unverified rules.
 */
export const malamSubmissionSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email("Please provide a valid email address"),
  teachingSubjects: z.string().trim().min(1, "Teaching subjects description is required"),
  yearsTeaching: z.string().trim().min(1, "Years of teaching experience is required"),
  madrasahName: z.string().trim().min(1, "Madrasah name is required"),
  idProof: fileUploadSchema,
  letter: fileUploadSchema,
});

/**
 * 🔍 Ingestion validation schema for Admin review actions.
 */
export const adminReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    errorMap: () => ({ message: "Verification status must be either APPROVED or REJECTED" }),
  }),
  verificationNotes: z.string().trim().nullable(),
  verifiedBy: z.string().trim().nullable(),
});

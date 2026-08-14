// lib/malam/types.ts

import { VerificationStatus } from "@prisma/client";

export interface MalamApplicationSubmission {
  fullName: string;
  phone: string;
  email: string;
  teachingSubjects: string;
  yearsTeaching: string;
  madrasahName: string;
  idProof: File;
  letter: File;
}

export interface ApplicationReviewPayload {
  status: Exclude<VerificationStatus, "PENDING">;
  verificationNotes: string | null;
  verifiedBy: string | null;
}

export interface DomainActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
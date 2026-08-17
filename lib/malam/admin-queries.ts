// lib/malam/admin-queries.ts

import { prisma } from "@/lib/prisma";
import { VerificationStatus } from "@prisma/client";

/**
 * Fetch Malam users for the administrative verification panel.
 * This function is read-only and does not mutate application statuses.
 * 
 * @param status Optional verification state filter to narrow down records
 */
export async function getMalamApplications(status?: VerificationStatus) {
  return prisma.user.findMany({
    where: {
      role: "MALAM",
      ...(status ? { verificationStatus: status } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,

      teachingSubjects: true,
      yearsTeaching: true,
      madrasahName: true,
      madrasahPhone: true,

      idProofUrl: true,
      letterUrl: true,

      verificationStatus: true,
      verificationNotes: true,
      verifiedAt: true,
      verifiedBy: true,

      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Fetch a single Malam application folder record by user ID.
 * Invoked when Abdul opens an individual partner profile for an audit review.
 */
export async function getMalamApplicationById(userId: string) {
  return prisma.user.findFirst({
    where: {
      id: userId,
      role: "MALAM",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,

      teachingSubjects: true,
      yearsTeaching: true,
      madrasahName: true,
      madrasahPhone: true,

      idProofUrl: true,
      letterUrl: true,

      verificationStatus: true,
      verificationNotes: true,
      verifiedAt: true,
      verifiedBy: true,

      createdAt: true,
      updatedAt: true,
    },
  });
}

// lib/malam/verification.ts

import { prisma } from "@/lib/prisma";
import { ApplicationReviewPayload, DomainActionResponse } from "./types";
import { revalidatePath } from "next/cache";

/**
 * Executes an administrative review state transition for a Malam partner profile.
 * Maintained completely faithful to your Prisma audit column definitions.
 */
export async function reviewMalamApplication(
  targetUserId: string,
  review: ApplicationReviewPayload
): Promise<DomainActionResponse> {
  try {
    // 1. Verify the targeted user row exists before executing state mutations
    const userRow = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!userRow) {
      return {
        success: false,
        error: "The targeted user profile could not be found.",
      };
    }

    // 2. Perform pure audit updates without altering the underlying UserRole identity
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        verificationStatus: review.status,
        verificationNotes: review.verificationNotes,
        verifiedBy: review.verifiedBy,
        verifiedAt: new Date(), // Enforce reliable server audit timestamp
      },
    });

    // 3. Clear cache segments across your storefront routes instantly
    revalidatePath("/malam-apply");
    revalidatePath("/books");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Administrative verification transition failure:", error);
    return {
      success: false,
      error: error.message || "Failed to execute verification transition. Please try again.",
    };
  }
}

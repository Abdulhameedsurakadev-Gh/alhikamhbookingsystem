// app/(admin)/malam-applications/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/malam/auth-guards";
import { adminReviewSchema } from "@/lib/malam/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { VerificationStatus } from "@prisma/client";

/**
 * Malam-Exclusive Administrative Server Action.
 * Allows authenticated administrators to process PENDING teacher partner profiles.
 */
export async function auditMalamApplication(targetUserId: string, formData: FormData) {
  try {
    // 1. 🛡️ Enforce strict administrator identity validation
    const adminSession = await requireAdminUser();

    // 2. Extract payload elements from the admin panel form submittal
    const rawReviewPayload = {
      status: formData.get("status"),
      verificationNotes: formData.get("verificationNotes"),
      verifiedBy: adminSession.id, // Enforce auditable relationship to the admin account ID
    };

    // 3. Parse input properties through your structural Zod validation schema
    const parsed = adminReviewSchema.safeParse(rawReviewPayload);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message;
      return {
        success: false,
        error: firstError || "Please check your audit notes and ensure they are filled correctly.",
      };
    }

    const { status, verificationNotes, verifiedBy } = parsed.data;

    // 4. 🔒 Strict Security Scope Gate: Target record must explicitly be an unverified, PENDING MALAM account
    const targetUser = await prisma.user.findFirst({
      where: {
        id: targetUserId,
        role: "CUSTOMER",
        verificationStatus: VerificationStatus.PENDING, // 🛡️ Restricts mutations strictly to pending review items

        teachingSubjects: {
          not: null,
        },
      },
    });

    if (!targetUser) {
      return {
        success: false,
        error: "Access denied. The target profile is either not a Malam application or has already been reviewed.",
      };
    }

    // 5. Execute the clean database state transition
    const resultingRole =
      status === VerificationStatus.APPROVED ? "MALAM" : "CUSTOMER";

    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        role: resultingRole,
        verificationStatus: status,
        verificationNotes: verificationNotes,
        verifiedBy: verifiedBy,
        verifiedAt: new Date(), // Establish server-side timestamp
      },
    });

    // 6. Clear route cache tags to refresh your administration panels instantly
    revalidatePath("/admin/malam-applications");
    revalidatePath("/admin/malam-applications/[userId]", "page");

  } catch (error: any) {
    console.error("Critical Malam admin verification action failure:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while processing the verification audit.",
    };
  }

  // 7. Redirect back to the dashboard so the pending/approved/rejected
  //    counts and lists reflect the new state.
  redirect("/admin/malam-applications");
}
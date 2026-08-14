// lib/malam/application.ts

import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { MalamApplicationSubmission, DomainActionResponse } from "./types";
import { revalidatePath } from "next/cache";

// Initialize the isolated infrastructure client using your precise token bindings
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = "uploads";

/**
 * Handles the server-side lifecycle of a Malam partner submission.
 * Faithful to legacy route behaviors with added storage cleanup guarantees.
 */
export async function processMalamApplication(
  submission: MalamApplicationSubmission
): Promise<DomainActionResponse<{ userId: string }>> {
  
  let uploadedIdPath: string | null = null;
  let uploadedLetterPath: string | null = null;

  try {
    const timestamp = Date.now();

    // 1. Upload National ID Proof File to Storage
    const idFileName = `malam-applications/id-proofs/${timestamp}-${submission.idProof.name}`;
    const idBuffer = await submission.idProof.arrayBuffer();
    
    const { error: idUploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(idFileName, idBuffer, {
        contentType: submission.idProof.type,
        upsert: false,
      });

    if (idUploadError) throw new Error("Failed to upload National ID. Please try again.");
    uploadedIdPath = idFileName; // Track success path for cleanup rollback

    // 2. Upload Madrasah Verification Letter File to Storage
    const letterFileName = `malam-applications/letters/${timestamp}-${submission.letter.name}`;
    const letterBuffer = await submission.letter.arrayBuffer();

    const { error: letterUploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(letterFileName, letterBuffer, {
        contentType: submission.letter.type,
        upsert: false,
      });

    if (letterUploadError) throw new Error("Failed to upload Madrasah Letter. Please try again.");
    uploadedLetterPath = letterFileName; // Track success path for cleanup rollback

    // 3. Resolve Public Storage URLs
    const idUrlResult = supabase.storage.from(BUCKET_NAME).getPublicUrl(idFileName);
    const letterUrlResult = supabase.storage.from(BUCKET_NAME).getPublicUrl(letterFileName);

    const idProofUrl = idUrlResult.data.publicUrl;
    const letterUrl = letterUrlResult.data.publicUrl;

    // 4. Prisma Database Mutation Pipeline (Find or Create/Update)
    const existingUser = await prisma.user.findUnique({
      where: { email: submission.email },
    });

    let updatedUser;

    const databasePayload = {
      name: submission.fullName,
      phone: submission.phone,
      role: "MALAM" as const,
      verificationStatus: "PENDING" as const,
      teachingSubjects: submission.teachingSubjects,
      yearsTeaching: submission.yearsTeaching,
      madrasahName: submission.madrasahName,
      idProofUrl,
      letterUrl,
    };

    if (existingUser) {
      updatedUser = await prisma.user.update({
        where: { email: submission.email },
        data: databasePayload,
      });
    } else {
      updatedUser = await prisma.user.create({
        data: {
          email: submission.email,
          ...databasePayload,
        },
      });
    }

    // 5. Cache Revalidation Invalidation Rules
    revalidatePath("/malam-apply");
    revalidatePath("/books");

    return {
      success: true,
      data: { userId: updatedUser.id }
    };

  } catch (error: any) {
    console.error("Critical domain application failure:", error);

    // 🔄 Rollback Cleanup Protocol: Remove files if a downstream error occurs
    const pathsToClean: string[] = [];
    if (uploadedIdPath) pathsToClean.push(uploadedIdPath);
    if (uploadedLetterPath) pathsToClean.push(uploadedLetterPath);

    if (pathsToClean.length > 0) {
      try {
        await supabase.storage.from(BUCKET_NAME).remove(pathsToClean);
        console.log("Cleanup rollback successfully completed for paths:", pathsToClean);
      } catch (cleanupError) {
        console.error("Storage rollback cleanup failed:", cleanupError);
      }
    }

    return {
      success: false,
      error: error.message || "An unexpected error occurred. Please try again.",
    };
  }
}

// app/(store)/malam-apply/actions.ts
"use server";

import { processMalamApplication } from "@/lib/malam/application";
import { malamSubmissionSchema } from "@/lib/malam/validation";

/**
 * Server Action acting as a thin entry adapter for the Malam application form.
 * Ensures strict input validation via Zod before invoking underlying domain logic services.
 */
export async function submitMalamApplication(formData: FormData) {
  try {
    // 1. Extract raw web elements cleanly from the incoming multipart form payload
    const submission = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      teachingSubjects: formData.get("teachingSubjects"),
      yearsTeaching: formData.get("yearsTeaching"),
      madrasahName: formData.get("madrasahName"),
      idProof: formData.get("idProof"),
      letter: formData.get("letter"),
    };

    // 2. Delegate deep structural validation checks to our isolated Zod schema
    const parsed = malamSubmissionSchema.safeParse(submission);

    if (!parsed.success) {
      // Isolate the immediate validation problem to deliver clean UI toast messages
      const firstError = parsed.error.issues[0]?.message;
      return {
        success: false,
        error: firstError || "Please check your application details.",
      };
    }

    // 3. Hand off the clean data model to our business service routine for processing
    const result = await processMalamApplication(parsed.data);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to process your application.",
      };
    }

    return {
      success: true,
      message: "Application submitted successfully! We'll verify within 24-48 hours.",
      userId: result.data?.userId,
    };

  } catch (error) {
    console.error("Malam application action controller failure:", error);
    return {
      success: false,
      error: "An unexpected network error occurred. Please try again.",
    };
  }
}
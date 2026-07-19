// app/(store)/madrasah-apply/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Initialize Supabase client for server-side file uploads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitMadrasahApplication(formData: FormData) {
  try {
    // Extract form fields
    const organizationName = formData.get("organizationName") as string;
    const principalName = formData.get("principalName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const location = formData.get("location") as string;
    const studentCount = parseInt(formData.get("studentCount") as string, 10);
    const letterFile = formData.get("letter") as File;
    const registrationFile = formData.get("idProof") as File | null; // Match frontend name from form context

    // Validate required fields
    if (!organizationName || !principalName || !phone || !email || !location || !studentCount) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    if (!letterFile || letterFile.size === 0) {
      return {
        success: false,
        error: "Please upload Madrasah Letter",
      };
    }

    // Validate file types (only images and PDFs)
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(letterFile.type)) {
      return {
        success: false,
        error: "Only JPG, PNG, or PDF files allowed for letter",
      };
    }

    // ✅ FIXED: Guard condition to check if an optional file actually contains data
    const hasRegistrationUploaded = registrationFile && registrationFile.size > 0;

    if (hasRegistrationUploaded && !allowedTypes.includes(registrationFile.type)) {
      return {
        success: false,
        error: "Only JPG, PNG, or PDF files allowed for registration",
      };
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (letterFile.size > maxSize) {
      return {
        success: false,
        error: "Letter file must be smaller than 5MB",
      };
    }

    if (hasRegistrationUploaded && registrationFile.size > maxSize) {
      return {
        success: false,
        error: "Registration file must be smaller than 5MB",
      };
    }

    // ✅ FIXED: Sanitize file names to remove spaces and bad characters before pushing to storage path
    const cleanLetterName = letterFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const letterFileName = `madrasah-applications/letters/${Date.now()}-${cleanLetterName}`;
    const letterBuffer = await letterFile.arrayBuffer();
    
    const { data: letterData, error: letterError } = await supabase.storage
      .from("uploads")
      .upload(letterFileName, letterBuffer, {
        contentType: letterFile.type,
        upsert: false,
      });

    if (letterError) {
      console.error("Letter upload error:", letterError);
      return {
        success: false,
        error: "Failed to upload Madrasah Letter. Please try again.",
      };
    }

    // Upload School Registration (optional)
    let registrationUrl: string | null = null;
    if (hasRegistrationUploaded) {
      // ✅ FIXED: Sanitize registration file name
      const cleanRegName = registrationFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const registrationFileName = `madrasah-applications/registration/${Date.now()}-${cleanRegName}`;
      const registrationBuffer = await registrationFile.arrayBuffer();
      
      const { data: regData, error: regError } = await supabase.storage
        .from("uploads")
        .upload(registrationFileName, registrationBuffer, {
          contentType: registrationFile.type,
          upsert: false,
        });

      if (regError) {
        console.error("Registration upload error:", regError);
        return {
          success: false,
          error: "Failed to upload School Registration. Please try again.",
        };
      }

      const { data: regPublicData } = supabase.storage
        .from("uploads")
        .getPublicUrl(registrationFileName);
      registrationUrl = regPublicData?.publicUrl || null;
    }

    // Get public URL for letter
    const { data: letterPublicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(letterFileName);
    const letterUrl = letterPublicData?.publicUrl;

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Create or update user with MADRASAH role and verification pending
    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: {
          name: organizationName,
          phone,
          role: "MADRASAH",
          verificationStatus: "PENDING",
          organizationName,
          principalName,
          studentCount,
          location,
          letterUrl,
          idProofUrl: registrationUrl,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: organizationName,
          phone,
          role: "MADRASAH",
          verificationStatus: "PENDING",
          organizationName,
          principalName,
          studentCount,
          location,
          letterUrl,
          idProofUrl: registrationUrl,
        },
      });
    }

    // Revalidate store pages
    revalidatePath("/madrasah-apply");
    revalidatePath("/books");

    return {
      success: true,
      message: "Application submitted successfully! We'll verify within 24-48 hours.",
      userId: user.id,
    };
  } catch (error: any) {
    console.error("Madrasah application error:", error);
    return {
      success: false,
      error: error.message || "An error occurred. Please try again.",
    };
  }
}

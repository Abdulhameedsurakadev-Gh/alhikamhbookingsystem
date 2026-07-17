// app/(store)/malam-apply/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Initialize Supabase client for server-side file uploads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitMalamApplication(formData: FormData) {
  try {
    // Extract form fields
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const teachingSubjects = formData.get("teachingSubjects") as string;
    const yearsTeaching = formData.get("yearsTeaching") as string;
    const madrasahName = formData.get("madrasahName") as string;
    const idProofFile = formData.get("idProof") as File;
    const letterFile = formData.get("letter") as File;

    // Validate required fields
    if (!fullName || !phone || !email || !teachingSubjects || !yearsTeaching || !madrasahName) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    if (!idProofFile || !letterFile) {
      return {
        success: false,
        error: "Please upload both National ID and Madrasah Letter",
      };
    }

    // Validate file types (only images and PDFs)
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(idProofFile.type) || !allowedTypes.includes(letterFile.type)) {
      return {
        success: false,
        error: "Only JPG, PNG, or PDF files allowed",
      };
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (idProofFile.size > maxSize || letterFile.size > maxSize) {
      return {
        success: false,
        error: "Files must be smaller than 5MB",
      };
    }

    // Upload ID Proof to Supabase Storage
    const idFileName = `malam-applications/id-proofs/${Date.now()}-${idProofFile.name}`;
    const idProofBuffer = await idProofFile.arrayBuffer();
    const { data: idData, error: idError } = await supabase.storage
      .from("uploads")
      .upload(idFileName, idProofBuffer, {
        contentType: idProofFile.type,
        upsert: false,
      });

    if (idError) {
      console.error("ID upload error:", idError);
      return {
        success: false,
        error: "Failed to upload National ID. Please try again.",
      };
    }

    // Upload Madrasah Letter to Supabase Storage
    const letterFileName = `malam-applications/letters/${Date.now()}-${letterFile.name}`;
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

    // Get public URLs for uploaded files
    const { data: idPublicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(idFileName);
    const { data: letterPublicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(letterFileName);

    const idProofUrl = idPublicData?.publicUrl;
    const letterUrl = letterPublicData?.publicUrl;

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Create or update user with MALAM role and verification pending
    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          name: fullName,
          phone,
          role: "MALAM",
          verificationStatus: "PENDING",
          teachingSubjects,
          yearsTeaching,
          madrasahName,
          idProofUrl,
          letterUrl,
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: fullName,
          phone,
          role: "MALAM",
          verificationStatus: "PENDING",
          teachingSubjects,
          yearsTeaching,
          madrasahName,
          idProofUrl,
          letterUrl,
        },
      });
    }

    // Revalidate store pages
    revalidatePath("/malam-apply");
    revalidatePath("/books");

    return {
      success: true,
      message: "Application submitted successfully! We'll verify within 24-48 hours.",
      userId: user.id,
    };
  } catch (error: any) {
    console.error("Malam application error:", error);
    return {
      success: false,
      error: error.message || "An error occurred. Please try again.",
    };
  }
}
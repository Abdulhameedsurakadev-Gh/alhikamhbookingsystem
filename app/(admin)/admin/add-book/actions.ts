"use server";

import { CoverType, VolumeType, KnowledgeLevel, TextType, BookImageLabel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadAsset } from "@/lib/supabase-storage";

export async function createBook(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string || null;
    const isbn = formData.get("isbn") as string || null;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string, 10);
    const publisher = formData.get("publisher") as string;
    const publishedYear = formData.get("publishedYear") ? parseInt(formData.get("publishedYear") as string, 10) : null;
    const language = formData.get("language") as string || "Arabic";
    const weight = formData.get("weight") ? parseFloat(formData.get("weight") as string) : null;
    const authorId = formData.get("authorId") as string;
    const categoryId = formData.get("categoryId") as string;
    const volumeCount = parseInt(formData.get("volumeCount") as string, 10) || 1;
    const explainsBookId = formData.get("explainsBookId") as string || null;
    const tableOfContents = formData.get("tableOfContents") as string || null;

    const coverType = formData.get("coverType") as CoverType;
    const volumeType = formData.get("volumeType") as VolumeType;
    const knowledgeLevel = formData.get("knowledgeLevel") as KnowledgeLevel;
    const textType = formData.get("textType") as TextType;

    // ⚡ CAPTURE RAW FILE BINARY OBJECT DATA FROM FORM INPUTS
    const coverFile = formData.get("coverImageFile") as File | null;
    const insideFile = formData.get("insideImageFile") as File | null;

    if (!title || isNaN(price) || isNaN(stock) || !publisher || !authorId || !categoryId) {
      return { success: false, error: "Missing or invalid required fields" };
    }

    let finalCoverUrl: string | null = null;
    let finalPreviewUrl: string | null = null;

    // 1. Process and upload the core cover image binary if attached
    if (coverFile && coverFile.size > 0 && coverFile.name !== "undefined") {
      finalCoverUrl = await uploadAsset(coverFile, "covers");
    }

    // 2. Process and upload the inside preview sample page binary if attached
    if (insideFile && insideFile.size > 0 && insideFile.name !== "undefined") {
      finalPreviewUrl = await uploadAsset(insideFile, "previews");
    }

    // 3. Complete structural entry logging into Supabase PostgreSQL via Prisma
    await prisma.book.create({
      data: {
        title,
        description,
        isbn,
        price,
        stock,
        publisher,
        publishedYear,
        language,
        weight,
        tableOfContents,
        coverImage: finalCoverUrl, // Saves the permanent storage string URL path directly
        authorId,
        categoryId,
        coverType,
        volumeType,
        volumeCount,
        knowledgeLevel,
        textType,
        explainsBookId: explainsBookId || null,
        
        // Maps inside previews securely directly to your structural secondary relation BookImage array
        images: finalPreviewUrl ? {
          create: {
            imageUrl: finalPreviewUrl,
            label: BookImageLabel.SAMPLE_PAGE,
            sortOrder: 1,
          }
        } : undefined,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/add-book");
    revalidatePath("/admin/manage-inventory");
    
    return { success: true, message: "Manuscript and assets published successfully!" };
  } catch (error: any) {
    console.error("Fulfillment engine failure:", error);
    return { success: false, error: error.message || "Failed to finalize asset registry." };
  }
}

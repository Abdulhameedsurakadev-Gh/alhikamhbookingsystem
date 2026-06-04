"use server";

import { CoverType, VolumeType, KnowledgeLevel, TextType, BookImageLabel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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

    if (!title || isNaN(price) || isNaN(stock) || !publisher || !authorId || !categoryId) {
      return { success: false, error: "Missing or invalid required fields" };
    }

    // 1. Capture dynamic text URL strings directly from your form fields
    const coverUrlInput = formData.get("coverImageUrl") as string | null;
    const insideUrlInput = formData.get("insideImageUrl") as string | null;

    // Sanitize values by trimming whitespace; map empty text strings safely to null
    const finalCoverUrl = coverUrlInput && coverUrlInput.trim() !== "" ? coverUrlInput.trim() : null;
    const finalPreviewUrl = insideUrlInput && insideUrlInput.trim() !== "" ? insideUrlInput.trim() : null;

    // 2. Complete structural entry logging into database via Prisma
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
        coverImage: finalCoverUrl, // Saves the permanent text URL string directly
        authorId,
        categoryId,
        coverType,
        volumeType,
        volumeCount,
        knowledgeLevel,
        textType,
        explainsBookId: explainsBookId || null,
        
        // Maps inside preview text URLs directly into the relation table structure
        images: finalPreviewUrl ? {
          create: {
            imageUrl: finalPreviewUrl,
            label: BookImageLabel.SAMPLE_PAGE,
            sortOrder: 1,
          }
        } : undefined,
      },
    });

    // 3. Force revalidation of all inventory cache layers
    revalidatePath("/admin");
    revalidatePath("/admin/add-book");
    revalidatePath("/admin/manage-inventory");
    
    return { success: true, message: "Manuscript and storage URLs published successfully!" };
  } catch (error: any) {
    console.error("Fulfillment engine failure:", error);
    return { success: false, error: error.message || "Failed to finalize asset registry." };
  }
}

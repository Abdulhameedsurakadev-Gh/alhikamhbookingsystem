"use server";

import { CoverType, VolumeType, KnowledgeLevel, TextType, BookImageLabel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadAsset, deleteAssetByUrl } from "@/lib/supabase-storage";

export async function updateBook(bookId: string, formData: FormData) {
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

    // 1. Verify existence of the targeted manuscript record
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
      include: { images: true }
    });

    if (!existingBook) {
      return { success: false, error: "Target manuscript record not found" };
    }

    // 2. Capture dynamic binary file inputs from the multipart form
    const coverFile = formData.get("coverImageFile") as File | null;
    const insideFile = formData.get("insideImageFile") as File | null;

    if (!title || isNaN(price) || isNaN(stock) || !publisher || !authorId || !categoryId) {
      return { success: false, error: "Missing or invalid required fields" };
    }

    // Default back onto old strings if no replacement files exist
    let finalCoverUrl: string | null = existingBook.coverImage;
    let finalPreviewUrl: string | null = existingBook.images.find(img => img.label === BookImageLabel.SAMPLE_PAGE)?.imageUrl || null;

    // A. Handle Cover Image File Replacement and Cleanup
    if (coverFile && coverFile.size > 0 && coverFile.name !== "undefined") {
      // Delete old asset from Supabase Storage bucket first to prevent orphaned junk data
      if (existingBook.coverImage) {
        await deleteAssetByUrl(existingBook.coverImage);
      }
      // Upload fresh file asset stream
      finalCoverUrl = await uploadAsset(coverFile, "covers");
    }

    // B. Handle Inside Sample Page File Replacement and Cleanup
    if (insideFile && insideFile.size > 0 && insideFile.name !== "undefined") {
      if (finalPreviewUrl) {
        await deleteAssetByUrl(finalPreviewUrl);
      }
      finalPreviewUrl = await uploadAsset(insideFile, "previews");
    }

    // 3. Update primary core database entry fields
    await prisma.book.update({
      where: { id: bookId },
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
        coverImage: finalCoverUrl,
        authorId,
        categoryId,
        coverType,
        volumeType,
        volumeCount,
        knowledgeLevel,
        textType,
        explainsBookId: explainsBookId || null,
      },
    });

    // 4. Overwrite secondary sub-relation preview lines cleanly inside table
    await prisma.bookImage.deleteMany({
      where: { bookId, label: BookImageLabel.SAMPLE_PAGE }
    });

    if (finalPreviewUrl) {
      await prisma.bookImage.create({
        data: {
          bookId,
          imageUrl: finalPreviewUrl,
          label: BookImageLabel.SAMPLE_PAGE,
          sortOrder: 1
        }
      });
    }

    // 5. Purge server runtime route caches instantly
    revalidatePath("/admin");
    revalidatePath("/admin/manage-inventory");
    
    return { success: true, message: "Manuscript variations and storage buckets synced successfully!" };
  } catch (error: any) {
    console.error("Critical error running edit transaction cleanup:", error);
    return { success: false, error: error.message || "Failed to finalize database asset values." };
  }
}

"use server";

import { CoverType, VolumeType, KnowledgeLevel, TextType, BookImageLabel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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

    if (!title || isNaN(price) || isNaN(stock) || !publisher || !authorId || !categoryId) {
      return { success: false, error: "Missing or invalid required fields" };
    }

    // 2. Capture dynamic text URL inputs directly from the form fields
    const coverUrlInput = formData.get("coverImageUrl") as string | null;
    const insideUrlInput = formData.get("insideImageUrl") as string | null;

    // Fallback to old strings if fields are left entirely empty
    const finalCoverUrl = coverUrlInput && coverUrlInput.trim() !== "" 
      ? coverUrlInput.trim() 
      : existingBook.coverImage;

    const finalPreviewUrl = insideUrlInput && insideUrlInput.trim() !== "" 
      ? insideUrlInput.trim() 
      : existingBook.images.find(img => img.label === BookImageLabel.SAMPLE_PAGE)?.imageUrl || null;

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
    
    return { success: true, message: "Manuscript text URLs updated successfully!" };
  } catch (error: any) {
    console.error("Critical error running edit text transaction:", error);
    return { success: false, error: error.message || "Failed to finalize database asset values." };
  }
}

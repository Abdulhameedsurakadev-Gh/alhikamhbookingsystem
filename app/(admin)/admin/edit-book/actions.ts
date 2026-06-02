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
    const coverImage = formData.get("coverImage") as string || null;
    const insideImage = formData.get("insideImage") as string || null;
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

    // FIX: Replaced interactive transaction blocks with direct sequential execution paths
    // 1. Update core book metrics safely
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
        coverImage,
        tableOfContents,
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

    // 2. Clear out older inside preview samples
    await prisma.bookImage.deleteMany({
      where: { bookId, label: BookImageLabel.SAMPLE_PAGE }
    });

    // 3. Insert new inside preview sample if provided
    if (insideImage) {
      await prisma.bookImage.create({
        data: {
          bookId,
          imageUrl: insideImage,
          label: BookImageLabel.SAMPLE_PAGE,
          sortOrder: 1
        }
      });
    }

    // Revalidate app router filesystem layouts
    revalidatePath("/admin");
    revalidatePath("/admin/manage-inventory");
    
    return { success: true, message: "Manuscript updated successfully!" };
  } catch (error: any) {
    console.error("Error updating book:", error);
    return { success: false, error: error.message || "Something went wrong." };
  }
}

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

    // Validate required fields
    if (!title || isNaN(price) || isNaN(stock) || !publisher || !authorId || !categoryId) {
      return { success: false, error: "Missing or invalid required fields" };
    }

    // Write record to database using schema relation patterns
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
        coverImage, // Saved safely directly on the Book record
        tableOfContents,
        authorId,
        categoryId,
        coverType,
        volumeType,
        volumeCount,
        knowledgeLevel,
        textType,
        explainsBookId: explainsBookId || null,
        
        // FIX: Map inside samples directly into your schema's BookImage model array 
        images: insideImage ? {
          create: {
            imageUrl: insideImage,
            label: BookImageLabel.SAMPLE_PAGE,
            sortOrder: 1,
          }
        } : undefined,
      },
    });

    // Revalidate relevant view layouts instantly
    revalidatePath("/admin");
    revalidatePath("/admin/add-book");
    revalidatePath("/admin/manage-inventory"); // Clear cache for inventory grid listings
    
    return { success: true, message: "Book created successfully!" };
  } catch (error: any) {
    console.error("Error creating book:", error);
    return { success: false, error: error.message || "Something went wrong." };
  }
}

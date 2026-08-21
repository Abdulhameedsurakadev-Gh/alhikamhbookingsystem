"use server";

import {
  CoverType,
  VolumeType,
  KnowledgeLevel,
  TextType,
  BookImageLabel,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateBook(
  bookId: string,
  formData: FormData
) {
  try {
    const title =
      (formData.get("title") as string | null)?.trim() || "";

    const description =
      (formData.get("description") as string | null)?.trim() || null;

    const isbn =
      (formData.get("isbn") as string | null)?.trim() || null;

    const price = parseFloat(
      (formData.get("price") as string) || ""
    );

    const publisher =
      (formData.get("publisher") as string | null)?.trim() || "";

    const publishedYearValue =
      (formData.get("publishedYear") as string | null)?.trim() || "";

    const publishedYear = publishedYearValue
      ? parseInt(publishedYearValue, 10)
      : null;

    const language =
      (formData.get("language") as string | null)?.trim() ||
      "Arabic";

    const weightValue =
      (formData.get("weight") as string | null)?.trim() || "";

    const weight = weightValue
      ? parseFloat(weightValue)
      : null;

    const authorId =
      (formData.get("authorId") as string | null)?.trim() || "";

    const categoryId =
      (formData.get("categoryId") as string | null)?.trim() || "";

    const volumeCountValue =
      (formData.get("volumeCount") as string | null)?.trim() || "";

    const volumeCount =
      parseInt(volumeCountValue, 10) || 1;

    const explainsBookId =
      (formData.get("explainsBookId") as string | null)?.trim() ||
      null;

    const tableOfContents =
      (formData.get("tableOfContents") as string | null)?.trim() ||
      null;

    const coverType =
      formData.get("coverType") as CoverType;

    const volumeType =
      formData.get("volumeType") as VolumeType;

    const knowledgeLevel =
      formData.get("knowledgeLevel") as KnowledgeLevel;

    const textType =
      formData.get("textType") as TextType;

    /*
     * ------------------------------------------------------------
     * VALIDATION
     * ------------------------------------------------------------
     */

    if (
      !title ||
      !publisher ||
      !authorId ||
      !categoryId ||
      Number.isNaN(price)
    ) {
      return {
        success: false,
        error: "Missing or invalid required fields.",
      };
    }

    if (price < 0) {
      return {
        success: false,
        error: "Price cannot be negative.",
      };
    }

    if (weight !== null && Number.isNaN(weight)) {
      return {
        success: false,
        error: "Weight must be a valid number.",
      };
    }

    if (publishedYear !== null && Number.isNaN(publishedYear)) {
      return {
        success: false,
        error: "Published year must be a valid number.",
      };
    }

    if (volumeCount < 1) {
      return {
        success: false,
        error: "Volume count must be at least 1.",
      };
    }

    /*
     * ------------------------------------------------------------
     * FETCH EXISTING BOOK
     * ------------------------------------------------------------
     */

    const existingBook = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      include: {
        images: true,
      },
    });

    if (!existingBook) {
      return {
        success: false,
        error: "Target manuscript record was not found.",
      };
    }

    /*
     * ------------------------------------------------------------
     * IMAGE URL HANDLING
     *
     * Empty replacement fields mean:
     * "Keep the existing image."
     * ------------------------------------------------------------
     */

    const coverUrlInput = (
      formData.get("coverImageUrl") as string | null
    )?.trim();

    const insideUrlInput = (
      formData.get("insideImageUrl") as string | null
    )?.trim();

    const existingPreview =
      existingBook.images.find(
        (image) =>
          image.label === BookImageLabel.SAMPLE_PAGE
      );

    const finalCoverUrl =
      coverUrlInput || existingBook.coverImage || null;

    const finalPreviewUrl =
      insideUrlInput ||
      existingPreview?.imageUrl ||
      null;

    /*
     * ------------------------------------------------------------
     * DATABASE TRANSACTION
     *
     * Book update + preview image update happen together.
     * ------------------------------------------------------------
     */

    await prisma.$transaction(async (tx) => {
      /*
       * Update primary book record
       */
      await tx.book.update({
        where: {
          id: bookId,
        },

        data: {
          title,
          description,
          isbn,
          price,
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

          explainsBookId,
        },
      });

      /*
       * Only replace the SAMPLE_PAGE image when
       * the submitted URL is different from the current one.
       */
      if (
        insideUrlInput &&
        insideUrlInput !== existingPreview?.imageUrl
      ) {
        await tx.bookImage.deleteMany({
          where: {
            bookId,
            label: BookImageLabel.SAMPLE_PAGE,
          },
        });

        await tx.bookImage.create({
          data: {
            bookId,
            imageUrl: insideUrlInput,
            label: BookImageLabel.SAMPLE_PAGE,
            sortOrder: 1,
          },
        });
      }
    });

    /*
     * ------------------------------------------------------------
     * CACHE REVALIDATION
     * ------------------------------------------------------------
     */

    revalidatePath("/admin");
    revalidatePath("/admin/manage-inventory");
    revalidatePath("/admin/manage-inventory/edit-book");

    /*
     * Revalidate the public book/catalog pages as well.
     */
    revalidatePath("/books");
    revalidatePath(`/books/${bookId}`);

    return {
      success: true,
      message: "Manuscript updated successfully.",
    };
  } catch (error) {
    console.error(
      "Critical error updating manuscript:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update manuscript.",
    };
  }
}
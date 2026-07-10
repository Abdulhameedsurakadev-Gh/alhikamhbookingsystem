"use server";

import { prisma } from "../../../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAvailability(bookId: string, available: boolean) {
  try {
    await prisma.book.update({
      where: { id: bookId },
      data: { available },
    });

    revalidatePath("/admin/manage-inventory");
    revalidatePath("/admin");
    revalidatePath("/books");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update availability:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update availability" 
    };
  }
}

export async function deleteBook(bookId: string) {
  try {
    // Delete related cart items first
    await prisma.cartItem.deleteMany({
      where: { bookId },
    });

    // Delete related order items
    await prisma.orderItem.deleteMany({
      where: { bookId },
    });

    // Delete book images
    await prisma.bookImage.deleteMany({
      where: { bookId },
    });

    // Delete the book itself
    await prisma.book.delete({
      where: { id: bookId },
    });

    revalidatePath("/admin/manage-inventory");
    revalidatePath("/admin");
    revalidatePath("/books");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete book:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete book" 
    };
  }
}
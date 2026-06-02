"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Instantly update physical stock figures from the table counter
export async function updateStock(bookId: string, newStock: number) {
  try {
    if (newStock < 0) return { success: false, error: "Stock cannot be negative" };
    
    await prisma.book.update({
      where: { id: bookId },
      data: { stock: newStock },
    });
    
    revalidatePath("/admin/manage-inventory");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 2. Erase obsolete or damaged items safely from tables
export async function deleteBook(bookId: string) {
  try {
    // FIX: Execute an atomic transaction to purge any existing checkout session allocations 
    // before erasing the main manuscript catalog entry to bypass SQL foreign key constraints
    await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: { bookId: bookId }
      }),
      prisma.book.delete({
        where: { id: bookId },
      })
    ]);
    
    revalidatePath("/admin/manage-inventory");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

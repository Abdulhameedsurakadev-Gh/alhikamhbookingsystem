// app/(store)/cart/actions.ts
"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server-side inventory validation check to ensure a user never reserves more books than physically present
 */
export async function syncAndValidateCartItem(userId: string, bookId: string, targetQuantity: number) {
  // 1. Fetch live book parameters directly from the source of truth
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { stock: true, title: true }
  });

  if (!book) {
    return { success: false, message: "This volume no longer exists in our registry." };
  }

  // 2. Bound quantity to minimum 1 and absolute maximum stock thresholds
  const verifiedQuantity = Math.max(1, Math.min(targetQuantity, book.stock));

  if (book.stock <= 0) {
    return { success: false, message: `"${book.title}" is currently completely out of stock.` };
  }

  // 3. Ensure a persistent Cart entry wrapper model physically exists for this user profile
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // 4. Perform an Upsert operation: Insert if new, update quantity if already present
  await prisma.cartItem.upsert({
    where: {
      cartId_bookId: { cartId: cart.id, bookId }
    },
    update: { quantity: verifiedQuantity },
    create: { cartId: cart.id, bookId, quantity: verifiedQuantity }
  });

  revalidatePath("/cart");
  
  if (targetQuantity > book.stock) {
    return { 
      success: true, 
      capped: true,
      message: `Only ${book.stock} copies of "${book.title}" are available. Basket updated to maximum.` 
    };
  }

  return { success: true, capped: false };
}

/**
 * Remove an item permanently from the authenticated database cart
 */
export async function removeDatabaseCartItem(userId: string, bookId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return { success: false };

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, bookId }
  });

  revalidatePath("/cart");
  return { success: true };
}

/**
 * Merge Guest Zustand items into PostgreSQL upon successful login session completion
 */
export async function mergeGuestCartToDatabase(userId: string, guestItems: { id: string; quantity: number }[]) {
  if (guestItems.length === 0) return { success: true };

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Execute processing in parallel batches for optimization velocity
  await Promise.all(
    guestItems.map(async (item) => {
      const book = await prisma.book.findUnique({ where: { id: item.id }, select: { stock: true } });
      if (!book || book.stock <= 0) return;

      const targetQuantity = Math.min(item.quantity, book.stock);

      await prisma.cartItem.upsert({
        where: { cartId_bookId: { cartId: cart!.id, bookId: item.id } },
        update: { quantity: { increment: targetQuantity } }, // Add guest counts onto existing database totals safely
        create: { cartId: cart!.id, bookId: item.id, quantity: targetQuantity }
      });
    })
  );

  revalidatePath("/cart");
  return { success: true };
}

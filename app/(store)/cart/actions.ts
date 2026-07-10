// app/(store)/cart/actions.ts
"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server-side inventory validation: ensure user can only add available books
 */
export async function syncAndValidateCartItem(userId: string, bookId: string, targetQuantity: number) {
  // 1. Fetch live book availability status from source of truth
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { available: true, title: true }
  });

  if (!book) {
    return { success: false, message: "This volume no longer exists in our registry." };
  }

  // 2. Block checkout if book is marked as unavailable
  if (!book.available) {
    return { success: false, message: `"${book.title}" is currently out of stock.` };
  }

  // 3. For dropshipping: quantity = 1 only (no bulk ordering)
  const verifiedQuantity = 1;

  // 4. Ensure a persistent Cart entry exists for this user profile
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // 5. Perform an Upsert operation: Insert if new, update quantity if already present
  await prisma.cartItem.upsert({
    where: {
      cartId_bookId: { cartId: cart.id, bookId }
    },
    update: { quantity: verifiedQuantity },
    create: { cartId: cart.id, bookId, quantity: verifiedQuantity }
  });

  revalidatePath("/cart");
  
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

  await Promise.all(
    guestItems.map(async (item) => {
      // 1. Fetch live availability status
      const book = await prisma.book.findUnique({ 
        where: { id: item.id }, 
        select: { available: true } 
      });
      
      // Skip if book not available
      if (!book || !book.available) return;

      // 2. Look up if this item already exists in the user's database cart
      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          cartId_bookId: { cartId: cart!.id, bookId: item.id }
        }
      });

      // 3. For dropshipping, enforce quantity = 1 only
      const finalVerifiedQuantity = 1;

      // 4. Upsert with single quantity
      await prisma.cartItem.upsert({
        where: { cartId_bookId: { cartId: cart!.id, bookId: item.id } },
        update: { quantity: finalVerifiedQuantity }, 
        create: { cartId: cart!.id, bookId: item.id, quantity: finalVerifiedQuantity }
      });
    })
  );

  revalidatePath("/cart");
  return { success: true };
}
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";

/**
 * Resolve the currently authenticated customer.
 *
 * SECURITY:
 * The browser never supplies the user ID.
 * Better Auth determines cart ownership.
 */
async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return session.user;
}

/**
 * Validate and synchronize one cart item with the
 * authenticated customer's persistent PostgreSQL cart.
 *
 * The server is the source of truth for:
 * - cart ownership
 * - book existence
 * - book availability
 * - quantity validation
 */
export async function syncAndValidateCartItem(
  bookId: string,
  targetQuantity: number = 1
) {
  // -----------------------------------------------------------------------
  // 1. Authenticate
  // -----------------------------------------------------------------------

  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to synchronize your cart.",
    };
  }

  // -----------------------------------------------------------------------
  // 2. Validate the requested quantity
  // -----------------------------------------------------------------------

  if (
    !Number.isFinite(targetQuantity) ||
    !Number.isInteger(targetQuantity) ||
    targetQuantity < 1
  ) {
    return {
      success: false,
      message: "Invalid cart quantity.",
    };
  }

  // -----------------------------------------------------------------------
  // 3. Validate the book against the live database
  // -----------------------------------------------------------------------

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    select: {
      id: true,
      title: true,
      available: true,
    },
  });

  if (!book) {
    return {
      success: false,
      message: "This volume no longer exists in our registry.",
    };
  }

  // -----------------------------------------------------------------------
  // 4. Never trust browser availability state
  // -----------------------------------------------------------------------

  if (!book.available) {
    return {
      success: false,
      message: `"${book.title}" is currently out of stock.`,
    };
  }

  // -----------------------------------------------------------------------
  // 5. Find or create the customer's persistent cart
  // -----------------------------------------------------------------------

  let cart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });
  }

  // -----------------------------------------------------------------------
  // 6. Persist the ACTUAL requested quantity
  // -----------------------------------------------------------------------

  await prisma.cartItem.upsert({
    where: {
      cartId_bookId: {
        cartId: cart.id,
        bookId: book.id,
      },
    },
    update: {
      quantity: targetQuantity,
    },
    create: {
      cartId: cart.id,
      bookId: book.id,
      quantity: targetQuantity,
    },
  });

  // -----------------------------------------------------------------------
  // 7. Revalidate cart and checkout
  // -----------------------------------------------------------------------

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return {
    success: true,
    quantity: targetQuantity,
    message: "Cart synchronized successfully.",
  };
}

/**
 * Remove one item from the authenticated customer's
 * persistent database cart.
 */
export async function removeDatabaseCartItem(
  bookId: string
) {
  // -----------------------------------------------------------------------
  // 1. Authenticate
  // -----------------------------------------------------------------------

  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to modify your cart.",
    };
  }

  // -----------------------------------------------------------------------
  // 2. Find the customer's cart
  // -----------------------------------------------------------------------

  const cart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!cart) {
    return {
      success: true,
      message: "Cart is already empty.",
    };
  }

  // -----------------------------------------------------------------------
  // 3. Delete the requested item
  // -----------------------------------------------------------------------

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      bookId,
    },
  });

  // -----------------------------------------------------------------------
  // 4. Revalidate dependent routes
  // -----------------------------------------------------------------------

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return {
    success: true,
    message: "Book removed from your persistent cart.",
  };
}

/**
 * Clear the authenticated customer's entire persistent cart.
 */
export async function clearDatabaseCart() {
  // -----------------------------------------------------------------------
  // 1. Authenticate
  // -----------------------------------------------------------------------

  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to clear your cart.",
    };
  }

  // -----------------------------------------------------------------------
  // 2. Find the customer's cart
  // -----------------------------------------------------------------------

  const cart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });

  // Nothing to delete is still a successful clear operation.
  if (!cart) {
    return {
      success: true,
      deleted: 0,
    };
  }

  // -----------------------------------------------------------------------
  // 3. Delete every cart item
  // -----------------------------------------------------------------------

  const result = await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  // -----------------------------------------------------------------------
  // 4. Revalidate dependent routes
  // -----------------------------------------------------------------------

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return {
    success: true,
    deleted: result.count,
  };
}

/**
 * Merge the guest Zustand cart into the authenticated customer's
 * persistent PostgreSQL cart.
 *
 * Guest quantities are preserved.
 */
export async function mergeGuestCartToDatabase(
  guestItems: {
    id: string;
    quantity: number;
  }[]
) {
  // -----------------------------------------------------------------------
  // 1. Authenticate
  // -----------------------------------------------------------------------

  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in before merging your cart.",
      merged: 0,
      skipped: 0,
    };
  }

  // -----------------------------------------------------------------------
  // 2. Nothing to merge
  // -----------------------------------------------------------------------

  if (guestItems.length === 0) {
    return {
      success: true,
      merged: 0,
      skipped: 0,
    };
  }

  // -----------------------------------------------------------------------
  // 3. Find or create persistent cart
  // -----------------------------------------------------------------------

  let cart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });
  }

  // -----------------------------------------------------------------------
  // 4. Validate and merge every guest item
  // -----------------------------------------------------------------------

  let merged = 0;
  let skipped = 0;

  for (const item of guestItems) {
    // ---------------------------------------------------------------
    // Validate quantity
    // ---------------------------------------------------------------

    if (
      !Number.isFinite(item.quantity) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      skipped += 1;
      continue;
    }

    // ---------------------------------------------------------------
    // Validate book
    // ---------------------------------------------------------------

    const book = await prisma.book.findUnique({
      where: {
        id: item.id,
      },
      select: {
        id: true,
        available: true,
      },
    });

    if (!book || !book.available) {
      skipped += 1;
      continue;
    }

    // ---------------------------------------------------------------
    // Preserve the guest quantity
    // ---------------------------------------------------------------

    await prisma.cartItem.upsert({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId: book.id,
        },
      },
      update: {
        quantity: item.quantity,
      },
      create: {
        cartId: cart.id,
        bookId: book.id,
        quantity: item.quantity,
      },
    });

    merged += 1;
  }

  // -----------------------------------------------------------------------
  // 5. Revalidate
  // -----------------------------------------------------------------------

  revalidatePath("/cart");
  revalidatePath("/checkout");

  return {
    success: true,
    merged,
    skipped,
  };
}
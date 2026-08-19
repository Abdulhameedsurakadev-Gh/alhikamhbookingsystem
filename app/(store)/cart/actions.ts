
// app/(store)/cart/actions.ts
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";

/**
 * Get the currently authenticated user from the Better Auth session.
 *
 * IMPORTANT:
 * Never trust a userId supplied by the browser for cart mutations.
 * The authenticated session is the source of truth for ownership.
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
 * Server-side inventory validation and persistent cart synchronization.
 *
 * This is used when an authenticated customer adds a book to their cart.
 *
 * The browser does NOT provide the userId.
 * Better Auth determines which customer owns the cart.
 *
 * Quantity is intentionally capped at 1 because the current
 * Al-Hikmah dropshipping model does not allow bulk quantities
 * through the normal retail cart.
 */
export async function syncAndValidateCartItem(
  bookId: string,
  targetQuantity: number = 1
) {
  // -----------------------------------------------------------------------
  // 1. Authenticate the request
  // -----------------------------------------------------------------------
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to synchronize your cart.",
    };
  }

  // -----------------------------------------------------------------------
  // 2. Validate the requested book against the live database
  // -----------------------------------------------------------------------
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: {
      id: true,
      available: true,
      title: true,
    },
  });

  if (!book) {
    return {
      success: false,
      message: "This volume no longer exists in our registry.",
    };
  }

  // -----------------------------------------------------------------------
  // 3. Never trust the availability state stored in the browser
  // -----------------------------------------------------------------------
  if (!book.available) {
    return {
      success: false,
      message: `"${book.title}" is currently out of stock.`,
    };
  }

  // -----------------------------------------------------------------------
  // 4. Enforce the current retail quantity rule
  // -----------------------------------------------------------------------
  //
  // targetQuantity is intentionally accepted so the action remains
  // compatible with future quantity-aware cart functionality.
  //
  // For the current dropshipping model, however, every cart item is
  // restricted to exactly one unit.
  //
  const verifiedQuantity = 1;

  // Prevent an unused-parameter lint warning while documenting that
  // the requested quantity is deliberately ignored under the current
  // business rule.
  void targetQuantity;

  // -----------------------------------------------------------------------
  // 5. Find or create the authenticated customer's persistent cart
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
  // 6. Persist the item in the database cart
  // -----------------------------------------------------------------------
  //
  // The compound unique key guarantees that the same book cannot be
  // duplicated as separate cart rows for the same customer.
  //
  await prisma.cartItem.upsert({
    where: {
      cartId_bookId: {
        cartId: cart.id,
        bookId: book.id,
      },
    },
    update: {
      quantity: verifiedQuantity,
    },
    create: {
      cartId: cart.id,
      bookId: book.id,
      quantity: verifiedQuantity,
    },
  });

  // -----------------------------------------------------------------------
  // 7. Refresh the cart route
  // -----------------------------------------------------------------------
  revalidatePath("/cart");

  return {
    success: true,
    capped: false,
    message: "Book added to your persistent cart.",
  };
}

/**
 * Remove an item from the authenticated customer's database cart.
 *
 * The browser supplies only the bookId.
 * Cart ownership is determined from the authenticated session.
 */
export async function removeDatabaseCartItem(bookId: string) {
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
      success: false,
      message: "No persistent cart was found.",
    };
  }

  // -----------------------------------------------------------------------
  // 3. Remove the requested book
  // -----------------------------------------------------------------------
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      bookId,
    },
  });

  // -----------------------------------------------------------------------
  // 4. Refresh cart route
  // -----------------------------------------------------------------------
  revalidatePath("/cart");

  return {
    success: true,
  };
}

/**
 * Merge guest Zustand/localStorage cart items into the authenticated
 * customer's persistent PostgreSQL cart.
 *
 * This is used after a guest signs up or logs in.
 *
 * The browser supplies only book IDs and quantities.
 * The server determines the authenticated user's cart itself.
 */
export async function mergeGuestCartToDatabase(
  guestItems: { id: string; quantity: number }[]
) {
  // -----------------------------------------------------------------------
  // 1. Authenticate
  // -----------------------------------------------------------------------
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in before merging your cart.",
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
  // 3. Find or create the authenticated user's persistent cart
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
  // 4. Validate and merge each guest item
  // -----------------------------------------------------------------------
  let merged = 0;
  let skipped = 0;

  for (const item of guestItems) {
    // ---------------------------------------------------------------
    // Validate book against the live database
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

    // Book disappeared or is no longer available.
    if (!book || !book.available) {
      skipped += 1;
      continue;
    }

    // ---------------------------------------------------------------
    // Current business rule: one unit per retail cart item
    // ---------------------------------------------------------------
    const verifiedQuantity = 1;

    // ---------------------------------------------------------------
    // Persist the item
    // ---------------------------------------------------------------
    await prisma.cartItem.upsert({
      where: {
        cartId_bookId: {
          cartId: cart.id,
          bookId: book.id,
        },
      },
      update: {
        quantity: verifiedQuantity,
      },
      create: {
        cartId: cart.id,
        bookId: book.id,
        quantity: verifiedQuantity,
      },
    });

    merged += 1;
  }

  // -----------------------------------------------------------------------
  // 5. Refresh cart route
  // -----------------------------------------------------------------------
  revalidatePath("/cart");

  return {
    success: true,
    merged,
    skipped,
  };
}



// app/(store)/cart/actions.ts
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";

/**
 * Resolve the currently authenticated customer from the Better Auth session.
 *
 * SECURITY:
 * Cart ownership is always determined server-side from the authenticated
 * session. Never trust a userId supplied by the browser.
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
 * Add an authenticated customer's selected book to their persistent
 * PostgreSQL cart.
 *
 * The browser supplies only the book ID and requested quantity.
 * The authenticated session determines cart ownership.
 *
 * Current retail business rule:
 * - Only available books may be added.
 * - Retail cart quantity is capped at exactly 1.
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
  // 2. Validate the book against the live database
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
  // 3. Never trust availability information from the browser
  // -----------------------------------------------------------------------

  if (!book.available) {
    return {
      success: false,
      message: `"${book.title}" is currently out of stock.`,
    };
  }

  // -----------------------------------------------------------------------
  // 4. Enforce current retail quantity policy
  // -----------------------------------------------------------------------
  //
  // The retail/dropshipping model currently allows one unit per cart item.
  //
  // targetQuantity remains part of the API so the action can be extended
  // later when quantity-aware ordering is introduced.
  //

  void targetQuantity;

  const verifiedQuantity = 1;

  // -----------------------------------------------------------------------
  // 5. Find or create this customer's persistent cart
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
  // 6. Persist the book
  // -----------------------------------------------------------------------
  //
  // The compound unique constraint:
  //
  // cartId_bookId
  //
  // prevents duplicate cart rows for the same book.
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
  // 7. Revalidate the cart route
  // -----------------------------------------------------------------------

  revalidatePath("/cart");

  return {
    success: true,
    capped: false,
    message: "Book added to your persistent cart.",
  };
}

/**
 * Remove a book from the authenticated customer's persistent database cart.
 *
 * Cart ownership comes exclusively from the Better Auth session.
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
  // 4. Revalidate the cart route
  // -----------------------------------------------------------------------

  revalidatePath("/cart");

  return {
    success: true,
    message: "Book removed from your persistent cart.",
  };
}

/**
 * Merge a guest Zustand/localStorage cart into the authenticated
 * customer's persistent PostgreSQL cart.
 *
 * SECURITY:
 * The browser supplies only book IDs and quantities.
 * The server determines the authenticated customer from Better Auth.
 *
 * Current retail business rule:
 * Every cart item is persisted with quantity = 1.
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
  // 3. Find or create the authenticated customer's persistent cart
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
    // ---------------------------------------------------------------------
    // Validate the book against the live database
    // ---------------------------------------------------------------------

    const book = await prisma.book.findUnique({
      where: {
        id: item.id,
      },
      select: {
        id: true,
        available: true,
      },
    });

    // Skip deleted or unavailable books.
    if (!book || !book.available) {
      skipped += 1;
      continue;
    }

    // ---------------------------------------------------------------------
    // Enforce the current retail quantity policy
    // ---------------------------------------------------------------------

    const verifiedQuantity = 1;

    // ---------------------------------------------------------------------
    // Persist the item
    // ---------------------------------------------------------------------

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
  // 5. Revalidate the cart route
  // -----------------------------------------------------------------------

  revalidatePath("/cart");

  return {
    success: true,
    merged,
    skipped,
  };
}


// app/(auth)/actions.ts
"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
// Import your custom jose JWT sign-in handler wrapper directly from your lib folder
import { signIn } from "../../lib/auth";

interface GuestCartItem {
  id: string;
  quantity: number;
}

/**
 * 1. USER LOGIN SEED ACTION
 * Validates login credentials against PostgreSQL, executes guest cart merge loops,
 * and signs a secure text token using your custom jose JWT implementation.
 */
export async function loginUserAction(formData: FormData, guestCart: GuestCartItem[]) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Please enter your email and password credentials." };
  }

  try {
    // Locate user record inside your database table profile
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ⚠️ NOTE: Replace this raw string match check with bcrypt/argon2 hashing later
    if (!user || user.passwordHash !== password) {
      return { success: false, message: "Invalid email or password. Please verify your details." };
    }

    // =========================================================================
    // 🛒 GUEST CART MERGE WORKFLOW (Kept safe and robust)
    // =========================================================================
    if (guestCart.length > 0) {
      let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: user.id } });
      }

      await Promise.all(
        guestCart.map(async (item) => {
          const book = await prisma.book.findUnique({ where: { id: item.id }, select: { stock: true } });
          if (!book || book.stock <= 0) return;

          const safeQty = Math.min(item.quantity, book.stock);

          await prisma.cartItem.upsert({
            where: { cartId_bookId: { cartId: cart!.id, bookId: item.id } },
            update: { quantity: { increment: safeQty } },
            create: { cartId: cart!.id, bookId: item.id, quantity: safeQty }
          });
        })
      );
    }

    // =========================================================================
    // 🔒 CALL YOUR NEW CUSTOM WRAPPERS FOR SESSION MANAGEMENT
    // =========================================================================
    await signIn({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    revalidatePath("/");
    return { success: true, message: "Successfully authenticated." };

  } catch (error) {
    console.error("Authentication mutation processing error:", error);
    return { success: false, message: "A server side processing breakdown occurred." };
  }
}

/**
 * 2. USER REGISTRATION SPRINT ACTION
 * Provisions a fresh user profile inside the database, prevents email duplicates,
 * and calls your custom jose signIn wrapper to automatically initialize the session.
 */
export async function registerUserAction(formData: FormData, guestCart: GuestCartItem[]) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, message: "Please fill out all required field metrics." };
  }

  try {
    // Defend against email address collisions
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "This email address is already registered to a student account." };
    }

    // Provision the new User table row entry
    // ⚠️ NOTE: Swap password raw tracking for a hash mechanism (like bcrypt) later
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: password,
        role: "CUSTOMER", // Forces default secure client clearance boundaries
      },
    });

    // =========================================================================
    // 🛒 GUEST CART MERGE WORKFLOW (Matches login behavior)
    // =========================================================================
    if (guestCart.length > 0) {
      let cart = await prisma.cart.findUnique({ where: { userId: newUser.id } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: newUser.id } });
      }

      await Promise.all(
        guestCart.map(async (item) => {
          const book = await prisma.book.findUnique({ where: { id: item.id }, select: { stock: true } });
          if (!book || book.stock <= 0) return;

          const safeQty = Math.min(item.quantity, book.stock);

          await prisma.cartItem.upsert({
            where: { cartId_bookId: { cartId: cart!.id, bookId: item.id } },
            update: { quantity: { increment: safeQty } },
            create: { cartId: cart!.id, bookId: item.id, quantity: safeQty }
          });
        })
      );
    }

    // Immediately log the student in using your custom wrapper tool
    await signIn({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    revalidatePath("/");
    return { success: true, message: "Profile successfully registered." };

  } catch (error) {
    console.error("Account provisioning failure error loop:", error);
    return { success: false, message: "A data writing exception occurred on the database tier." };
  }
}

/**
 * 3. USER LOGOUT SYSTEM WORKER (NEW)
 * Securely deletes the server-signed httpOnly session cookie from the browser kernel.
 */
export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete("alhikmah_session");
  revalidatePath("/");
  return { success: true };
}

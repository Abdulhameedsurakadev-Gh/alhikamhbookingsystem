"use server";

import { prisma } from "@/lib/prisma";
import { encryptSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return { success: false, error: "Credentials input fields required" };

    // Find user record in database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, error: "Invalid credentials validation" };

    // Check Role - Block access if user is not an administrator
    if (user.role !== "ADMIN") return { success: false, error: "Access denied: Unauthorized identity" };

    // Plaintext check for testing. Replace with bcrypt.compare once dependencies are installed.
    const isPasswordValid = password === user.passwordHash;
    if (!isPasswordValid) return { success: false, error: "Invalid credentials validation" };

    // Generate secure token payload
    const sessionToken = await encryptSession({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    
    // FIX: Await the asynchronous set operation to guarantee cookie allocation finishes before continuing
    await cookieStore.set("alhikmah_session", sessionToken, {
      httpOnly: true, // 🔒 Crucial: Prevents JavaScript and browser DevTools from reading this cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

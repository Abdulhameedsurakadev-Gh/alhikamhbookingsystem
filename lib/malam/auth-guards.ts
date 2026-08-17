// lib/malam/auth-guards.ts

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole } from "@prisma/client";

export interface AuthenticatedUserSession {
  id: string;
  email: string;
  role: string;
  name?: string | null;
}

/**
 * 🛡️ Security Gate 1: Enforces a valid, logged-in session.
 * Rejects unauthenticated visitors instantly with a clear error payload.
 */
export async function requireAuthenticatedUser(): Promise<AuthenticatedUserSession> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Authentication required. Please log into your account to proceed.");
  }

  return {
    id: session.user.id,
    email: session.user.email,
    // 🔥 FIXED: Added strict string fallback constraint to resolve the type error smoothly
    role: session.user.role || UserRole.CUSTOMER,
    name: session.user.name,
  };
}

/**
 * 🛡️ Security Gate 2: Enforces strict administrative role permissions.
 * Verifies the authenticated user is an active system ADMIN (e.g., Abdul).
 */
export async function requireAdminUser(): Promise<AuthenticatedUserSession> {
  const user = await requireAuthenticatedUser();

  if (user.role !== UserRole.ADMIN) {
    throw new Error("Access denied. Only system administrators can perform this action.");
  }

  return user;
}

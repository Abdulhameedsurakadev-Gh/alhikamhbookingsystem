// app/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";

export interface SessionPayload {
  id: string;
  email: string;
  role: UserRole;
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");

export async function encryptSession(payload: SessionPayload) {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET);
}

export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("alhikmah_session")?.value;
  if (!token) return null;
  return await decryptSession(token);
}

/* ==========================================================================
   NEW WORKER HANDLERS: CUSTOM SIGN-IN & SIGN-OUT WRAPPERS
   ========================================================================== */

/**
 * Custom sign-in function handler wrapper.
 * Encrypts user attributes and bakes a secure, tamper-proof cookie session.
 */
export async function signIn(user: { id: string; email: string; role: UserRole }) {
  const sessionToken = await encryptSession({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set("alhikmah_session", sessionToken, {
    httpOnly: true, // Shields tokens from cross-site client scripting (XSS)
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2, // 2-hour lifecycle matching your JWT payload setup
    path: "/",
    sameSite: "lax",
  });
}

/**
 * Custom sign-out wrapper. Wipes the session tracking cookie cleanly.
 */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("alhikmah_session");
}

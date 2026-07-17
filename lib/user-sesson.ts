// lib/user-session.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface UserSessionContext {
  id: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "MALAM" | "MADRASAH" | "ADMIN";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
  isVerifiedB2B: boolean; // Pre-calculated boolean flag for easier front-end consumption
}

export async function getCurrentUserB2BContext(): Promise<UserSessionContext | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return null;

    // Better-Auth roles and properties map directly here
    const role = session.user.role as any;
    const verificationStatus = (session.user as any).verificationStatus || null;

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || null,
      role,
      verificationStatus,
      // Helper flag: True ONLY if they are an wholesale role AND Abdul changed them to APPROVED
      isVerifiedB2B: 
        (role === "MALAM" || role === "MADRASAH") && 
        verificationStatus === "APPROVED"
    };
  } catch (error) {
    console.error("Error fetching B2B session context:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

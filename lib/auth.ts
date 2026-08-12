// app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const betterAuthSecretEnv = process.env.BETTER_AUTH_SECRET;
if (!betterAuthSecretEnv) {
  throw new Error("❌ CRITICAL CONFIGURATION ERROR: BETTER_AUTH_SECRET environment variable is missing!");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: betterAuthSecretEnv,
  advanced: {
    cookiePrefix: "alhikmah",
  },

  // 🛡️ v1.0.5 CUSTOM SCHEMA TYPE EXTENSION
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: false, // Prevents malicious clients from pass-injecting "ADMIN" roles during public registration
      },
      // Fixed: this was missing entirely, which meant session.user.verificationStatus
      // was always undefined — every "(session?.user as any)?.verificationStatus
      // === 'APPROVED'" check across the app was silently comparing
      // undefined === 'APPROVED', always false. Every verified Malam/Madrasah
      // account has been getting retail pricing instead of their actual tier.
      verificationStatus: {
        type: "string",
        required: false,
        input: false, // Same protection as role — a client should never be able to
                       // self-approve their own verification status on signup/update.
      },
    },
  },
});
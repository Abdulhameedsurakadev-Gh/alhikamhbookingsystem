// app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; // Ensure this matches your relative path to your Prisma client instantiation

// 🛡️ ENFORCE STRICT SECURITY: Guard against silent fallbacks on missing environment keys
const betterAuthSecretEnv = process.env.BETTER_AUTH_SECRET;
if (!betterAuthSecretEnv) {
  throw new Error("❌ CRITICAL CONFIGURATION ERROR: BETTER_AUTH_SECRET environment variable is completely missing!");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // Binds to your PostgreSQL setup
  }),
  emailAndPassword: {
    enabled: true, // Enables default credentials login flow
  },
  secret: betterAuthSecretEnv,
  advanced: {
    cookiePrefix: "alhikmah", // Matches the prefix expected by your proxy middleware layer
  },
  // Ensure your user table schema handles custom attributes like 'role' matching UserRole from Prisma
});

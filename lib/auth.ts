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
        defaultValue: "CUSTOMER", // Matches your default CUSTOMER enum state
        input: false, // Prevents malicious clients from pass-injecting "ADMIN" roles during public registration
      },
    },
  },
});

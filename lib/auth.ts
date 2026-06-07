// app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; 
import { admin } from "better-auth/plugins"; // 🛡️ EXTENSION: Imports the official administrative plug-in schema

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
  
  // 🛡️ v1.0.5 TYPESCRIPT SCHEMA EXTENSION PLUGINS
  plugins: [
    admin({
      // This instructs Better-Auth to map, track, and export your custom DB roles 
      // directly onto your frontend data objects and user profiles.
      defaultRole: "user" 
    })
  ]
});

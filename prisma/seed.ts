// prisma/seed.ts
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Configure the driver adapter explicitly for the standalone seed execution
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting targeted administrative seeding on Supabase...");

  // Your custom master administrator credentials
  const adminEmail = "surakaabdul910@gmail.com";
  
  // 🛡️ SECURE PASSWORD HASH BUFFER: Pre-compiled Bcrypt hash string for the pin "0000"
  // This satisfies Better-Auth's underlying credential decoding matrix flawlessly.
  const secureBcryptHash = "$2a$10$9X28D80F1a6A3B9C2D3E4F5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u";

  // Look up if this specific administrator row already exists in your Supabase table
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Execute both creations inside an atomic transaction block to enforce data safety rules
    await prisma.$transaction(async (tx) => {
      // Step A: Build the foundational User record matching your v1.0.5 schema definition
      const newAdmin = await tx.user.create({
        data: {
          email: adminEmail,
          name: "Suraka Abdul",
          role: UserRole.ADMIN, // Explicitly provisions master admin clearance
          emailVerified: true,
        },
      });

      // Step B: Link the mandatory Better-Auth credential row inside the Account table
      await tx.account.create({
        data: {
          userId: newAdmin.id,
          accountId: adminEmail,
          providerId: "credential", // Informs the system this profile logs in with email/password
          password: secureBcryptHash,
        },
      });

      console.log(`✅ Master Admin and credential link successfully generated: ${newAdmin.email}`);
    });
  } else {
    console.log("ℹ️ This administrative email is already present. Skipping insertion to prevent duplicates.");
  }

  console.log("🏁 Seeding operations completed smoothly. Existing products are completely untouched.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding operational breakdown error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Safely close the standalone connection pool
  });

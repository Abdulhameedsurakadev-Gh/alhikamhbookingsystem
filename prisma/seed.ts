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
  const adminPasswordHash = "0000"; 

  // Look up if this specific administrator row already exists in your Supabase table
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Suraka Abdul",
        passwordHash: adminPasswordHash,
        role: UserRole.ADMIN, // Explicitly provisions master admin clearance
      },
    });
    console.log(`✅ Master Admin successfully generated: ${newAdmin.email}`);
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

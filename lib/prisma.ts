// app/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Define a type-safe interface for the NodeJS global object to prevent leaks
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: pg.Pool | undefined;
};

// 1. Ensure the PostgreSQL connection pool is cached globally in development
const pool =
  globalForPrisma.pgPool ??
  new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Keeps connection footprints extremely light on Supabase's free tier
  });

const adapter = new PrismaPg(pool);

// 2. Initialize or reuse the active global Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// 3. Save references to the global scope if we are not running on production servers
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pool;
}

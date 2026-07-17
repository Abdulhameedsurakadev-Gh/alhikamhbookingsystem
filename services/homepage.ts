// services/homepage.ts
import { prisma } from "../lib/prisma"; // Direct mapping matching your exact import path

// ==========================================================================
// STRICT VIEW MODEL CONTRACTS (Preserves existing application signatures)
// ==========================================================================

export interface SanitizedBook {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
  available: boolean;
}

export interface LevelStat {
  level: string;
  count: number;
  books: SanitizedBook[];
}

export interface ScholarStat {
  id: string;
  name: string;
  slug: string;
  diedAH: number | null | string; // Matches your model property rules
  bookCount: number;
  featuredBooks: SanitizedBook[];
  [key: string]: any; // Catch-all fallback safely protecting extra database traits
}

export interface CategoryStat {
  id: string;
  name: string;
  slug: string;
  bookCount: number;
  [key: string]: any;
}

export interface HeroStats {
  totalBooks: number;
  totalCategories: number;
  totalAuthors: number;
  totalShipping: number;
  featuredBook: SanitizedBook | null;
}

export interface HomepageViewModel {
  heroStats: HeroStats;
  categoryStats: CategoryStat[];
  sanitizedFeaturedBooks: SanitizedBook[];
  levelStats: LevelStat[];
  scholarStats: ScholarStat[];
  sanitizedNewBooks: SanitizedBook[];
}

// ==========================================================================
// THE EXTRACTION ENGINE
// ==========================================================================

export async function getHomepageContent(): Promise<HomepageViewModel> {
  // --- Standardized Book Sanitizer Module ---
  const sanitizeBook = (b: any): SanitizedBook => ({
    id: b.id,
    title: b.title,
    price: b.price.toString(),
    coverImage: b.coverImage || "",
    authorName: b.author?.name || "Unknown Scholar",
    available: b.available,
  });

  // 🏎️ PHASE 1: Massive Parallel Fetching Core (Squashes structural waiting)
  const [
    categoriesRaw,
    activeScholarsRaw,
    newBooksRaw,
    featuredBooksRaw,
    beginnerBooksRaw,
    intermediateBooksRaw,
    advancedBooksRaw,
    featuredBookRaw,
    totalBooks,
    totalCategories,
    totalAuthors,
    totalShipping,
    beginnerCount,
    intermediateCount,
    advancedCount
  ] = await Promise.all([
    // Categories with Inline Aggregation (Replaces the slow loops)
    prisma.category.findMany({
      where: { parentId: null },
      take: 8,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { books: true } }
      }
    }),
    // Scholars with Inline Pre-Fetched Relationships (Replaces the nested loops)
    prisma.author.findMany({
      take: 4,
      orderBy: { diedAH: "asc" },
      include: {
        books: {
          where: { available: true },
          take: 2,
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: "desc" }
        },
        _count: { select: { books: true } }
      }
    }),
    prisma.book.findMany({
      take: 4,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      take: 4,
      where: { available: true },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      where: { knowledgeLevel: "MUBTADI", available: true },
      take: 3,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      where: { knowledgeLevel: "MUTAWASSIT", available: true },
      take: 3,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      where: { available: true }, // Keeping exact logic constraint matching your file
      take: 4,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findFirst({
      where: { available: true },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    // Global metric counts mapping
    prisma.book.count(),
    prisma.category.count({ where: { parentId: null } }),
    prisma.author.count(),
    prisma.book.count({ where: { available: true } }),
    // Level totals counts mapping
    prisma.book.count({ where: { knowledgeLevel: "MUBTADI" } }),
    prisma.book.count({ where: { knowledgeLevel: "MUTAWASSIT" } }),
    prisma.book.count({ where: { knowledgeLevel: "MUTAQADDIM" } }),
  ]);

  // 🛠️ PHASE 2: View Model Synthesis & Cleaning 
  const sanitizedNewBooks = newBooksRaw.map(sanitizeBook);
  const sanitizedFeaturedBooks = featuredBooksRaw.map(sanitizeBook);
  const sanitizedFeaturedBook = featuredBookRaw ? sanitizeBook(featuredBookRaw) : null;

  const levelStats: LevelStat[] = [
    { level: "MUBTADI", count: beginnerCount, books: beginnerBooksRaw.map(sanitizeBook) },
    { level: "MUTAWASSIT", count: intermediateCount, books: intermediateBooksRaw.map(sanitizeBook) },
    { level: "MUTAQADDIM", count: advancedCount, books: advancedBooksRaw.map(sanitizeBook) },
  ];

  // Map high-performance scholars bundle payload
  const scholarStats: ScholarStat[] = activeScholarsRaw.map((scholar) => ({
    ...scholar,
    bookCount: scholar._count.books,
    featuredBooks: scholar.books.map(sanitizeBook),
  }));

  // Map high-performance categories bundle payload
  const categoryStats: CategoryStat[] = categoriesRaw.map((cat) => ({
    ...cat,
    bookCount: cat._count.books,
  }));

  const heroStats: HeroStats = {
    totalBooks,
    totalCategories,
    totalAuthors,
    totalShipping,
    featuredBook: sanitizedFeaturedBook,
  };

  // Deliver the complete decoupled dataset
  return {
    heroStats,
    categoryStats,
    sanitizedFeaturedBooks,
    levelStats,
    scholarStats,
    sanitizedNewBooks,
  };
}

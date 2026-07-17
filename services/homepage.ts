// services/homepage.ts
import { prisma } from "../lib/prisma";

// ==========================================================================
// STRICT VIEW MODEL CONTRACTS
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

// [key: string]: any removed — it was hiding the raw, unsanitized `books`
// array (with Prisma Decimal prices) leaking through the ...scholar spread
// below. Explicit fields only, so the compiler can actually catch this.
export interface ScholarStat {
  id: string;
  name: string;
  nameArabic: string | null;
  diedAH: string | null;
  bookCount: number;
  featuredBooks: SanitizedBook[];
}

export interface CategoryStat {
  id: string;
  name: string;
  slug: string;
  bookCount: number;
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

export interface NavMenuData {
  categories: Array<{ id: string; name: string; slug: string; parentId: string | null }>;
  featuredAuthors: Array<{ id: string; name: string; diedAH: string | null }>;
}

// ==========================================================================
// THE EXTRACTION ENGINE
// ==========================================================================

export async function getHomepageContent(): Promise<HomepageViewModel> {
  const sanitizeBook = (b: any): SanitizedBook => ({
    id: b.id,
    title: b.title,
    price: b.price.toString(),
    coverImage: b.coverImage || "",
    authorName: b.author?.name || "Unknown Scholar",
    available: b.available,
  });

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
    prisma.category.findMany({
      where: { parentId: null },
      take: 8,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { books: true } }
      }
    }),
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
    // Fixed: was missing knowledgeLevel entirely, silently pulling any
    // available book regardless of level under the "Advanced" section.
    prisma.book.findMany({
      where: { knowledgeLevel: "MUTAQADDIM", available: true },
      take: 3,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findFirst({
      where: { available: true },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.count(),
    prisma.category.count({ where: { parentId: null } }),
    prisma.author.count(),
    prisma.book.count({ where: { available: true } }),
    prisma.book.count({ where: { knowledgeLevel: "MUBTADI" } }),
    prisma.book.count({ where: { knowledgeLevel: "MUTAWASSIT" } }),
    prisma.book.count({ where: { knowledgeLevel: "MUTAQADDIM" } }),
  ]);

  const sanitizedNewBooks = newBooksRaw.map(sanitizeBook);
  const sanitizedFeaturedBooks = featuredBooksRaw.map(sanitizeBook);
  const sanitizedFeaturedBook = featuredBookRaw ? sanitizeBook(featuredBookRaw) : null;

  const levelStats: LevelStat[] = [
    { level: "MUBTADI", count: beginnerCount, books: beginnerBooksRaw.map(sanitizeBook) },
    { level: "MUTAWASSIT", count: intermediateCount, books: intermediateBooksRaw.map(sanitizeBook) },
    { level: "MUTAQADDIM", count: advancedCount, books: advancedBooksRaw.map(sanitizeBook) },
  ];

  // Fixed: no longer spreads the raw scholar object. Only the explicit,
  // sanitized fields are returned — the raw `books` relation (with Decimal
  // prices) never leaves this function, so it can't crash a Client
  // Component's props further down the tree.
  const scholarStats: ScholarStat[] = activeScholarsRaw.map((scholar) => ({
    id: scholar.id,
    name: scholar.name,
    nameArabic: scholar.nameArabic,
    diedAH: scholar.diedAH,
    bookCount: scholar._count.books,
    featuredBooks: scholar.books.map(sanitizeBook),
  }));

  const categoryStats: CategoryStat[] = categoriesRaw.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    bookCount: cat._count.books,
  }));

  const heroStats: HeroStats = {
    totalBooks,
    totalCategories,
    totalAuthors,
    totalShipping,
    featuredBook: sanitizedFeaturedBook,
  };

  return {
    heroStats,
    categoryStats,
    sanitizedFeaturedBooks,
    levelStats,
    scholarStats,
    sanitizedNewBooks,
  };
}

/**
 * Fetches navigation metadata (categories + featured authors) in parallel,
 * called once from the layout instead of independently inside Navbar.
 */
export async function getNavigationMetadata(): Promise<NavMenuData> {
  const [categories, featuredAuthors] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      take: 9,
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, parentId: true },
    }),
    prisma.author.findMany({
      take: 5,
      orderBy: { diedAH: "asc" },
      select: { id: true, name: true, diedAH: true },
    }),
  ]);

  return { categories, featuredAuthors };
}
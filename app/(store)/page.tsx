import React from "react";
import { prisma } from "../../lib/prisma";

import { Hero } from "../components/home/Hero";
import { SubjectChips } from "../components/home/SubjectChips";
import { StudyLevels } from "../components/home/StudyLevels";
import { FeaturedScholars } from "../components/home/FeaturedScholars";
import { BookGridSection } from "../components/home/BookGridSection";
import { BookRequestCTA } from "../components/shared/BookRequestCTA";
import { TrustSection } from "../components/home/TrustSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Fetch all core data
  const [
    categories,
    activeScholars,
    newBooks,
    featuredBooks,
    beginnerBooks,
    intermediateBooks,
    advancedBooks,
    featuredBook, // Single featured/trending book for hero
  ] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      take: 8,
      orderBy: { name: "asc" },
    }),
    prisma.author.findMany({
      take: 4,
      orderBy: { diedAH: "asc" },
    }),
    prisma.book.findMany({
      take: 4,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      take: 4,
      where: { stock: { gt: 0 } },
      include: { author: { select: { name: true } } },
      orderBy: { stock: "desc" },
    }),
    prisma.book.findMany({
      where: { knowledgeLevel: "MUBTADI", stock: { gt: 0 } },
      take: 3,
      include: { author: { select: { name: true } } },
      orderBy: { stock: "desc" },
    }),
    prisma.book.findMany({
      where: { knowledgeLevel: "MUTAWASSIT", stock: { gt: 0 } },
      take: 3,
      include: { author: { select: { name: true } } },
      orderBy: { stock: "desc" },
    }),
    prisma.book.findMany({
      where: { knowledgeLevel: "MUTAQADDIM", stock: { gt: 0 } },
      take: 3,
      include: { author: { select: { name: true } } },
      orderBy: { stock: "desc" },
    }),
    // Featured book (most popular/newest with stock)
    prisma.book.findFirst({
      where: { stock: { gt: 0 } },
      include: { author: { select: { name: true } } },
      orderBy: { stock: "desc" },
    }),
  ]);

  // 2. Fetch global stats for hero
  const [totalBooks, totalCategories, totalAuthors, totalShipping] =
    await Promise.all([
      prisma.book.count(),
      prisma.category.count({ where: { parentId: null } }),
      prisma.author.count(),
      prisma.book.count({ where: { stock: { gt: 0 } } }),
    ]);

  // 3. Fetch featured books for each scholar
  const scholarBooksMap = new Map();
  const scholarBookCounts = new Map();

  for (const scholar of activeScholars) {
    const [scholarBooks, bookCount] = await Promise.all([
      prisma.book.findMany({
        where: { authorId: scholar.id, stock: { gt: 0 } },
        take: 2,
        include: { author: { select: { name: true } } },
        orderBy: { stock: "desc" },
      }),
      prisma.book.count({ where: { authorId: scholar.id } }),
    ]);
    scholarBooksMap.set(scholar.id, scholarBooks);
    scholarBookCounts.set(scholar.id, bookCount);
  }

  // 4. Get book counts for each category
  const categoryCountsMap = new Map();
  for (const category of categories) {
    const count = await prisma.book.count({
      where: { categoryId: category.id },
    });
    categoryCountsMap.set(category.id, count);
  }

  // Sanitize functions
  const sanitizeBook = (b: any) => ({
    id: b.id,
    title: b.title,
    price: b.price.toString(),
    coverImage: b.coverImage || "",
    authorName: b.author?.name || "Unknown Scholar",
    stock: b.stock || 0,
  });
  const sanitizeByLevel = (books: any[]) => books.map(sanitizeBook);

  const sanitizedNewBooks = newBooks.map(sanitizeBook);
  const sanitizedFeaturedBooks = featuredBooks.map(sanitizeBook);
  const beginnerBooksData = sanitizeByLevel(beginnerBooks);
  const intermediateBooksData = sanitizeByLevel(intermediateBooks);
  const advancedBooksData = sanitizeByLevel(advancedBooks);
  const sanitizedFeaturedBook = featuredBook ? sanitizeBook(featuredBook) : null;

  const [beginnerCount, intermediateCount, advancedCount] = await Promise.all([
    prisma.book.count({ where: { knowledgeLevel: "MUBTADI" } }),
    prisma.book.count({ where: { knowledgeLevel: "MUTAWASSIT" } }),
    prisma.book.count({ where: { knowledgeLevel: "MUTAQADDIM" } }),
  ]);

  const levelStats = [
    { level: "MUBTADI", count: beginnerCount, books: beginnerBooksData },
    {
      level: "MUTAWASSIT",
      count: intermediateCount,
      books: intermediateBooksData,
    },
    { level: "MUTAQADDIM", count: advancedCount, books: advancedBooksData },
  ];

  // Create scholar stats with featured books
  const scholarStats = activeScholars.map((scholar) => ({
    ...scholar,
    bookCount: scholarBookCounts.get(scholar.id) || 0,
    featuredBooks: (scholarBooksMap.get(scholar.id) || []).map(sanitizeBook),
  }));

  // Create category stats with counts
  const categoryStats = categories.map((cat) => ({
    ...cat,
    bookCount: categoryCountsMap.get(cat.id) || 0,
  }));

  // Hero stats
  const heroStats = {
    totalBooks,
    totalCategories,
    totalAuthors,
    totalShipping,
    featuredBook: sanitizedFeaturedBook,
  };

  return (
    <div className="space-y-12 pb-16">
      <Hero heroStats={heroStats} />
      <SubjectChips categoryStats={categoryStats} />
      <BookGridSection
        title="Bestselling Recommendation"
        title2="Popular titles frequently purchased by students, teachers, and seekers of knowledge."
        books={sanitizedFeaturedBooks}
      />
      <StudyLevels levelStats={levelStats} />
      <FeaturedScholars scholarStats={scholarStats} />
      <BookRequestCTA />
      <BookGridSection
        title="New Arrivals"
        title2="Recently added titles from our growing catalog of Islamic works."
        books={sanitizedNewBooks}
      />
      <TrustSection />
    </div>
  );
}
import React from "react";
import { prisma } from "../../lib/prisma";

// Import your custom home components cleanly
import { Hero } from "../components/home/Hero";
import { SubjectChips } from "../components/home/SubjectChips";
import { StudyLevels } from "../components/home/StudyLevels";
import { FeaturedScholars } from "../components/home/FeaturedScholars";
import { BookGridSection } from "../components/home/BookGridSection";
import { BookRequestCTA } from "../components/shared/BookRequestCTA";
import { TrustSection } from "../components/home/TrustSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Fetch all storefront dataset catalogs concurrently
  const [categories, activeScholars, newBooks, featuredBooks] = await Promise.all([
    prisma.category.findMany({ 
      where: { parentId: null },
      take: 8, 
      orderBy: { name: "asc" } 
    }),
    prisma.author.findMany({ 
      take: 4, 
      orderBy: { diedAH: "asc" } 
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
  ]);

  // 2. Sanitize book data structures to eliminate Decimal serialization 500 bugs safely
  const sanitizedNewBooks = newBooks.map((b) => ({
    id: b.id,
    title: b.title,
    price: b.price.toString(),
    coverImage: b.coverImage || "",
    authorName: b.author?.name || "Unknown Scholar",
  }));

  const sanitizedFeaturedBooks = featuredBooks.map((b) => ({
    id: b.id,
    title: b.title,
    price: b.price.toString(),
    coverImage: b.coverImage || "",
    authorName: b.author?.name || "Unknown Scholar",
  }));

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Cover Banner Section */}
      <Hero />

      {/* 2. Horizontal Category Navigation Subject Strip */}
      <SubjectChips categories={categories} />

      {/* 3. High Recommendation Bestsellers Catalog Row */}
      <BookGridSection title="Bestselling Recommendation" title2="Popular titles frequently purchased by students, teachers, and seekers of knowledge." books={sanitizedFeaturedBooks} />

      {/* 4. Curriculum Target Study Track System Grid */}
      <StudyLevels />

      {/* 5. Islamic Scholars Historical Chronology Card Hub */}
      <FeaturedScholars scholars={activeScholars} />

      <BookRequestCTA />

      {/* 6. Newly Added Manuscripts Block Rows */}
      <BookGridSection title="New Arrivals" title2="Recently added titles from our growing catalog of Islamic works." books={sanitizedNewBooks} />

      {/* 7. Platform Assurances & Commercial Trust Badges */}
      <TrustSection />
    </div>
  );
}

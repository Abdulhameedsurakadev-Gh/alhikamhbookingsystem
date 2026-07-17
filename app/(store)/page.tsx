// app/(store)/page.tsx
import React from "react";
import { getHomepageContent } from "@/services/homepage";

import { Hero } from "../components/home/Hero";
import { SubjectChips } from "../components/home/SubjectChips";
import { StudyLevels } from "../components/home/StudyLevels";
import { FeaturedScholars } from "../components/home/FeaturedScholars";
import { BookGridSection } from "../components/home/BookGridSection";
import { BookRequestCTA } from "../components/shared/BookRequestCTA";
import { TrustSection } from "../components/home/TrustSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Phase 1 & 2: Descriptive Single-Line View Model Acquisition
  const data = await getHomepageContent();

  // Phase 3: Composition (Executing the New Chronological Trust Journey)
  return (
    <div className="space-y-16 pb-16">
      
      {/* Chapter 1: Introduction, Identity, and Global Library Scale */}
      <Hero heroStats={data.heroStats} />
      
      {/* Chapter 2: Foundational Discovery (What subjects do I study?) */}
      <SubjectChips categoryStats={data.categoryStats} />
      
      {/* Chapter 3: Structural Curriculum Tracking (How do I progress my reading?) */}
      <StudyLevels levelStats={data.levelStats} />
      
      {/* Chapter 4: Author Context & Biography (Who should I seek knowledge from?) */}
      <FeaturedScholars scholarStats={data.scholarStats} />
      
      {/* Chapter 5: Primary Recommendations (Curated Scholarly Literature) */}
      <BookGridSection
        title="Bestselling Recommendation"
        title2="Popular titles frequently purchased by students, teachers, and seekers of knowledge."
        books={data.sanitizedFeaturedBooks}
      />
      
      {/* 
        💎 NEW POSITION: "Why Readers Trust Al-Hikmah"
        Trust is now firmly established immediately AFTER the customer sees 
        our core curriculum and books, but BEFORE the secondary actions below.
      */}
      <TrustSection />
      
      {/* Chapter 7: Sourcing Procurement Desk (Can't find a vital manuscript volume?) */}
      <BookRequestCTA />
      
      {/* Chapter 8: Chronological Arrivals (What fresh prints dropped this week?) */}
      <BookGridSection
        title="New Arrivals"
        title2="Recently added titles from our growing catalog of Islamic works."
        books={data.sanitizedNewBooks}
      />
      
    </div>
  );
}

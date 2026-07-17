// app/components/home/Hero.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Search,
  Check,
  Award,
} from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";

interface FeaturedBook {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
  available: boolean;
}

interface HeroStats {
  totalBooks: number;
  totalCategories: number;
  totalAuthors: number;
  totalShipping: number;
  featuredBook: FeaturedBook | null;
}

interface HeroProps {
  heroStats: HeroStats;
}

export function Hero({ heroStats }: HeroProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAddFeaturedToCart = () => {
    if (heroStats.featuredBook) {
      addItem({
        id: heroStats.featuredBook.id,
        title: heroStats.featuredBook.title,
        price: parseFloat(heroStats.featuredBook.price),
        weight: 0.5,
        coverImage: heroStats.featuredBook.coverImage,
        available: heroStats.featuredBook.available,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    /* 
      System Fit: 
      - Replaced dark emerald/slate gradient loop with clean warm paper canvas background.
      - Enforces core roasted-coffee brown typography color tokens throughout.
    */
    <div className="relative bg-background text-foreground overflow-hidden border-b border-border/40 py-12 sm:py-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ==========================================================================
            SECTION 1: DISCIPLINED ACADEMIC HEADING AREA
           ========================================================================== */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {/* System Badge Rule: Muted sand tone, line-stroke icon, zero floating emoji fragments */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-sm bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
              Authentic Islamic Literature
            </span>
          </div>

          {/* Typography Pairings: Strict Serif Playfair Headings */}
          <h1 className="text-display font-bold font-serif text-foreground leading-tight tracking-tight">
            Building Libraries of Beneficial Knowledge
          </h1>

          <p className="text-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore a carefully selected repository of works across Aqeedah, Fiqh, Hadith, Tafsir, Arabic, and Seerah, sourced specifically to support serious students of knowledge and families.
          </p>
        </div>

        {/* ==========================================================================
            SECTION 2: INTEGRATED METRICS COUNTERS (Unified Design Language)
           ========================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: heroStats.totalBooks, label: "Volumes in Catalogue" },
            { value: heroStats.totalCategories, label: "Core Disciplines" },
            { value: heroStats.totalAuthors, label: "Classical Scholars" },
            { value: heroStats.totalShipping, label: "Available in Stock" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-sm p-4 text-center select-none">
              {/* Removed corporate blue/purple/orange color text maps */}
              <p className="text-heading font-sans font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ==========================================================================
            SECTION 3: ELEVATED DISCOVERY ENGINE & QUICK ACTIONS (Stacked Rhythm)
           ========================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-end pt-2">
          {/* Main Centralized Search Container Anchor */}
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Search the Repository
            </label>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 stroke-[1.5]" />
                <input
                  type="text"
                  placeholder="Search by book title, classical author, or publisher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-24 rounded-sm border border-border bg-card text-foreground font-sans text-label placeholder:text-muted-foreground/50 outline-none transition-all duration-normal ease-standard focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-9 px-4 rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium text-xs transition-colors duration-fast ease-standard cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Catalog Index Link Actions */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Explore Collections
            </label>
            <Link
              href="/books"
              className="flex items-center justify-center gap-2 h-12 px-6 bg-card hover:bg-secondary/20 text-foreground font-sans font-medium text-label rounded-sm border border-border transition-colors duration-fast ease-standard w-full cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-primary" /> 
              <span>Browse Full Catalogue</span>
            </Link>
          </div>
        </div>

                {/* ==========================================================================
            SECTION 4: RECOMMENDATION EMBED & VALUES MAPPING (Split Layout)
           ========================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start max-w-5xl mx-auto pt-4">
          
          {/* LEFT PANELS: Curated Recommendation Spot Frame (Occupies 3 Columns) */}
          <div className="lg:col-span-3">
            {heroStats.featuredBook && (
              <div className="bg-card border border-border rounded-sm p-6 space-y-4 shadow-subtle">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <Award className="w-4 h-4 text-primary stroke-[1.5]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Selected Recommendation
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-6 items-start">
                  {heroStats.featuredBook.coverImage && (
                    <div className="col-span-1">
                      <img
                        src={heroStats.featuredBook.coverImage}
                        alt={heroStats.featuredBook.title}
                        className="w-full aspect-[3/4] object-cover rounded-sm border border-border/80 shadow-none bg-background"
                      />
                    </div>
                  )}

                  <div className={`${heroStats.featuredBook.coverImage ? "col-span-2" : "col-span-3"} space-y-4`}>
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-title text-foreground leading-tight line-clamp-2">
                        {heroStats.featuredBook.title}
                      </h3>
                      <p className="text-label text-muted-foreground font-medium">
                        by {heroStats.featuredBook.authorName}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/50 space-y-3">
                      <p className="text-title font-sans font-semibold text-foreground">
                        GH₵{parseFloat(heroStats.featuredBook.price).toFixed(2)}
                      </p>

                      <div className="flex gap-3">
                        <Link
                          href={`/books/${heroStats.featuredBook.id}`}
                          className="flex-1 inline-flex items-center justify-center text-xs font-medium py-2 rounded-sm border border-border bg-background hover:bg-card text-foreground transition-colors duration-fast ease-standard"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={handleAddFeaturedToCart}
                          className="flex-1 inline-flex items-center justify-center text-xs font-medium py-2 rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-fast ease-standard"
                        >
                          {addedToCart ? "✓ Added" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANELS: Restrained Value Claims Checklist (Occupies 2 Columns) */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-border/50 pb-2">
              The Al-Hikmah Promise
            </h3>

            <div className="space-y-4">
              {[
                { title: "Verified Authenticity", desc: "Texts verified to stem from precise publisher prints and reliable text collections." },
                { title: "Regional Courier Delivery", desc: "Reliable distribution channels routing parcels safely across Kasoa, Accra, and greater Ghana." },
                { title: "Protected Transactions", desc: "Fully integrated checkout handling local Mobile Money and cards via Paystack systems safely." },
                { title: "Structured Curriculum Paths", desc: "Literature catalogued explicitly by complexity parameters matching your individual progression." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 select-none">
                  {/* Thin line checkmark icons set to primary terracotta clay color */}
                  <div className="p-1 rounded-full bg-secondary/30 text-primary shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wide">{item.title}</p>
                    <p className="text-label text-muted-foreground leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Curriculum Jump Point */}
            <div className="pt-2">
              <Link
                href="#study-tracks"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-card hover:bg-secondary/20 text-foreground font-sans font-medium text-label rounded-sm border border-border/80 transition-colors duration-fast ease-standard cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-primary stroke-[1.5]" /> 
                <span>Explore Structured Learning Paths</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

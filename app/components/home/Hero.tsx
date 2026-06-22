"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Search,
  CheckCircle,
  Truck,
  CreditCard,
  Layers,
  TrendingUp,
  Star,
} from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";

interface FeaturedBook {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
  stock: number;
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
        stock: heroStats.featuredBook.stock,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden border-b border-emerald-900/30">
      {/* Subtle Visual Geometric Grid Layer */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* ============================================
            SECTION 1: HEADER + HEADLINE + COPY
        ============================================ */}
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-4">
          {/* Authority Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono tracking-wider uppercase">
            📚 Authentic Islamic Books for Students of Knowledge
          </span>

          {/* Main Headline - Clean & Concise */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-slate-100 leading-tight">
            Build Your Islamic Library <br />
            <span className="text-emerald-400">With Trusted Scholarly Works</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Explore carefully selected books in Aqeedah, Fiqh, Hadith, Tafsir, Arabic, Seerah, and other Islamic sciences from reliable publishers and scholars.
          </p>
        </div>

        {/* ============================================
            SECTION 2: STATS CARDS
        ============================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              {heroStats.totalBooks}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Books in Catalog</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl sm:text-3xl font-black text-blue-400">
              {heroStats.totalCategories}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Disciplines</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl sm:text-3xl font-black text-purple-400">
              {heroStats.totalAuthors}+
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Scholars</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl sm:text-3xl font-black text-orange-400">
              {heroStats.totalShipping}+
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">In Stock</p>
          </div>
        </div>

        {/* ============================================
            SECTION 3: SEARCH + CTA BUTTONS (SIDE BY SIDE)
        ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Search Bar - Takes 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Search
            </label>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-24 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-emerald-500 text-sm font-medium text-slate-200 placeholder-slate-500 shadow-sm transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Primary CTAs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Actions
            </label>
            <Link
              href="/books"
              className="flex items-center justify-center gap-2 h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/20 w-full cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Browse All Books
            </Link>
          </div>
        </div>

        {/* ============================================
            SECTION 4: FEATURED BOOK + TRUST BADGES (2 COLUMN)
        ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Featured Book */}
          {heroStats.featuredBook && (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Featured This Week
                </span>
              </div>

              {/* Featured Book Card */}
              <div className="grid grid-cols-3 gap-4 items-start">
                {/* Book Cover */}
                {heroStats.featuredBook.coverImage && (
                  <div className="col-span-1">
                    <img
                      src={heroStats.featuredBook.coverImage}
                      alt={heroStats.featuredBook.title}
                      className="w-full aspect-[3/4] object-cover rounded-lg border border-slate-600 shadow-lg"
                    />
                  </div>
                )}

                {/* Book Info */}
                <div className={`${heroStats.featuredBook.coverImage ? "col-span-2" : "col-span-3"} space-y-3`}>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-sm text-slate-100 line-clamp-2">
                      {heroStats.featuredBook.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      By {heroStats.featuredBook.authorName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-slate-300">Highly Rated</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-700">
                    <p className="text-sm font-black text-emerald-400">
                      GH₵{parseFloat(heroStats.featuredBook.price).toFixed(2)}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddFeaturedToCart}
                        className={`flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-all ${
                          addedToCart
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                        }`}
                      >
                        {addedToCart ? "✓ Added" : "Add to Cart"}
                      </button>
                      <Link
                        href={`/books/${heroStats.featuredBook.id}`}
                        className="flex-1 inline-flex items-center justify-center text-xs font-bold py-2 rounded-lg border border-slate-600 hover:border-emerald-500 hover:text-emerald-400 transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: Trust Badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Why Choose Al-Hikmah
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-200">Authentic Publications</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Curated works from reliable publishers and scholars
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <Truck className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-200">Nationwide Delivery</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Fast, secure delivery across all regions of Ghana
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <CreditCard className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-200">Secure Payments</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Mobile money, cards, and bank transfers via Paystack
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <Layers className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-200">Structured Learning</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Books organized by knowledge level and discipline
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary CTA */}
            <Link
              href="#study-tracks"
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-xl border border-slate-800 transition-all cursor-pointer mt-2"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" /> Explore Study Levels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
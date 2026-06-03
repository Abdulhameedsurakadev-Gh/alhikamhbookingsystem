"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Search, CheckCircle, Truck, CreditCard, Layers } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Quick subjects architecture data map
  const subjects = [
    { name: "Aqeedah", slug: "aqeedah" },
    { name: "Fiqh", slug: "fiqh" },
    { name: "Hadith", slug: "hadith" },
    { name: "Tafsir", slug: "tafsir" },
    { name: "Arabic", slug: "arabic" },
    { name: "Seerah", slug: "seerah" }
  ];

  return (
    <div className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden border-b border-emerald-900/30">
      {/* Subtle Visual Geometric Grid Layer */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* Split Engine: Stacks vertically on mobile (Visual first), unlocks side-by-side split on desktop */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* LEFT COLUMN: Core Conversion Content Block (50% Width on desktop) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            
            {/* Section 1: Authority Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono tracking-wider uppercase">
              Authentic Islamic Books for Students of Knowledg
            </span>
            
            {/* Section 2: Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-slate-100 leading-tight">
              Build Your Islamic Library with Authentic Scholarly Works <br />
              <span className="text-emerald-400">With Trusted Scholarly Works</span>
            </h1>
            
            {/* Section 3: Supporting Copy */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explore carefully selected books in Aqeedah, Fiqh, Hadith, Tafsir, Arabic, Seerah, and other Islamic sciences from reliable publishers and scholars.
            </p>

            {/* Section 4 & 5: Primary & Secondary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 max-w-sm mx-auto sm:max-w-none">
              <Link 
                href="/books" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/20 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Browse Books
              </Link>
              <Link 
                href="#study-tracks" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-xl border border-slate-800 transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" /> Explore Study Levels
              </Link>
            </div>

            {/* Section 6: Trust Bar Matrix */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-4 border-t border-slate-800/40 text-xs text-slate-400 font-medium text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Authentic Publications</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Delivery Across Ghana</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Secure Mobile Money Payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Curated For Students Of Knowledge</span>
              </div>
            </div>

            {/* Section 7: Deep Functional Search Bar Container */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl pt-2 mx-auto lg:mx-0">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search books, authors, subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-24 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-emerald-500 text-sm font-medium text-slate-200 placeholder-slate-500 shadow-2xs transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Section 8: Quick Categories / Subject Chips */}
            <div className="space-y-1.5 text-left max-w-xl mx-auto lg:mx-0">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center lg:text-left">Browse by Subject</span>
              <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {subjects.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/books?category=${sub.slug}`}
                    className="inline-flex h-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/40 px-3 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400 shadow-3xs transition cursor-pointer whitespace-nowrap"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Section 9: Social Proof Mini Stats Footer */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 border-t border-slate-800/40 text-slate-400">
              <div className="text-left">
                <span className="block font-serif text-base font-bold text-slate-200 leading-none">📚 Carefully Curated</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Classical & Contemporary Works</span>
              </div>
              <div className="h-5 w-px bg-slate-800" />
              <div className="text-left">
                <span className="block font-serif text-base font-bold text-slate-200 leading-none">📦 Nationwide Delivery</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Shipped Across Ghana</span>
              </div>
              <div className="h-5 w-px bg-slate-800" />
              <div className="text-left">
                <span className="block font-serif text-base font-bold text-slate-200 leading-none">🎓 Structured Learning</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Beginner to Advanced Levels</span>
              </div>
            </div>

          </div>

                    {/* =========================================================================
              RIGHT COLUMN: DYNAMIC INVENTORY HERO IMAGE MEDIA BLOCK (50% Width on desktop)
             ========================================================================= */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] rounded-2xl bg-gradient-to-tr from-emerald-950/40 to-slate-900/40 border border-slate-800/60 shadow-2xl overflow-hidden flex items-center justify-center group">
              
              {/* Background ambient gradient blur effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/15 transition-colors duration-500" />
              
              {/* High-Performance Image Element */}
              <img 
                src="https://octlrqnttziiatgdehmr.supabase.co/storage/v1/object/public/book-assets/covers/Hero%20Image.jpg" 
                alt="Al-Hikmah Bookstore Featured Islamic Texts Collection"
                className="relative z-10 w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-500 select-none pointer-events-none"
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

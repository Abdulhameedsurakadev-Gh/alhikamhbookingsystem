// app/components/navigation/Navbar.tsx
import React from "react";
import Link from "next/link";
import { NavActions } from "./NavActions";
import type { NavMenuData } from "@/services/homepage";

interface NavbarProps {
  // Synchronized seamlessly to map Better Auth data objects cleanly during pnpm build
  session: {
    user: {
      id: string;
      email: string;
      name: string | null;
      role?: string | null; // Safe parameter mapping that native database vectors output
    };
  } | null;
  categories: NavMenuData["categories"];
  featuredAuthors: NavMenuData["featuredAuthors"];
}

export function Navbar({ session, categories, featuredAuthors }: NavbarProps) {
  return (
    <div className="w-full bg-background font-sans text-label font-medium text-foreground select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">

          <Link href="/" className="flex flex-shrink-0 items-center group">
            <span className="text-title font-bold tracking-tight text-foreground font-serif group-hover:text-primary-hover transition-colors duration-fast ease-standard">
              Al-Hikmah
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-x-6">

            {/* Link Block 1: General Inventory Directories */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-primary-hover transition-colors duration-fast ease-standard cursor-pointer focus-visible:outline-2 focus-visible:outline-ring">
                <span>Books</span>
                <span className="text-[9px] text-muted-foreground/80 opacity-60 group-hover:text-primary-hover transition-colors">▼</span>
              </button>
              {/* System Fit: Fixed legacy rounded-md to print-inspired rounded-sm tokens */}
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-card border border-border rounded-sm shadow-dialog py-2 mt-1 z-50">
                <Link href="/books" className="block px-4 py-2 hover:bg-surface-hover text-foreground transition-colors duration-fast">All Books</Link>
                <Link href="/books?filter=new" className="block px-4 py-2 hover:bg-surface-hover text-foreground transition-colors duration-fast">New Arrivals</Link>
                <Link href="/books?filter=best" className="block px-4 py-2 hover:bg-surface-hover text-foreground transition-colors duration-fast">Best Sellers</Link>
              </div>
            </div>

            {/* Link Block 2: Islamic Sciences & Disciplines Index */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-primary-hover transition-colors duration-fast ease-standard cursor-pointer focus-visible:outline-2 focus-visible:outline-ring">
                <span>Categories</span>
                <span className="text-[9px] text-muted-foreground/80 opacity-60 group-hover:text-primary-hover transition-colors">▼</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-card border border-border rounded-sm shadow-dialog py-2 mt-1 z-50 max-h-[350px] overflow-y-auto scrollbar-none">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/categories/${cat.slug}`} className="block px-4 py-2 hover:bg-surface-hover text-foreground transition-colors duration-fast">
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-border/40 my-1" />
                <Link href="/books" className="block px-4 py-2 text-primary hover:bg-surface-hover font-semibold transition-colors duration-fast">
                  Browse All →
                </Link>
              </div>
            </div>

            {/* Link Block 3: Biography Catalog Links */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-primary-hover transition-colors duration-fast ease-standard cursor-pointer focus-visible:outline-2 focus-visible:outline-ring">
                <span>Authors</span>
                <span className="text-[9px] text-muted-foreground/80 opacity-60 group-hover:text-primary-hover transition-colors">▼</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-60 bg-card border border-border rounded-sm shadow-dialog py-2 mt-1 z-50">
                <Link
                  href="/authors"
                  className="block px-4 py-1.5 font-bold text-muted-foreground text-[10px] uppercase tracking-wider border-b border-border/30 mb-1 hover:text-primary-hover transition-colors"
                >
                  Browse Authors
                </Link>
                {featuredAuthors.map((author) => (
                  <Link key={author.id} href={`/authors/${author.id}`} className="block px-4 py-2 hover:bg-surface-hover text-foreground transition-colors duration-fast text-xs font-medium">
                    {author.name}{author.diedAH ? ` (d. ${author.diedAH} AH)` : ""}
                  </Link>
                ))}
                <div className="border-t border-border/40 my-1" />
                <Link href="/authors" className="block px-4 py-2 text-primary hover:bg-surface-hover font-semibold transition-colors duration-fast">
                  All Scholars →
                </Link>
              </div>
            </div>

            {/* Link Block 4: Curriculum Difficulty Tracks */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-primary-hover transition-colors duration-fast ease-standard cursor-pointer focus-visible:outline-2 focus-visible:outline-ring">
                <span>Study Level</span>
                <span className="text-[9px] text-muted-foreground/80 opacity-60 group-hover:text-primary-hover transition-colors">▼</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-card border border-border rounded-sm shadow-dialog py-2 mt-1 z-50">
                <Link href="/books?level=MUBTADI" className="block px-4 py-2 hover:bg-surface-hover text-foreground transition-colors flex flex-col space-y-0.5">
                  <span className="font-semibold text-xs uppercase tracking-wide">Beginner</span>
                  <span className="text-[11px] text-muted-foreground font-serif leading-none">Mubtadi (مبتدئ)</span>
                </Link>
                <Link href="/books?level=MUTAWASSIT" className="block px-4 py-2 hover:bg-surface-hover text-foreground transition-colors flex flex-col space-y-0.5">
                  <span className="font-semibold text-xs uppercase tracking-wide">Intermediate</span>
                  <span className="text-[11px] text-muted-foreground font-serif leading-none">Mutawassit (متوسط)</span>
                </Link>
                <Link href="/books?level=MUTAQADDIM" className="block px-4 py-2 hover:bg-surface-hover text-foreground transition-colors flex flex-col space-y-0.5">
                  <span className="font-semibold text-xs uppercase tracking-wide">Advanced</span>
                  <span className="text-[11px] text-muted-foreground font-serif leading-none">Mutaqaddim (متقدم)</span>
                </Link>
              </div>
            </div>

            <Link href="/about" className="hover:text-primary-hover transition-colors duration-fast ease-standard">About</Link>
          </nav>

          {/* User Context Interface Tray */}
          <NavActions
            categories={categories}
            session={session}
          />

        </div>
      </div>
    </div>
  );
}

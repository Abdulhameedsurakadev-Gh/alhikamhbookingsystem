// app/components/home/FeaturedScholars.tsx
import React from "react";
import Link from "next/link";
import { PenTool, ArrowRight } from "lucide-react";

interface FeaturedBook {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
}

interface ScholarNode {
  id: string;
  name: string;
  nameArabic: string | null;
  diedAH: string | null;
  bookCount?: number;
  featuredBooks?: FeaturedBook[];
}

interface FeaturedScholarsProps {
  scholarStats: ScholarNode[];
}

export function FeaturedScholars({ scholarStats }: FeaturedScholarsProps) {
  return (
    /* 
      System Fit:
      - Swapped out heavy slate/black dark blocks for our clean paper background.
      - Section relies on regular vertical rhythm separated by thin system lines.
    */
    <div className="bg-background py-16 border-t border-b border-border/40 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* 1. Curatorial Introductory Text Stack */}
        <div className="space-y-1">
          <h2 className="font-serif text-heading font-bold text-foreground">
            Explore the Works of Renowned Scholars
          </h2>
          <p className="font-sans text-label text-muted-foreground leading-relaxed max-w-2xl">
            Browse classical and contemporary volumes organized explicitly by the authoritative authors whose dedication has preserved traditional Islamic scholarship.
          </p>
        </div>

        {/* 2. Biographical Doorway Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {scholarStats.map((sch) => {
            const featuredBooks = sch.featuredBooks || [];
            const bookCount = sch.bookCount || 0;

            return (
              <div
                key={sch.id}
                className="bg-card border border-border/80 rounded-sm p-5 flex flex-col justify-between space-y-6 transition-all duration-normal ease-standard hover:border-primary/40 hover:shadow-subtle group/card select-none"
              >
                {/* Upper Module: Scholar Biological Metadata */}
                <div className="space-y-4">
                  {/* Replaced Quote icon with an academic line quill; colored in brand terracotta clay */}
                  <div className="w-8 h-8 rounded-sm bg-background border border-border/60 flex items-center justify-center text-primary">
                    <PenTool className="w-3.5 h-3.5 stroke-[1.5]" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-title text-foreground tracking-tight leading-tight">
                      {sch.name}
                    </h4>
                    {sch.nameArabic && (
                      <p
                        className="text-base font-arabic text-primary font-medium leading-none"
                        dir="rtl"
                      >
                        {sch.nameArabic}
                      </p>
                    )}
                    {sch.diedAH && (
                      <p className="text-[10px] font-sans font-bold tracking-wider text-muted-foreground uppercase pt-0.5">
                        Died {sch.diedAH} AH
                      </p>
                    )}
                  </div>
                </div>

                {/* Library Catalog Style Metric Capsule */}
                {bookCount > 0 && (
                  <div className="text-xs font-semibold text-foreground bg-background border border-border/50 rounded-sm px-2.5 py-1.5 inline-block w-fit">
                    {bookCount} {bookCount === 1 ? "work available" : "works available"}
                  </div>
                )}

                {/* 3. Previews Deck: Line-clamp labels beneath the cover jackets */}
                {featuredBooks.length > 0 && (
                  <div className="space-y-3 border-t border-border/50 pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      {featuredBooks.map((book) => (
                        <Link
                          key={book.id}
                          href={`/books/${book.id}`}
                          className="group/book flex flex-col space-y-1.5"
                        >
                          {book.coverImage ? (
                            <div className="relative aspect-[3/4] overflow-hidden bg-background border border-border rounded-sm">
                              <img
                                src={book.coverImage}
                                alt={`Cover art for ${book.title}`}
                                className="w-full h-full object-cover grayscale-[15%] group-hover/book:grayscale-0 transition duration-normal ease-standard"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[3/4] bg-background border border-border border-dashed flex items-center justify-center rounded-sm p-1">
                              <span className="text-[8px] font-serif text-muted-foreground text-center line-clamp-3">
                                {book.title}
                              </span>
                            </div>
                          )}
                          {/* Title text rendered cleanly below, completely removing mobile overlay limits */}
                          <p className="text-[10px] font-medium text-foreground line-clamp-1 leading-tight px-0.5 group-hover/book:text-primary transition-colors">
                            {book.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Action Core: Traditional, clean text-link mapping background-only states */}
                <div className="pt-2 border-t border-border/40">
                  <Link
                    href={`/books?authorId=${sch.id}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 py-2.5 bg-background hover:bg-primary text-foreground hover:text-primary-foreground border border-border hover:border-primary text-xs font-sans font-semibold rounded-sm transition-all duration-fast ease-standard cursor-pointer"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-fast ease-standard group-hover/card:translate-x-0.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

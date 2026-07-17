// app/components/home/StudyLevels.tsx
import React from "react";
import { ArrowRight, BookOpen, Library, Landmark } from "lucide-react";

interface FeaturedBook {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
}

interface LevelStat {
  level: string;
  count: number;
  books: FeaturedBook[];
}

interface StudyLevelsProps {
  levelStats: LevelStat[];
}

export function StudyLevels({ levelStats }: StudyLevelsProps) {
  // Traditional Academic Journey definition mapping into our system tokens
  const levels = [
    {
      title: "Beginning the Journey (Mubtadi)",
      slug: "MUBTADI",
      icon: BookOpen,
      desc: "Start with essential texts that build a strong foundation of belief, worship, and classical principles before moving to complex commentaries.",
    },
    {
      title: "Intermediate Expansion (Mutawassit)",
      slug: "MUTAWASSIT",
      icon: Library,
      desc: "Advance into comprehensive annotations, detailed scholarly explanations, and a deeper analysis of primary Islamic disciplines.",
    },
    {
      title: "Advanced Scholarly Research (Mutaqaddim)",
      slug: "MUTAQADDIM",
      icon: Landmark,
      desc: "Engage with extensive comparative research works, detailed master manuscripts, and authoritative multi-volume literature collections.",
    },
  ];

  return (
    <section
      id="study-tracks"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24 py-4"
    >
      {/* 1. Curatorial Introductory Text Stack */}
      <div className="max-w-3xl space-y-2">
        <h2 className="font-serif text-heading font-bold text-foreground">
          Study Levels
        </h2>
        <p className="font-sans text-body text-muted-foreground leading-relaxed">
          Our collection is organized according to the traditional stages of study, helping readers master foundational texts before progressing to advanced academic research. 
          <span className="block mt-1.5 text-label font-medium text-primary bg-secondary/20 border border-secondary px-3 py-1 rounded-sm w-fit">
            💡 **Not sure where to begin?** Most readers should start with the **Beginner (Mubtadi)** collection.
          </span>
        </p>
      </div>

      {/* 2. Structured Learning Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((lvl, index) => {
          const Icon = lvl.icon;
          const stat = levelStats.find((s) => s.level === lvl.slug);
          const books = stat?.books || [];
          const totalCount = stat?.count || 0;
          const remainingCount = Math.max(0, totalCount - books.length);

          return (
            <div
              key={index}
              className="bg-card border border-border/80 rounded-sm p-5 shadow-none flex flex-col justify-between space-y-6 select-none group"
            >
              {/* Upper Details Module */}
              <div className="space-y-4">
                {/* Unified, unified line stroke framing using primary clay-brown accent */}
                <div className="w-9 h-9 rounded-sm bg-background border border-border/60 flex items-center justify-center text-primary">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-title text-foreground">
                    {lvl.title}
                  </h4>
                  <p className="font-sans text-label text-muted-foreground leading-relaxed">
                    {lvl.desc}
                  </p>
                </div>
              </div>

              {/* Middle Metrics Tag: Flat, quiet index label style */}
              <div className="text-xs font-semibold text-foreground bg-background border border-border/40 rounded-sm px-3 py-1.5 inline-block w-fit">
                {totalCount} {totalCount === 1 ? "available work" : "available works"}
              </div>

              {/* 3. Representative Titles Frame: Banish dark hover overlaps */}
              {books.length > 0 && (
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Representative Titles
                  </p>
                  
                  {/* Outer flex column grouping book blocks underneath their covers */}
                  <div className="grid grid-cols-3 gap-3">
                    {books.map((book) => (
                      <div key={book.id} className="space-y-1.5 flex flex-col">
                        {book.coverImage ? (
                          <div className="relative aspect-[3/4] overflow-hidden bg-background border border-border rounded-sm">
                            <img
                              src={book.coverImage}
                              alt={`Cover art for ${book.title}`}
                              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-normal ease-standard"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[3/4] bg-background border border-border border-dashed flex items-center justify-center rounded-sm p-1">
                            <span className="text-[8px] text-muted-foreground text-center line-clamp-3">
                              {book.title}
                            </span>
                          </div>
                        )}
                        {/* Title text rendered cleanly below, completely removing e-commerce overlay shades */}
                        <p className="text-[10px] font-medium text-foreground line-clamp-1 leading-tight px-0.5">
                          {book.title}
                        </p>
                      </div>
                    ))}
                  </div>

                  {remainingCount > 0 && (
                    <p className="font-sans text-[10px] text-muted-foreground font-medium text-center bg-background/50 py-1 border border-border/20 rounded-sm">
                      + View all {totalCount} titles in this pathway
                    </p>
                  )}
                </div>
              )}

              {/* 4. Action Core: Anchored text links triggering color states cleanly */}
              <div className="pt-2 border-t border-border/40">
                <a
                  href={`/books?level=${lvl.slug}`}
                  className="inline-flex items-center gap-2 font-sans font-semibold text-label text-primary hover:text-primary/80 transition-colors duration-fast ease-standard cursor-pointer"
                >
                  <span>Begin Learning</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-fast ease-standard group-hover:translate-x-1" />
                </a>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}

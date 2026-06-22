import React from "react";
import Link from "next/link";
import { ArrowRight, BookMarked, Layers, Award } from "lucide-react";

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
  const levels = [
    {
      title: "Beginner (Mubtadi)",
      slug: "MUBTADI",
      icon: BookMarked,
      desc: "Foundational texts introducing essential concepts, terminology, and principles.",
      border: "hover:border-emerald-500",
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50/50",
    },
    {
      title: "Intermediate (Mutawassit)",
      slug: "MUTAWASSIT",
      icon: Layers,
      desc: "Detailed commentaries, explanations, and deeper exploration of core subjects.",
      border: "hover:border-blue-500",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50/50",
    },
    {
      title: "Advanced (Mutaqaddim)",
      slug: "MUTAQADDIM",
      icon: Award,
      desc: "Advanced references, comparative works, research texts, and multi-volume collections.",
      border: "hover:border-rose-500",
      iconColor: "text-rose-500",
      bgColor: "bg-rose-50/50",
    },
  ];

  return (
    <div
      id="study-tracks"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24"
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 tracking-tight">
          Structured Curriculums
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Discover books according to your current stage of study and academic
          progression.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((lvl, index) => {
          const Icon = lvl.icon;
          const stat = levelStats.find((s) => s.level === lvl.slug);
          const books = stat?.books || [];
          const totalCount = stat?.count || 0;

          return (
            <Link
              key={index}
              href={`/books?level=${lvl.slug}`}
              className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all group flex flex-col justify-between space-y-4 ${lvl.border}`}
            >
              {/* Header Section */}
              <div className="space-y-2">
                <div
                  className={`w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center ${lvl.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 font-serif">
                  {lvl.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {lvl.desc}
                </p>
              </div>

              {/* Book Count Badge */}
              <div className="text-xs font-semibold text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5 inline-block">
                📚 {totalCount} {totalCount === 1 ? "book" : "books"} available
              </div>

              {/* Featured Books Preview Grid */}
              {books.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Featured Samples
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {books.map((book) => (
                      <div
                        key={book.id}
                        className="group/book rounded-lg overflow-hidden border border-slate-100 hover:border-slate-300 transition"
                      >
                        {book.coverImage ? (
                          <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover/book:scale-105 transition duration-200"
                            />
                            {/* Title tooltip on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/book:opacity-100 transition duration-200 flex items-end p-2">
                              <p className="text-[8px] text-white font-semibold line-clamp-2 leading-tight">
                                {book.title}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                            <span className="text-[7px] font-serif text-slate-400 text-center p-1 line-clamp-2">
                              {book.title}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    + {Math.max(0, totalCount - books.length)} more
                  </p>
                </div>
              )}

              {/* CTA Footer */}
              <div className="pt-2 text-xs font-bold text-slate-400 group-hover:text-slate-800 flex items-center gap-1 transition-colors">
                Explore All{" "}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
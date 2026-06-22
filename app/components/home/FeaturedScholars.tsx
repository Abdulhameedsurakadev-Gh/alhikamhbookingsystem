import React from "react";
import Link from "next/link";
import { Quote } from "lucide-react";

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
    <div className="bg-slate-950 py-12 text-white border-y border-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-100 tracking-tight">
            Featured Islamic Scholars
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Browse collections organized by renowned scholars and authors whose works have shaped Islamic scholarship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scholarStats.map((sch) => {
            const featuredBooks = sch.featuredBooks || [];
            const bookCount = sch.bookCount || 0;

            return (
              <div
                key={sch.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:border-emerald-600/50"
              >
                {/* Scholar Info Header */}
                <div className="space-y-1.5 relative">
                  <Quote className="w-8 h-8 text-emerald-500/10 absolute -top-2 -left-2" />
                  <h4 className="font-serif font-bold text-base text-slate-200">
                    {sch.name}
                  </h4>
                  {sch.nameArabic && (
                    <p
                      className="text-sm font-arabic text-emerald-400 font-medium"
                      dir="rtl"
                    >
                      {sch.nameArabic}
                    </p>
                  )}
                  {sch.diedAH && (
                    <p className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                      Died: {sch.diedAH} AH
                    </p>
                  )}
                </div>

                {/* Book Count Badge */}
                {bookCount > 0 && (
                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 rounded-lg px-2.5 py-1.5 inline-block border border-emerald-900/50">
                    📚 {bookCount} {bookCount === 1 ? "book" : "books"}
                  </div>
                )}

                {/* Featured Books Preview Grid */}
                {featuredBooks.length > 0 && (
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Featured Works
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {featuredBooks.map((book) => (
                        <Link
                          key={book.id}
                          href={`/books/${book.id}`}
                          className="group/book rounded-lg overflow-hidden border border-slate-800 hover:border-emerald-600/50 transition"
                        >
                          {book.coverImage ? (
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover/book:scale-105 transition duration-200"
                              />
                              {/* Title tooltip on hover */}
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/book:opacity-100 transition duration-200 flex items-end p-2">
                                <p className="text-[8px] text-white font-semibold line-clamp-2 leading-tight">
                                  {book.title}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                              <span className="text-[7px] font-serif text-slate-500 text-center p-1 line-clamp-2">
                                {book.title}
                              </span>
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={`/books?authorId=${sch.id}`}
                  className="inline-flex w-full items-center justify-center py-2 bg-slate-950 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-600 text-xs font-bold rounded-lg text-slate-300 hover:text-white transition-all"
                >
                  View All Works
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
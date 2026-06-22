import React from "react";
import Link from "next/link";
import { BookOpen, Scale, BookMarked, BookText, Languages, Users } from "lucide-react";

interface CategoryStats {
  id: string;
  name: string;
  slug: string;
  bookCount: number;
}

interface SubjectChipsProps {
  categoryStats: CategoryStats[];
}

// Map category names to appropriate icons
const getCategoryIcon = (slug: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    aqeedah: <BookOpen className="w-4 h-4" />,
    fiqh: <Scale className="w-4 h-4" />,
    quran: <BookMarked className="w-4 h-4" />,
    hadith: <BookText className="w-4 h-4" />,
    tafsir: <BookText className="w-4 h-4" />,
    arabic: <Languages className="w-4 h-4" />,
    seerah: <Users className="w-4 h-4" />,
    lugha: <Languages className="w-4 h-4" />,
  };
  return iconMap[slug] || <BookOpen className="w-4 h-4" />;
};

export function SubjectChips({ categoryStats }: SubjectChipsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Explore Core Islamic Disciplines
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Browse our curated collection across all major fields of Islamic scholarship
        </p>
      </div>

      {/* Horizontal Scroll Containers on mobile view, structural flex wrap on desktop */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 sm:pb-0 sm:flex-wrap mask-image">
        {categoryStats.map((cat) => (
          <Link
            key={cat.id}
            href={`/books?category=${cat.slug}`}
            className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/30 shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <span className="text-slate-500 group-hover:text-emerald-700 transition-colors">
              {getCategoryIcon(cat.slug)}
            </span>
            <span>{cat.name}</span>
            <span className="inline-flex items-center justify-center h-5 min-w-5 bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 rounded-full text-[10px] font-bold transition-colors">
              {cat.bookCount}
            </span>
          </Link>
        ))}
      </div>

      {/* Total catalog stat bar */}
      <div className="text-[11px] text-slate-500 font-medium pt-1">
        📚 Total:{" "}
        <span className="font-bold text-slate-700">
          {categoryStats.reduce((sum, cat) => sum + cat.bookCount, 0)} books
        </span>{" "}
        across{" "}
        <span className="font-bold text-slate-700">
          {categoryStats.length} disciplines
        </span>
      </div>
    </div>
  );
}
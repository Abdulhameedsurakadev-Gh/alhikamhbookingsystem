import React from "react";
import Link from "next/link";
import { Hash } from "lucide-react";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
}

export function SubjectChips({ categories }: { categories: CategoryNode[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
        Explore Core Islamic Discipline
      </h3>
      
      {/* Horizontal Scroll Containers on mobile view, structural flex wrap on desktop */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 sm:flex-wrap mask-image">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/books?category=${cat.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-800 hover:bg-emerald-50/20 shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

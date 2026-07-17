// app/components/home/SubjectChips.tsx
import React from "react";
import Link from "next/link";
import { Library, Scale, Bookmark, FileText, Languages, History, HelpCircle } from "lucide-react";

interface CategoryStats {
  id: string;
  name: string;
  slug: string;
  bookCount: number;
}

interface SubjectChipsProps {
  categoryStats: CategoryStats[];
}

const getCategoryIcon = (slug: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    aqeedah: <Library className="w-3.5 h-3.5 stroke-[1.5]" />,
    fiqh: <Scale className="w-3.5 h-3.5 stroke-[1.5]" />,
    quran: <Bookmark className="w-3.5 h-3.5 stroke-[1.5]" />,
    hadith: <FileText className="w-3.5 h-3.5 stroke-[1.5]" />,
    tafsir: <FileText className="w-3.5 h-3.5 stroke-[1.5]" />,
    arabic: <Languages className="w-3.5 h-3.5 stroke-[1.5]" />,
    seerah: <History className="w-3.5 h-3.5 stroke-[1.5]" />,
    lugha: <Languages className="w-3.5 h-3.5 stroke-[1.5]" />,
  };
  return iconMap[slug] || <HelpCircle className="w-3.5 h-3.5 stroke-[1.5]" />;
};

export function SubjectChips({ categoryStats }: SubjectChipsProps) {
  const disciplineOrder = ["aqeedah", "quran", "fiqh", "hadith", "tafsir", "seerah", "arabic", "lugha"];

  const sortedCategories = [...categoryStats].sort((a, b) => {
    const idxA = disciplineOrder.indexOf(a.slug);
    const idxB = disciplineOrder.indexOf(b.slug);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  const totalBooksCount = categoryStats.reduce((sum, cat) => sum + cat.bookCount, 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 py-4">

      <div className="space-y-1">
        <h3 className="font-serif text-title font-bold text-foreground">
          Browse by Discipline
        </h3>
        <p className="font-sans text-label text-muted-foreground leading-relaxed">
          Discover traditional volumes arranged according to the foundational sciences of Islamic knowledge.
        </p>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 sm:pb-0 sm:flex-wrap scrollbar-none scroll-smooth">
        {sortedCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/books?category=${cat.slug}`}
            /*
              Before: hover:bg-secondary/20 hover:border-primary/40
              After:  hover:bg-surface-hover hover:border-border-hover
              Same visual result — now it's a named decision instead of a
              fraction someone has to remember and retype correctly.
            */
            className="group inline-flex items-center gap-3 px-4 py-2.5 bg-card border border-border/80 rounded-sm text-label font-medium text-foreground transition-colors duration-fast ease-standard hover:bg-surface-hover hover:border-border-hover whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="text-primary transition-colors">
              {getCategoryIcon(cat.slug)}
            </span>

            <span className="font-sans">{cat.name}</span>

            <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-background border border-border/40 text-muted-foreground text-[10px] font-bold rounded-sm transition-colors group-hover:text-primary group-hover:border-primary/20">
              {cat.bookCount} vol
            </span>
          </Link>
        ))}
      </div>

      <div className="text-xs text-muted-foreground font-medium pt-1 border-t border-border/30 flex items-center gap-1.5 select-none">
        <span>Catalogue Summary:</span>
        <span className="font-bold text-foreground">{totalBooksCount} volumes</span>
        <span className="text-border">•</span>
        <span className="font-bold text-foreground">{categoryStats.length} primary sciences indexed</span>
      </div>

    </section>
  );
}
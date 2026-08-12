// app/(store)/books/FilterSidebar.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from "lucide-react";

interface FilterSidebarProps {
  categories: { id: string; name: string; slug: string }[];
  activeFilters: {
    search?: string;
    category?: string;
    level?: string;
    textType?: string;
    coverType?: string;
    volumeType?: string;
  };
}

export function FilterSidebar({ categories, activeFilters }: FilterSidebarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const activeFilterCount = Object.values(activeFilters).filter(val => val).length;

  const updateFilterUrl = (key: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (!value || searchParams.get(key) === value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
    setIsDrawerOpen(false);
  };

  const levels = [
    { label: "Beginner (Mubtadi)", value: "MUBTADI" },
    { label: "Intermediate (Mutawassit)", value: "MUTAWASSIT" },
    { label: "Advanced (Mutaqaddim)", value: "MUTAQADDIM" }
  ];

  const textTypes = [
    { label: "Matn (Source Text)", value: "MATN" },
    { label: "Sharh (Commentary)", value: "SHARH" },
    { label: "Tahqiq (Verification)", value: "TAHQIQ" }
  ];

  const coverTypes = [
    { label: "Soft Cover (Ghilaf Waraqi)", value: "AL_GHILAF_AL_WARAQI" },
    { label: "Hard Cover (Ghilaf Muqawwa)", value: "AL_GHILAF_AL_MUQAWWA" }
  ];

  const volumeTypes = [
    { label: "Single Volume (Kitab Mufrad)", value: "KITAB_MUFRAD" },
    { label: "Multi-Volume Set", value: "MAJMUAT_MUJALLADAT" },
    { label: "Compendium (Majmu)", value: "MAJMU" }
  ];

  const filtersMarkup = (
    <>
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Category Subject</h4>
        <div className="flex flex-col gap-2 text-sm max-h-48 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilterUrl("category", cat.slug)}
              className={`text-left px-3 py-2 rounded-sm text-xs font-medium transition-colors duration-fast cursor-pointer ${
                activeFilters.category === cat.slug
                  ? "bg-secondary text-secondary-foreground font-bold border-l-2 border-primary"
                  : "text-foreground hover:bg-surface-hover border-l-2 border-transparent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Knowledge Level</h4>
        <div className="flex flex-col gap-2.5">
          {levels.map((lvl) => (
            <label key={lvl.value} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:text-primary-hover transition-colors">
              <input
                type="checkbox"
                checked={activeFilters.level === lvl.value}
                onChange={() => updateFilterUrl("level", lvl.value)}
                className="rounded text-primary border-border focus:ring-primary h-4 w-4 cursor-pointer accent-primary"
              />
              <span className={activeFilters.level === lvl.value ? "text-primary font-semibold" : ""}>
                {lvl.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Text Classification</h4>
        <div className="flex flex-col gap-2.5">
          {textTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:text-primary-hover transition-colors">
              <input
                type="checkbox"
                checked={activeFilters.textType === type.value}
                onChange={() => updateFilterUrl("textType", type.value)}
                className="rounded text-primary border-border focus:ring-primary h-4 w-4 cursor-pointer accent-primary"
              />
              <span className={activeFilters.textType === type.value ? "text-primary font-semibold" : ""}>
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Volume Type</h4>
        <div className="flex flex-col gap-2.5">
          {volumeTypes.map((vol) => (
            <label key={vol.value} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:text-primary-hover transition-colors">
              <input
                type="checkbox"
                checked={activeFilters.volumeType === vol.value}
                onChange={() => updateFilterUrl("volumeType", vol.value)}
                className="rounded text-primary border-border focus:ring-primary h-4 w-4 cursor-pointer accent-primary"
              />
              <span className={activeFilters.volumeType === vol.value ? "text-primary font-semibold" : ""}>
                {vol.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Cover Binding</h4>
        <div className="flex flex-col gap-2.5">
          {coverTypes.map((cov) => (
            <label key={cov.value} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:text-primary-hover transition-colors">
              <input
                type="checkbox"
                checked={activeFilters.coverType === cov.value}
                onChange={() => updateFilterUrl("coverType", cov.value)}
                className="rounded text-primary border-border focus:ring-primary h-4 w-4 cursor-pointer accent-primary"
              />
              <span className={activeFilters.coverType === cov.value ? "text-primary font-semibold" : ""}>
                {cov.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sticky Action Bar */}
      <div className="block lg:hidden sticky top-20 z-40 bg-background border-y border-border py-3 px-4">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex w-full items-center justify-between rounded-sm border border-border bg-card py-2.5 px-4 text-sm font-semibold text-foreground hover:bg-surface-hover transition-colors duration-fast cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>Filters & Classifications</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-card border border-border rounded-md p-5 space-y-6 sticky top-24">
        <div className="flex items-center justify-between border-b border-border pb-3 gap-2">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Filter Catalog</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary-hover transition-colors cursor-pointer font-semibold"
              title="Clear all active filters"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
        {filtersMarkup}
      </div>

      {/* Mobile Drawer — genuinely a dialog/overlay, so shadow-dialog and
          rounded-lg (per Border Radius: "Large — dialogs") are the correct
          fit here, unlike most other surfaces on this page. */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/40 lg:hidden flex items-end justify-center animate-in fade-in">
          <div className="w-full max-h-[85vh] bg-background rounded-t-lg shadow-dialog flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-border p-4 sticky top-0 bg-background rounded-t-lg">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Filter Books</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-hover text-muted-foreground cursor-pointer transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-6 overflow-y-auto flex-1 pb-10">
              {filtersMarkup}
            </div>

            <div className="border-t border-border p-4 bg-card flex gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex-1 bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-sm text-sm transition-colors duration-fast hover:bg-surface-hover cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 rounded-sm text-sm transition-colors duration-fast hover:bg-primary-hover cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
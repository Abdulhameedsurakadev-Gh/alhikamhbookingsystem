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

  // Count active filters
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
      {/* 1. Category Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Category Subject</h4>
        <div className="flex flex-col gap-2 text-sm max-h-48 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilterUrl("category", cat.slug)}
              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition duration-200 cursor-pointer ${
                activeFilters.category === cat.slug
                  ? "bg-emerald-100 text-emerald-900 font-bold border-l-2 border-emerald-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 border-l-2 border-transparent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Knowledge Level Filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Knowledge Level</h4>
        <div className="flex flex-col gap-2.5">
          {levels.map((lvl) => (
            <label key={lvl.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-emerald-700 transition">
              <input
                type="checkbox"
                checked={activeFilters.level === lvl.value}
                onChange={() => updateFilterUrl("level", lvl.value)}
                className="rounded text-emerald-700 border-slate-300 focus:ring-emerald-600 h-4 w-4 cursor-pointer accent-emerald-700"
              />
              <span className={activeFilters.level === lvl.value ? "text-emerald-800 font-semibold" : ""}>
                {lvl.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Text Types Filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Text Classification</h4>
        <div className="flex flex-col gap-2.5">
          {textTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-emerald-700 transition">
              <input
                type="checkbox"
                checked={activeFilters.textType === type.value}
                onChange={() => updateFilterUrl("textType", type.value)}
                className="rounded text-emerald-700 border-slate-300 focus:ring-emerald-600 h-4 w-4 cursor-pointer accent-emerald-700"
              />
              <span className={activeFilters.textType === type.value ? "text-emerald-800 font-semibold" : ""}>
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Volume Type Filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Volume Type</h4>
        <div className="flex flex-col gap-2.5">
          {volumeTypes.map((vol) => (
            <label key={vol.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-emerald-700 transition">
              <input
                type="checkbox"
                checked={activeFilters.volumeType === vol.value}
                onChange={() => updateFilterUrl("volumeType", vol.value)}
                className="rounded text-emerald-700 border-slate-300 focus:ring-emerald-600 h-4 w-4 cursor-pointer accent-emerald-700"
              />
              <span className={activeFilters.volumeType === vol.value ? "text-emerald-800 font-semibold" : ""}>
                {vol.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Cover Type Filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Cover Binding</h4>
        <div className="flex flex-col gap-2.5">
          {coverTypes.map((cov) => (
            <label key={cov.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-emerald-700 transition">
              <input
                type="checkbox"
                checked={activeFilters.coverType === cov.value}
                onChange={() => updateFilterUrl("coverType", cov.value)}
                className="rounded text-emerald-700 border-slate-300 focus:ring-emerald-600 h-4 w-4 cursor-pointer accent-emerald-700"
              />
              <span className={activeFilters.coverType === cov.value ? "text-emerald-800 font-semibold" : ""}>
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
      <div className="block lg:hidden sticky top-20 z-40 bg-white border-y border-slate-200 py-3 px-4">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-sm"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span>Filters & Classifications</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 bg-emerald-700 text-white text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white border border-slate-200 rounded-xl p-5 space-y-6 shadow-sm sticky top-24">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Filter Catalog</h3>
          {activeFilterCount > 0 && (
            <button 
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-700 transition cursor-pointer font-semibold"
              title="Clear all active filters"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
        {filtersMarkup}
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden flex items-end justify-center animate-in fade-in">
          <div className="w-full max-h-[85vh] bg-white rounded-t-2xl shadow-xl flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Filter Books</h3>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer transition"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-6 overflow-y-auto flex-1 pb-10">
              {filtersMarkup}
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50 flex gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition hover:bg-slate-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm transition hover:bg-emerald-900 shadow-md cursor-pointer"
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
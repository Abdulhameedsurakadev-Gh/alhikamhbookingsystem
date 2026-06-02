// app/(store)/books/FilterSidebar.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

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

  const updateFilterUrl = (key: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    
    if (!value || searchParams.get(key) === value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    
    router.push(`${pathname}?${searchParams.toString()}`);
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

  // Added based on your CoverType enum
  const coverTypes = [
    { label: "Soft Cover (Ghilaf Waraqi)", value: "AL_GHILAF_AL_WARAQI" },
    { label: "Hard Cover (Ghilaf Muqawwa)", value: "AL_GHILAF_AL_MUQAWWA" }
  ];

  // Added based on your VolumeType enum
  const volumeTypes = [
    { label: "Single Volume (Kitab Mufrad)", value: "KITAB_MUFRAD" },
    { label: "Multi-Volume Set", value: "MAJMUAT_MUJALLADAT" },
    { label: "Compendium (Majmu)", value: "MAJMU" }
  ];

  const filtersMarkup = (
    <>
      {/* 1. Category Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Category Subject</h4>
        <div className="flex flex-col gap-1.5 text-sm max-h-48 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilterUrl("category", cat.slug)}
              className={`text-left px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                activeFilters.category === cat.slug
                  ? "bg-emerald-50 text-emerald-800 font-bold border-l-2 border-emerald-700 pl-1.5"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Knowledge Level Filter */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Knowledge Level</h4>
        <div className="flex flex-col gap-2">
          {levels.map((lvl) => (
            <label key={lvl.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={activeFilters.level === lvl.value}
                onChange={() => updateFilterUrl("level", lvl.value)}
                className="rounded text-emerald-700 border-slate-300 focus:ring-emerald-600 h-4 w-4 cursor-pointer"
              />
              <span className={activeFilters.level === lvl.value ? "text-emerald-800 font-bold" : ""}>
                {lvl.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Text Types Filter */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Text Classification</h4>
        <div className="flex flex-col gap-2">
          {textTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={activeFilters.textType === type.value}
                onChange={() => updateFilterUrl("textType", type.value)}
                className="rounded text-emerald-700 border-slate-300 focus:ring-emerald-600 h-4 w-4 cursor-pointer"
              />
              <span className={activeFilters.textType === type.value ? "text-emerald-800 font-bold" : ""}>
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Volume Type Filter (NEW) */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Volume Type</h4>
        <div className="flex flex-col gap-2">
          {volumeTypes.map((vol) => (
            <label key={vol.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={activeFilters.volumeType === vol.value}
                onChange={() => updateFilterUrl("volumeType", vol.value)}
                className="rounded text-emerald-700 border-slate-300 focus:ring-emerald-600 h-4 w-4 cursor-pointer"
              />
              <span className={activeFilters.volumeType === vol.value ? "text-emerald-800 font-bold" : ""}>
                {vol.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Cover Type Filter (NEW) */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Cover Binding</h4>
        <div className="flex flex-col gap-2">
          {coverTypes.map((cov) => (
            <label key={cov.value} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-emerald-700">
              <input
                type="checkbox"
                checked={activeFilters.coverType === cov.value}
                onChange={() => updateFilterUrl("coverType", cov.value)}
                className="rounded text-emerald-700 border-slate-300 focus:ring-emerald-600 h-4 w-4 cursor-pointer"
              />
              <span className={activeFilters.coverType === cov.value ? "text-emerald-800 font-bold" : ""}>
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
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span>Filters & Classifications</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white border border-slate-200 rounded-xl p-5 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Filter Catalog</h3>
          <button onClick={() => router.push(pathname)} className="text-xs text-slate-400 hover:text-emerald-700 transition cursor-pointer">Reset All</button>
        </div>
        {filtersMarkup}
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden flex items-end justify-center">
          <div className="w-full max-h-[85vh] bg-white rounded-t-2xl shadow-xl flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Filter Books</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-6 overflow-y-auto flex-1 pb-10">
              {filtersMarkup}
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm transition hover:bg-emerald-900 shadow-md cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

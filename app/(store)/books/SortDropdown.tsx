// app/(store)/books/SortDropdown.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function SortDropdown({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentSort}
        onChange={(e) => {
          // Type-safe URL mutations natively handled through Next.js state hooks
          const nextParams = new URLSearchParams(searchParams.toString());
          
          if (e.target.value) {
            nextParams.set("sort", e.target.value);
          } else {
            nextParams.delete("sort");
          }
          
          // Clear current loaded page offsets to reset scroll states during view changes
          nextParams.delete("page");
          
          router.push(`${pathname}?${nextParams.toString()}`);
        }}
        className="block w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
      >
        <option value="">Sort: Default</option>
        <option value="newest">Newest Added</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="title-asc">Title: A to Z</option>
        <option value="title-desc">Title: Z to A</option>
      </select>
    </div>
  );
}

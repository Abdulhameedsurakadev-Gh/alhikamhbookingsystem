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
          const nextParams = new URLSearchParams(searchParams.toString());

          if (e.target.value) {
            nextParams.set("sort", e.target.value);
          } else {
            nextParams.delete("sort");
          }

          nextParams.delete("page");

          router.push(`${pathname}?${nextParams.toString()}`);
        }}
        className="block w-full rounded-sm border border-border bg-card py-1.5 pl-3 pr-8 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-fast cursor-pointer"
      >
        <option value="">Sort: Default</option>
        <option value="newest">Newest Added</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        {/* Fixed: these values now match what books/page.tsx's switch
            statement actually checks for ("title-az" / "title-za") — they
            previously said "title-asc" / "title-desc", which the page
            silently ignored, so title sorting has never worked. */}
        <option value="title-az">Title: A to Z</option>
        <option value="title-za">Title: Z to A</option>
      </select>
    </div>
  );
}
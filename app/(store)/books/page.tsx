// app/(store)/books/page.tsx
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { FilterSidebar } from "./FilterSidebar";
import { KnowledgeLevel, TextType, CoverType, VolumeType } from "@prisma/client";
import { Search, X, BookOpen, Star, Sparkles } from "lucide-react";
import { SortDropdown } from "./SortDropdown";


interface SearchParams {
  search?: string;
  category?: string;
  level?: string;
  textType?: string;
  coverType?: string;
  volumeType?: string;
  sort?: string;
  page?: string;
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const categorySlug = params.category || "";
  const level = params.level as KnowledgeLevel | undefined;
  const textType = params.textType as TextType | undefined;
  const coverType = params.coverType as CoverType | undefined;
  const volumeType = params.volumeType as VolumeType | undefined;
  
  // Sorting Configuration
  const sort = params.sort || "newest";

  // Pagination Configuration 
  const BOOKS_PER_PAGE = 12; // Standard view limit per load batch
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const skip = (currentPage - 1) * BOOKS_PER_PAGE;

  // 1. Build Unified Prisma Dynamic Conditions Object
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { author: { name: { contains: search, mode: "insensitive" } } },
      { isbn: { contains: search, mode: "insensitive" } },
      { publisher: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categorySlug) whereClause.category = { slug: categorySlug };
  if (level) whereClause.knowledgeLevel = level;
  if (textType) whereClause.textType = textType;
  if (coverType) whereClause.coverType = coverType;
  if (volumeType) whereClause.volumeType = volumeType;

  // 2. Build Unified Prisma Dynamic Sorting Array Block
  let orderByClause: any = { createdAt: "desc" }; // default fallback
  if (sort === "price-asc") orderByClause = { price: "asc" };
  if (sort === "price-desc") orderByClause = { price: "desc" };
  if (sort === "title-az") orderByClause = { title: "asc" };
  if (sort === "title-za") orderByClause = { title: "desc" };

  // 3. Execute DB Operations (Running parallel queries for high processing velocity)
  const [allBooks, totalFilteredCount, totalStoreCount, categories] = await Promise.all([
    prisma.book.findMany({
      where: whereClause,
      include: { author: true, category: true, explanations: true },
      orderBy: orderByClause,
      take: currentPage * BOOKS_PER_PAGE, // Pulls cumulative counts to support "Load More" appends smoothly
    }),
    prisma.book.count({ where: whereClause }), // Filtered criteria count
    prisma.book.count(), // absolute catalog maximum limit
    prisma.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" } })
  ]);

  // Fetch contextual carousels only when no active filter constraints are present
  const hasActiveFilters = search || categorySlug || level || textType || coverType || volumeType;
  
  const newArrivals = !hasActiveFilters
    ? await prisma.book.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { author: true, category: true } })
    : [];

  const beginnerFriendly = !hasActiveFilters
    ? await prisma.book.findMany({ where: { knowledgeLevel: "MUBTADI" }, take: 5, include: { author: true, category: true } })
    : [];

  // Helper url modifier path assembly logic
  const getRemoveFilterUrl = (keyToDelete: string) => {
    const activeKeys = { ...params };
    delete (activeKeys as any)[keyToDelete];
    const searchParams = new URLSearchParams();
    Object.entries(activeKeys).forEach(([key, val]) => {
      if (val) searchParams.set(key, val);
    });
    return `/books?${searchParams.toString()}`;
  };

  const hasNextPage = totalFilteredCount > allBooks.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-0 pb-16">
      
      {/* Search Header Banner */}
      <div className="sticky top-0 z-30 bg-slate-50 py-2.5 lg:static lg:bg-transparent lg:py-0">
        <form action="/books" method="GET" className="relative w-full shadow-sm lg:shadow-none">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search book titles, scholars, keywords, ISBN barcodes..."
            className="w-full bg-white text-slate-900 pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm transition shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          {sort && <input type="hidden" name="sort" value={sort} />}
        </form>
      </div>

      {/* Quick Topic Chips */}
      <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="flex gap-2 whitespace-nowrap py-1">
          <Link
            href="/books"
            className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full transition ${
              !categorySlug ? "bg-emerald-800 text-amber-100" : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-600"
            }`}
          >
            All Subjects
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/books?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
              className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                categorySlug === cat.slug ? "bg-emerald-800 text-amber-100" : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-600"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Pre-Catalog Discovery Sections */}
      {!hasActiveFilters && (
        <div className="space-y-8">
          <section className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-2xl p-5 shadow-md border border-emerald-800">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-300" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-200">Start Learning By Study Level</h2>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Link href={`/books?level=MUBTADI${sort ? `&sort=${sort}` : ""}`} className="bg-white/10 hover:bg-white/15 text-center p-2 rounded-xl text-xs font-bold transition border border-white/5 shadow-sm">
                Beginner <span className="block text-[9px] font-normal text-emerald-300 font-mono mt-0.5">Mubtadi</span>
              </Link>
              <Link href={`/books?level=MUTAWASSIT${sort ? `&sort=${sort}` : ""}`} className="bg-white/10 hover:bg-white/15 text-center p-2 rounded-xl text-xs font-bold transition border border-white/5 shadow-sm">
                Intermediate <span className="block text-[9px] font-normal text-emerald-300 font-mono mt-0.5">Mutawassit</span>
              </Link>
              <Link href={`/books?level=MUTAQADDIM${sort ? `&sort=${sort}` : ""}`} className="bg-white/10 hover:bg-white/15 text-center p-2 rounded-xl text-xs font-bold transition border border-white/5 shadow-sm">
                Advanced <span className="block text-[9px] font-normal text-emerald-300 font-mono mt-0.5">Mutaqaddim</span>
              </Link>
            </div>
          </section>

          {newArrivals.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-1.5 px-1">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="font-serif font-bold text-lg text-slate-900">New Arrivals</h3>
              </div>
              <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0 flex gap-4 pb-2">
                {newArrivals.map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`} className="w-40 flex-shrink-0 bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:border-emerald-600 transition flex flex-col justify-between">
                    <div className="h-36 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-slate-400 font-serif px-2 text-center line-clamp-3">{book.title}</span>
                      )}
                    </div>
                    <div className="mt-2 space-y-0.5 flex-1 flex flex-col justify-end">
                      <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-1">{book.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate">By {book.author.name}</p>
                      <p className="text-xs font-extrabold text-emerald-800 pt-1">GH₵ {Number(book.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {beginnerFriendly.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-1.5 px-1">
                <Star className="h-4 w-4 text-amber-500" />
                <h3 className="font-serif font-bold text-lg text-slate-900">Beginner Friendly Mutoon</h3>
              </div>
              <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0 flex gap-4 pb-2">
                {beginnerFriendly.map((book) => (
                                    <Link key={book.id} href={`/books/${book.id}`} className="w-40 flex-shrink-0 bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:border-emerald-600 transition flex flex-col justify-between">
                    <div className="h-36 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-slate-400 font-serif px-2 text-center line-clamp-3">{book.title}</span>
                      )}
                    </div>
                    <div className="mt-2 space-y-0.5 flex-1 flex flex-col justify-end">
                      <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-1">{book.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate">By {book.author.name}</p>
                      <p className="text-xs font-extrabold text-emerald-800 pt-1">GH₵ {Number(book.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Active Filters Tag Close Chips Panel */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 px-1 pt-2">
          <span className="font-semibold mr-1">Active Criteria:</span>
          {search && (
            <Link href={getRemoveFilterUrl("search")} className="inline-flex items-center gap-1 bg-slate-100 border text-slate-700 px-2.5 py-1 rounded-full hover:bg-rose-50 hover:text-rose-700 transition">
              &quot;{search}&quot; <X className="h-3 w-3" />
            </Link>
          )}
          {categorySlug && (
            <Link href={getRemoveFilterUrl("category")} className="inline-flex items-center gap-1 bg-slate-100 border text-slate-700 px-2.5 py-1 rounded-full hover:bg-rose-50 hover:text-rose-700 transition">
              Subject: {categorySlug} <X className="h-3 w-3" />
            </Link>
          )}
          {level && (
            <Link href={getRemoveFilterUrl("level")} className="inline-flex items-center gap-1 bg-slate-100 border text-slate-700 px-2.5 py-1 rounded-full hover:bg-rose-50 hover:text-rose-700 transition">
              Level: {level} <X className="h-3 w-3" />
            </Link>
          )}
          {textType && (
            <Link href={getRemoveFilterUrl("textType")} className="inline-flex items-center gap-1 bg-slate-100 border text-slate-700 px-2.5 py-1 rounded-full hover:bg-rose-50 hover:text-rose-700 transition">
              Type: {textType} <X className="h-3 w-3" />
            </Link>
          )}
          {volumeType && (
            <Link href={getRemoveFilterUrl("volumeType")} className="inline-flex items-center gap-1 bg-slate-100 border text-slate-700 px-2.5 py-1 rounded-full hover:bg-rose-50 hover:text-rose-700 transition">
              Volume: {volumeType} <X className="h-3 w-3" />
            </Link>
          )}
          {coverType && (
            <Link href={getRemoveFilterUrl("coverType")} className="inline-flex items-center gap-1 bg-slate-100 border text-slate-700 px-2.5 py-1 rounded-full hover:bg-rose-50 hover:text-rose-700 transition">
              Binding: {coverType} <X className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {/* Combined Responsive Filtering Panel Layout Grid Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start pt-2">
        <aside className="lg:col-span-1">
          <FilterSidebar categories={categories} activeFilters={params} />
        </aside>

        <main className="lg:col-span-3 space-y-4">
          
          {/* Catalog Controls: Statistics Indicator & Sorting Action Dropdown Selector */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 px-1">
            
            {/* Catalog Statistics (Feature 11) */}
            <div className="text-xs text-slate-500 font-medium">
              {totalFilteredCount === 0 ? (
                <span>0 Books Found</span>
              ) : (
                <span>
                  Showing{" "} <span className="font-semibold text-slate-800">{allBooks.length}</span>{" "} of {""} 
                  <span className="font-semibold text-slate-800">{totalFilteredCount}</span>{" "} Books
                </span>
              )}
            </div>

            {/* Sorting Interactive Control (Feature 6) */}
            <SortDropdown currentSort={sort} />
          </div>

          {allBooks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center mx-1">
              <p className="text-sm text-slate-500 font-medium">No books match your specific filters.</p>
              <Link href="/books" className="text-xs text-emerald-700 font-semibold underline mt-2 inline-block">
                Reset All Search Filters
              </Link>
            </div>
          ) : (
            <div>
              {/* Layout transformation: Single structural rows on smaller breakpoints, three-tier grid slots on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {allBooks.map((book) => (
                  <div key={book.id} className="flex flex-row lg:flex-col bg-white border border-slate-200 rounded-xl p-3 lg:p-4 shadow-sm hover:shadow-md transition gap-4 group relative">
                    
                    {/* Imagery Canvas Node */}
                    <div className="w-24 h-32 flex-shrink-0 lg:w-full lg:h-52 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover group-hover:scale-102 transition duration-300" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-serif px-2 text-center line-clamp-3">{book.title}</span>
                      )}
                      
                      {/* Top Corner Structural Text Class Indicator Label Tag */}
                      <span className="absolute top-1.5 right-1.5 bg-emerald-800 text-amber-100 font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shadow">
                        {book.textType}
                      </span>
                    </div>

                    {/* Operational Information Columns */}
                    <div className="flex-1 flex flex-col justify-between lg:justify-start lg:space-y-1">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                          {book.category.name} • {book.knowledgeLevel}
                        </span>
                        <h4 className="font-serif font-bold text-sm lg:text-base text-slate-900 group-hover:text-emerald-800 transition line-clamp-2 mt-0.5">
                          {book.title}
                        </h4>
                        <p className="text-xs text-slate-500 italic mt-0.5 truncate">
                          By {book.author.name} {book.author.nameArabic ? `(${book.author.nameArabic})` : ""}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t lg:border-none border-slate-100">
                        <span className="text-sm lg:text-base font-bold text-slate-900">
                          GH₵ {Number(book.price).toFixed(2)}
                        </span>
                        <Link
                          href={`/books/${book.id}`}
                          className="bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-700 font-semibold px-3 py-1.5 rounded-md text-xs transition"
                        >
                          View Book
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
              </div>
          )}
          
          {/* "Load More" Append Control Element (Feature 7) */}
          {allBooks.length < totalFilteredCount && (
            <div className="flex justify-center pt-6">
              <Link
                href={`/books?${(() => {
                  const nextParams = new URLSearchParams();
                  Object.entries(params).forEach(([key, val]) => {
                    if (val && key !== "page") nextParams.set(key, val);
                  });
                  nextParams.set("page", (currentPage + 1).toString());
                  return nextParams.toString();
                })()}`}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs px-6 py-3 shadow transition cursor-pointer"
              >
                Load More Books
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ==========================================================================
   INTERNAL CORE UI EXTENSION SUB-COMPONENTS (Kept inside same file for execution clarity)
   ========================================================================== */


/**
 * Clean Pagination bar tracking page state markers dynamically 
 */
function PaginationControls({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const createPageUrl = (pageNumber: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", pageNumber.toString());
    return `/books?${searchParams.toString()}`;
  };

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
          className={`relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 ${
            currentPage <= 1 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Previous
        </Link>
        <Link
          href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
          className={`relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 ${
            currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Next
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-700">
            Showing page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span> pages
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Link
              href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
              className={`relative inline-flex items-center rounded-l-md border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 ${
                currentPage <= 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Previous
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={createPageUrl(page)}
                className={`relative inline-flex items-center border px-3 py-2 text-xs font-medium ${
                  page === currentPage
                    ? "z-10 bg-emerald-800 text-white border-emerald-800"
                    : "bg-white border-slate-300 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {page}
              </Link>
            ))}
            <Link
              href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
              className={`relative inline-flex items-center rounded-r-md border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 ${
                currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Next
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}


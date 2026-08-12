// app/(store)/books/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "../../../lib/prisma";
import { FilterSidebar } from "./FilterSidebar";
import { KnowledgeLevel, TextType, CoverType, VolumeType } from "@prisma/client";
import { Search, X, BookOpen, Star, Sparkles, AlertCircle } from "lucide-react";
import { SortDropdown } from "./SortDropdown";
import { BookRequestCTA } from "../../components/shared/BookRequestCTA";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PriceDisplay } from "./PriceDisplay";

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

  const sort = params.sort || "newest";

  const BOOKS_PER_PAGE = 12;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  const [session, categories] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    prisma.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" } })
  ]);

  const userRole = session?.user?.role || null;
  // TODO: this cast hides verificationStatus from TypeScript entirely.
  // If better-auth isn't returning this field on session.user, the fix
  // belongs in lib/auth.ts (declaring it as an additional field), not here.
  const isVerified = (session?.user as any)?.verificationStatus === "APPROVED";

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

  let orderByClause: any = { createdAt: "desc" };
  switch (sort) {
    case "price-asc":
      orderByClause = { price: "asc" };
      break;
    case "price-desc":
      orderByClause = { price: "desc" };
      break;
    case "title-az":
      orderByClause = { title: "asc" };
      break;
    case "title-za":
      orderByClause = { title: "desc" };
      break;
  }

  const [allBooks, totalFilteredCount] = await Promise.all([
    prisma.book.findMany({
      where: whereClause,
      include: { author: true, category: true, explanations: true },
      orderBy: orderByClause,
      take: currentPage * BOOKS_PER_PAGE,
    }),
    prisma.book.count({ where: whereClause }),
  ]);

  const hasActiveFilters = search || categorySlug || level || textType || coverType || volumeType;

  const [newArrivals, beginnerFriendly] = hasActiveFilters
    ? [[], []]
    : await Promise.all([
        prisma.book.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { author: true, category: true } }),
        prisma.book.findMany({ where: { knowledgeLevel: "MUBTADI" }, take: 5, include: { author: true, category: true } }),
      ]);

  const getRemoveFilterUrl = (keyToDelete: string) => {
    const activeKeys = { ...params };
    delete (activeKeys as any)[keyToDelete];
    const searchParams = new URLSearchParams();
    Object.entries(activeKeys).forEach(([key, val]) => {
      if (val) searchParams.set(key, val);
    });
    return `/books?${searchParams.toString()}`;
  };

  // Translates the raw enum into plain, customer-facing text — matches
  // Voice & Copy's "simple language over technical language" rule.
  const formatBinding = (coverType: CoverType, volumeCount: number) => {
    const binding = coverType === "AL_GHILAF_AL_MUQAWWA" ? "Hardcover" : "Paperback";
    const volumes = volumeCount > 1 ? `${volumeCount} Volumes` : "1 Volume";
    return `${binding} · ${volumes}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-0 pb-16">

      {/* Search Header — sits flush with the page canvas, not elevated */}
      <div className="sticky top-0 z-30 bg-background py-2.5 lg:static">
        <form action="/books" method="GET" className="relative w-full">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search books, authors, ISBN..."
            className="w-full bg-card text-foreground pl-11 pr-4 py-3 rounded-sm border border-border focus:outline-none focus:border-primary text-sm transition-colors duration-fast ease-standard"
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          {sort && <input type="hidden" name="sort" value={sort} />}
        </form>
      </div>

      {/* Quick Topic Chips — rounded-sm now, matching SubjectChips' established
          treatment for the same category-navigation pattern */}
      <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="flex gap-2 whitespace-nowrap py-1">
          <Link
            href="/books"
            className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-sm transition-colors duration-fast ${
              !categorySlug ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:border-border-hover"
            }`}
          >
            All Subjects
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/books?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
              className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-sm transition-colors duration-fast ${
                categorySlug === cat.slug ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:border-border-hover"
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
          {/* Study Level banner — was a dark emerald gradient, which directly
              contradicted the Design System's "no gradients" rule. Rebuilt
              as a flat, quiet card matching the Cards section instead. */}
          <section className="bg-card border border-border rounded-md p-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Start Learning By Study Level</h2>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Link href={`/books?level=MUBTADI${sort ? `&sort=${sort}` : ""}`} className="bg-background hover:bg-surface-hover text-center p-2 rounded-sm text-xs font-bold transition-colors duration-fast border border-border">
                Beginner <span className="block text-[9px] font-normal text-muted-foreground mt-0.5">Mubtadi</span>
              </Link>
              <Link href={`/books?level=MUTAWASSIT${sort ? `&sort=${sort}` : ""}`} className="bg-background hover:bg-surface-hover text-center p-2 rounded-sm text-xs font-bold transition-colors duration-fast border border-border">
                Intermediate <span className="block text-[9px] font-normal text-muted-foreground mt-0.5">Mutawassit</span>
              </Link>
              <Link href={`/books?level=MUTAQADDIM${sort ? `&sort=${sort}` : ""}`} className="bg-background hover:bg-surface-hover text-center p-2 rounded-sm text-xs font-bold transition-colors duration-fast border border-border">
                Advanced <span className="block text-[9px] font-normal text-muted-foreground mt-0.5">Mutaqaddim</span>
              </Link>
            </div>
          </section>

          {/* New Arrivals list slider */}
          {newArrivals.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-1.5 px-1">
                <Sparkles className="h-4 w-4 text-secondary" />
                <h3 className="font-serif font-bold text-lg text-foreground">New Arrivals</h3>
              </div>
              <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0 flex gap-4 pb-2">
                {newArrivals.map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`} className={`w-40 flex-shrink-0 bg-card border border-border rounded-md p-3 hover:border-border-hover transition-colors duration-fast flex flex-col justify-between ${!book.available ? "opacity-60" : ""}`}>
                    <div className="h-36 bg-muted rounded-sm flex items-center justify-center overflow-hidden relative">
                      {book.coverImage ? (
                        <Image src={book.coverImage} alt={book.title} fill className="object-cover" sizes="160px" />
                      ) : (
                        <span className="text-[9px] text-muted-foreground font-serif px-2 text-center line-clamp-3">{book.title}</span>
                      )}
                      {!book.available && (
                        <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                          <span className="text-primary-foreground text-[9px] font-bold bg-foreground/50 px-1.5 py-0.5 rounded-sm">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 space-y-1 flex-1 flex flex-col justify-end">
                      <h4 className="font-serif text-xs font-bold text-foreground line-clamp-1">{book.title}</h4>
                      <p className="text-[10px] text-muted-foreground truncate">By {book.author.name}</p>
                      <div className="pt-1">
                        <PriceDisplay
                          retailPrice={Number(book.price)}
                          supplierCost={book.supplierCost ? Number(book.supplierCost) : null}
                          userRole={userRole}
                          isVerified={isVerified}
                          showTiered={false}
                          size="sm"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Beginner Friendly list slider — near-identical to New Arrivals
              above; worth extracting into a shared BookStrip component
              later, same pattern as the BookCard extraction. */}
          {beginnerFriendly.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-1.5 px-1">
                <Star className="h-4 w-4 text-secondary" />
                <h3 className="font-serif font-bold text-lg text-foreground">Beginner Friendly Mutoon</h3>
              </div>
              <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0 flex gap-4 pb-2">
                {beginnerFriendly.map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`} className={`w-40 flex-shrink-0 bg-card border border-border rounded-md p-3 hover:border-border-hover transition-colors duration-fast flex flex-col justify-between ${!book.available ? "opacity-60" : ""}`}>
                    <div className="h-36 bg-muted rounded-sm flex items-center justify-center overflow-hidden relative">
                      {book.coverImage ? (
                        <Image src={book.coverImage} alt={book.title} fill className="object-cover" sizes="160px" />
                      ) : (
                        <span className="text-[9px] text-muted-foreground font-serif px-2 text-center line-clamp-3">{book.title}</span>
                      )}
                      {!book.available && (
                        <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                          <span className="text-primary-foreground text-[9px] font-bold bg-foreground/50 px-1.5 py-0.5 rounded-sm">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 space-y-1 flex-1 flex flex-col justify-end">
                      <h4 className="font-serif text-xs font-bold text-foreground line-clamp-1">{book.title}</h4>
                      <p className="text-[10px] text-muted-foreground truncate">By {book.author.name}</p>
                      <div className="pt-1">
                        <PriceDisplay
                          retailPrice={Number(book.price)}
                          supplierCost={book.supplierCost ? Number(book.supplierCost) : null}
                          userRole={userRole}
                          isVerified={isVerified}
                          showTiered={false}
                          size="sm"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Active Filters Chips — matched to the same rounded-sm + destructive
          hover pattern already used once in NavActions' logout button */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground px-1 pt-2">
          <span className="font-semibold mr-1">Active Criteria:</span>
          {search && (
            <Link href={getRemoveFilterUrl("search")} className="inline-flex items-center gap-1 bg-card border border-border text-foreground px-2.5 py-1 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors">
              &quot;{search}&quot; <X className="h-3 w-3" />
            </Link>
          )}
          {categorySlug && (
            <Link href={getRemoveFilterUrl("category")} className="inline-flex items-center gap-1 bg-card border border-border text-foreground px-2.5 py-1 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors">
              Subject: {categorySlug} <X className="h-3 w-3" />
            </Link>
          )}
          {level && (
            <Link href={getRemoveFilterUrl("level")} className="inline-flex items-center gap-1 bg-card border border-border text-foreground px-2.5 py-1 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors">
              Level: {level} <X className="h-3 w-3" />
            </Link>
          )}
          {textType && (
            <Link href={getRemoveFilterUrl("textType")} className="inline-flex items-center gap-1 bg-card border border-border text-foreground px-2.5 py-1 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors">
              Type: {textType} <X className="h-3 w-3" />
            </Link>
          )}
          {volumeType && (
            <Link href={getRemoveFilterUrl("volumeType")} className="inline-flex items-center gap-1 bg-card border border-border text-foreground px-2.5 py-1 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors">
              Volume: {volumeType} <X className="h-3 w-3" />
            </Link>
          )}
          {coverType && (
            <Link href={getRemoveFilterUrl("coverType")} className="inline-flex items-center gap-1 bg-card border border-border text-foreground px-2.5 py-1 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors">
              Binding: {coverType} <X className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {/* Main Split Grid View System */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Fixed: this wrapper previously had "hidden lg:block", which
            hid the entire <aside> — including FilterSidebar's own
            internal mobile trigger button — on small screens. That's why
            the mobile filter button disappeared: FilterSidebar already
            handles its own mobile/desktop split internally, so hiding
            the parent too was redundant and broke it. */}
        <aside className="lg:col-span-1 lg:sticky lg:top-6">
          <FilterSidebar activeFilters={params} categories={categories} />
        </aside>

        <main className="lg:col-span-3 space-y-4">

          {/* Fixed: flex children default to min-width:auto, so this text
              block was refusing to shrink below its content width on
              narrow screens — combined with the <select> next to it, that
              could push the whole row (and the page) into horizontal
              overflow instead of wrapping. flex-wrap lets it drop to a
              second line instead of forcing the page wider than the
              viewport; min-w-0 lets the text actually shrink/wrap. */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-4 rounded-md">
            <div className="text-xs font-semibold text-muted-foreground min-w-0">
              Found <span className="text-foreground font-bold">{totalFilteredCount}</span> authentic volumes {hasActiveFilters && "matching parameters"}
            </div>
            <SortDropdown currentSort={sort} />
          </div>

          {allBooks.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-card p-12 text-center mx-1 space-y-3">
              <p className="text-sm text-muted-foreground font-medium">No books match your specific filters.</p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/books" className="text-xs text-primary font-semibold underline">
                  Reset All Search Filters
                </Link>
                <span className="text-border">•</span>
                <a href="#book-request" className="text-xs text-primary font-semibold underline">
                  Request this Book
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {allBooks.map((book) => (
                  <div key={book.id} className={`flex flex-row lg:flex-col bg-card border border-border rounded-md p-3 lg:p-4 hover:shadow-subtle transition-all duration-fast ease-standard gap-4 group relative ${!book.available ? "opacity-60" : ""}`}>

                    <div className="w-24 h-32 flex-shrink-0 lg:w-full lg:h-52 bg-muted rounded-sm flex items-center justify-center overflow-hidden relative">
                      {book.coverImage ? (
                        <Image src={book.coverImage} alt={book.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-300" sizes="(max-width: 1024px) 96px, 33vw" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-serif px-2 text-center line-clamp-3">{book.title}</span>
                      )}

                      {!book.available && (
                        <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-1">
                            <AlertCircle className="h-5 w-5 text-primary-foreground" />
                            <span className="text-primary-foreground text-[9px] font-bold bg-foreground/60 px-2 py-1 rounded-sm">Out of Stock</span>
                          </div>
                        </div>
                      )}

                      <span className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm z-10">
                        {book.textType}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between lg:justify-start lg:space-y-1">
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block">
                          {book.category.name} • {book.knowledgeLevel}
                        </span>
                        <h4 className="font-serif font-bold text-sm lg:text-base text-foreground group-hover:text-primary-hover transition-colors line-clamp-2 mt-0.5">
                          {book.title}
                        </h4>
                        <p className="text-xs text-muted-foreground italic mt-0.5 truncate">
                          By {book.author.name} {book.author.nameArabic ? `(${book.author.nameArabic})` : ""}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatBinding(book.coverType, book.volumeCount)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t lg:border-none border-border gap-2">
                        <PriceDisplay
                          retailPrice={Number(book.price)}
                          supplierCost={book.supplierCost ? Number(book.supplierCost) : null}
                          userRole={userRole}
                          isVerified={isVerified}
                          showTiered={true}
                          size="sm"
                        />
                        <Link
                          href={`/books/${book.id}`}
                          className={`font-semibold px-3 py-1.5 rounded-sm text-xs transition-colors duration-fast h-fit ${
                            book.available
                              ? "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                              : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                          }`}
                        >
                          {book.available ? "View Book" : "Out"}
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

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
                className="inline-flex items-center justify-center rounded-sm bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs px-6 py-3 transition-colors duration-fast ease-standard cursor-pointer"
              >
                Load More Books
              </Link>
            </div>
          )}

          <div id="book-request">
            <BookRequestCTA />
          </div>
        </main>
      </div>
    </div>
  );
}
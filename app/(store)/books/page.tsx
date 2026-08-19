// app/(store)/books/page.tsx

import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { FilterSidebar } from "./FilterSidebar";
import {
  KnowledgeLevel,
  TextType,
  CoverType,
  VolumeType,
} from "@prisma/client";
import {
  Search,
  X,
  BookOpen,
  Star,
  Sparkles,
} from "lucide-react";
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

  const sort = params.sort || "newest";

  const BOOKS_PER_PAGE = 12;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const skip = (currentPage - 1) * BOOKS_PER_PAGE;

  // ---------------------------------------------------------------------------
  // DATABASE FILTERS
  // ---------------------------------------------------------------------------

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        author: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        isbn: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        publisher: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (categorySlug) {
    whereClause.category = {
      slug: categorySlug,
    };
  }

  if (level) {
    whereClause.knowledgeLevel = level;
  }

  if (textType) {
    whereClause.textType = textType;
  }

  if (coverType) {
    whereClause.coverType = coverType;
  }

  if (volumeType) {
    whereClause.volumeType = volumeType;
  }

  // ---------------------------------------------------------------------------
  // SORTING
  // ---------------------------------------------------------------------------

  let orderByClause: any = {
    createdAt: "desc",
  };

  if (sort === "price-asc") {
    orderByClause = {
      price: "asc",
    };
  }

  if (sort === "price-desc") {
    orderByClause = {
      price: "desc",
    };
  }

  if (sort === "title-az") {
    orderByClause = {
      title: "asc",
    };
  }

  if (sort === "title-za") {
    orderByClause = {
      title: "desc",
    };
  }

  // ---------------------------------------------------------------------------
  // DATABASE QUERIES
  // ---------------------------------------------------------------------------

  const [
    allBooks,
    totalFilteredCount,
    totalStoreCount,
    categories,
  ] = await Promise.all([
    prisma.book.findMany({
      where: whereClause,
      include: {
        author: true,
        category: true,
        explanations: true,
      },
      orderBy: orderByClause,
      take: currentPage * BOOKS_PER_PAGE,
    }),

    prisma.book.count({
      where: whereClause,
    }),

    prisma.book.count(),

    prisma.category.findMany({
      where: {
        parentId: null,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  // ---------------------------------------------------------------------------
  // DISCOVERY SECTIONS
  // ---------------------------------------------------------------------------

  const hasActiveFilters =
    search ||
    categorySlug ||
    level ||
    textType ||
    coverType ||
    volumeType;

  const newArrivals = !hasActiveFilters
    ? await prisma.book.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          category: true,
        },
      })
    : [];

  const beginnerFriendly = !hasActiveFilters
    ? await prisma.book.findMany({
        where: {
          knowledgeLevel: "MUBTADI",
        },
        take: 5,
        include: {
          author: true,
          category: true,
        },
      })
    : [];

  // ---------------------------------------------------------------------------
  // FILTER URL HELPERS
  // ---------------------------------------------------------------------------

  const getRemoveFilterUrl = (keyToDelete: string) => {
    const activeKeys = {
      ...params,
    };

    delete (activeKeys as any)[keyToDelete];

    const searchParams = new URLSearchParams();

    Object.entries(activeKeys).forEach(([key, val]) => {
      if (val) {
        searchParams.set(key, val);
      }
    });

    const query = searchParams.toString();

    return query ? `/books?${query}` : "/books";
  };

  const hasNextPage = totalFilteredCount > allBooks.length;

  // ---------------------------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-3 pb-16 sm:px-4 lg:px-0">
      {/* ---------------------------------------------------------------------
          SEARCH
      --------------------------------------------------------------------- */}

      <div className="sticky top-0 z-30 bg-background py-2.5 lg:static lg:bg-transparent lg:py-0">
        <form
          action="/books"
          method="GET"
          className="relative w-full"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search book titles, scholars, keywords, ISBN barcodes..."
            className="w-full rounded-md border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
          />

          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />

          {sort && (
            <input
              type="hidden"
              name="sort"
              value={sort}
            />
          )}
        </form>
      </div>

      {/* ---------------------------------------------------------------------
          QUICK TOPICS
      --------------------------------------------------------------------- */}

      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="flex min-w-max gap-2 py-1">
          <Link
            href="/books"
            className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              !categorySlug
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            All Subjects
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/books?category=${cat.slug}${
                sort ? `&sort=${sort}` : ""
              }`}
              className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                categorySlug === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          DISCOVERY SECTIONS
      --------------------------------------------------------------------- */}

      {!hasActiveFilters && (
        <div className="space-y-8">
          {/* Study Level */}

          <section className="rounded-md border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />

              <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                Start Learning By Study Level
              </h2>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Link
                href={`/books?level=MUBTADI${
                  sort ? `&sort=${sort}` : ""
                }`}
                className="rounded-md border border-border bg-background p-3 text-center text-xs font-bold text-foreground transition hover:border-primary hover:bg-muted"
              >
                Beginner

                <span className="mt-0.5 block text-[9px] font-normal text-muted-foreground">
                  Mubtadi
                </span>
              </Link>

              <Link
                href={`/books?level=MUTAWASSIT${
                  sort ? `&sort=${sort}` : ""
                }`}
                className="rounded-md border border-border bg-background p-3 text-center text-xs font-bold text-foreground transition hover:border-primary hover:bg-muted"
              >
                Intermediate

                <span className="mt-0.5 block text-[9px] font-normal text-muted-foreground">
                  Mutawassit
                </span>
              </Link>

              <Link
                href={`/books?level=MUTAQADDIM${
                  sort ? `&sort=${sort}` : ""
                }`}
                className="rounded-md border border-border bg-background p-3 text-center text-xs font-bold text-foreground transition hover:border-primary hover:bg-muted"
              >
                Advanced

                <span className="mt-0.5 block text-[9px] font-normal text-muted-foreground">
                  Mutaqaddim
                </span>
              </Link>
            </div>
          </section>

          {/* New Arrivals */}

          {newArrivals.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-1.5 px-1">
                <Sparkles className="h-4 w-4 text-primary" />

                <h3 className="font-serif text-lg font-bold text-foreground">
                  New Arrivals
                </h3>
              </div>

              <div className="flex w-full gap-4 overflow-x-auto pb-2 scrollbar-none">
                {newArrivals.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="flex w-40 shrink-0 flex-col justify-between rounded-md border border-border bg-card p-3 shadow-sm transition hover:border-primary"
                  >
                    <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-md bg-muted">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="px-2 text-center font-serif text-[9px] text-muted-foreground line-clamp-3">
                          {book.title}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-1 flex-col justify-end space-y-0.5">
                      <h4 className="font-serif text-xs font-bold text-foreground line-clamp-1">
                        {book.title}
                      </h4>

                      <p className="truncate text-[10px] text-muted-foreground">
                        By {book.author.name}
                      </p>

                      <p className="pt-1 text-xs font-extrabold text-primary">
                        GH₵ {Number(book.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Beginner Friendly */}

          {beginnerFriendly.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-1.5 px-1">
                <Star className="h-4 w-4 text-primary" />

                <h3 className="font-serif text-lg font-bold text-foreground">
                  Beginner Friendly Mutoon
                </h3>
              </div>

              <div className="flex w-full gap-4 overflow-x-auto pb-2 scrollbar-none">
                {beginnerFriendly.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="flex w-40 shrink-0 flex-col justify-between rounded-md border border-border bg-card p-3 shadow-sm transition hover:border-primary"
                  >
                    <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-md bg-muted">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="px-2 text-center font-serif text-[9px] text-muted-foreground line-clamp-3">
                          {book.title}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-1 flex-col justify-end space-y-0.5">
                      <h4 className="font-serif text-xs font-bold text-foreground line-clamp-1">
                        {book.title}
                      </h4>

                      <p className="truncate text-[10px] text-muted-foreground">
                        By {book.author.name}
                      </p>

                      <p className="pt-1 text-xs font-extrabold text-primary">
                        GH₵ {Number(book.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------
          ACTIVE FILTERS
      --------------------------------------------------------------------- */}

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 pt-2 text-xs text-muted-foreground">
          <span className="mr-1 font-semibold text-foreground">
            Active Criteria:
          </span>

          {search && (
            <Link
              href={getRemoveFilterUrl("search")}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              &quot;{search}&quot;
              <X className="h-3 w-3" />
            </Link>
          )}

          {categorySlug && (
            <Link
              href={getRemoveFilterUrl("category")}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              Subject: {categorySlug}
              <X className="h-3 w-3" />
            </Link>
          )}

          {level && (
            <Link
              href={getRemoveFilterUrl("level")}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              Level: {level}
              <X className="h-3 w-3" />
            </Link>
          )}

          {textType && (
            <Link
              href={getRemoveFilterUrl("textType")}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              Type: {textType}
              <X className="h-3 w-3" />
            </Link>
          )}

          {volumeType && (
            <Link
              href={getRemoveFilterUrl("volumeType")}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              Volume: {volumeType}
              <X className="h-3 w-3" />
            </Link>
          )}

          {coverType && (
            <Link
              href={getRemoveFilterUrl("coverType")}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-muted-foreground transition hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              Binding: {coverType}
              <X className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------
          CATALOG
      --------------------------------------------------------------------- */}

      <div className="grid grid-cols-1 items-start gap-6 pt-2 lg:grid-cols-4">
        <aside className="min-w-0 lg:col-span-1">
          <FilterSidebar
            categories={categories}
            activeFilters={params}
          />
        </aside>

        <main className="min-w-0 space-y-4 lg:col-span-3">
          {/* Catalog controls */}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-1 pb-3">
            <div className="text-xs font-medium text-muted-foreground">
              {totalFilteredCount === 0 ? (
                <span>0 Books Found</span>
              ) : (
                <span>
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {allBooks.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalFilteredCount}
                  </span>{" "}
                  Books
                </span>
              )}
            </div>

            <SortDropdown currentSort={sort} />
          </div>

          {/* Empty state */}

          {allBooks.length === 0 ? (
            <div className="mx-1 rounded-md border border-dashed border-border bg-card p-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No books match your specific filters.
              </p>

              <Link
                href="/books"
                className="mt-2 inline-block text-xs font-semibold text-primary underline underline-offset-2"
              >
                Reset All Search Filters
              </Link>
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {allBooks.map((book) => (
                <div
                  key={book.id}
                  className="group relative flex min-w-0 flex-row gap-3 rounded-md border border-border bg-card p-3 shadow-sm transition hover:shadow-md sm:gap-4 lg:flex-col lg:p-4"
                >
                  {/* Cover */}

                  <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-md bg-muted sm:h-36 sm:w-28 lg:h-52 lg:w-full">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center px-2 text-center font-serif text-[10px] text-muted-foreground line-clamp-3">
                        {book.title}
                      </span>
                    )}

                    <span className="absolute right-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-primary-foreground shadow">
                      {book.textType}
                    </span>
                  </div>

                  {/* Book information */}

                  <div className="flex min-w-0 flex-1 flex-col justify-between lg:justify-start lg:space-y-1">
                    <div className="min-w-0">
                      <span className="block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                        {book.category.name} • {book.knowledgeLevel}
                      </span>

                      <h4 className="mt-0.5 font-serif text-sm font-bold text-foreground line-clamp-2 transition group-hover:text-primary lg:text-base">
                        {book.title}
                      </h4>

                      <p className="mt-0.5 truncate text-xs italic text-muted-foreground">
                        By {book.author.name}{" "}
                        {book.author.nameArabic
                          ? `(${book.author.nameArabic})`
                          : ""}
                      </p>
                    </div>

                    <div className="mt-2 flex min-w-0 items-center justify-between gap-2 border-t border-border pt-2 lg:mt-3 lg:border-none lg:pt-0">
                      <span className="shrink-0 text-sm font-bold text-foreground lg:text-base">
                        GH₵ {Number(book.price).toFixed(2)}
                      </span>

                      <Link
                        href={`/books/${book.id}`}
                        className="shrink-0 rounded-md bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground"
                      >
                        View Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load more */}

          {allBooks.length < totalFilteredCount && (
            <div className="flex justify-center pt-6">
              <Link
                href={`/books?${(() => {
                  const nextParams = new URLSearchParams();

                  Object.entries(params).forEach(([key, val]) => {
                    if (val && key !== "page") {
                      nextParams.set(key, val);
                    }
                  });

                  nextParams.set(
                    "page",
                    (currentPage + 1).toString()
                  );

                  return nextParams.toString();
                })()}`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
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
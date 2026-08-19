// app/(store)/authors/[id]/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface AuthorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;

  const author = await prisma.author.findUnique({
    where: { id },
    select: {
      name: true,
      nameArabic: true,
      bio: true,
    },
  });

  if (!author) {
    return {
      title: "Author Not Found | Al-Hikmah Islamic Bookstore",
    };
  }

  return {
    title: `${author.name} | Al-Hikmah Islamic Bookstore`,
    description:
      author.bio ||
      `Explore the works of ${author.name} available through Al-Hikmah.`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;

  const author = await prisma.author.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      nameArabic: true,
      bio: true,
      diedAH: true,
      books: {
        orderBy: {
          title: "asc",
        },
        select: {
          id: true,
          title: true,
          price: true,
          coverImage: true,
          available: true,
          knowledgeLevel: true,
          textType: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!author) {
    notFound();
  }

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

        {/* Back navigation */}
        <Link
          href="/authors"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All Authors
        </Link>

        {/* Author Header */}
        <header className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Author
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {author.name}
          </h1>

          {author.nameArabic && (
            <p
              className="mt-2 font-serif text-xl text-muted-foreground"
              dir="rtl"
            >
              {author.nameArabic}
            </p>
          )}

          {author.diedAH && (
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Died {author.diedAH} AH
            </p>
          )}
        </header>

        {/* Biography */}
        {author.bio && (
          <section className="mt-10 max-w-3xl border-t border-border pt-8">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              About the Author
            </h2>

            <div className="mt-4 text-sm leading-7 text-muted-foreground whitespace-pre-line">
              {author.bio}
            </div>
          </section>
        )}

        {/* Books */}
        <section className="mt-12 border-t border-border pt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Al-Hikmah Catalogue
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
                Books by {author.name}
              </h2>
            </div>

            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {author.books.length}{" "}
              {author.books.length === 1 ? "book" : "books"}
            </span>
          </div>

          {author.books.length === 0 ? (
            <div className="mt-8 rounded-md border border-dashed border-border p-10 text-center">
              <BookOpen
                className="mx-auto h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />

              <p className="mt-3 font-serif text-base font-semibold text-foreground">
                No books currently listed
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Al-Hikmah does not currently have any books by this author in
                the catalogue.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {author.books.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-all duration-fast hover:border-primary/40 hover:shadow-sm"
                >
                  {/* Book Cover */}
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-muted">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="px-6 text-center">
                        <BookOpen
                          className="mx-auto h-7 w-7 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <p className="mt-2 font-serif text-xs text-muted-foreground line-clamp-3">
                          {book.title}
                        </p>
                      </div>
                    )}

                    {!book.available && (
                      <span className="absolute left-2 top-2 rounded-sm bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm">
                        Currently unavailable
                      </span>
                    )}
                  </div>

                  {/* Book Information */}
                  <div className="flex flex-1 flex-col p-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {book.category.name}{" "}
                        <span className="text-border">•</span>{" "}
                        {book.knowledgeLevel}
                      </p>

                      <h3 className="mt-1 font-serif text-base font-semibold leading-6 text-foreground line-clamp-2">
                        {book.title}
                      </h3>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {book.textType}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-sm font-bold text-foreground">
                        GH₵ {Number(book.price).toFixed(2)}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        View book
                        <ArrowRight
                          className="h-3 w-3 transition-transform duration-fast group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Return to Authors */}
        <div className="mt-12 border-t border-border pt-6">
          <Link
            href="/authors"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Browse all authors
          </Link>
        </div>
      </div>
    </main>
  );
}


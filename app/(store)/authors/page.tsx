// app/(store)/authors/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Authors | Al-Hikmah Islamic Bookstore",
  description:
    "Explore scholars and authors whose works are available through Al-Hikmah.",
};

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      nameArabic: true,
      _count: {
        select: { books: true },
      },
    },
  });

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Header */}
        <header className="max-w-2xl">
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Authors
          </h1>

          <p className="mt-4 font-sans text-base leading-7 text-muted-foreground">
            Explore scholars and authors whose works are available through
            Al-Hikmah.
          </p>
        </header>

        {/* Author grid */}
        {authors.length === 0 ? (
          <div className="mt-12 rounded-md border border-dashed border-border p-10 text-center">
            <p className="font-serif text-base font-semibold text-foreground">
              No authors yet
            </p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Authors will appear here as books are added to the catalogue.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/authors/${author.id}`}
                className="group rounded-md border border-border p-6 transition-colors duration-fast hover:border-primary/40"
              >
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  {author.name}
                </h2>

                {author.nameArabic && (
                  <p
                    className="mt-1 font-sans text-sm text-muted-foreground"
                    dir="rtl"
                  >
                    {author.nameArabic}
                  </p>
                )}

                <p className="mt-4 font-sans text-xs text-muted-foreground">
                  {author._count.books}{" "}
                  {author._count.books === 1 ? "book" : "books"} in
                  catalogue
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary">
                  View author
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-fast group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
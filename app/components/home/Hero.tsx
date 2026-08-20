// app/components/home/Hero.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Search,
  Check,
  Award,
} from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";
import { authClient } from "../../../lib/auth-client";
import { syncAndValidateCartItem } from "../../../app/(store)/cart/actions";

interface FeaturedBook {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
  available: boolean;
}

interface HeroStats {
  totalBooks: number;
  totalCategories: number;
  totalAuthors: number;
  totalShipping: number;
  featuredBook: FeaturedBook | null;
}

interface HeroProps {
  heroStats: HeroStats;
}

export function Hero({ heroStats }: HeroProps): React.JSX.Element {
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);

  const [searchQuery, setSearchQuery] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (query) {
      router.push(`/books?search=${encodeURIComponent(query)}`);
    }
  };

  const handleAddFeaturedToCart = async (): Promise<void> => {
    const featuredBook = heroStats.featuredBook;

    if (!featuredBook || !featuredBook.available || isAddingToCart) {
      return;
    }

    setIsAddingToCart(true);

    try {
      /*
       * Get the current session first.
       *
       * Guest users only need the Zustand/localStorage cart.
       * Authenticated users must also have the item synchronized
       * with the PostgreSQL cart because checkout reads the
       * persistent database cart.
       */
      const session = await authClient.getSession();

      /*
       * Always update the local cart immediately so the cart page
       * reflects the customer's action.
       */
      addItem({
        id: featuredBook.id,
        title: featuredBook.title,
        price: parseFloat(featuredBook.price),
        weight: 0.5,
        coverImage: featuredBook.coverImage,
        available: featuredBook.available,
      });

      /*
       * Authenticated users require database synchronization.
       *
       * This is what keeps the Home page's "Add to Cart" behavior
       * consistent with the Book Details page.
       */
      if (session?.data?.user?.id) {
        const result = await syncAndValidateCartItem(
          featuredBook.id,
          1
        );

        if (!result.success) {
          /*
           * The database is the source of truth for inventory.
           *
           * If synchronization fails or the book is no longer
           * available, remove the optimistic local cart item.
           */
          useCartStore.getState().removeItem(featuredBook.id);

          console.error(
            "Unable to synchronize featured book with database cart:",
            result.message
          );

          setIsAddingToCart(false);
          return;
        }
      }

      /*
       * At this point the item exists in:
       *
       * Guest:
       *   Zustand/localStorage
       *
       * Authenticated:
       *   Zustand/localStorage + PostgreSQL
       *
       * Therefore the customer can safely proceed to the cart.
       */
      setAddedToCart(true);

      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to add featured book to cart:", error);

      /*
       * If the authenticated database synchronization failed,
       * do not leave the local cart claiming the item was added.
       */
      const session = await authClient.getSession().catch(() => null);

      if (session?.data?.user?.id) {
        useCartStore.getState().removeItem(featuredBook.id);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="relative overflow-hidden border-b border-border/40 bg-background py-12 text-foreground sm:py-16">
      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">

        {/* =====================================================================
            SECTION 1: HEADING
           ===================================================================== */}

        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-sm bg-secondary px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              Authentic Islamic Literature
            </span>
          </div>

          <h1 className="font-serif text-display font-bold leading-tight tracking-tight text-foreground">
            Building Libraries of Beneficial Knowledge
          </h1>

          <p className="mx-auto max-w-2xl text-body leading-relaxed text-muted-foreground">
            Explore a carefully selected repository of works across Aqeedah,
            Fiqh, Hadith, Tafsir, Arabic, and Seerah, sourced specifically to
            support serious students of knowledge and families.
          </p>
        </div>

        {/* =====================================================================
            SECTION 2: STORE METRICS
           ===================================================================== */}

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              value: heroStats.totalBooks,
              label: "Volumes in Catalogue",
            },
            {
              value: heroStats.totalCategories,
              label: "Core Disciplines",
            },
            {
              value: heroStats.totalAuthors,
              label: "Classical Scholars",
            },
            {
              value: heroStats.totalShipping,
              label: "Available in Stock",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="select-none rounded-sm border border-border/60 bg-card p-4 text-center"
            >
              <p className="font-sans text-heading font-bold text-foreground">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* =====================================================================
            SECTION 3: SEARCH + CATALOGUE
           ===================================================================== */}

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-end gap-6 pt-2 lg:grid-cols-3">

          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Search the Repository
            </label>

            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.5] text-muted-foreground/60" />

                <input
                  type="text"
                  placeholder="Search by book title, classical author, or publisher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-sm border border-border bg-card pl-11 pr-24 font-sans text-label text-foreground outline-none transition-all duration-normal ease-standard placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-9 cursor-pointer rounded-sm bg-primary px-4 font-sans text-xs font-medium text-primary-foreground transition-colors duration-fast ease-standard hover:bg-primary/90"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Explore Collections
            </label>

            <Link
              href="/books"
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-border bg-card px-6 font-sans text-label font-medium text-foreground transition-colors duration-fast ease-standard hover:bg-secondary/20"
            >
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Browse Full Catalogue</span>
            </Link>
          </div>
        </div>

        {/* =====================================================================
            SECTION 4: FEATURED BOOK + AL-HIKMAH PROMISE
           ===================================================================== */}

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 pt-4 lg:grid-cols-5">

          {/* -------------------------------------------------------------------
              FEATURED BOOK
             ------------------------------------------------------------------- */}

          <div className="lg:col-span-3">
            {heroStats.featuredBook && (
              <div className="space-y-4 rounded-sm border border-border bg-card p-6 shadow-subtle">

                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <Award className="h-4 w-4 stroke-[1.5] text-primary" />

                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Selected Recommendation
                  </span>
                </div>

                <div className="grid grid-cols-3 items-start gap-6">

                  {heroStats.featuredBook.coverImage && (
                    <div className="col-span-1">
                      <img
                        src={heroStats.featuredBook.coverImage}
                        alt={heroStats.featuredBook.title}
                        className="aspect-[3/4] w-full rounded-sm border border-border/80 bg-background object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`${
                      heroStats.featuredBook.coverImage
                        ? "col-span-2"
                        : "col-span-3"
                    } space-y-4`}
                  >
                    <div className="space-y-1">
                      <h3 className="line-clamp-2 font-serif text-title font-bold leading-tight text-foreground">
                        {heroStats.featuredBook.title}
                      </h3>

                      <p className="font-medium text-label text-muted-foreground">
                        by {heroStats.featuredBook.authorName}
                      </p>
                    </div>

                    <div className="space-y-3 border-t border-border/50 pt-2">

                      <p className="font-sans text-title font-semibold text-foreground">
                        GH₵
                        {parseFloat(
                          heroStats.featuredBook.price
                        ).toFixed(2)}
                      </p>

                      <div className="flex gap-3">

                        <Link
                          href={`/books/${heroStats.featuredBook.id}`}
                          className="inline-flex flex-1 items-center justify-center rounded-sm border border-border bg-background py-2 text-xs font-medium text-foreground transition-colors duration-fast ease-standard hover:bg-card"
                        >
                          View Details
                        </Link>

                        <button
                          type="button"
                          onClick={handleAddFeaturedToCart}
                          disabled={
                            !heroStats.featuredBook.available ||
                            isAddingToCart
                          }
                          className={`inline-flex flex-1 items-center justify-center rounded-sm py-2 text-xs font-medium transition-colors duration-fast ease-standard ${
                            !heroStats.featuredBook.available
                              ? "cursor-not-allowed bg-muted text-muted-foreground"
                              : isAddingToCart
                                ? "cursor-wait bg-muted text-muted-foreground"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          {!heroStats.featuredBook.available ? (
                            "Out of Stock"
                          ) : isAddingToCart ? (
                            "Adding..."
                          ) : addedToCart ? (
                            "✓ Added"
                          ) : (
                            "Add to Cart"
                          )}
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------------
              AL-HIKMAH PROMISE
             ------------------------------------------------------------------- */}

          <div className="space-y-5 lg:col-span-2">

            <h3 className="border-b border-border/50 pb-2 text-xs font-bold uppercase tracking-wider text-foreground">
              The Al-Hikmah Promise
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: "Verified Authenticity",
                  desc: "Texts verified to stem from precise publisher prints and reliable text collections.",
                },
                {
                  title: "Regional Courier Delivery",
                  desc: "Reliable distribution channels routing parcels safely across Kasoa, Accra, and greater Ghana.",
                },
                {
                  title: "Protected Transactions",
                  desc: "Fully integrated checkout handling local Mobile Money and cards via Paystack systems safely.",
                },
                {
                  title: "Structured Curriculum Paths",
                  desc: "Literature catalogued explicitly by complexity parameters matching your individual progression.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex select-none items-start gap-3"
                >
                  <div className="mt-0.5 shrink-0 rounded-full bg-secondary/30 p-1 text-primary">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-foreground">
                      {item.title}
                    </p>

                    <p className="leading-normal text-label text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="#study-tracks"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-border/80 bg-card py-2.5 font-sans text-label font-medium text-foreground transition-colors duration-fast ease-standard hover:bg-secondary/20"
              >
                <GraduationCap className="h-4 w-4 stroke-[1.5] text-primary" />
                <span>Explore Structured Learning Paths</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


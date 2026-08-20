// app/components/books/BookGridSection.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ImageOff,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";
import { authClient } from "../../../lib/auth-client";
import { syncAndValidateCartItem } from "../../(store)/cart/actions";

interface GridBookItem {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
  available?: boolean;
}

interface BookGridSectionProps {
  title: string;
  title2: string;
  books: GridBookItem[];
}

export function BookGridSection({
  title,
  title2,
  books,
}: BookGridSectionProps) {
  const addItem = useCartStore((state) => state.addItem);

  const [addedBooks, setAddedBooks] = useState<Set<string>>(new Set());
  const [addingBooks, setAddingBooks] = useState<Set<string>>(new Set());

  const handleAddToCart = async (book: GridBookItem): Promise<void> => {
    if (book.available === false || addingBooks.has(book.id)) {
      return;
    }

    setAddingBooks((prev) => {
      const next = new Set(prev);
      next.add(book.id);
      return next;
    });

    try {
      /*
       * Check authentication first.
       *
       * Guest users only need the Zustand/localStorage cart.
       * Authenticated users need BOTH the local cart and
       * the persistent database cart because checkout uses
       * the database cart as its source of truth.
       */
      const session = await authClient.getSession();
      const isAuthenticated = Boolean(session?.data?.user?.id);

      /*
       * Immediately update the client-side cart.
       */
      addItem({
        id: book.id,
        title: book.title,
        price: Number(book.price),
        weight: 0.5,
        coverImage: book.coverImage,
        available: book.available ?? true,
      });

      /*
       * Authenticated users must also have the item persisted
       * in the database cart.
       */
      if (isAuthenticated) {
        const result = await syncAndValidateCartItem(book.id, 1);

        if (!result.success) {
          /*
           * Roll back the optimistic local cart update if
           * the database rejected the item.
           */
          useCartStore.getState().removeItem(book.id);

          console.error(
            "Unable to synchronize book with database cart:",
            result.message
          );

          return;
        }
      }

      /*
       * Both local and database carts are now synchronized.
       */
      setAddedBooks((prev) => {
        const next = new Set(prev);
        next.add(book.id);
        return next;
      });

      setTimeout(() => {
        setAddedBooks((prev) => {
          const next = new Set(prev);
          next.delete(book.id);
          return next;
        });
      }, 2000);
    } catch (error) {
      console.error("Add to cart failed:", error);

      /*
       * If the user is authenticated and synchronization failed,
       * do not leave a misleading item in the local cart.
       */
      try {
        const session = await authClient.getSession();

        if (session?.data?.user?.id) {
          useCartStore.getState().removeItem(book.id);
        }
      } catch {
        // Ignore secondary session-check failure.
      }
    } finally {
      setAddingBooks((prev) => {
        const next = new Set(prev);
        next.delete(book.id);
        return next;
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-heading font-black font-serif text-foreground tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{title2}</p>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-label">
          No books found. Please check back later.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book) => {
            const isOutOfStock = book.available === false;
            const isAdded = addedBooks.has(book.id);
            const isAdding = addingBooks.has(book.id);
            const price = Number(book.price);

            return (
              <div
                key={book.id}
                className={`bg-card border border-border rounded-md overflow-hidden flex flex-col group hover:shadow-subtle transition-all duration-fast ease-standard ${
                  isOutOfStock ? "opacity-60" : ""
                }`}
              >
                <div className="aspect-[3/4] bg-muted relative overflow-hidden flex items-center justify-center border-b border-border">
                  {book.coverImage ? (
                    <>
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />

                      <div className="absolute top-2 right-2">
                        {isOutOfStock ? (
                          <div className="inline-flex items-center gap-1 bg-destructive text-destructive-foreground text-[9px] font-bold px-2 py-1 rounded-sm">
                            <AlertCircle className="w-3 h-3" />
                            Out of Stock
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-success text-success-foreground text-[9px] font-bold px-2 py-1 rounded-sm">
                            <CheckCircle className="w-3 h-3" />
                            In Stock
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center gap-1.5">
                      <ImageOff className="w-6 h-6" />
                      <span className="text-[10px]">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-3 flex-grow flex flex-col justify-between space-y-2">
                  <div className="space-y-0.5 min-h-10">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-foreground group-hover:text-primary-hover transition-colors line-clamp-2">
                      {book.title}
                    </h4>

                    <p className="text-[10px] text-muted-foreground truncate font-medium">
                      By {book.authorName}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border space-y-2">
                    <span className="text-xs sm:text-sm font-black text-primary block">
                      GH₵{price.toFixed(2)}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(book)}
                        disabled={isOutOfStock || isAdding}
                        className={`flex-1 inline-flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold py-1.5 rounded-sm transition-colors duration-fast ease-standard ${
                          isAdded
                            ? "bg-primary text-primary-foreground"
                            : isOutOfStock || isAdding
                              ? "bg-muted text-muted-foreground cursor-not-allowed"
                              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                        }`}
                        title={
                          isOutOfStock
                            ? "Out of stock"
                            : isAdding
                              ? "Adding to cart"
                              : "Add to cart"
                        }
                      >
                        <ShoppingCart className="w-3 h-3" />

                        <span>
                          {isAdding
                            ? "Adding..."
                            : isAdded
                              ? "Added"
                              : "Add"}
                        </span>
                      </button>

                      <Link
                        href={`/books/${book.id}`}
                        className="flex-1 inline-flex items-center justify-center text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-primary-hover transition-colors py-1.5 border border-border rounded-sm hover:border-border-hover"
                        title="View details"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
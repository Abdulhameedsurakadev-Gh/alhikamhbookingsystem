"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ImageOff, ShoppingCart, AlertCircle, CheckCircle } from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";

interface GridBookItem {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
  stock?: number;
}

interface BookGridSectionProps {
  title: string;
  title2: string;
  books: GridBookItem[];
}

export function BookGridSection({ title, title2, books }: BookGridSectionProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (book: GridBookItem) => {
    // Add to cart store
    addItem({
      id: book.id,
      title: book.title,
      price: parseFloat(book.price),
      weight: 0.5, // Default weight
      coverImage: book.coverImage,
      stock: book.stock || 0,
    });

    // Show feedback
    setAddedToCart(book.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">{title2}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {books.map((book) => {
          const isOutOfStock = (book.stock || 0) === 0;
          const isAdded = addedToCart === book.id;

          return (
            <div
              key={book.id}
              className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all ${isOutOfStock ? "opacity-60" : ""}`}
            >
              {/* Aspect Container Handling Image Layout */}
              <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                {book.coverImage ? (
                  <>
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Stock Indicator Badge */}
                    <div className="absolute top-2 right-2">
                      {isOutOfStock ? (
                        <div className="inline-flex items-center gap-1 bg-rose-500 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm">
                          <AlertCircle className="w-3 h-3" />
                          Out of Stock
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm">
                          <CheckCircle className="w-3 h-3" />
                          In Stock
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-1.5">
                    <ImageOff className="w-6 h-6" />
                    <span className="text-[10px] font-mono">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-3 flex-grow flex flex-col justify-between space-y-2">
                {/* Title & Author */}
                <div className="space-y-0.5 min-h-10">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate font-medium">
                    By {book.authorName}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="font-mono text-xs sm:text-sm font-black text-emerald-800 block">
                    GH₵{parseFloat(book.price).toFixed(2)}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(book)}
                      disabled={isOutOfStock}
                      className={`flex-1 inline-flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold py-1.5 rounded-lg transition-all ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : isOutOfStock
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                      }`}
                      title={isOutOfStock ? "Out of stock" : "Add to cart"}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>{isAdded ? "Added" : "Add"}</span>
                    </button>

                    {/* View Details Link */}
                    <Link
                      href={`/books/${book.id}`}
                      className="flex-1 inline-flex items-center justify-center text-[10px] sm:text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors py-1.5 border border-slate-200 rounded-lg hover:border-emerald-600"
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
    </div>
  );
}
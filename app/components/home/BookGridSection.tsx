import React from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";

interface GridBookItem {
  id: string;
  title: string;
  price: string;
  coverImage: string;
  authorName: string;
}

export function BookGridSection({ title, title2, books }: { title: string; title2:string; books: GridBookItem[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{title2}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
            {/* Aspect Container Handling Image Layout */}
            <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-1.5"><ImageOff className="w-6 h-6" /><span className="text-[10px] font-mono">No Image</span></div>
              )}
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{book.title}</h4>
                <p className="text-[11px] text-slate-500 truncate font-medium">By {book.authorName}</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                <span className="font-mono text-xs sm:text-sm font-black text-emerald-800">GH₵{parseFloat(book.price).toFixed(2)}</span>
                <Link href={`/books/${book.id}`} className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

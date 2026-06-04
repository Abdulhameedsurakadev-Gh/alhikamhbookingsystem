"use client";

import React, { useState, useTransition } from "react";
import { updateBook } from "./actions";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type SanitizedBook = {
  id: string; title: string; description: string; isbn: string; price: string; stock: number;
  publisher: string; publishedYear: number | string; language: string; weight: string;
  coverImage: string; insideImage: string; tableOfContents: string; authorId: string; categoryId: string;
  coverType: string; volumeType: string; volumeCount: number; knowledgeLevel: string;
  textType: string; explainsBookId: string;
};

type Author = { id: string; name: string; nameArabic: string };
type Category = { id: string; name: string };
type ReferenceBook = { id: string; title: string };

interface EditBookFormProps {
  book: SanitizedBook;
  authors: Author[];
  categories: Category[];
  referenceBooks: ReferenceBook[];
}

export default function EditBookForm({ book, authors, categories, referenceBooks }: EditBookFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setFeedback(null);
      const result = await updateBook(book.id, formData);
      
      if (result.success) {
        setFeedback({ type: "success", message: result.message || "Book updated successfully!" });
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({ type: "error", message: result.error || "Failed to update book" });
      }
    });
  }

  return (
    <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 shadow-2xl relative">
      <div className="absolute top-8 right-8">
        <Link href="/admin/manage-inventory" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Ledger
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-100">Edit Catalog Details</h2>
        <p className="text-sm text-slate-400 mt-1">Modify properties, reset pricing variables, or adjust volume scales.</p>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      <form action={handleSubmit}  className="space-y-6">
        {/* Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Book Title *
            </label>
            <input
              required
              type="text"
              name="title"
              defaultValue={book.title}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              ISBN / Barcode SKU
            </label>
            <input
              type="text"
              name="isbn"
              defaultValue={book.isbn}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Text Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Book Description / Notes
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={book.description}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Table of Contents / Index (Fihrist)
          </label>
          <textarea
            name="tableOfContents"
            rows={6}
            defaultValue={book.tableOfContents}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono"
            placeholder="1. Muqaddimah...&#10;2. Kitab al-Salah...&#10;3. Bab al-Wudu..."
          />
        </div>

        {/* Pricing, Stock, Weight */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Price (GHS) *
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              name="price"
              defaultValue={book.price}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Stock Inventory *
            </label>
            <input
              required
              type="number"
              min="0"
              name="stock"
              defaultValue={book.stock}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="weight"
              defaultValue={book.weight}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Language *
            </label>
            <input
              required
              type="text"
              name="language"
              defaultValue={book.language}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Taxonomy Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Assigned Author *
            </label>
            <select
              required
              name="authorId"
              defaultValue={book.authorId}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} {a.nameArabic ? `(${a.nameArabic})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Store Category *
            </label>
            <select
              required
              name="categoryId"
              defaultValue={book.categoryId}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Publication Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Publisher House *
            </label>
            <input
              required
              type="text"
              name="publisher"
              defaultValue={book.publisher}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Published Year (CE)
            </label>
            <input
              type="number"
              min="1000"
              max="2100"
              name="publishedYear"
              defaultValue={book.publishedYear}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Total Volume Count *
            </label>
            <input
              required
              type="number"
              min="1"
              name="volumeCount"
              defaultValue={book.volumeCount}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Enums Classification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Cover Type *
            </label>
            <select
              required
              name="coverType"
              defaultValue={book.coverType}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="AL_GHILAF_AL_WARAQI">Paperback (Waraqi)</option>
              <option value="AL_GHILAF_AL_MUQAWWA">Hardcover (Muqawwa)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Volume Setup *
            </label>
            <select
              required
              name="volumeType"
              defaultValue={book.volumeType}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="KITAB_MUFRAD">Single Book (Mufrad)</option>
              <option value="MAJMUAT_MUJALLADAT">Volume Set (Majmuat)</option>
                            <option value="KITAB_MUFRAD">Single Book (Mufrad)</option>
              <option value="MAJMUAT_MUJALLADAT">Volume Set (Majmuat)</option>
              <option value="MAJMU">Compendium (Majmu)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Knowledge Level *
            </label>
            <select
              required
              name="knowledgeLevel"
              defaultValue={book.knowledgeLevel}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="MUBTADI">Beginner (Mubtadi)</option>
              <option value="MUTAWASSIT">Intermediate (Mutawassit)</option>
              <option value="MUTAQADDIM">Advanced (Mutaqaddim)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Text Breakdown *
            </label>
            <select
              required
              name="textType"
              defaultValue={book.textType}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="MATN">Core Text (Matn)</option>
              <option value="SHARH">Explanation (Sharh)</option>
              <option value="TAHQIQ">Verification (Tahqiq)</option>
            </select>
          </div>
        </div>

        {/* Text Self-Relation */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Explains or Unpacks Text (Self-Relation)
          </label>
          <select
            name="explainsBookId"
            defaultValue={book.explainsBookId}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="">None (This is a standalone or master text)</option>
            {referenceBooks.map((b) => (
              <option key={b.id} value={b.id}>
                Explains: {b.title}
              </option>
            ))}
          </select>
        </div>

        {/* Image Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Replace Cover Image
            </label>
            <input
              type="text"
              name="coverImageUrl"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {book.coverImage && <p className="text-[10px] text-slate-500 mt-1 truncate">Current: {book.coverImage}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Inside Preview Image URL
            </label>
            <input
              type="text"
              name="insideImageUrl"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {book.insideImage && <p className="text-[10px] text-slate-500 mt-1 truncate">Current: {book.insideImage}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Manuscript Variations"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


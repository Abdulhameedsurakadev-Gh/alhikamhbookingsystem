"use client";

import React, { useState, useTransition } from "react";
import { createBook } from "./actions";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type Author = { id: string; name: string; nameArabic: string | null };
type Category = { id: string; name: string };
type Book = { id: string; title: string };

interface AddBookFormProps {
  authors: Author[];
  categories: Category[];
  referenceBooks: Book[];
}

export default function AddBookForm({ authors, categories, referenceBooks }: AddBookFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setFeedback(null);
      const result = await createBook(formData);
      
      if (result.success) {
        setFeedback({ type: "success", message: result.message || "Book created successfully!" });
        // Reset form after successful submission
        const form = document.querySelector("form") as HTMLFormElement;
        form?.reset();
        
        // Clear feedback after 5 seconds
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({ type: "error", message: result.error || "Failed to create book" });
      }
    });
  }

  return (
    <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Add New Arabic/Islamic Manuscript</h1>
        <p className="text-sm text-slate-400 mt-1">Register text editions, volumes, weights, and detailed catalog options.</p>
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
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g., Matn al-Ajurrumiyyah"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              ISBN / Barcode SKU
            </label>
            <input
              type="text"
              name="isbn"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Optional barcode"
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
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            placeholder="Summary of text contents..."
          ></textarea>
        </div>

        {/* Table of Contents Index Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Table of Contents / Index (Fihrist)
          </label>
          <textarea
            name="tableOfContents"
            rows={6}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono text-emerald-400"
            placeholder="1. Muqaddimah...&#10;2. Kitab al-Salah...&#10;3. Bab al-Wudu..."
          ></textarea>
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
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="0.00"
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
              defaultValue="0"
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
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. 0.45"
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
              defaultValue="Arabic"
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
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Select Author...</option>
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
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Select Category...</option>
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
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Dar Al-Hadith"
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
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. 2024"
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
                            defaultValue="1"
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
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
            >
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
              Cover Image URL
            </label>
            <input
              type="text"
              name="coverImageUrl"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Inside Preview Image URL
            </label>
            <input
              type="text"
              name="insideImageUrl"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="https://..."
            />
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
                Publishing Manuscript...
              </>
            ) : (
              "Publish New Inventory Entry"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

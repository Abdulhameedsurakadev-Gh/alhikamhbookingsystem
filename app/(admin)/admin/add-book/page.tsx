import React from "react";
import AddBookForm from "./AddBookForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AddBookPage() {
  const [rawAuthors, rawCategories, rawReferenceBooks] = await Promise.all([
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.book.findMany({ 
      select: { id: true, title: true }, 
      orderBy: { title: "asc" } 
    }),
  ]);

  const authors = rawAuthors.map(author => ({
    id: author.id,
    name: author.name,
    nameArabic: author.nameArabic || "",
    bio: author.bio || "",
    diedAH: author.diedAH || null
  }));

  const categories = rawCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parentId: cat.parentId || null
  }));

  const referenceBooks = rawReferenceBooks.map(book => ({
    id: book.id,
    title: book.title
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 font-serif tracking-tight">Register New Book Title</h1>
        <p className="text-xs text-slate-400 mt-1">Populate library catalogs with pricing, structural classifications, and stock metrics.</p>
      </div>

      <AddBookForm 
        authors={authors}
        categories={categories}
        referenceBooks={referenceBooks}
      />
    </div>
  );
}

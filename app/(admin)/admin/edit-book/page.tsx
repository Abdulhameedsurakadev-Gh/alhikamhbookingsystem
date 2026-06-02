import React from "react";
import { prisma } from "@/lib/prisma";
import EditBookForm from "./EditBookForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditBookPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const bookId = resolvedParams.id;

  if (!bookId) {
    redirect("/admin/manage-inventory");
  }

  // Fetch target book details and lookup arrays concurrently
  const [rawBook, rawAuthors, rawCategories, rawReferenceBooks] = await Promise.all([
    prisma.book.findUnique({
      where: { id: bookId },
      include: { images: true }
    }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.book.findMany({
      where: { NOT: { id: bookId } }, // Prevent self-referencing links
      select: { id: true, title: true },
      orderBy: { title: "asc" }
    })
  ]);

  if (!rawBook) {
    redirect("/admin/manage-inventory");
  }

  // Sanitize data arrays to prevent any undefined/null serialization bugs across the RSC boundary
  const book = {
    id: rawBook.id,
    title: rawBook.title,
    description: rawBook.description || "",
    isbn: rawBook.isbn || "",
    price: rawBook.price.toString(), // Convert Prisma Decimal safely to a plain string
    stock: rawBook.stock,
    publisher: rawBook.publisher,
    publishedYear: rawBook.publishedYear || "",
    language: rawBook.language,
    weight: rawBook.weight ? rawBook.weight.toString() : "",
    coverImage: rawBook.coverImage || "",
    insideImage: rawBook.images.find(img => img.label === "SAMPLE_PAGE")?.imageUrl || "",
    tableOfContents: rawBook.tableOfContents || "", // FIX: Added tableOfContents mapping path here
    authorId: rawBook.authorId,
    categoryId: rawBook.categoryId,
    coverType: rawBook.coverType,
    volumeType: rawBook.volumeType,
    volumeCount: rawBook.volumeCount,
    knowledgeLevel: rawBook.knowledgeLevel,
    textType: rawBook.textType,
    explainsBookId: rawBook.explainsBookId || ""
  };

  const authors = rawAuthors.map(author => ({
    id: author.id,
    name: author.name,
    nameArabic: author.nameArabic || ""
  }));

  const categories = rawCategories.map(cat => ({
    id: cat.id,
    name: cat.name
  }));

  const referenceBooks = rawReferenceBooks.map(b => ({
    id: b.id,
    title: b.title
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 font-serif tracking-tight">Modify Manuscript Entry</h1>
        <p className="text-xs text-slate-400 mt-1">Update specific library listings, pricing configurations, and real-time ledger details.</p>
      </div>

      <EditBookForm 
        book={book}
        authors={authors}
        categories={categories}
        referenceBooks={referenceBooks}
      />
    </div>
  );
}

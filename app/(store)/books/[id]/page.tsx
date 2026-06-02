// app/(store)/books/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { BookGallery } from "./BookGallery";
import { AddToCartButton } from "../../../../components/ui/AddToCartButton";
import { useCartStore } from "../../../../store/useCartStore"; 
import { 
  BookOpen, 
  Calendar, 
  Milestone, 
  Layers, 
  User, 
  Tag, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;

  // 1. Unified Scholarly Query: Include author, category, deep media files, and text relationships
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      explainsBook: { include: { author: true } }, // The original text this book comments on
      explanations: { include: { author: true } }, // Alternative commentaries on this book
    },
  });

  if (!book) notFound();

  // 2. Query recommendations: Find more books by the same scholar/author
  const moreByAuthor = await prisma.book.findMany({
    where: { authorId: book.authorId, NOT: { id: book.id } },
    take: 4,
    include: { category: true },
  });

  // 3. Query recommendations: Find related books within the same Islamic science science category
  const relatedBooks = await prisma.book.findMany({
    where: { categoryId: book.categoryId, NOT: { id: book.id } },
    take: 4,
    include: { author: true },
  });

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb Hierarchy Navigation */}
      <nav className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
        <Link href="/" className="hover:text-emerald-800 transition">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/books" className="hover:text-emerald-800 transition">Catalog</Link>
        <span className="mx-2">/</span>
        <Link href={`/books?category=${book.category.slug}`} className="hover:text-emerald-800 transition">{book.category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600 line-clamp-1 inline">{book.title}</span>
      </nav>

      {/* Main Grid: Media Viewer Box Left / Pricing & Metadata Panel Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Active High-Definition Inspection Media Gallery */}
        <div className="lg:col-span-5">
          <BookGallery 
            coverImage={book.coverImage} 
            title={book.title} 
            images={book.images} 
          />
        </div>

        {/* RIGHT COLUMN: Scholarly Purchase Action Panel */}
        <div className="lg:col-span-7 space-y-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              <Layers className="h-3 w-3" />
              {book.knowledgeLevel} (Level)
            </span>
            <h1 className="font-serif text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              {book.title}
            </h1>
            <p className="text-sm text-slate-500 italic mt-1">
              By <span className="font-semibold text-emerald-800">{book.author.name}</span> {book.author.nameArabic ? `(${book.author.nameArabic})` : ""}
            </p>
          </div>

          {/* Pricing Row */}
          <div className="border-y border-slate-100 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">GH₵ {Number(book.price).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Availability</p>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mt-1 ${
                book.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}>
                {book.stock > 0 ? `${book.stock} Copies In Stock` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Action Buy Buttons */}
          <AddToCartButton 
            book={{
              id: book.id,
              title: book.title,
              price: Number(book.price), // Safely convert Prisma's Decimal object to a JavaScript number
              weight: Number(book.weight || 0),
              coverImage: book.coverImage,
              stock: book.stock
            }} 
          />
          
          {/* Scholarly Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Binding Cover</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {book.coverType === "AL_GHILAF_AL_MUQAWWA" ? "Hardcover (Mujallad)" : "Softcover (Ghilaf Waraqi)"}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Volume Count</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{book.volumeCount} {book.volumeCount > 1 ? "Volumes" : "Single Volume"}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Publisher Label</span>
              <span className="font-bold text-slate-800 mt-0.5 block truncate">{book.publisher} {book.publishedYear ? `(${book.publishedYear} AH)` : ""}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Classification / Text Type</span>
              <span className="font-bold text-emerald-800 mt-0.5 block font-mono uppercase">{book.textType}</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2 & 3: Description & Searchable Table of Contents Text */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-slate-200 pt-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-700" /> About This Work
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            {book.description || "No analytical overview statement has been cataloged for this item text."}
          </p>
        </div>

        {/* Searchable Text Table of Contents Area */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="h-5 w-5 text-emerald-700" /> Table of Contents Index
          </h3>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs max-h-64 overflow-y-auto font-mono text-slate-600 leading-normal whitespace-pre-wrap shadow-sm">
            {book.tableOfContents || "Table of contents index text has not been typed out for this volume yet."}
          </div>
        </div>
      </div>

      {/* SECTION 4: Scholarly Relationship Mapping Apparent Fields */}
      {(book.explainsBook || book.explanations.length > 0) && (
        <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-2xl p-6 border border-emerald-800 shadow-md space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-200 flex items-center gap-2">
            <Milestone className="h-4 w-4" /> Classical Text Linkage Graph
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Parent Text Block */}
            {book.explainsBook && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-emerald-300 font-medium uppercase tracking-wider block text-[10px]">Source Reference Text (Matn)</span>
                  <p className="text-sm font-serif font-bold text-amber-100 mt-1">This work explains the core text:</p>
                  <p className="font-medium text-slate-200 mt-2 text-sm">{book.explainsBook.title}</p>
                  <p className="text-slate-400 italic">By {book.explainsBook.author.name}</p>
                </div>
                <Link href={`/books/${book.explainsBook.id}`} className="mt-4 inline-flex items-center gap-1 bg-white/10 hover:bg-amber-500 hover:text-emerald-950 px-3 py-2 rounded-lg font-bold transition text-center justify-center">
                  View Original Text <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Commentaries Block */}
                        {book.explanations.length > 0 && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                <span className="text-emerald-300 font-medium uppercase tracking-wider block text-[10px]">Available Shurooh (Commentaries)</span>
                <p className="text-sm font-serif font-bold text-amber-100 mt-1">Scholarly explanations for this text:</p>
                <div className="flex flex-col gap-1.5 mt-2 max-h-48 overflow-y-auto">
                  {book.explanations.map((exp) => (
                    <Link key={exp.id} href={`/books/${exp.id}`} className="block bg-white/5 hover:bg-emerald-800/40 p-2 rounded border border-white/5 transition text-slate-200 hover:text-white">
                      <span className="font-medium block text-amber-50">{exp.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">By {exp.author.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 5: Author Biography Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-700" /> Biography of the Scholar
        </h3>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
          <h4 className="font-serif font-bold text-base text-slate-900">
            {book.author.name} {book.author.nameArabic ? `(${book.author.nameArabic})` : ""}
          </h4>
          {book.author.diedAH && (
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Died: {book.author.diedAH} AH (Hijri Year)
            </p>
          )}
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-1">
            {book.author.bio || "Biographical tracking records have not been fully populated for this scholar yet."}
          </p>
        </div>
      </section>

      {/* SECTION 6: More Books By This Scholar */}
      {moreByAuthor.length > 0 && (
        <section className="space-y-4 border-t border-slate-100 pt-6">
          <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" /> More from this Scholar
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moreByAuthor.map((abook) => (
              <Link key={abook.id} href={`/books/${abook.id}`} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-emerald-600 transition flex flex-col justify-between group">
                <div className="aspect-[3/4] bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {abook.coverImage ? (
                    <img src={abook.coverImage} alt={abook.title} className="h-full w-full object-cover group-hover:scale-102 transition duration-200" />
                  ) : (
                    <span className="text-[10px] text-slate-400 p-2 text-center line-clamp-3 font-serif">{abook.title}</span>
                  )}
                </div>
                <div className="mt-2 space-y-0.5">
                  <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition">{abook.title}</h4>
                  <p className="text-[11px] font-extrabold text-emerald-700">GH₵ {Number(abook.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 7: Related Books by Science Category */}
      {relatedBooks.length > 0 && (
        <section className="space-y-4 border-t border-slate-100 pt-6">
          <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-emerald-700" /> Related Works in {book.category.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedBooks.map((rbook) => (
              <Link key={rbook.id} href={`/books/${rbook.id}`} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-emerald-600 transition flex flex-col justify-between group">
                <div className="aspect-[3/4] bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {rbook.coverImage ? (
                    <img src={rbook.coverImage} alt={rbook.title} className="h-full w-full object-cover group-hover:scale-102 transition duration-200" />
                  ) : (
                    <span className="text-[10px] text-slate-400 p-2 text-center line-clamp-3 font-serif">{rbook.title}</span>
                  )}
                </div>
                <div className="mt-2 space-y-0.5">
                  <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition">{rbook.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate">By {rbook.author.name}</p>
                  <p className="text-[11px] font-extrabold text-emerald-700">GH₵ {Number(rbook.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


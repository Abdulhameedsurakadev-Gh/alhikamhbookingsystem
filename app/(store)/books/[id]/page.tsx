// app/(store)/books/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "../../../../lib/prisma";
import { BookGallery } from "./BookGallery";
import { BookRecommendationCard } from "../BookRecommendationCard";
import { AddToCartButton } from "../../../../components/ui/AddToCartButton";
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
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PriceDisplay, PriceComparison } from "../PriceDisplay";

interface Props {
  params: Promise<{ id: string }>;
}

// New — lets Google (and link previews) see the actual book title instead
// of a generic "Book Detail" for every page.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    select: { title: true, description: true, author: { select: { name: true } } },
  });

  if (!book) return { title: "Book Not Found | Al-Hikmah Bookstore" };

  return {
    title: `${book.title} | Al-Hikmah Bookstore`,
    description: book.description || `${book.title} by ${book.author.name}, available at Al-Hikmah Islamic Bookstore.`,
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;

  const [session, book] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        explainsBook: { include: { author: true } },
        explanations: { include: { author: true } },
      },
    })
  ]);

  if (!book) notFound();

  const userRole = session?.user?.role || null;
  // TODO: same open item flagged elsewhere in the codebase — if
  // verificationStatus isn't showing up on session.user without this cast,
  // the real fix belongs in lib/auth.ts's additional-fields config.
  const isVerified = (session?.user as any)?.verificationStatus === "APPROVED";

  // Fixed: these three were independent, unrelated queries running
  // sequentially (three separate round trips) instead of in parallel.
  const [moreByAuthor, relatedBooks, otherVolumes] = await Promise.all([
    prisma.book.findMany({
      where: { authorId: book.authorId, NOT: { id: book.id } },
      take: 4,
      include: { category: true, author: true },
    }),
    prisma.book.findMany({
      where: { categoryId: book.categoryId, NOT: { id: book.id } },
      take: 4,
      include: { author: true },
    }),
    book.volumeCount > 1 || book.volumeType === "MAJMUAT_MUJALLADAT"
      ? prisma.book.findMany({
          where: {
            volumeType: book.volumeType,
            NOT: { id: book.id },
            authorId: book.authorId,
            volumeCount: { gte: book.volumeCount - 1, lte: book.volumeCount + 1 },
          },
          take: 4,
          include: { author: true },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
        <Link href="/" className="hover:text-primary-hover transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/books" className="hover:text-primary-hover transition-colors">Catalog</Link>
        <span className="mx-2">/</span>
        <Link href={`/books?category=${book.category.slug}`} className="hover:text-primary-hover transition-colors">{book.category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground line-clamp-1 inline">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-5">
          <BookGallery
            coverImage={book.coverImage}
            title={book.title}
            images={book.images}
          />
        </div>

        <div className="lg:col-span-7 space-y-6 bg-card border border-border rounded-md p-6">
          <div>
            <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
              <Layers className="h-3 w-3" aria-hidden="true" />
              {book.knowledgeLevel} (Level)
            </span>
            <h1 className="font-serif text-heading lg:text-display font-extrabold text-foreground tracking-tight mt-3">
              {book.title}
            </h1>
            <p className="text-sm text-muted-foreground italic mt-2">
              By <span className="font-semibold text-primary">{book.author.name}</span> {book.author.nameArabic ? `(${book.author.nameArabic})` : ""}
            </p>
          </div>

          <div className="border-y border-border py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Price</p>
              <div className="mt-1">
                <PriceDisplay
                  retailPrice={Number(book.price)}
                  supplierCost={book.supplierCost ? Number(book.supplierCost) : null}
                  userRole={userRole}
                  isVerified={isVerified}
                  showTiered={true}
                  size="lg"
                />
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Availability</p>
              {/* Fixed: was using Zap (reads as "fast/energy") for out-of-stock
                  — swapped to AlertCircle, matching Cart and the Books
                  catalog, which both already use it for the same state. */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-sm mt-1 transition-colors ${
                book.available
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}>
                {book.available ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    In Stock
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Out of Stock
                  </>
                )}
              </span>
            </div>
          </div>

          {userRole && isVerified && (
            <div className="bg-background border border-border rounded-md p-4 space-y-2">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Wholesale Price Matrix
              </h4>
              <PriceComparison
                retailPrice={Number(book.price)}
                supplierCost={book.supplierCost ? Number(book.supplierCost) : null}
              />
            </div>
          )}

          <AddToCartButton
            book={{
              id: book.id,
              title: book.title,
              price: Number(book.price),
              weight: Number(book.weight || 0),
              coverImage: book.coverImage,
              available: book.available
            }}
          />

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-background p-3 rounded-sm border border-border">
              <span className="text-muted-foreground font-medium block">Binding Cover</span>
              <span className="font-bold text-foreground mt-0.5 block text-sm">
                {book.coverType === "AL_GHILAF_AL_MUQAWWA" ? "Hardcover" : "Softcover"}
              </span>
            </div>
            <div className="bg-background p-3 rounded-sm border border-border">
              <span className="text-muted-foreground font-medium block">Volume Count</span>
              <span className="font-bold text-foreground mt-0.5 block text-sm">{book.volumeCount} {book.volumeCount > 1 ? "Vols" : "Vol"}</span>
            </div>
            <div className="bg-background p-3 rounded-sm border border-border">
              <span className="text-muted-foreground font-medium block">Publisher</span>
              <span className="font-bold text-foreground mt-0.5 block text-sm truncate">{book.publisher}</span>
            </div>
            <div className="bg-background p-3 rounded-sm border border-border">
              <span className="text-muted-foreground font-medium block">Text Type</span>
              <span className="font-bold text-primary mt-0.5 block text-sm uppercase">{book.textType}</span>
            </div>
          </div>

          {/* Fixed: raw blue-* mapped to secondary — a neutral fact box
              (published year, language) isn't a status, so it shouldn't
              use success/warning/destructive; secondary ("quiet accent")
              is the right fit. */}
          {book.publishedYear && (
            <div className="bg-secondary/20 border border-secondary/40 p-3 rounded-sm text-xs">
              <span className="text-foreground font-semibold">Published:</span> {book.publishedYear} AH
              {book.language && <span className="text-foreground font-semibold ml-2">• Language:</span>}
              {book.language && <span className="text-muted-foreground ml-1">{book.language}</span>}
            </div>
          )}

          {/* Confirmed B2B pricing active — mapped to success, since this
              is literally confirming a positive/active state. */}
          {userRole && userRole !== "CUSTOMER" && isVerified && (
            <div className="bg-success/10 border border-success/20 rounded-sm p-3.5 flex gap-2.5 items-start">
              <ShieldCheck className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-bold text-foreground">
                  {userRole === "MALAM" ? "Malam Reseller Pricing Active" : "Madrasah Bulk Terms Unlocked"}
                </p>
                <p className="text-muted-foreground mt-0.5">
                  {userRole === "MALAM"
                    ? "Your wholesale educator pricing has been applied automatically."
                    : "Your institutional wholesale pricing is active for bulk orders."}
                </p>
              </div>
            </div>
          )}

          {/* Pending verification — mapped to warning, which is exactly
              what that token means. */}
          {userRole && !isVerified && (
            <div className="bg-warning/10 border border-warning/20 rounded-sm p-3.5 flex gap-2.5 items-start">
              <Calendar className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-bold text-foreground">Application Under Verification Review</p>
                <p className="text-muted-foreground mt-0.5">
                  We&apos;re currently reviewing your submitted credentials. Standard retail pricing applies storewide until verification is complete.
                </p>
              </div>
            </div>
          )}

          {!userRole && (
            <div className="bg-secondary/20 border border-secondary/40 rounded-sm p-3.5 flex gap-2.5 items-start">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <p className="font-bold text-foreground">Are you an Islamic Educator or School?</p>
                <p className="text-muted-foreground mt-0.5">
                  Unlock partner pricing on all books ≥ 50 GHS.{" "}
                  <Link href="/malam-apply" className="font-bold text-primary underline mx-1 hover:text-primary-hover">Become a Malam</Link>
                  or
                  <Link href="/madrasah-apply" className="font-bold text-primary underline ml-1 hover:text-primary-hover">Register your Madrasah</Link>.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Description & Table of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-border pt-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-serif text-title font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" /> About This Work
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line bg-card p-5 rounded-md border border-border">
            {book.description || "No description has been added for this book yet."}
          </p>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-serif text-title font-bold text-foreground flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" aria-hidden="true" /> Table of Contents
          </h3>
          <div className="bg-card border border-border rounded-md p-4 text-xs max-h-64 overflow-y-auto text-muted-foreground leading-normal whitespace-pre-wrap">
            {book.tableOfContents || "Table of contents has not been added for this book yet."}
          </div>
        </div>
      </div>

      {/* Text Linkage — was a dark emerald gradient, rebuilt flat */}
      {(book.explainsBook || book.explanations.length > 0) && (
        <section className="bg-card border border-border rounded-md p-6 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Milestone className="h-4 w-4" aria-hidden="true" /> Related Classical Texts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {book.explainsBook && (
              <div className="bg-background border border-border p-4 rounded-sm space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-primary font-medium uppercase tracking-wider block text-[10px]">Source Reference Text (Matn)</span>
                  <p className="text-sm font-serif font-bold text-foreground mt-1">This work explains the core text:</p>
                  <p className="font-medium text-foreground mt-2 text-sm">{book.explainsBook.title}</p>
                  <p className="text-muted-foreground italic">By {book.explainsBook.author.name}</p>
                </div>
                <Link href={`/books/${book.explainsBook.id}`} className="mt-4 inline-flex items-center gap-1 bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground px-3 py-2 rounded-sm font-bold transition-colors duration-fast text-center justify-center">
                  View Original Text <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            )}

            {book.explanations.length > 0 && (
              <div className="bg-background border border-border p-4 rounded-sm space-y-2">
                <span className="text-primary font-medium uppercase tracking-wider block text-[10px]">Available Shurooh (Commentaries)</span>
                <p className="text-sm font-serif font-bold text-foreground mt-1">Scholarly explanations for this text:</p>
                <div className="flex flex-col gap-1.5 mt-2 max-h-48 overflow-y-auto">
                  {book.explanations.map((exp) => (
                    <Link key={exp.id} href={`/books/${exp.id}`} className="block bg-card hover:bg-surface-hover p-2 rounded-sm border border-border transition-colors text-foreground">
                      <span className="font-medium block">{exp.title}</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">By {exp.author.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Author Biography */}
      <section className="bg-card border border-border rounded-md p-6 space-y-4">
        <h3 className="font-serif text-title font-bold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-primary" aria-hidden="true" /> Biography of the Scholar
        </h3>
        <div className="bg-background p-4 rounded-sm border border-border space-y-2">
          <h4 className="font-serif font-bold text-base text-foreground">
            {book.author.name} {book.author.nameArabic ? `(${book.author.nameArabic})` : ""}
          </h4>
          {book.author.diedAH && (
            <p className="text-xs font-semibold text-primary flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" /> Died: {book.author.diedAH} AH (Hijri Year)
            </p>
          )}
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line pt-1">
            {book.author.bio || "A biography has not been added for this scholar yet."}
          </p>
        </div>
      </section>

      {/* Other Volumes / More by Author / Related Works — all three now
          share BookRecommendationCard instead of three copies of the same
          markup (and the same scale-102 bug three times over). */}
      {otherVolumes.length > 0 && (
        <section className="space-y-4 border-t border-border pt-6">
          <h3 className="font-serif text-heading font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-secondary" aria-hidden="true" /> Other Volumes in This Set
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherVolumes.map((volBook) => (
              <BookRecommendationCard key={volBook.id} book={volBook} userRole={userRole} isVerified={isVerified} />
            ))}
          </div>
        </section>
      )}

      {moreByAuthor.length > 0 && (
        <section className="space-y-4 border-t border-border pt-6">
          <h3 className="font-serif text-heading font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-secondary" aria-hidden="true" /> More from this Scholar
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moreByAuthor.map((abook) => (
              <BookRecommendationCard key={abook.id} book={abook} userRole={userRole} isVerified={isVerified} showAuthor={false} />
            ))}
          </div>
        </section>
      )}

      {relatedBooks.length > 0 && (
        <section className="space-y-4 border-t border-border pt-6">
          <h3 className="font-serif text-heading font-bold text-foreground flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" /> Related Works in {book.category.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedBooks.map((rbook) => (
              <BookRecommendationCard key={rbook.id} book={rbook} userRole={userRole} isVerified={isVerified} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
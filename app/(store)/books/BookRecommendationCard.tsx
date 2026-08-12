// app/(store)/books/BookRecommendationCard.tsx
import Link from "next/link";
import Image from "next/image";
import { PriceDisplay } from "./PriceDisplay";

interface RecommendationBook {
  id: string;
  title: string;
  price: unknown; // Prisma Decimal — caller passes Number(book.price) below
  coverImage: string | null;
  available: boolean;
  supplierCost: unknown;
  author: { name: string };
}

interface BookRecommendationCardProps {
  book: RecommendationBook;
  userRole: string | null;
  isVerified: boolean;
  showAuthor?: boolean;
}

/**
 * Shared card for the three near-identical recommendation grids on the
 * book detail page (Other Volumes, More by This Scholar, Related Works).
 * Extracted because all three were copy-pasted verbatim, including the
 * same group-hover:scale-102 bug in three places at once.
 */
export function BookRecommendationCard({ book, userRole, isVerified, showAuthor = true }: BookRecommendationCardProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className={`bg-card border border-border rounded-md p-3 hover:border-border-hover transition-colors duration-fast flex flex-col justify-between group ${
        !book.available ? "opacity-60" : ""
      }`}
    >
      <div className="aspect-[3/4] bg-muted rounded-sm flex items-center justify-center overflow-hidden relative">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <span className="text-[10px] text-muted-foreground p-2 text-center line-clamp-3 font-serif">{book.title}</span>
        )}
        {!book.available && (
          <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
            <span className="text-primary-foreground text-[10px] font-bold bg-foreground/50 px-2 py-1 rounded-sm">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="mt-2 space-y-1 flex-1 flex flex-col justify-end">
        <h4 className="font-serif text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary-hover transition-colors">
          {book.title}
        </h4>
        {showAuthor && (
          <p className="text-[10px] text-muted-foreground truncate">By {book.author.name}</p>
        )}
        <div className="pt-1">
          <PriceDisplay
            retailPrice={Number(book.price)}
            supplierCost={book.supplierCost ? Number(book.supplierCost) : null}
            userRole={userRole}
            isVerified={isVerified}
            showTiered={false}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}
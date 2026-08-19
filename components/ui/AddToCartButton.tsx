
// components/ui/AddToCartButton.tsx
"use client";

import { useCartStore } from "../../store/useCartStore";
import { authClient } from "../../lib/auth-client";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { syncAndValidateCartItem } from "../../app/(store)/cart/actions";

interface AddToCartButtonProps {
  book: {
    id: string;
    title: string;
    price: number;
    weight: number;
    coverImage: string | null;
    available: boolean;
  };
}

export function AddToCartButton({
  book,
}: AddToCartButtonProps): React.JSX.Element {
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <button
        disabled
        className="w-full bg-muted text-muted-foreground font-bold py-3.5 px-6 rounded-sm text-xs opacity-50 cursor-not-allowed border-0"
      >
        Loading Inventory...
      </button>
    );
  }

  const isOutOfStock = !book.available;

  const handleAddToCart = async (): Promise<void> => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);

    try {
      /*
       * First check whether the visitor is authenticated.
       *
       * Guest users continue using Zustand/localStorage only.
       * Authenticated users must also have the item persisted
       * in the PostgreSQL cart because checkout reads the
       * database cart, not Zustand.
       */
      const session = await authClient.getSession();

      /*
       * Always keep the local Zustand cart updated.
       *
       * This gives the cart page its immediate client-side state.
       */
      addItem({
        id: book.id,
        title: book.title,
        price: book.price,
        weight: book.weight,
        coverImage: book.coverImage,
        available: book.available,
      });

      /*
       * If the user is authenticated, synchronize the same item
       * with the persistent database cart.
       *
       * This is the critical fix for the checkout redirect bug.
       */
      if (session?.data?.user?.id) {
        const result = await syncAndValidateCartItem(
          book.id,
          1
        );

        if (!result.success) {
          /*
           * The server is the source of truth for availability.
           *
           * If the book became unavailable between the page load
           * and this click, remove the optimistic local item so
           * the client cart does not claim the book is available.
           */
          useCartStore.getState().removeItem(book.id);

          console.error("Unable to add item to database cart:", result.message);

          setIsAdding(false);
          return;
        }
      }

      /*
       * Both guest and authenticated users can now proceed
       * to the normal cart page.
       *
       * For authenticated users, the database cart is now ready
       * for the checkout page to read.
       */
      router.push("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);

      /*
       * Do not leave an item in Zustand if database synchronization
       * failed for an authenticated user.
       */
      const session = await authClient.getSession().catch(() => null);

      if (session?.data?.user?.id) {
        useCartStore.getState().removeItem(book.id);
      }

      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isAdding}
      className={`w-full font-bold py-3.5 px-6 rounded-sm transition-colors duration-fast ease-standard text-sm tracking-wide flex items-center justify-center gap-2 border-0 ${
        isOutOfStock || isAdding
          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          : "bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer"
      }`}
    >
      {isOutOfStock ? (
        <span>Out of Stock</span>
      ) : isAdding ? (
        <span>Adding to Cart...</span>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}


// components/ui/AddToCartButton.tsx
"use client";

import { useCartStore } from "../../store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

export function AddToCartButton({ book }: AddToCartButtonProps): React.JSX.Element {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <button disabled className="w-full bg-muted text-muted-foreground font-bold py-3.5 px-6 rounded-sm text-xs opacity-50 cursor-not-allowed border-0">
        Loading Inventory...
      </button>
    );
  }

  const isOutOfStock = !book.available;

  const handleAddToCart = (): void => {
    if (isOutOfStock) return;

    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      weight: book.weight,
      coverImage: book.coverImage,
      available: book.available,
    });

    router.push("/cart");
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`w-full font-bold py-3.5 px-6 rounded-sm transition-colors duration-fast ease-standard text-sm tracking-wide flex items-center justify-center gap-2 border-0 ${
        isOutOfStock
          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          : "bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer"
      }`}
    >
      {isOutOfStock ? (
        <span>Out of Stock</span>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {/* "Student Basket" → "Add to Cart" — same fix as Signup's
              "Create Student Profile" earlier: your actual buyers include
              malams, madrasahs, and parents, not just students. Also
              matches the Cart page's own "Basket" → "Cart" vocabulary
              standardization. */}
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
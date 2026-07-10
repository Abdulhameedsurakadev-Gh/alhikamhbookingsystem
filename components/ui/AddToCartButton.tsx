// components/ui/AddToCartButton.tsx
"use client";

import { useCartStore, CartItem } from "../../store/useCartStore"; // Verified path to step out of components/ui into store/
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

  // React 19 Hydration Safeguard
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <button disabled className="w-full bg-slate-200 text-slate-400 font-bold py-3.5 px-6 rounded-xl text-xs opacity-50 cursor-not-allowed border-0">
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
      className={`w-full font-bold py-3.5 px-6 rounded-xl shadow-md transition text-sm tracking-wide flex items-center justify-center gap-2 border-0 ${
        isOutOfStock 
          ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60" 
          : "bg-emerald-800 hover:bg-emerald-900 text-amber-100 cursor-pointer"
      }`}
    >
      {isOutOfStock ? (
        <span>Out of Stock</span>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          <span>Add to Student Basket</span>
        </>
      )}
    </button>
  );
}
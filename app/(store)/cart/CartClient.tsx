// app/(store)/cart/CartClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, CartItem } from "../../../store/useCartStore";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Scale, ShieldCheck, AlertCircle } from "lucide-react";

export function CartClient(): React.JSX.Element {
  const items: CartItem[] = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotals = useCartStore((state) => state.getTotals);

  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-sm text-muted-foreground font-medium">Loading your cart...</div>
      </div>
    );
  }

  const { totalAmount, totalWeight, totalItems } = getTotals();
  const hasAvailableItems = items.some((item) => item.available);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 space-y-4">
        <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center text-primary">
          <ShoppingBag className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-heading font-bold text-foreground">Your Cart is Empty</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Browse our collection and add books to begin your order.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs px-6 py-3 rounded-sm transition-colors duration-fast ease-standard cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="font-serif text-display font-extrabold text-foreground tracking-tight">Your Cart</h1>
        <p className="text-sm text-muted-foreground mt-1">Review your selected books before checking out.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selected Books ({totalItems})</span>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-destructive hover:text-destructive/80 cursor-pointer bg-transparent border-0 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="divide-y divide-border border border-border bg-card rounded-md overflow-hidden">
            {items.map((item: CartItem) => (
              <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">

                <div className="w-16 h-24 bg-muted border border-border rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                  {item.coverImage ? (
                    <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="64px" />
                  ) : (
                    <span className="text-[8px] font-serif text-muted-foreground p-1 text-center line-clamp-3">{item.title}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-foreground hover:text-primary-hover transition-colors line-clamp-1">
                      <Link href={`/books/${item.id}`}>{item.title}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Scale className="h-3 w-3" aria-hidden="true" /> Weight: {item.weight ? `${item.weight} kg` : "N/A"}
                    </p>
                    {!item.available && (
                      <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" aria-hidden="true" /> Unavailable — remove item to continue
                      </p>
                    )}
                    <p className="text-sm font-extrabold text-foreground sm:hidden">
                      GH₵ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="flex items-center border border-border rounded-sm bg-background overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="p-2 text-muted-foreground hover:bg-surface-hover transition-colors disabled:opacity-30 cursor-pointer bg-transparent border-0"
                      >
                        <Minus className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-foreground select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={!item.available}
                        aria-label={`Increase quantity of ${item.title}`}
                        className="p-2 text-muted-foreground hover:bg-surface-hover transition-colors disabled:opacity-30 cursor-pointer bg-transparent border-0"
                      >
                        <Plus className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold text-foreground hidden sm:block min-w-[80px] text-right">
                        GH₵ {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-sm hover:bg-destructive/10 cursor-pointer bg-transparent border-0"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 bg-card border border-border rounded-md p-6 space-y-6">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border pb-3">
            Order Summary
          </h3>
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Selected Books</span>
              <span className="font-semibold text-foreground">{totalItems} Books</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Package Weight</span>
              <span className="font-semibold text-foreground">{totalWeight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delivery</span>
              <span className="font-semibold text-foreground">Calculated at checkout</span>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Subtotal</p>
            <p className="text-heading font-black text-primary mt-0.5">GH₵ {totalAmount.toFixed(2)}</p>
          </div>

          {hasAvailableItems ? (
            <Link href="/checkout" className="block w-full text-center bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3.5 px-6 rounded-sm transition-colors duration-fast ease-standard text-sm tracking-wide cursor-pointer">
              Proceed to Checkout
            </Link>
          ) : (
            <div
              aria-disabled="true"
              className="block w-full text-center bg-muted text-muted-foreground font-bold py-3.5 px-6 rounded-sm text-sm tracking-wide cursor-not-allowed"
            >
              No Available Books to Checkout
            </div>
          )}

          {/* Order confidence — expanded from a single line to concrete
              reassurances, per the review's suggestion */}
          <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" aria-hidden="true" />
              <span>Local payments secured via Paystack</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" aria-hidden="true" />
              <span>Delivery calculated at checkout</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" aria-hidden="true" />
              <span>Support available via WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
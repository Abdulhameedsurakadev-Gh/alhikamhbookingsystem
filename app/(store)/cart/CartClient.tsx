"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  useCartStore,
  CartItem,
} from "../../../store/useCartStore";

import {
  removeDatabaseCartItem,
  clearDatabaseCart,
  syncAndValidateCartItem,
} from "./actions";

import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Scale,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function CartClient(): React.JSX.Element {
  const items = useCartStore((state) => state.items);

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const getTotals = useCartStore(
    (state) => state.getTotals
  );

  const [isHydrated, setIsHydrated] =
    useState<boolean>(false);

  const [processingItemId, setProcessingItemId] =
    useState<string | null>(null);

  const [isClearingCart, setIsClearingCart] =
    useState<boolean>(false);

  const [cartError, setCartError] =
    useState<string>("");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-sm text-muted-foreground font-medium">
          Loading your cart...
        </div>
      </div>
    );
  }

  const {
    totalAmount,
    totalWeight,
    totalItems,
  } = getTotals();

  const hasAvailableItems = items.some(
    (item) => item.available
  );

  /**
   * Change quantity.
   *
   * IMPORTANT:
   * The database is updated FIRST.
   * Zustand is updated only after the database confirms success.
   */
  const handleQuantityChange = async (
    item: CartItem,
    newQuantity: number
  ): Promise<void> => {
    if (
      processingItemId !== null ||
      isClearingCart
    ) {
      return;
    }

    const quantity = Math.max(
      1,
      Math.floor(newQuantity)
    );

    if (quantity === item.quantity) {
      return;
    }

    setCartError("");
    setProcessingItemId(item.id);

    try {
      const result =
        await syncAndValidateCartItem(
          item.id,
          quantity
        );

      if (!result.success) {
        setCartError(
          result.message ||
            "Unable to update your cart quantity."
        );

        return;
      }

      // Database is synchronized.
      updateQuantity(item.id, quantity);
    } catch (error) {
      console.error(
        "Failed to synchronize cart quantity:",
        error
      );

      setCartError(
        "We could not update your cart. Your previous quantity has been kept."
      );
    } finally {
      setProcessingItemId(null);
    }
  };

  /**
   * Remove one item.
   *
   * Database deletion happens FIRST.
   */
  const handleRemoveItem = async (
    bookId: string
  ): Promise<void> => {
    if (
      processingItemId !== null ||
      isClearingCart
    ) {
      return;
    }

    setCartError("");
    setProcessingItemId(bookId);

    try {
      const result =
        await removeDatabaseCartItem(bookId);

      if (!result.success) {
        setCartError(
          result.message ||
            "Unable to remove this book from your cart."
        );

        return;
      }

      // Database is synchronized.
      removeItem(bookId);
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error
      );

      setCartError(
        "We could not update your cart. The item was not removed."
      );
    } finally {
      setProcessingItemId(null);
    }
  };

  /**
   * Clear the entire cart.
   *
   * Database deletion happens FIRST.
   */
  const handleClearCart = async (): Promise<void> => {
    if (
      isClearingCart ||
      processingItemId !== null ||
      items.length === 0
    ) {
      return;
    }

    setCartError("");
    setIsClearingCart(true);

    try {
      const result =
        await clearDatabaseCart();

      if (!result.success) {
        setCartError(
          result.message ||
            "Unable to clear your persistent cart."
        );

        return;
      }

      // Database is synchronized.
      clearCart();
    } catch (error) {
      console.error(
        "Failed to clear database cart:",
        error
      );

      setCartError(
        "We could not clear your cart. Your items have been kept."
      );
    } finally {
      setIsClearingCart(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 space-y-4">
        <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center text-primary">
          <ShoppingBag
            className="h-8 w-8"
            aria-hidden="true"
          />
        </div>

        <h1 className="font-serif text-heading font-bold text-foreground">
          Your Cart is Empty
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Browse our collection and add books to begin
          your order.
        </p>

        <Link
          href="/books"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs px-6 py-3 rounded-sm transition-colors duration-fast ease-standard cursor-pointer"
        >
          <ArrowLeft
            className="h-4 w-4"
            aria-hidden="true"
          />
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="font-serif text-display font-extrabold text-foreground tracking-tight">
          Your Cart
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Review your selected books before checking out.
        </p>
      </div>

      {cartError && (
        <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-sm p-3 text-xs font-medium text-destructive">
          <AlertCircle
            className="h-4 w-4 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />

          <span>{cartError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT — CART ITEMS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Selected Books ({totalItems})
            </span>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={
                isClearingCart ||
                processingItemId !== null
              }
              className="text-xs font-semibold text-destructive hover:text-destructive/80 cursor-pointer bg-transparent border-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {isClearingCart && (
                <Loader2
                  className="h-3 w-3 animate-spin"
                  aria-hidden="true"
                />
              )}

              {isClearingCart
                ? "Clearing..."
                : "Clear Cart"}
            </button>
          </div>

          <div className="divide-y divide-border border border-border bg-card rounded-md overflow-hidden">
            {items.map((item) => {
              const isProcessing =
                processingItemId === item.id;

              const anotherItemProcessing =
                processingItemId !== null &&
                !isProcessing;

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-6 flex gap-4 sm:gap-6 items-center transition-opacity ${
                    isProcessing
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  {/* BOOK IMAGE */}
                  <div className="w-16 h-24 bg-muted border border-border rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span className="text-[8px] font-serif text-muted-foreground p-1 text-center line-clamp-3">
                        {item.title}
                      </span>
                    )}
                  </div>

                  {/* BOOK INFORMATION */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-foreground hover:text-primary-hover transition-colors line-clamp-1">
                        <Link
                          href={`/books/${item.id}`}
                        >
                          {item.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Scale
                          className="h-3 w-3"
                          aria-hidden="true"
                        />

                        Weight:{" "}
                        {item.weight
                          ? `${item.weight} kg`
                          : "N/A"}
                      </p>

                      {!item.available && (
                        <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                          <AlertCircle
                            className="h-3 w-3"
                            aria-hidden="true"
                          />

                          Unavailable — remove item
                          to continue
                        </p>
                      )}

                      <p className="text-sm font-extrabold text-foreground sm:hidden">
                        GH₵{" "}
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="flex items-center border border-border rounded-sm bg-background overflow-hidden">
                        {/* DECREASE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1 ||
                            isProcessing ||
                            anotherItemProcessing ||
                            isClearingCart
                          }
                          aria-label={`Decrease quantity of ${item.title}`}
                          className="p-2 text-muted-foreground hover:bg-surface-hover transition-colors disabled:opacity-30 cursor-pointer bg-transparent border-0"
                        >
                          <Minus
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        </button>

                        <span className="w-8 text-center text-xs font-bold text-foreground select-none">
                          {isProcessing ? (
                            <Loader2
                              className="h-3 w-3 animate-spin mx-auto"
                              aria-hidden="true"
                            />
                          ) : (
                            item.quantity
                          )}
                        </span>

                        {/* INCREASE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            !item.available ||
                            isProcessing ||
                            anotherItemProcessing ||
                            isClearingCart
                          }
                          aria-label={`Increase quantity of ${item.title}`}
                          className="p-2 text-muted-foreground hover:bg-surface-hover transition-colors disabled:opacity-30 cursor-pointer bg-transparent border-0"
                        >
                          <Plus
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      {/* PRICE + DELETE */}
                      <div className="flex items-center gap-4">
                        <span className="text-base font-bold text-foreground hidden sm:block min-w-[80px] text-right">
                          GH₵{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              item.id
                            )
                          }
                          disabled={
                            isProcessing ||
                            anotherItemProcessing ||
                            isClearingCart
                          }
                          aria-label={`Remove ${item.title} from cart`}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-sm hover:bg-destructive/10 cursor-pointer bg-transparent border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <Loader2
                              className="h-4 w-4 animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Trash2
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="lg:col-span-4 bg-card border border-border rounded-md p-6 space-y-6">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Selected Books</span>

              <span className="font-semibold text-foreground">
                {totalItems}{" "}
                {totalItems === 1
                  ? "Book"
                  : "Books"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Package Weight</span>

              <span className="font-semibold text-foreground">
                {totalWeight.toFixed(2)} kg
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Delivery</span>

              <span className="font-semibold text-foreground">
                Calculated at checkout
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
              Subtotal
            </p>

            <p className="text-heading font-black text-primary mt-0.5">
              GH₵ {totalAmount.toFixed(2)}
            </p>
          </div>

          {hasAvailableItems ? (
            <Link
              href="/checkout"
              className="block w-full text-center bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3.5 px-6 rounded-sm transition-colors duration-fast ease-standard text-sm tracking-wide cursor-pointer"
            >
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

          <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck
                className="h-3.5 w-3.5 text-primary flex-shrink-0"
                aria-hidden="true"
              />

              <span>
                Local payments secured via Paystack
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck
                className="h-3.5 w-3.5 text-primary flex-shrink-0"
                aria-hidden="true"
              />

              <span>
                Delivery calculated at checkout
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck
                className="h-3.5 w-3.5 text-primary flex-shrink-0"
                aria-hidden="true"
              />

              <span>
                Support available via WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
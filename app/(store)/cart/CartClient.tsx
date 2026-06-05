"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useCartStore, CartItem } from "../../../store/useCartStore";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Scale, Loader2, ShieldCheck  } from "lucide-react";
// 🌟 IMPORT SERVER ACTIONS: Pulls your rock-solid database mutation controllers
import { syncAndValidateCartItem, removeDatabaseCartItem } from "./actions";

interface CartClientProps {
  userId?: string; // Passed from parent server component if user is logged in
}

export function CartClient({ userId }: CartClientProps): React.JSX.Element {
  const items: CartItem[] = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotals = useCartStore((state) => state.getTotals);

  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isSyncing, startTransition] = useTransition();
  const [syncError, setSyncError] = useState<string>("");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-sm text-slate-400 font-medium">Loading your student basket...</div>
      </div>
    );
  }

  const { totalAmount, totalWeight, totalItems } = getTotals();

  // 🌟 DYNAMIC SYNCHRONIZATION WRAPPER: Intercepts clicks to mutate local UI AND update PostgreSQL
  const handleQuantityAdjustment = async (bookId: string, newQty: number, stockLimit: number) => {
    if (newQty < 1) return;
    const boundedQty = Math.min(newQty, stockLimit);
    
    // Update local memory state instantly for fluid UX
    updateQuantity(bookId, boundedQty);

    // If authenticated, seamlessly send mutation to Postgres database via Server Action
    if (userId) {
      startTransition(async () => {
        try {
          const res = await syncAndValidateCartItem(userId, bookId, boundedQty);
          if (!res.success) {
            setSyncError(res.message || "An unexpected validation anomaly occurred");
          } else if (res.capped) {
            // If server stock ran out, align local Zustand memory state with the true capped value
            updateQuantity(bookId, boundedQty);
          }
        } catch (err) {
          setSyncError("An unexpected error occurred while syncing the cart.");
          console.error("Cart sync mutation failure:", err);
        }
      });
    }
  };

  // 🌟 DYNAMIC REMOVAL WRAPPER: Clears item locally and drops the row out of Postgres
  const handleItemRemoval = async (bookId: string) => {
    removeItem(bookId);

    if (userId) {
      startTransition(async () => {
        try {
          await removeDatabaseCartItem(userId, bookId);
        } catch (err) {
          console.error("Cart deletion sync failure:", err);
        }
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 space-y-4">
        <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">Your Basket is Empty</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          You haven't selected any classical texts, commentaries, or reference manuals for study yet.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-semibold text-xs px-6 py-3 rounded-xl shadow transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Explore Discovery Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight">Student Basket</h1>
          <p className="text-sm text-slate-500 mt-1">Review your selected volumes and reference materials before checking out.</p>
        </div>
        
        {/* Visual Sync Spinner Anchor */}
        {isSyncing && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full animate-in fade-in">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Syncing database...</span>
          </div>
        )}
      </div>

      {syncError && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs font-semibold text-rose-700 animate-in fade-in">
          ⚠️ {syncError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Works ({totalItems})</span>
            <button 
              onClick={clearCart} 
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer bg-transparent border-0"
            >
              Clear Basket
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
            {items.map((item: CartItem) => (
              <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                
                {/* Book Thumbnail image frame */}
                <div className="w-16 h-24 bg-slate-50 border border-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8px] font-serif text-slate-400 p-1 text-center line-clamp-3">{item.title}</span>
                  )}
                </div>

                {/* Info and Incrementers layout block */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-800 transition line-clamp-1">
                      <Link href={`/books/${item.id}`}>{item.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Scale className="h-3 w-3" /> Single Weight: {item.weight ? `${item.weight} kg` : "N/A"}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 sm:hidden">
                      GH₵ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Action Controls */}
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                      <button 
                        onClick={() => handleQuantityAdjustment(item.id, item.quantity - 1, item.stock)} 
                        className="p-2 text-slate-500 hover:bg-slate-100 transition cursor-pointer bg-transparent border-0"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800 select-none">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityAdjustment(item.id, item.quantity + 1, item.stock)} 
                        disabled={item.quantity >= item.stock} 
                        className="p-2 text-slate-500 hover:bg-slate-100 transition disabled:opacity-30 cursor-pointer bg-transparent border-0"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold text-slate-900 hidden sm:block min-w-[80px] text-right">
                        GH₵ {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => handleItemRemoval(item.id)} 
                        className="p-2 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50 cursor-pointer bg-transparent border-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

                {/* Right Side: Price Summary & Weight Metrics */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Order Summary
          </h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Selected Volumes</span>
              <span className="font-semibold text-slate-800">{totalItems} Books</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Package Weight</span>
              <span className="font-semibold text-slate-800 font-mono">{totalWeight.toFixed(2)} kg</span>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Basket Subtotal</p>
            <p className="text-2xl font-black text-emerald-900 mt-0.5">GH₵ {totalAmount.toFixed(2)}</p>
          </div>

          <Link 
            href="/checkout" 
            className="block w-full text-center bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold py-3.5 px-6 rounded-xl shadow-md transition text-sm tracking-wide cursor-pointer"
          >
            Proceed to Secure Checkout
          </Link>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
            <span>Stock levels and inventory limits verified in real-time.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

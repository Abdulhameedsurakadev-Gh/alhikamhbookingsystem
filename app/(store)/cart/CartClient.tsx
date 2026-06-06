// app/(store)/cart/CartClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore, CartItem } from "../../../store/useCartStore";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Scale, ShieldCheck } from "lucide-react";

export function CartClient(): React.JSX.Element {
  // Pull states cleanly from your global Zustand state machine
  const items: CartItem[] = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotals = useCartStore((state) => state.getTotals);

  // Strict React 19 Safe Hydration strategy: Avoids cascading renders or setState loop crashes
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Return an isolated loading skeleton during server pass to prevent hydration token errors
  if (!isHydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-sm text-slate-400 font-medium">Loading your student basket...</div>
      </div>
    );
  }

  const { totalAmount, totalWeight, totalItems } = getTotals();

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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight">Student Basket</h1>
        <p className="text-sm text-slate-500 mt-1">Review your selected volumes and reference materials before checking out.</p>
      </div>

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
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className="p-2 text-slate-500 hover:bg-slate-100 transition cursor-pointer bg-transparent border-0"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800 select-none">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
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
                        onClick={() => removeItem(item.id)} 
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
          <Link href="/checkout" className="block w-full text-center bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold py-3.5 px-6 rounded-xl shadow-md transition text-sm tracking-wide cursor-pointer">
            Proceed to Checkout
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Local payments secured.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

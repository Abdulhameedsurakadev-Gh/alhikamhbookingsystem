// app/(store)/books/PriceDisplay.tsx
"use client";

import React from "react";
import { calculateMalamPrice, calculateMadrasahPrice, formatPrice } from "@/lib/pricing";

interface PriceDisplayProps {
  retailPrice: number;
  supplierCost: number | null;
  userRole?: string | null;
  // Unlocked only if user's verificationStatus is explicitly APPROVED
  isVerified?: boolean; 
  showTiered?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Display price based on user role and verification verification state
 * - Regular customer: Retail price
 * - MALAM: Malam discounted price (if approved and cheaper than retail)
 * - MADRASAH: Madrasah discounted price (if approved and cheaper than retail)
 */
export function PriceDisplay({
  retailPrice,
  supplierCost,
  userRole,
  isVerified = false,
  showTiered = false,
  size = "md",
}: PriceDisplayProps) {
  // Determine which price to show
  let displayPrice = retailPrice;
  let savedAmount = 0;
  let isTiered = false;

  // Wholesale pricing is restricted to verified accounts on books over 50 GHS
  if (isVerified && retailPrice >= 50) {
    if (userRole === "MALAM") {
      const calculatedMalam = calculateMalamPrice(retailPrice, supplierCost);
      // Safety safeguard: only apply if the wholesale tier actually saves money
      if (calculatedMalam < retailPrice) {
        displayPrice = calculatedMalam;
        savedAmount = retailPrice - displayPrice;
        isTiered = true;
      }
    } else if (userRole === "MADRASAH") {
      const calculatedMadrasah = calculateMadrasahPrice(retailPrice, supplierCost);
      if (calculatedMadrasah < retailPrice) {
        displayPrice = calculatedMadrasah;
        savedAmount = retailPrice - displayPrice;
        isTiered = true;
      }
    }
  }

  const sizeClasses = {
    sm: "text-lg font-bold animate-fade-in",
    md: "text-2xl font-extrabold tracking-tight",
    lg: "text-3xl font-black tracking-tight",
  };

  return (
    <div className="space-y-1">
      {/* Original Retail Price Context (Strikethrough) */}
      {isTiered && (
        <div className="text-xs font-medium text-slate-500 line-through">
          GH₵{formatPrice(retailPrice)}
        </div>
      )}

      {/* Target Selling Price */}
      <div className={`${sizeClasses[size]} text-emerald-400 font-sans`}>
        GH₵{formatPrice(displayPrice)}
      </div>

      {/* Premium Visual Savings Badge */}
      {isTiered && savedAmount > 0 && (
        <div className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit select-none">
          Save GH₵{formatPrice(savedAmount)}
        </div>
      )}

      {/* Account Context Badge */}
      {userRole && showTiered && (
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">
          {isTiered && userRole === "MALAM" && "📚 Malam Wholesale Price"}
          {isTiered && userRole === "MADRASAH" && "🏫 Madrasah Institutional Price"}
          {(!isTiered || userRole === "CUSTOMER") && "Retail Store Price"}
        </div>
      )}
    </div>
  );
}

/**
 * Show price comparison across all tiers
 * Used in backend administrative boards or info drawers
 */
export function PriceComparison({
  retailPrice,
  supplierCost,
}: {
  retailPrice: number;
  supplierCost: number | null;
}) {
  const malamPrice = calculateMalamPrice(retailPrice, supplierCost);
  const madrasahPrice = calculateMadrasahPrice(retailPrice, supplierCost);

  return (
    <div className="grid grid-cols-3 gap-3 text-xs">
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center">
        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-tight text-[10px]">Retail</p>
        <p className="font-bold text-slate-200">GH₵{formatPrice(retailPrice)}</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center">
        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-tight text-[10px]">Malam</p>
        <p className="font-bold text-emerald-400">GH₵{formatPrice(malamPrice)}</p>
        {malamPrice < retailPrice ? (
          <p className="text-emerald-500 font-medium text-[10px] mt-0.5">
            -GH₵{formatPrice(retailPrice - malamPrice)}
          </p>
        ) : (
          <p className="text-slate-500 text-[10px] mt-0.5 italic">No discount</p>
        )}
      </div>
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center">
        <p className="text-slate-500 font-semibold mb-1 uppercase tracking-tight text-[10px]">Madrasah</p>
        <p className="font-bold text-emerald-400">GH₵{formatPrice(madrasahPrice)}</p>
        {madrasahPrice < retailPrice ? (
          <p className="text-emerald-500 font-medium text-[10px] mt-0.5">
            -GH₵{formatPrice(retailPrice - madrasahPrice)}
          </p>
        ) : (
          <p className="text-slate-500 text-[10px] mt-0.5 italic">No discount</p>
        )}
      </div>
    </div>
  );
}

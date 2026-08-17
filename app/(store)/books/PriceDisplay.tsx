// app/(store)/books/PriceDisplay.tsx
"use client";

import React from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import { calculateMalamPrice, calculateMadrasahPrice, formatPrice } from "@/lib/pricing";

interface PriceDisplayProps {
  retailPrice: number;
  supplierCost: number | null;
  userRole?: string | null;
  isVerified?: boolean;
  showTiered?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Display price based on user role and verification state
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
  let displayPrice = retailPrice;
  let savedAmount = 0;
  let isTiered = false;

  if (isVerified && retailPrice >= 50) {
    if (userRole === "MALAM") {
      const calculatedMalam = calculateMalamPrice(retailPrice, supplierCost);
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
    // Fixed: "animate-fade-in" doesn't match the animation pattern used
    // elsewhere in the codebase (tw-animate-css expects "animate-in" plus
    // a modifier, e.g. "animate-in fade-in" as seen in NavActions).
    sm: "text-lg font-bold animate-in fade-in duration-normal",
    md: "text-2xl font-extrabold tracking-tight",
    lg: "text-3xl font-black tracking-tight",
  };

  return (
    <div className="space-y-1">
      {isTiered && (
        <div className="text-xs font-medium text-muted-foreground line-through">
          GH₵{formatPrice(retailPrice)}
        </div>
      )}

      <div className={`${sizeClasses[size]} text-primary font-sans`}>
        GH₵{formatPrice(displayPrice)}
      </div>

      {/* Mapped to the success token, not primary — this is specifically
          communicating "you saved money," which is what success means in
          the Color System, not just brand identity. */}
      {isTiered && savedAmount > 0 && (
        <div className="text-[11px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-sm w-fit select-none">
          Save GH₵{formatPrice(savedAmount)}
        </div>
      )}

      {/* Emojis removed — replaced with the same Lucide icons already used
          for these roles elsewhere (Shield for admin, GraduationCap for
          Study Level), matching the Icons-not-emoji rule. */}
      {userRole && showTiered && (
        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1 flex items-center gap-1">
          {isTiered && userRole === "MALAM" && (
            <>
              <BookOpen className="h-3 w-3" aria-hidden="true" /> Malam Wholesale Price
            </>
          )}
          {isTiered && userRole === "MADRASAH" && (
            <>
              <GraduationCap className="h-3 w-3" aria-hidden="true" /> Madrasah Institutional Price
            </>
          )}
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
      <div className="bg-card border border-border p-2.5 rounded-sm text-center">
        <p className="text-muted-foreground font-semibold mb-1 uppercase tracking-tight text-[10px]">Retail</p>
        <p className="font-bold text-foreground">GH₵{formatPrice(retailPrice)}</p>
      </div>
      <div className="bg-card border border-border p-2.5 rounded-sm text-center">
        <p className="text-muted-foreground font-semibold mb-1 uppercase tracking-tight text-[10px]">Malam</p>
        <p className="font-bold text-primary">GH₵{formatPrice(malamPrice)}</p>
        {malamPrice < retailPrice ? (
          <p className="text-success font-medium text-[10px] mt-0.5">
            -GH₵{formatPrice(retailPrice - malamPrice)}
          </p>
        ) : (
          <p className="text-muted-foreground text-[10px] mt-0.5 italic">No discount</p>
        )}
      </div>
      <div className="bg-card border border-border p-2.5 rounded-sm text-center">
        <p className="text-muted-foreground font-semibold mb-1 uppercase tracking-tight text-[10px]">Madrasah</p>
        <p className="font-bold text-primary">GH₵{formatPrice(madrasahPrice)}</p>
        {madrasahPrice < retailPrice ? (
          <p className="text-success font-medium text-[10px] mt-0.5">
            -GH₵{formatPrice(retailPrice - madrasahPrice)}
          </p>
        ) : (
          <p className="text-muted-foreground text-[10px] mt-0.5 italic">No discount</p>
        )}
      </div>
    </div>
  );
}
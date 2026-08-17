// app/(store)/books/PriceDisplay.tsx
"use client";

import React from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import {
  calculatePrice,
  formatPrice,
  resolvePricingRole,
} from "@/lib/pricing";

interface PriceDisplayProps {
  retailPrice: number;
  supplierCost: number | null;
  userRole?: string | null;
  isVerified?: boolean;
  showTiered?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Displays the authoritative catalog price for the current customer profile.
 *
 * Catalog stage:
 * - Regular/unverified users → retail price
 * - Approved MALAM → Malam Standard price (quantity 1)
 * - Approved MADRASAH → Madrasah Standard price (quantity 1)
 *
 * Bulk pricing is intentionally handled later by the cart/checkout flow,
 * where the actual quantity is available.
 */
export function PriceDisplay({
  retailPrice,
  supplierCost,
  userRole,
  isVerified = false,
  showTiered = false,
  size = "md",
}: PriceDisplayProps) {
  const pricingRole = isVerified
    ? resolvePricingRole(
        userRole as Parameters<typeof resolvePricingRole>[0],
        "APPROVED"
      )
    : "GUEST";

  const result = calculatePrice({
    retailPrice,
    supplierCost,
    quantity: 1,
    role: pricingRole,
  });

  const displayPrice = result.unitPrice;
  const isTiered = result.isWholesale && displayPrice < retailPrice;
  const savedAmount = isTiered ? retailPrice - displayPrice : 0;

  const sizeClasses = {
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

      {isTiered && savedAmount > 0 && (
        <div className="text-[11px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-sm w-fit select-none">
          Save GH₵{formatPrice(savedAmount)}
        </div>
      )}

      {userRole && showTiered && (
        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1 flex items-center gap-1">
          {isTiered && pricingRole === "MALAM" && (
            <>
              <BookOpen className="h-3 w-3" aria-hidden="true" />
              Malam Wholesale Price
            </>
          )}

          {isTiered && pricingRole === "MADRASAH" && (
            <>
              <GraduationCap className="h-3 w-3" aria-hidden="true" />
              Madrasah Institutional Price
            </>
          )}

          {!isTiered && "Retail Store Price"}
        </div>
      )}
    </div>
  );
}

/**
 * Show price comparison across the available pricing tiers.
 *
 * Administrative display only.
 * Catalog/customer pricing should use PriceDisplay.
 */
export function PriceComparison({
  retailPrice,
  supplierCost,
}: {
  retailPrice: number;
  supplierCost: number | null;
}) {
  const malamPrice = calculatePrice({
    retailPrice,
    supplierCost,
    quantity: 1,
    role: "MALAM",
  });

  const madrasahPrice = calculatePrice({
    retailPrice,
    supplierCost,
    quantity: 1,
    role: "MADRASAH",
  });

  return (
    <div className="grid grid-cols-3 gap-3 text-xs">
      <div className="bg-card border border-border p-2.5 rounded-sm text-center">
        <p className="text-muted-foreground font-semibold mb-1 uppercase tracking-tight text-[10px]">
          Retail
        </p>
        <p className="font-bold text-foreground">
          GH₵{formatPrice(retailPrice)}
        </p>
      </div>

      <div className="bg-card border border-border p-2.5 rounded-sm text-center">
        <p className="text-muted-foreground font-semibold mb-1 uppercase tracking-tight text-[10px]">
          Malam
        </p>
        <p className="font-bold text-primary">
          GH₵{formatPrice(malamPrice.unitPrice)}
        </p>

        {malamPrice.unitPrice < retailPrice ? (
          <p className="text-success font-medium text-[10px] mt-0.5">
            -GH₵{formatPrice(retailPrice - malamPrice.unitPrice)}
          </p>
        ) : (
          <p className="text-muted-foreground text-[10px] mt-0.5 italic">
            No discount
          </p>
        )}
      </div>

      <div className="bg-card border border-border p-2.5 rounded-sm text-center">
        <p className="text-muted-foreground font-semibold mb-1 uppercase tracking-tight text-[10px]">
          Madrasah
        </p>
        <p className="font-bold text-primary">
          GH₵{formatPrice(madrasahPrice.unitPrice)}
        </p>

        {madrasahPrice.unitPrice < retailPrice ? (
          <p className="text-success font-medium text-[10px] mt-0.5">
            -GH₵{formatPrice(retailPrice - madrasahPrice.unitPrice)}
          </p>
        ) : (
          <p className="text-muted-foreground text-[10px] mt-0.5 italic">
            No discount
          </p>
        )}
      </div>
    </div>
  );
}
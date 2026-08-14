// lib/pricing/calculations.ts

import { PricingInput, PriceResult } from "./types";
import { determinePricingTier } from "./rules";
import { PRICING_LADDER } from "./margins";
import { BUFFER_ABOVE_FIFTY } from "./constants";

/**
 * Authoritative financial calculation engine for the Al-Hikmah Bookstore ecosystem.
 * Safely processes tiered pricing using your exact profit markup and buffer rules.
 */
export function calculatePrice(input: PricingInput): PriceResult {
  const { retailPrice, supplierCost, quantity, role } = input;

  // 1. Resolve the matching semantic classification tier
  const tier = determinePricingTier(role, quantity, retailPrice);

  // 🛑 SECURITY GATE: If item is under GH₵ 50 or supplier cost is missing, everyone pays retail reference
  if (retailPrice < 50 || supplierCost === null || supplierCost <= 0) {
    return {
      unitPrice: retailPrice,
      totalPrice: Number((retailPrice * quantity).toFixed(2)),
      isWholesale: false,
      tier
    };
  }

  // 👤 PIPELINE A: Public Retail & Guest Handling (Completely Independent of Ledger Arrays)
  if (tier === "RETAIL_STANDARD") {
    return {
      unitPrice: retailPrice,
      totalPrice: Number((retailPrice * quantity).toFixed(2)),
      isWholesale: false,
      tier
    };
  }

  if (tier === "RETAIL_BULK") {
    const bulkUnitPrice = Number((retailPrice - BUFFER_ABOVE_FIFTY).toFixed(2));
    return {
      unitPrice: bulkUnitPrice,
      totalPrice: Number((bulkUnitPrice * quantity).toFixed(2)),
      isWholesale: true,
      tier
    };
  }

  // 🕌/🏫 PIPELINE B: Partner & Wholesale Handling (Requires Verified Cost Structures)
  const cost = Number(supplierCost);
  
  // Isolate the exact row in your locked data ladder matching this retail reference price
  const row = PRICING_LADDER.find((r) => retailPrice >= r.minPrice && retailPrice < r.maxPrice);

  // Fallback guard if a 50+ book is somehow omitted from your ledger arrays
  if (!row) {
    return {
      unitPrice: retailPrice,
      totalPrice: Number((retailPrice * quantity).toFixed(2)),
      isWholesale: false,
      tier
    };
  }

  let finalUnitPrice = retailPrice;

  // Mathematical Evaluation Matrix using pure cost markup rules
  switch (tier) {
    case "MALAM_STANDARD":
      // 🕌 Malam 1-9: Cost + Malam Standard Margin (No Buffer)
      finalUnitPrice = cost + (cost * row.malamStandard);
      break;

    case "MALAM_BULK":
      // 🕌 Malam 10+: Cost + Malam Bulk Margin (No Buffer)
      finalUnitPrice = cost + (cost * row.malamBulk);
      break;

    case "MADRASAH_STANDARD":
      // 🏫 Madrasah 1-9: Cost + Madrasah Standard Margin (No Buffer)
      finalUnitPrice = cost + (cost * row.madrasahStandard);
      break;

    case "MADRASAH_BULK":
      // 🏫 Madrasah 10+: Cost + Madrasah Bulk Margin (No Buffer)
      finalUnitPrice = cost + (cost * row.madrasahBulk);
      break;
  }

  // Final Guardrail: Ensure final pricing never drops below actual acquisition cost
  const sanitizedUnitPrice = Math.max(finalUnitPrice, cost);
  const roundedUnitPrice = Number(sanitizedUnitPrice.toFixed(2));

  return {
    unitPrice: roundedUnitPrice,
    totalPrice: Number((roundedUnitPrice * quantity).toFixed(2)),
    isWholesale: true,
    tier
  };
}

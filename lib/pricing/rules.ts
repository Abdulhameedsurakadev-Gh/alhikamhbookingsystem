// lib/pricing/rules.ts

import { CustomerPricingRole, PricingTier } from "./types";
import { 
  WHOLESALE_MIN_RETAIL_PRICE, 
  RETAIL_BULK_MIN_QUANTITY, 
  PARTNER_BULK_MIN_QUANTITY 
} from "./constants";

/**
 * 🛡️ Rule Gate: Evaluates if a book is eligible for any partner or volume-based pricing adjustments.
 * Any item with a retail price under GH₵ 50 is strictly locked out.
 */
export function isWholesaleEligible(retailPrice: number): boolean {
  return retailPrice >= WHOLESALE_MIN_RETAIL_PRICE;
}

/**
 * 🧠 Rule Selector: Resolves the authoritative pricing classification tier.
 */
export function determinePricingTier(
  role: CustomerPricingRole,
  quantity: number,
  retailPrice: number
): PricingTier {
  
  // 🛑 RULE: Books under GH₵ 50 always fall back to standard retail across all profiles
  if (!isWholesaleEligible(retailPrice)) {
    return "RETAIL_STANDARD";
  }

  // 👤 Guest/Retail Evaluations
  if (role === "GUEST") {
    return quantity >= RETAIL_BULK_MIN_QUANTITY 
      ? "RETAIL_BULK" 
      : "RETAIL_STANDARD";
  }

  // 🕌 Malam Evaluations
  if (role === "MALAM") {
    return quantity >= PARTNER_BULK_MIN_QUANTITY 
      ? "MALAM_BULK" 
      : "MALAM_STANDARD";
  }

  // 🏫 Madrasah Evaluations
  if (role === "MADRASAH") {
    return quantity >= PARTNER_BULK_MIN_QUANTITY 
      ? "MADRASAH_BULK" 
      : "MADRASAH_STANDARD";
  }

  return "RETAIL_STANDARD";
}

// lib/pricing/types.ts

export type CustomerPricingRole = "GUEST" | "MALAM" | "MADRASAH";

export type PricingTier =
  | "RETAIL_STANDARD"
  | "RETAIL_BULK"
  | "MALAM_STANDARD"
  | "MALAM_BULK"
  | "MADRASAH_STANDARD"
  | "MADRASAH_BULK";

export interface PricingInput {
  retailPrice: number;
  supplierCost: number | null;
  quantity: number;
  role: CustomerPricingRole;
}

export interface PriceResult {
  unitPrice: number;
  totalPrice: number;
  isWholesale: boolean;
  tier: PricingTier;
}

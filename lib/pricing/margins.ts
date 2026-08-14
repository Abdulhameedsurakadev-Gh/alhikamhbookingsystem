// lib/pricing/margins.ts

import { CustomerPricingRole } from "./types";

export interface MarginRow {
  minPrice: number;
  maxPrice: number;
  malamStandard: number;
  malamBulk: number;
  madrasahStandard: number;
  madrasahBulk: number;
}

export const PRICING_LADDER: MarginRow[] = [
  { minPrice: 50,  maxPrice: 60,       malamStandard: 0.26, malamBulk: 0.24, madrasahStandard: 0.24, madrasahBulk: 0.22 },
  { minPrice: 60,  maxPrice: 70,       malamStandard: 0.28, malamBulk: 0.26, madrasahStandard: 0.26, madrasahBulk: 0.24 },
  { minPrice: 70,  maxPrice: 80,       malamStandard: 0.30, malamBulk: 0.28, madrasahStandard: 0.28, madrasahBulk: 0.26 },
  { minPrice: 80,  maxPrice: 90,       malamStandard: 0.32, malamBulk: 0.30, madrasahStandard: 0.30, madrasahBulk: 0.28 },
  { minPrice: 90,  maxPrice: 100,      malamStandard: 0.34, malamBulk: 0.32, madrasahStandard: 0.32, madrasahBulk: 0.30 },
  { minPrice: 100, maxPrice: 120,      malamStandard: 0.36, malamBulk: 0.34, madrasahStandard: 0.34, madrasahBulk: 0.32 },
  { minPrice: 120, maxPrice: 240,      malamStandard: 0.38, malamBulk: 0.36, madrasahStandard: 0.36, madrasahBulk: 0.34 },
  { minPrice: 240, maxPrice: 260,      malamStandard: 0.40, malamBulk: 0.38, madrasahStandard: 0.38, madrasahBulk: 0.36 },
  { minPrice: 260, maxPrice: 280,      malamStandard: 0.42, malamBulk: 0.40, madrasahStandard: 0.40, madrasahBulk: 0.38 },
  { minPrice: 280, maxPrice: 300,      malamStandard: 0.44, malamBulk: 0.42, madrasahStandard: 0.42, madrasahBulk: 0.40 },
  { minPrice: 300, maxPrice: 450,      malamStandard: 0.42, malamBulk: 0.40, madrasahStandard: 0.40, madrasahBulk: 0.38 },
  { minPrice: 450, maxPrice: Infinity, malamStandard: 0.30, malamBulk: 0.28, madrasahStandard: 0.30, madrasahBulk: 0.26 },
];

/**
 * Returns the raw retail markup percentage for small inventory items under GH₵ 50
 */
export function getBelowFiftyMargin(retailPrice: number): number {
  if (retailPrice >= 40) return 0.20;
  if (retailPrice >= 30) return 0.15;
  if (retailPrice >= 20) return 0.10;
  return 0.05; // 0-19 range
}

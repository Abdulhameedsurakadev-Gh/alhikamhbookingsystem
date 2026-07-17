// lib/pricing.ts
/**
 * Pricing Logic for Al-Hikmah Bookstore v2.0
 * 
 * Rules:
 * - Books < 50 GHS: Everyone pays same price (no tiered pricing)
 * - Books >= 50 GHS: Use tiered pricing (Malam, Madrasah get discounts)
 * - Buffer: 10 GHS (added after margin calculation)
 * - Formula: Floor(cost × (1 + margin%)) + 10 + 0.99
 */

// Margin percentages for MALAM (Teacher Resellers)
const MALAM_MARGINS: Record<string, number> = {
  "50-60": 0.22,      // 22%
  "60-70": 0.24,      // 24%
  "70-80": 0.26,      // 26%
  "80-90": 0.28,      // 28%
  "90-100": 0.30,     // 30%
  "100-120": 0.32,    // 32%
  "120-240": 0.34,    // 34%
  "240-260": 0.36,    // 36%
  "260-280": 0.38,    // 38%
  "280-300": 0.40,    // 40%
  "300-449": 0.42,    // 42%
  "450+": 0.22,       // 22%
};

// Margin percentages for MADRASAH (Institutions)
const MADRASAH_MARGINS: Record<string, number> = {
  "50-60": 0.20,      // 20%
  "60-70": 0.22,      // 22%
  "70-80": 0.24,      // 24%
  "80-90": 0.26,      // 26%
  "90-100": 0.28,     // 28%
  "100-120": 0.30,    // 30%
  "120-240": 0.32,    // 32%
  "240-260": 0.34,    // 34%
  "260-280": 0.36,    // 36%
  "280-300": 0.38,    // 38%
  "300-449": 0.40,    // 40%
  "450+": 0.20,       // 20%
};

/**
 * Get margin percentage based on the book's retail price
 * @param retailPrice Base retail price from database
 * @param margins Margin table (Malam or Madrasah)
 * @returns Margin percentage as decimal (0.22 = 22%)
 */
function getMarginForPrice(retailPrice: number, margins: Record<string, number>): number {
  if (retailPrice >= 450) return margins["450+"];
  if (retailPrice >= 300) return margins["300-449"];
  if (retailPrice >= 280) return margins["280-300"];
  if (retailPrice >= 260) return margins["260-280"];
  if (retailPrice >= 240) return margins["240-260"];
  if (retailPrice >= 120) return margins["120-240"];
  if (retailPrice >= 100) return margins["100-120"];
  if (retailPrice >= 90) return margins["90-100"];
  if (retailPrice >= 80) return margins["80-90"];
  if (retailPrice >= 70) return margins["70-80"];
  if (retailPrice >= 60) return margins["60-70"];
  if (retailPrice >= 50) return margins["50-60"];
  return 0; // Fallback safety catch
}

/**
 * Calculate discounted price for a tier
 * Formula: Floor(cost × (1 + margin)) + 10 + 0.99
 * @param supplierCost Wholesale cost
 * @param marginRate Margin percentage as decimal
 * @returns Calculated price
 */
function calculateTieredPrice(supplierCost: number, marginRate: number): number {
  const buffer = 10; // Always 10 GHS for tiered pricing
  const withMargin = supplierCost * (1 + marginRate);
  const floored = Math.floor(withMargin);
  return floored + buffer + 0.99;
}

/**
 * Calculate all three prices (retail, malam, madrasah)
 * @param retailPrice Current retail price in database
 * @param supplierCost Supplier/wholesale cost
 * @returns Object with all three prices
 */
export function calculatePrices(retailPrice: number, supplierCost: number | null) {
  return {
    retail: retailPrice,
    malam: calculateMalamPrice(retailPrice, supplierCost),
    madrasah: calculateMadrasahPrice(retailPrice, supplierCost),
  };
}

/**
 * Calculate Malam (teacher reseller) price
 * If retail < 50: return retail price
 * If retail >= 50: apply margin + buffer
 */
export function calculateMalamPrice(retailPrice: number, supplierCost: number | null): number {
  // Books < 50 GHS: No tiered pricing
  if (retailPrice < 50) {
    return retailPrice;
  }

  // Books >= 50 GHS: Use tiered pricing
  if (!supplierCost || supplierCost <= 0) {
    return retailPrice; // Fallback if no supplier cost
  }

  // FIX: Passing retailPrice instead of supplierCost to match the business ranges
  const margin = getMarginForPrice(retailPrice, MALAM_MARGINS);
  return calculateTieredPrice(supplierCost, margin);
}

/**
 * Calculate Madrasah (institution) price
 * If retail < 50: return retail price
 * If retail >= 50: apply margin + buffer
 */
export function calculateMadrasahPrice(
  retailPrice: number,
  supplierCost: number | null
): number {
  // Books < 50 GHS: No tiered pricing
  if (retailPrice < 50) {
    return retailPrice;
  }

  // Books >= 50 GHS: Use tiered pricing
  if (!supplierCost || supplierCost <= 0) {
    return retailPrice; // Fallback if no supplier cost
  }

  // FIX: Passing retailPrice instead of supplierCost to match the business ranges
  const margin = getMarginForPrice(retailPrice, MADRASAH_MARGINS);
  return calculateTieredPrice(supplierCost, margin);
}

/**
 * Format price to 2 decimal places
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Calculate profit margin percentage
 * @param retailPrice Selling price
 * @param supplierCost Cost paid to supplier
 * @returns Margin as percentage string (e.g., "25%")
 */
export function calculateMarginPercentage(retailPrice: number, supplierCost: number): string {
  if (supplierCost <= 0) return "0%";
  const margin = ((retailPrice - supplierCost) / supplierCost) * 100;
  return `${Math.round(margin)}%`;
}

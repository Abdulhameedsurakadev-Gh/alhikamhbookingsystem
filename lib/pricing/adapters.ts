// lib/pricing/adapters.ts

import { CustomerPricingRole, PricingInput } from "./types";
import { UserRole, VerificationStatus, Book } from "@prisma/client";

/**
 * 🔒 Authorization Gate: Evaluates user parameters and translates them
 * into the strict commercial pricing role required by the execution engine.
 */
export function resolvePricingRole(
  role: UserRole | null | undefined,
  verificationStatus: VerificationStatus | null | undefined
): CustomerPricingRole {
  // A partner only unlocks wholesale rates if their category matches AND their application is fully APPROVED
  if (verificationStatus === VerificationStatus.APPROVED) {
    if (role === UserRole.MALAM) return "MALAM";
    if (role === UserRole.MADRASAH) return "MADRASAH";
  }

  // Regular CUSTOMER profiles and unverified/pending/rejected partners fall back to standard GUEST retail pricing
  return "GUEST";
}

/**
 * 🎛️ Database Adapter: Converts raw Prisma model instances into primitive,
 * clean JS calculation variables.
 */
export function mapBookToPricingInput(
  book: Book,
  quantity: number,
  role: CustomerPricingRole
): PricingInput {
  return {
    retailPrice: Number(book.price),
    supplierCost: book.supplierCost ? Number(book.supplierCost) : null,
    quantity,
    role,
  };
}

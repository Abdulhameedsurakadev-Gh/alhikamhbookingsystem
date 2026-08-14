// lib/malam/access.ts

import { CustomerPricingRole } from "@/lib/pricing/types";

export interface MalamAccessInput {
  role: string | null | undefined;
  verificationStatus: string | null | undefined;
}

/**
 * A Malam receives partner pricing only after successful verification.
 *
 * Role identifies the user's intended account type.
 * Verification status determines whether that account is authorized
 * to use the Malam pricing domain.
 */
export function hasMalamAccess(input: MalamAccessInput): boolean {
  return (
    input.role === "MALAM" &&
    input.verificationStatus === "APPROVED"
  );
}

/**
 * Converts an authenticated, verified Malam into the pricing-domain role.
 * Unverified users remain ordinary retail customers.
 */
export function resolveMalamPricingRole(
  input: MalamAccessInput
): CustomerPricingRole {
  return hasMalamAccess(input) ? "MALAM" : "GUEST";
}
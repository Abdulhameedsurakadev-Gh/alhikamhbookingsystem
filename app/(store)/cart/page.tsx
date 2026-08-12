// app/(store)/cart/page.tsx
import { CartClient } from "./CartClient";

// Removed force-dynamic — this page does no server-side data fetching at
// all (cart lives entirely in client-side Zustand/localStorage), so there
// was nothing here that actually needed per-request dynamic evaluation.

export const metadata = {
  title: "Your Cart | Al-Hikmah Bookstore",
  description: "Review the books in your cart before proceeding to checkout.",
};

export default function CartPage() {
  return <CartClient />;
}
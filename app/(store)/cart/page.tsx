// app/(store)/cart/page.tsx
import { CartClient } from "./CartClient";

// Force Next.js to evaluate this endpoint dynamically on every page request pass
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Cart | Al-Hikmah Bookstore",
  description: "Review your selected classical reference texts and commentaries.",
};

export default function CartPage() {
  return <CartClient />;
}

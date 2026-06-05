// app/checkout/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "../../../lib/auth";
import { CheckoutForm } from "../../checkout/CheckoutForm";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CheckoutPage(): Promise<React.JSX.Element> {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?redirect=checkout");
  }

  // 1. Fetch current database snapshot for the logged-in student user
  const cart = await prisma.cart.findUnique({
    where: { userId: session.id },
    include: {
      user: true,
      items: { 
        include: { book: true },
        orderBy: { createdAt: "desc" } // Keeps list rendering structurally predictable
      }
    }
  });

  // 2. If the user has no database-level items, bounce them safely back to basket assembly
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // 3. Transform database layout records into a clean, uniform format for the interactive form
  const formattedItems = cart.items.map((item) => ({
    id: item.book.id, // Explicitly cross-references the core structural book ID
    title: item.book.title,
    price: parseFloat(item.book.price.toString()),
    quantity: item.quantity,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Secure payment popup powered by Paystack
          </p>
        </div>
        <Link href="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-800 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Basket
        </Link>
      </div>

      {/* 4. The form handles the complete rendering grid, combining delivery addresses with live total adjustments */}
      <CheckoutForm 
        userId={session.id} 
        userEmail={cart.user?.email || "student@alhikmah.com"} 
        cartItems={formattedItems} 
      />
    </div>
  );
}

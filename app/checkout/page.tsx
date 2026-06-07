// app/checkout/page.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers"; // Next.js 16 core headers utility
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth"; // 🌟 FIXED: Swapped out custom hook for official Better-Auth core client
import { CheckoutForm } from "./CheckoutForm";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CheckoutPage(): Promise<React.JSX.Element> {
  // 🛡️ SECURE BETTER-AUTH SERVER INVOCATION: Read active tokens instantly from incoming headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login?redirect=checkout");
  }

  // Pull down persistent cart matrix matched strictly to Better-Auth's user ID key framework
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      items: { include: { book: true } }
    }
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // Format cart items safely for our client component
  const formattedItems = cart.items.map((item) => ({
    id: item.id,
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

      {/* The CheckoutForm wraps both form inputs and order summary to allow live totals */}
      <CheckoutForm 
        userId={session.user.id} 
        userEmail={session.user.email || "student@alhikmah.com"} 
        cartItems={formattedItems} 
      />
    </div>
  );
}

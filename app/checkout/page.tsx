// app/checkout/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getServerSession } from "../../lib/auth";
import { CheckoutForm } from "./CheckoutForm";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CheckoutPage(): Promise<React.JSX.Element> {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?redirect=checkout");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.id },
    include: {
      user: true,
      items: { include: { book: true } }
    }
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const totalAmount = cart.items.reduce((acc, item) => {
    return acc + (parseFloat(item.book.price.toString()) * item.quantity);
  }, 0);

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-slate-900">Delivery Information</h2>
          {/* Look right around line 52 inside app/checkout/page.tsx and verify the prop names match: */}
            <CheckoutForm 
              userId={session.id} 
              userEmail={cart.user?.email || "student@alhikmah.com"} 
              totalAmount={totalAmount} 
            />

        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2.5">
            Order Summary ({totalItems})
          </h3>
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto space-y-2 pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="pt-2 flex justify-between items-start text-xs gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-slate-900 truncate">{item.book.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-800 flex-shrink-0">
                  ₵{(parseFloat(item.book.price.toString()) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Total Payable</span>
              <p className="text-xl font-black text-emerald-900 mt-0.5">GH₵ {totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

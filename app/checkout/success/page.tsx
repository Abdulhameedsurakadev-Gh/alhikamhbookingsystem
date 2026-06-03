// app/checkout/success/page.tsx
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle2, ShoppingBag, ClipboardList, ShieldCheck, MapPin } from "lucide-react";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const params = await searchParams;
  const orderId = params.id;

  // 1. Defend against empty string parameters entering the route stream
  if (!orderId) {
    notFound();
  }

  // 2. Fetch the newly written order record from your Supabase PostgreSQL cluster
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: {
        include: { book: { select: { title: true } } }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in duration-300">
      
      {/* Visual Success Indicator Badge */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shadow-sm">
          <CheckCircle2 className="h-10 w-10 animate-bounce duration-700" />
        </div>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight">Order Confirmed!</h1>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          Alhamdulillah, your transaction has been verified. Your study volumes have been logged inside our ledger.
        </p>
      </div>

      {/* Technical Transaction Voucher Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>Receipt Voucher</span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px]">
            {order.status}
          </span>
        </div>

        {/* References Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Al-Hikmah Order ID</span>
            <span className="font-mono font-bold text-slate-800 block select-all truncate">{order.id}</span>
          </div>
          {order.paystackReference && (
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Paystack Gateway ID</span>
              <span className="font-mono font-bold text-slate-800 block select-all truncate">{order.paystackReference}</span>
            </div>
          )}
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Total Amount Paid</span>
            <span className="font-bold text-emerald-900 text-sm block">GH₵ {Number(order.totalAmount).toFixed(2)}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Student Profile</span>
            <span className="font-bold text-slate-800 block truncate">{order.user?.name || "Student of Knowledge"}</span>
          </div>
        </div>

        {/* Shipping & Delivery Location Info */}
        <div className="border-t border-slate-100 pt-3 text-xs space-y-2">
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium block">Delivery Destination</span>
              <p className="font-semibold text-slate-800 leading-relaxed">{order.shippingAddress}</p>
              <p className="font-mono font-bold text-emerald-800 mt-1">{order.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Manifest Books Roll Sheet */}
        <div className="border-t border-slate-100 pt-3 text-xs">
          <span className="text-slate-400 font-medium block mb-1.5">Purchased Manifest Book Items</span>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5 font-medium text-slate-700">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-4">
                <span className="font-serif truncate">{item.book.title}</span>
                <span className="text-slate-400 flex-shrink-0">Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Redirect Action Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
        <Link
          href="/books"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 hover:text-emerald-800 text-slate-700 font-bold text-xs px-6 py-3.5 shadow-xs transition cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Continue Browsing</span>
        </Link>
        <Link
          href="/account/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold text-xs px-6 py-3.5 shadow-md transition cursor-pointer"
        >
          <ClipboardList className="h-4 w-4" />
          <span>View Order History</span>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-4">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Authentic system receipt entry automatically verified and closed inside PostgreSQL database logs.</span>
      </div>

    </div>
  );
}

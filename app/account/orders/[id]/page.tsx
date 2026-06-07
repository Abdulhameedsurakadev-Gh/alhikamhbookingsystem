// app/account/orders/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers"; // Next.js 16 core headers wrapper
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth"; // 🌟 FIXED: Unified Better-Auth client instance
import {
  Calendar,
  MapPin,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Milestone,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: Props): Promise<React.JSX.Element> {
  // 1. Authenticate user session strictly on the server layer using standard request headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session || !session.user) redirect("/login");

  const { id } = await params;

  // 2. Fetch deep historical details with item linkages
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          book: {
            include: { author: true },
          },
        },
      },
    },
  });

  // 🛡️ CYBERSECURITY VERIFICATION FIX: Validates ownership parameters against the Better-Auth session model ID
  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  // 3. Fetch classical commentaries (Shurooh) based on the first item's core text as a recommendation engine
  const firstBook = order.orderItems[0]?.book;
  const recommendations = firstBook
    ? await prisma.book.findMany({
        where: { explainsBookId: firstBook.id },
        take: 1,
        include: { author: true },
      })
    : [];

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Track state calculations for the physical flowchart matrix
  const currentStatus = order.status;
  const isPaid = ["PAID", "SHIPPED", "DELIVERED"].includes(currentStatus);
  const isShipped = ["SHIPPED", "DELIVERED"].includes(currentStatus);
  const isDelivered = currentStatus === "DELIVERED";
  const isCancelled = currentStatus === "CANCELLED";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Detail Header Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-800 transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Tracker Center
          </Link>
          <h1 className="font-serif text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Order #{order.id.substring(0, 12).toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <Calendar className="h-3.5 w-3.5" /> Registered on {formattedDate}
          </p>
        </div>
        <div className="bg-slate-50 border px-4 py-2 rounded-xl text-right text-xs">
          <span className="text-slate-400 font-bold uppercase block text-[9px]">
            Grand Subtotal
          </span>
          <span className="text-base font-black text-emerald-900 mt-0.5 block">
            GH₵ {Number(order.totalAmount).toFixed(2)}
          </span>
        </div>
      </div>

      {/* GRAPHICAL SHIPMENT TRACKER PIPELINE FLOWCHART ROW */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <Milestone className="h-4 w-4" /> Logistical Journey Logs
        </h3>

        {isCancelled ? (
          <div className="flex items-center gap-3 text-xs bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 font-semibold">
            <div className="h-5 w-5 bg-rose-600 text-white flex items-center justify-center rounded-full text-[10px]">
              ✕
            </div>
            <span>
              This checkout tracking file has been permanently marked as CANCELLED.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 text-xs font-bold font-mono tracking-wide relative pt-2">
            {/* Step 1: Paid */}
            <div className="flex flex-col items-center text-center space-y-2 relative">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center border text-xs ${
                  isPaid
                    ? "bg-emerald-700 border-emerald-700 text-amber-50 shadow-sm"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {isPaid ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className={isPaid ? "text-emerald-800" : "text-slate-400"}>
                PAID
              </span>
            </div>

            {/* Step 2: Shipped */}
            <div className="flex flex-col items-center text-center space-y-2 relative">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center border text-xs ${
                  isShipped
                    ? "bg-emerald-700 border-emerald-700 text-amber-50 shadow-sm"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {isShipped ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span
                className={isShipped ? "text-emerald-800" : "text-slate-400"}
              >
                SHIPPED
              </span>
            </div>

            {/* Step 3: Delivered */}
            <div className="flex flex-col items-center text-center space-y-2 relative">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center border text-xs ${
                  isDelivered
                    ? "bg-emerald-700 border-emerald-700 text-amber-50 shadow-sm"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {isDelivered ? <Check className="h-4 w-4" /> : "3"}
              </div>
              <span
                className={isDelivered ? "text-emerald-800" : "text-slate-400"}
              >
                DELIVERED
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SHIPPING & PAYMENT TELEMETRY COLUMNS SPLIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Shipping Block Left */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 text-xs leading-relaxed">
          <h3 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-800" /> Delivery Destination Details
          </h3>
          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-medium text-slate-700 space-y-1">
            <p className="font-serif font-bold text-slate-900 text-xs">
              {order.shippingAddress.split("|")[0] || "Student User"}
            </p>
            <p className="text-slate-600 pt-0.5">
              {order.shippingAddress.split("|")[1] || order.shippingAddress}
            </p>
            <p className="font-mono font-bold text-emerald-800 pt-1">
              {order.phoneNumber}
            </p>
          </div>
        </div>

        {/* Paystack Telemetry Block Right */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
          <h3 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-emerald-800" /> Payment Validation Sheet
          </h3>
          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2 font-medium text-slate-600">
            <div className="flex justify-between">
              <span>Channel Network</span>
              <span className="font-bold text-slate-800 font-mono uppercase">
                {order.paymentChannel || "Mobile Money"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Gateway Token</span>
              <span className="font-mono text-[10px] font-bold text-slate-500 truncate max-w-[150px]" title={order.paystackReference || ""}>
                {order.paystackReference || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200/60 pt-2 mt-1">
              <span>Transaction Status</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                <ShieldCheck className="h-3 w-3" /> VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS CATALOG PURCHASED LIST */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-sm text-slate-900">Purchased Volumes</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-slate-900 text-sm truncate">{item.book.title}</p>
                                <p className="text-slate-400 font-medium mt-0.5">by {item.book.author.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-slate-800">GH₵ {parseFloat(item.priceAtPurchase.toString()).toFixed(2)}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC SCHOLARLY RECOMMENDATION ENGINES */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-900 rounded-2xl p-5 sm:p-6 shadow-md text-amber-50 relative overflow-hidden">
          <div className="relative z-10 space-y-3.5 max-w-xl">
            <span className="inline-flex items-center gap-1 bg-emerald-800/60 text-emerald-300 font-bold tracking-widest text-[9px] uppercase px-2.5 py-1 rounded-full border border-emerald-700/50">
              <Sparkles className="h-3 w-3" /> Deepen Your Study (Shurooh Commentary)
            </span>
            <div className="space-y-1">
              <h4 className="font-serif text-base sm:text-lg font-bold tracking-tight text-amber-100">
                Expand on: {firstBook?.title}
              </h4>
              <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">
                We detected you purchased {firstBook?.title}. Scholars recommend checking out its foundational expansion text:{" "}
                <span className="text-amber-200 font-serif italic font-bold">"{recommendations[0].title}"</span> by {recommendations[0].author.name}.
              </p>
            </div>
            <Link
              href={`/books/${recommendations[0].id}`}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition shadow-md group"
            >
              <span>Examine Commentary Volume</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fcd34d_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
      )}
    </div>
  );
}

// app/account/orders/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";
import {
  Calendar,
  MapPin,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Milestone,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: Props): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) redirect("/login");

  const { id } = await params;

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

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

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

  const currentStatus = order.status;
  const isPaid = ["PAID", "SHIPPED", "DELIVERED"].includes(currentStatus);
  const isShipped = ["SHIPPED", "DELIVERED"].includes(currentStatus);
  const isDelivered = currentStatus === "DELIVERED";
  const isCancelled = currentStatus === "CANCELLED";

  // Fixed: this was previously order.shippingAddress.split("|") — a format
  // that no longer matches what the verify route actually writes (it uses
  // "Zone — Area (Landmark)" with no pipes at all). Reads the real
  // structured columns directly now, with a plain fallback to the raw
  // string for any order created before this fix existed.
  const orderWithDelivery = order as typeof order & {
    deliveryZone?: string | null;
    deliveryArea?: string | null;
    deliveryLandmark?: string | null;
    recipientName?: string | null;
  };
  const hasStructuredDelivery = !!orderWithDelivery.deliveryZone;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-normal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary-hover transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to Orders
          </Link>
          <h1 className="font-serif text-heading font-extrabold text-foreground tracking-tight">
            Order #{order.id.substring(0, 12).toUpperCase()}
          </h1>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> Placed on {formattedDate}
          </p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-sm text-right text-xs">
          <span className="text-muted-foreground font-bold uppercase block text-[9px]">
            Order Total
          </span>
          <span className="text-base font-black text-primary mt-0.5 block">
            GH₵ {Number(order.totalAmount).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Delivery Status — kept as the existing 3-step Paid/Shipped/
          Delivered pipeline, matching your current OrderStatus enum. Not
          expanding into PROCESSING/RIDER_ASSIGNED/etc. yet — those states
          don't exist in the schema, and per your own plan, new statuses
          should come after the delivery SOP is defined, not before. */}
      <div className="bg-card border border-border rounded-md p-5 sm:p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
          <Milestone className="h-4 w-4" aria-hidden="true" /> Delivery Status
        </h3>

        {isCancelled ? (
          <div className="flex items-center gap-3 text-xs bg-destructive/10 border border-destructive/20 p-4 rounded-sm text-destructive font-semibold">
            <div className="h-5 w-5 bg-destructive text-primary-foreground flex items-center justify-center rounded-full">
              <X className="h-3 w-3" aria-hidden="true" />
            </div>
            <span>This order has been cancelled.</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 text-xs font-bold tracking-wide relative pt-2">
            {[
              { done: isPaid, label: "Paid", num: "1" },
              { done: isShipped, label: "Shipped", num: "2" },
              { done: isDelivered, label: "Delivered", num: "3" },
            ].map((step) => (
              <div key={step.label} className="flex flex-col items-center text-center space-y-2 relative">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center border text-xs ${
                    step.done
                      ? "bg-success border-success text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {step.done ? <Check className="h-4 w-4" aria-hidden="true" /> : step.num}
                </div>
                <span className={step.done ? "text-success" : "text-muted-foreground"}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-card border border-border rounded-md p-5 space-y-3 text-xs leading-relaxed">
          <h3 className="font-serif font-bold text-sm text-foreground flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" /> Delivery Details
          </h3>
          <div className="bg-background border border-border p-3.5 rounded-sm font-medium text-muted-foreground space-y-1">
            <p className="font-serif font-bold text-foreground text-xs">
              {orderWithDelivery.recipientName || "Al-Hikmah Customer"}
            </p>
            {hasStructuredDelivery ? (
              <>
                <p className="text-muted-foreground pt-0.5">{orderWithDelivery.deliveryZone}</p>
                <p className="text-muted-foreground">{orderWithDelivery.deliveryArea}</p>
                {orderWithDelivery.deliveryLandmark && (
                  <p className="text-muted-foreground">{orderWithDelivery.deliveryLandmark}</p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground pt-0.5">{order.shippingAddress}</p>
            )}
            <p className="font-bold text-primary pt-1">
              {order.phoneNumber}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-md p-5 space-y-3 text-xs">
          <h3 className="font-serif font-bold text-sm text-foreground flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" /> Payment Details
          </h3>
          <div className="bg-background border border-border p-3.5 rounded-sm space-y-2 font-medium text-muted-foreground">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-bold text-foreground uppercase">
                {order.paymentChannel || "Mobile Money"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Reference</span>
              <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[150px]" title={order.paystackReference || ""}>
                {order.paystackReference || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-2 mt-1">
              <span>Status</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-success bg-success/10 px-2 py-0.5 rounded-sm border border-success/20">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" /> VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-md p-5 sm:p-6 space-y-4">
        <h3 className="font-serif font-bold text-sm text-foreground">Books in This Order</h3>
        <div className="divide-y divide-border text-xs">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-serif font-bold text-foreground text-sm truncate">{item.book.title}</p>
                <p className="text-muted-foreground font-medium mt-0.5">by {item.book.author.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-foreground">GH₵ {Number(item.priceAtPurchase).toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation — was a dark emerald gradient with a hardcoded
          amber hex radial texture (the same #fcd34d pattern already caught
          in About, Contact, Login, and Signup). Rebuilt flat. */}
      {recommendations.length > 0 && (
        <div className="bg-card border border-border rounded-md p-5 sm:p-6 space-y-3.5">
          <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground font-bold tracking-widest text-[9px] uppercase px-2.5 py-1 rounded-sm">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Deepen Your Study
          </span>
          <div className="space-y-1">
            <h4 className="font-serif text-title font-bold tracking-tight text-foreground">
              Expand on: {firstBook?.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Since you purchased {firstBook?.title}, you may also want to check its commentary:{" "}
              <span className="text-primary font-serif italic font-bold">&ldquo;{recommendations[0].title}&rdquo;</span> by {recommendations[0].author.name}.
            </p>
          </div>
          <Link
            href={`/books/${recommendations[0].id}`}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-primary-foreground font-black text-xs px-4 py-2.5 rounded-sm transition-colors duration-fast group"
          >
            <span>View Commentary</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
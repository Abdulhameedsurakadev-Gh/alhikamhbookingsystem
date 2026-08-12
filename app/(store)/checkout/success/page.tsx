// app/checkout/success/page.tsx
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ShoppingBag,
  ClipboardList,
  ShieldCheck,
  MapPin,
  Package,
  Truck,
  MessageCircle,
} from "lucide-react";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export const dynamic = "force-dynamic";

// Friendly labels for your actual OrderStatus enum (PENDING | PAID |
// SHIPPED | DELIVERED | CANCELLED) — no new states invented, just plainer
// customer-facing text for the ones that already exist.
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Processing",
  PAID: "Payment Received",
  SHIPPED: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// Simplified fulfillment steps built only from real enum values — no
// "packaging" or "rider assigned" states invented that don't exist yet
// in the schema.
const FULFILLMENT_STEPS = [
  { key: "PAID", label: "Payment Received" },
  { key: "PROCESSING", label: "Preparing Your Order" },
  { key: "SHIPPED", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

function getStepIndex(status: string): number {
  if (status === "PENDING") return -1;
  if (status === "PAID") return 0;
  if (status === "SHIPPED") return 2;
  if (status === "DELIVERED") return 3;
  return 0;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: Props): Promise<React.JSX.Element> {
  const params = await searchParams;
  const orderId = params.id;

  if (!orderId) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: {
        include: { book: { select: { title: true } } },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Defensive parsing: prefers structured fields if your Order model has
  // them (deliveryZone/deliveryArea/deliveryLandmark — these don't exist
  // in the schema yet as far as I can see, so this falls back to parsing
  // the legacy delimited string). Once /api/checkout/verify writes to
  // real columns instead of one compiled string, this whole fallback
  // branch can be deleted.
  const structuredOrder = order as typeof order & {
    deliveryZone?: string | null;
    deliveryArea?: string | null;
    deliveryLandmark?: string | null;
    deliveryFee?: number | null;
  };

  let zoneInfo = structuredOrder.deliveryZone || "";
  let areaInfo = structuredOrder.deliveryArea || "";
  let landmarkInfo = structuredOrder.deliveryLandmark || order.shippingAddress;

  if (!zoneInfo && order.shippingAddress.includes(" | ")) {
    const segments = order.shippingAddress.split(" | ");
    zoneInfo = segments[0]?.replace("Zone: ", "") || "";
    areaInfo = segments[1]?.replace("Area: ", "") || "";
    landmarkInfo = segments[2]?.replace("Landmark Details: ", "") || "";
  }

  const statusLabel = STATUS_LABELS[order.status] || order.status;
  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in duration-normal">

      {/* Fixed: animate-bounce is explicitly listed as something to avoid
          in the Motion section ("bouncing, spinning, flashy transitions").
          A single calm fade-in is enough. */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="h-16 w-16 rounded-full bg-success/10 text-success border border-success/20 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-display font-extrabold text-foreground tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Alhamdulillah, your payment has been received. Our team will now verify stock, prepare your books, and contact you before dispatch.
        </p>
      </div>

      {/* Fulfillment Timeline — new, replaces a flat "Order Confirmed" with
          a real sense of where the order actually stands */}
      {order.status !== "CANCELLED" && (
        <div className="bg-card border border-border rounded-md p-5">
          <div className="flex items-center justify-between">
            {FULFILLMENT_STEPS.map((step, idx) => (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {idx > 0 && (
                  <div className={`absolute top-3 right-1/2 w-full h-0.5 ${idx <= currentStepIndex ? "bg-primary" : "bg-border"}`} />
                )}
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                  idx <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {idx <= currentStepIndex ? "✓" : idx + 1}
                </div>
                <span className={`text-[9px] font-semibold mt-1.5 text-center leading-tight ${
                  idx <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt */}
      <div className="bg-card border border-border rounded-md p-6 text-left space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
          <span>Receipt</span>
          <span className="bg-success/10 text-success px-2 py-0.5 rounded-sm text-[10px]">
            {statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-muted-foreground font-medium">
              Order ID
            </span>
            <span className="font-bold text-foreground block select-all truncate">
              {order.id}
            </span>
          </div>
          {order.paystackReference && (
            <div className="space-y-0.5">
              <span className="text-muted-foreground font-medium">
                Payment Reference
              </span>
              <span className="font-bold text-foreground block select-all truncate">
                {order.paystackReference}
              </span>
            </div>
          )}
          <div className="space-y-0.5">
            <span className="text-muted-foreground font-medium">
              Total Amount Paid
            </span>
            <span className="font-bold text-primary text-sm block">
              GH₵ {Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground font-medium">Customer</span>
            <span className="font-bold text-foreground block truncate">
              {order.user?.name || "Al-Hikmah Customer"}
            </span>
          </div>
        </div>

        {/* Delivery fee breakdown — only renders if your Order model
            actually has a deliveryFee column populated; otherwise this
            section is silently skipped rather than showing a fake GH₵0.00 */}
        {structuredOrder.deliveryFee != null && (
          <div className="border-t border-border pt-3 text-xs space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span>Books</span>
              <span>GH₵ {(Number(order.totalAmount) - structuredOrder.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span>{structuredOrder.deliveryFee === 0 ? "FREE" : `GH₵ ${structuredOrder.deliveryFee.toFixed(2)}`}</span>
            </div>
          </div>
        )}

        <div className="border-t border-border pt-3 text-xs space-y-2">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1 w-full">
              <span className="text-muted-foreground font-medium block">
                Delivery Destination
              </span>

              {zoneInfo ? (
                <div className="space-y-0.5 bg-background border border-border rounded-sm p-3 text-foreground">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Zone / Region
                  </p>
                  <p className="font-semibold text-foreground mb-2">
                    {zoneInfo}
                  </p>

                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Specific Area
                  </p>
                  <p className="font-semibold text-foreground mb-2">
                    {areaInfo}
                  </p>

                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Landmarks / Directions
                  </p>
                  <p className="font-medium text-muted-foreground">{landmarkInfo}</p>
                </div>
              ) : (
                <p className="font-semibold text-foreground leading-relaxed">
                  {order.shippingAddress}
                </p>
              )}

              <p className="text-[10px] uppercase font-bold text-muted-foreground pt-1">
                Contact Number
              </p>
              <p className="font-bold text-primary text-sm">
                {order.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-3 text-xs">
          <span className="text-muted-foreground font-medium block mb-1.5">
            Books in This Order
          </span>
          <div className="bg-background border border-border rounded-sm p-3 space-y-1.5 font-medium text-foreground">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-4"
              >
                <span className="font-serif truncate">{item.book.title}</span>
                <span className="text-muted-foreground flex-shrink-0">
                  Qty: {item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What Happens Next — new */}
      <div className="bg-card border border-border rounded-md p-5 text-left space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" aria-hidden="true" /> What Happens Next
        </h3>
        <ol className="space-y-2 text-xs text-muted-foreground">
          <li>1. We confirm your order and check stock.</li>
          <li>2. We prepare your books for dispatch.</li>
          <li>3. We&apos;ll contact you by phone if anything needs confirming.</li>
          <li>4. Your order is dispatched based on your selected delivery zone.</li>
        </ol>
        <p className="text-xs text-muted-foreground pt-1 border-t border-border flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Estimated processing: within 24–48 hours, delivery timing depends on your zone.
        </p>
      </div>

      {/* Need Help — new */}
      <div className="bg-card border border-border rounded-md p-5 text-left space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" /> Need Help?
        </h3>
        <p className="text-xs text-muted-foreground">
          If anything about your order needs attention, reach us on{" "}
          <a href="https://wa.me/233202131864" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline hover:text-primary-hover">
            WhatsApp
          </a>{" "}
          or through the{" "}
          <Link href="/contact" className="text-primary font-semibold underline hover:text-primary-hover">
            Contact page
          </Link>.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
        <Link
          href="/books"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card hover:border-border-hover hover:text-primary-hover text-foreground font-bold text-xs px-6 py-3.5 transition-colors duration-fast cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          <span>Continue Browsing</span>
        </Link>
        <Link
          href="/account/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-6 py-3.5 transition-colors duration-fast cursor-pointer"
        >
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          <span>View Order History</span>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground italic pt-2">
        Jazakallahu Khayran for supporting Al-Hikmah — your purchase helps make authentic Islamic books more accessible to students of knowledge.
      </p>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-2">
        <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>Your payment has been verified and your order recorded.</span>
      </div>
    </div>
  );
}
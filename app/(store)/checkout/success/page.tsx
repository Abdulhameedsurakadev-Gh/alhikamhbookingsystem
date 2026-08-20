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

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Processing",
  PAID: "Payment Received",
  SHIPPED: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

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
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          book: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const structuredOrder = order as typeof order & {
    deliveryZone?: string | null;
    deliveryArea?: string | null;
    deliveryLandmark?: string | null;
    deliveryFee?: number | null;
  };

  let zoneInfo = structuredOrder.deliveryZone || "";
  let areaInfo = structuredOrder.deliveryArea || "";
  let landmarkInfo =
    structuredOrder.deliveryLandmark || order.shippingAddress;

  if (!zoneInfo && order.shippingAddress.includes(" | ")) {
    const segments = order.shippingAddress.split(" | ");

    zoneInfo = segments[0]?.replace("Zone: ", "") || "";
    areaInfo = segments[1]?.replace("Area: ", "") || "";
    landmarkInfo =
      segments[2]?.replace("Landmark Details: ", "") || "";
  }

  const statusLabel = STATUS_LABELS[order.status] || order.status;
  const currentStepIndex = getStepIndex(order.status);

  const deliveryFee =
    structuredOrder.deliveryFee != null
      ? Number(structuredOrder.deliveryFee)
      : null;

  const booksTotal =
    deliveryFee != null
      ? Number(order.totalAmount) - deliveryFee
      : null;

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 text-center space-y-6 sm:space-y-8 overflow-hidden">
      {/* Confirmation Header */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-success/10 text-success border border-success/20 flex items-center justify-center">
          <CheckCircle2
            className="h-8 w-8 sm:h-10 sm:w-10"
            aria-hidden="true"
          />
        </div>

        <h1 className="font-serif text-2xl sm:text-display font-extrabold text-foreground tracking-tight">
          Order Confirmed!
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed px-2">
          Alhamdulillah, your payment has been received. Our team will now
          verify stock, prepare your books, and contact you before dispatch.
        </p>
      </div>

      {/* Fulfillment Timeline */}
      {order.status !== "CANCELLED" && (
        <div className="bg-card border border-border rounded-md p-4 sm:p-5 text-left">
          {/* Mobile: vertical timeline */}
          <div className="sm:hidden space-y-0">
            {FULFILLMENT_STEPS.map((step, idx) => {
              const isComplete = idx <= currentStepIndex;
              const isLast = idx === FULFILLMENT_STEPS.length - 1;

              return (
                <div
                  key={step.key}
                  className="flex items-start gap-3 relative"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                        isComplete
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isComplete ? "✓" : idx + 1}
                    </div>

                    {!isLast && (
                      <div
                        className={`w-0.5 h-8 ${
                          idx < currentStepIndex
                            ? "bg-primary"
                            : "bg-border"
                        }`}
                      />
                    )}
                  </div>

                  <div className="pt-1 pb-4 min-w-0">
                    <p
                      className={`text-xs font-semibold leading-tight ${
                        isComplete
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop/tablet: horizontal timeline */}
          <div className="hidden sm:flex items-start justify-between">
            {FULFILLMENT_STEPS.map((step, idx) => (
              <div
                key={step.key}
                className="flex-1 flex flex-col items-center relative"
              >
                {idx > 0 && (
                  <div
                    className={`absolute top-3 right-1/2 w-full h-0.5 ${
                      idx <= currentStepIndex
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                  />
                )}

                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                    idx <= currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx <= currentStepIndex ? "✓" : idx + 1}
                </div>

                <span
                  className={`text-[9px] font-semibold mt-1.5 text-center leading-tight max-w-[90px] ${
                    idx <= currentStepIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt */}
      <div className="bg-card border border-border rounded-md p-4 sm:p-6 text-left space-y-4">
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 border-b border-border pb-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
          <span>Receipt</span>

          <span className="self-start xs:self-auto bg-success/10 text-success px-2 py-0.5 rounded-sm text-[10px]">
            {statusLabel}
          </span>
        </div>

        {/* Receipt information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-0.5 min-w-0">
            <span className="text-muted-foreground font-medium">
              Order ID
            </span>

            <span className="font-bold text-foreground block break-all">
              {order.id}
            </span>
          </div>

          {order.paystackReference && (
            <div className="space-y-0.5 min-w-0">
              <span className="text-muted-foreground font-medium">
                Payment Reference
              </span>

              <span className="font-bold text-foreground block break-all">
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

          <div className="space-y-0.5 min-w-0">
            <span className="text-muted-foreground font-medium">
              Customer
            </span>

            <span className="font-bold text-foreground block break-words">
              {order.user?.name || "Al-Hikmah Customer"}
            </span>
          </div>
        </div>

        {/* Delivery Fee Breakdown */}
        {deliveryFee != null && (
          <div className="border-t border-border pt-3 text-xs space-y-1">
            <div className="flex justify-between gap-4 text-muted-foreground">
              <span>Books</span>

              <span className="text-right">
                GH₵ {Number(booksTotal).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-muted-foreground">
              <span>Delivery</span>

              <span className="text-right">
                {deliveryFee === 0
                  ? "FREE"
                  : `GH₵ ${deliveryFee.toFixed(2)}`}
              </span>
            </div>
          </div>
        )}

        {/* Delivery Destination */}
        <div className="border-t border-border pt-3 text-xs space-y-2">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin
              className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />

            <div className="space-y-2 w-full min-w-0">
              <span className="text-muted-foreground font-medium block">
                Delivery Destination
              </span>

              {zoneInfo ? (
                <div className="space-y-2 bg-background border border-border rounded-sm p-3 text-foreground">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                      Zone / Region
                    </p>

                    <p className="font-semibold break-words">
                      {zoneInfo}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                      Specific Area
                    </p>

                    <p className="font-semibold break-words">
                      {areaInfo}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                      Landmarks / Directions
                    </p>

                    <p className="font-medium text-muted-foreground break-words leading-relaxed">
                      {landmarkInfo}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="font-semibold text-foreground leading-relaxed break-words">
                  {order.shippingAddress}
                </p>
              )}

              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">
                  Contact Number
                </p>

                <p className="font-bold text-primary text-sm break-all">
                  {order.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Books */}
        <div className="border-t border-border pt-3 text-xs">
          <span className="text-muted-foreground font-medium block mb-1.5">
            Books in This Order
          </span>

          <div className="bg-background border border-border rounded-sm p-3 space-y-2 font-medium text-foreground">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3"
              >
                <span className="font-serif break-words min-w-0 leading-relaxed">
                  {item.book.title}
                </span>

                <span className="text-muted-foreground flex-shrink-0 whitespace-nowrap">
                  Qty: {item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-card border border-border rounded-md p-4 sm:p-5 text-left space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Package
            className="h-4 w-4 text-primary flex-shrink-0"
            aria-hidden="true"
          />
          What Happens Next
        </h3>

        <ol className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <li>1. We confirm your order and check stock.</li>
          <li>2. We prepare your books for dispatch.</li>
          <li>
            3. We&apos;ll contact you by phone if anything needs confirming.
          </li>
          <li>
            4. Your order is dispatched based on your selected delivery zone.
          </li>
        </ol>

        <div className="pt-2 border-t border-border flex items-start gap-1.5 text-xs text-muted-foreground">
          <Truck
            className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />

          <span className="leading-relaxed">
            Estimated processing: within 24–48 hours, delivery timing
            depends on your zone.
          </span>
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-card border border-border rounded-md p-4 sm:p-5 text-left space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <MessageCircle
            className="h-4 w-4 text-primary flex-shrink-0"
            aria-hidden="true"
          />
          Need Help?
        </h3>

        <p className="text-xs text-muted-foreground leading-relaxed">
          If anything about your order needs attention, reach us on{" "}
          <a
            href="https://wa.me/233202131864"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold underline hover:text-primary-hover break-all"
          >
            WhatsApp
          </a>{" "}
          or through the{" "}
          <Link
            href="/contact"
            className="text-primary font-semibold underline hover:text-primary-hover"
          >
            Contact page
          </Link>
          .
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center pt-1">
        <Link
          href="/books"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card hover:border-border-hover hover:text-primary-hover text-foreground font-bold text-xs px-6 py-3.5 transition-colors duration-fast cursor-pointer"
        >
          <ShoppingBag
            className="h-4 w-4"
            aria-hidden="true"
          />
          <span>Continue Browsing</span>
        </Link>

        <Link
          href="/account/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-6 py-3.5 transition-colors duration-fast cursor-pointer"
        >
          <ClipboardList
            className="h-4 w-4"
            aria-hidden="true"
          />
          <span>View Order History</span>
        </Link>
      </div>

      {/* Closing Message */}
      <p className="text-xs text-muted-foreground italic pt-1 px-2 leading-relaxed">
        Jazakallahu Khayran for supporting Al-Hikmah — your purchase helps
        make authentic Islamic books more accessible to students of
        knowledge.
      </p>

      {/* Verification Notice */}
      <div className="flex items-start sm:items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-1 px-2">
        <ShieldCheck
          className="h-4 w-4 text-primary flex-shrink-0"
          aria-hidden="true"
        />

        <span className="leading-relaxed">
          Your payment has been verified and your order recorded.
        </span>
      </div>
    </div>
  );
}
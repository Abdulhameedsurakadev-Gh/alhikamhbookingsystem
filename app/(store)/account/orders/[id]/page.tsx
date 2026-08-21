// app/account/orders/[id]/page.tsx

import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";
import { formatOrderNumber } from "../../../../../lib/order-number";
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

  if (!session || !session.user) {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          book: {
            include: {
              author: true,
            },
          },
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  /*
   * IMPORTANT:
   * The UUID remains the database identifier.
   * The formatted order number is the human-facing identifier
   * that the customer and admin should use when referring to
   * this order.
   */
  const orderNumber = formatOrderNumber(order.id);

  const firstBook = order.orderItems[0]?.book;

  const recommendations = firstBook
    ? await prisma.book.findMany({
        where: {
          explainsBookId: firstBook.id,
        },
        take: 1,
        include: {
          author: true,
        },
      })
    : [];

  const formattedDate = new Date(order.createdAt).toLocaleDateString(
    "en-GH",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const currentStatus = order.status;

  const isPaid = ["PAID", "SHIPPED", "DELIVERED"].includes(
    currentStatus
  );

  const isShipped = ["SHIPPED", "DELIVERED"].includes(
    currentStatus
  );

  const isDelivered = currentStatus === "DELIVERED";
  const isCancelled = currentStatus === "CANCELLED";

  const orderWithDelivery = order as typeof order & {
    deliveryZone?: string | null;
    deliveryArea?: string | null;
    deliveryLandmark?: string | null;
    recipientName?: string | null;
  };

  const hasStructuredDelivery = !!orderWithDelivery.deliveryZone;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-hidden animate-in fade-in duration-normal">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary-hover transition-colors mb-2 min-h-[32px]"
            >
              <ArrowLeft
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
              Back to Orders
            </Link>

            <h1 className="font-serif text-heading font-extrabold text-foreground tracking-tight break-words">
              Order #{orderNumber}
            </h1>

            <p className="text-[11px] sm:text-xs text-muted-foreground font-medium flex flex-wrap items-center gap-1 mt-1">
              <Calendar
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>Placed on {formattedDate}</span>
            </p>
          </div>

          {/* Order Total */}
          <div className="bg-card border border-border px-4 py-3 rounded-sm text-left sm:text-right w-full sm:w-auto shrink-0">
            <span className="text-muted-foreground font-bold uppercase block text-[9px] tracking-wider">
              Order Total
            </span>

            <span className="text-base sm:text-lg font-black text-primary mt-0.5 block">
              GH₵ {Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Status */}
      <div className="bg-card border border-border rounded-md p-4 sm:p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Milestone
            className="h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          Delivery Status
        </h3>

        {isCancelled ? (
          <div className="flex items-start sm:items-center gap-3 text-xs bg-destructive/10 border border-destructive/20 p-4 rounded-sm text-destructive font-semibold">
            <div className="h-5 w-5 bg-destructive text-primary-foreground flex items-center justify-center rounded-full shrink-0">
              <X
                className="h-3 w-3"
                aria-hidden="true"
              />
            </div>

            <span>This order has been cancelled.</span>
          </div>
        ) : (
          <div className="relative pt-2">
            {/* Connecting line */}
            <div className="absolute left-[16.67%] right-[16.67%] top-[15px] h-px bg-border" />

            <div className="grid grid-cols-3 text-[10px] sm:text-xs font-bold tracking-wide relative">
              {[
                {
                  done: isPaid,
                  label: "Paid",
                  num: "1",
                },
                {
                  done: isShipped,
                  label: "Shipped",
                  num: "2",
                },
                {
                  done: isDelivered,
                  label: "Delivered",
                  num: "3",
                },
              ].map((step) => (
                <div
                  key={step.label}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center border text-[10px] sm:text-xs relative z-10 ${
                      step.done
                        ? "bg-success border-success text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                    }`}
                  >
                    {step.done ? (
                      <Check
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    ) : (
                      step.num
                    )}
                  </div>

                  <span
                    className={
                      step.done
                        ? "text-success"
                        : "text-muted-foreground"
                    }
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delivery + Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Delivery Details */}
        <div className="bg-card border border-border rounded-md p-4 sm:p-5 space-y-3 text-xs leading-relaxed">
          <h3 className="font-serif font-bold text-sm text-foreground flex items-center gap-1.5">
            <MapPin
              className="h-4 w-4 text-primary shrink-0"
              aria-hidden="true"
            />
            Delivery Details
          </h3>

          <div className="bg-background border border-border p-3.5 rounded-sm font-medium text-muted-foreground space-y-1 break-words">
            <p className="font-serif font-bold text-foreground text-xs">
              {orderWithDelivery.recipientName ||
                "Al-Hikmah Customer"}
            </p>

            {hasStructuredDelivery ? (
              <>
                <p className="text-muted-foreground pt-0.5">
                  {orderWithDelivery.deliveryZone}
                </p>

                <p className="text-muted-foreground">
                  {orderWithDelivery.deliveryArea}
                </p>

                {orderWithDelivery.deliveryLandmark && (
                  <p className="text-muted-foreground">
                    {orderWithDelivery.deliveryLandmark}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground pt-0.5">
                {order.shippingAddress}
              </p>
            )}

            <p className="font-bold text-primary pt-1 break-all">
              {order.phoneNumber}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-card border border-border rounded-md p-4 sm:p-5 space-y-3 text-xs">
          <h3 className="font-serif font-bold text-sm text-foreground flex items-center gap-1.5">
            <CreditCard
              className="h-4 w-4 text-primary shrink-0"
              aria-hidden="true"
            />
            Payment Details
          </h3>

          <div className="bg-background border border-border p-3.5 rounded-sm space-y-2.5 font-medium text-muted-foreground">
            <div className="flex flex-col xs:flex-row xs:justify-between gap-1">
              <span>Payment Method</span>

              <span className="font-bold text-foreground uppercase break-words">
                {order.paymentChannel || "Mobile Money"}
              </span>
            </div>

            <div className="flex flex-col xs:flex-row xs:justify-between gap-1">
              <span>Reference</span>

              <span
                className="text-[10px] font-bold text-muted-foreground break-all xs:text-right"
                title={order.paystackReference || ""}
              >
                {order.paystackReference || "N/A"}
              </span>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 border-t border-border pt-2 mt-1">
              <span>Status</span>

              <span className="inline-flex items-center gap-1 self-start xs:self-auto text-[10px] font-extrabold text-success bg-success/10 px-2 py-1 rounded-sm border border-success/20">
                <ShieldCheck
                  className="h-3 w-3"
                  aria-hidden="true"
                />
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Books in Order */}
      <div className="bg-card border border-border rounded-md p-4 sm:p-6 space-y-4">
        <h3 className="font-serif font-bold text-sm text-foreground">
          Books in This Order
        </h3>

        <div className="divide-y divide-border text-xs">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="py-3 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-4"
            >
              <div className="min-w-0">
                <p className="font-serif font-bold text-foreground text-sm break-words">
                  {item.book.title}
                </p>

                <p className="text-muted-foreground font-medium mt-0.5 break-words">
                  by {item.book.author.name}
                </p>
              </div>

              <div className="sm:text-right flex sm:block items-center justify-between gap-3">
                <p className="font-bold text-foreground whitespace-nowrap">
                  GH₵{" "}
                  {Number(item.priceAtPurchase).toFixed(2)}
                </p>

                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      {recommendations.length > 0 && (
        <div className="bg-card border border-border rounded-md p-4 sm:p-6 space-y-3.5">
          <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground font-bold tracking-widest text-[9px] uppercase px-2.5 py-1 rounded-sm">
            <Sparkles
              className="h-3 w-3"
              aria-hidden="true"
            />
            Deepen Your Study
          </span>

          <div className="space-y-1">
            <h4 className="font-serif text-title font-bold tracking-tight text-foreground break-words">
              Expand on: {firstBook?.title}
            </h4>

            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Since you purchased {firstBook?.title}, you may
              also want to check its commentary:{" "}
              <span className="text-primary font-serif italic font-bold break-words">
                &ldquo;{recommendations[0].title}&rdquo;
              </span>{" "}
              by {recommendations[0].author.name}.
            </p>
          </div>

          <Link
            href={`/books/${recommendations[0].id}`}
            className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-primary-foreground font-black text-xs px-4 py-3 rounded-sm transition-colors duration-fast group min-h-[44px] w-full sm:w-auto"
          >
            <span>View Commentary</span>

            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      )}
    </div>
  );
}


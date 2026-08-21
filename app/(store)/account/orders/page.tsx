// app/account/orders/page.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";
import { formatOrderNumber } from "../../../../lib/order-number";
import { OrderStatus } from "@prisma/client";
import {
  ClipboardList,
  BookOpen,
  Calendar,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export const dynamic = "force-dynamic";

const VALID_STATUSES = Object.values(OrderStatus);

const FILTER_TABS = [
  "ALL",
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export default async function AccountOrdersPage({
  searchParams,
}: Props): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login?redirect=account/orders");
  }

  const params = await searchParams;
  const statusFilter = params.status;

  const whereClause: {
    userId: string;
    status?: OrderStatus;
  } = {
    userId: session.user.id,
  };

  if (
    statusFilter &&
    VALID_STATUSES.includes(statusFilter as OrderStatus)
  ) {
    whereClause.status = statusFilter as OrderStatus;
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const getBadgeClasses = (status: OrderStatus): string => {
    switch (status) {
      case "PAID":
      case "SHIPPED":
      case "DELIVERED":
        return "bg-success/10 text-success border-success/20";

      case "CANCELLED":
        return "bg-destructive/10 text-destructive border-destructive/20";

      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-5 sm:space-y-6 overflow-hidden">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-heading font-extrabold text-foreground tracking-tight">
          My Orders
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Track your orders and see what&apos;s happening with your books.
        </p>
      </div>

      {/* Status Filters */}
      <div className="relative -mx-3 sm:mx-0">
        <div className="flex gap-1.5 overflow-x-auto px-3 sm:px-0 pb-2 scrollbar-none border-b border-border text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          {FILTER_TABS.map((tab) => {
            const isAll = tab === "ALL";

            const isActive = isAll
              ? !statusFilter
              : statusFilter === tab;

            const hrefPath = isAll
              ? "/account/orders"
              : `/account/orders?status=${tab}`;

            return (
              <Link
                key={tab}
                href={hrefPath}
                className={`shrink-0 px-3 py-2 sm:px-3.5 sm:py-2 rounded-sm border transition-colors duration-fast whitespace-nowrap ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-card border-border text-muted-foreground hover:border-border-hover"
                }`}
              >
                {tab.toLowerCase()}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-md p-6 sm:p-8 text-center max-w-md mx-auto space-y-4">
          <div className="h-12 w-12 bg-background rounded-sm border border-border flex items-center justify-center mx-auto text-muted-foreground">
            <ClipboardList
              className="h-6 w-6"
              aria-hidden="true"
            />
          </div>

          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
            You haven&apos;t placed any orders matching this filter yet.
          </p>

          <Link
            href="/books"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-sm transition-colors duration-fast min-h-[42px]"
          >
            <ShoppingBag
              className="h-4 w-4"
              aria-hidden="true"
            />
            Browse Catalogue
          </Link>
        </div>
      ) : (
        /* Orders */
        <div className="space-y-3 sm:space-y-3.5">
          {orders.map((order) => {
            const itemCount = order.orderItems.reduce(
              (acc, item) => acc + item.quantity,
              0
            );

            const formattedDate = new Date(
              order.createdAt
            ).toLocaleDateString("en-GH", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            const orderNumber = formatOrderNumber(order.id);

            return (
              <div
                key={order.id}
                className="bg-card border border-border rounded-md p-4 sm:p-5 hover:border-border-hover transition-colors duration-fast"
              >
                {/* Top Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="font-bold text-[11px] sm:text-xs text-foreground break-all"
                      title={order.id}
                    >
                      Order #{orderNumber}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-sm text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wide border ${getBadgeClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Order Metadata */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />

                      <span>{formattedDate}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <BookOpen
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />

                      <span>
                        {itemCount}{" "}
                        {itemCount > 1 ? "books" : "book"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-4 pt-3.5 border-t border-border flex flex-col xs:flex-row sm:flex-row sm:items-center justify-between gap-3.5">
                  {/* Total */}
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Order Total
                    </span>

                    <p className="text-base sm:text-lg font-black text-foreground mt-0.5">
                      GH₵ {Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>

                  {/* Track Button */}
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-border bg-card hover:border-border-hover text-foreground hover:text-primary-hover font-bold text-xs px-4 py-3 sm:py-2.5 transition-colors duration-fast min-h-[44px] w-full sm:w-auto"
                  >
                    <span>Track Order</span>

                    <ChevronRight
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


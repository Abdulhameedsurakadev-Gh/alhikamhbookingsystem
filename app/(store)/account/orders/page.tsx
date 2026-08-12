// app/account/orders/page.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";
import { OrderStatus } from "@prisma/client";
import { ClipboardList, BookOpen, Calendar, ChevronRight, ShoppingBag } from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export const dynamic = "force-dynamic";

const VALID_STATUSES = Object.values(OrderStatus);

export default async function AccountOrdersPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login?redirect=account/orders");
  }

  const params = await searchParams;
  const statusFilter = params.status;

  const whereClause: any = { userId: session.user.id };
  if (statusFilter && VALID_STATUSES.includes(statusFilter as OrderStatus)) {
    whereClause.status = statusFilter;
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      orderItems: {
        include: { book: { select: { title: true } } }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Fixed: only three semantic status colors exist in the design system
  // (success/warning/destructive). The original mapped five statuses to
  // five different hues, including blue and purple — neither of which
  // exist anywhere in the palette. Progress states (PAID/SHIPPED/
  // DELIVERED) are differentiated by their label text, not by color.
  const getBadgeClasses = (status: string) => {
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

  const filterTabs = ["ALL", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-serif text-heading font-extrabold text-foreground tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track your orders and see what&apos;s happening with your books.</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border text-xs font-bold uppercase tracking-wider">
        {filterTabs.map((tab) => {
          const isAll = tab === "ALL";
          const isActive = isAll ? !statusFilter : statusFilter === tab;
          const hrefPath = isAll ? "/account/orders" : `/account/orders?status=${tab}`;

          return (
            <Link
              key={tab}
              href={hrefPath}
              className={`px-3 py-2 rounded-sm border transition-colors duration-fast whitespace-nowrap ${
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

      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-md p-8 text-center max-w-md mx-auto space-y-4">
          <div className="h-12 w-12 bg-background rounded-sm border border-border flex items-center justify-center mx-auto text-muted-foreground">
            <ClipboardList className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            You haven&apos;t placed any orders matching this filter yet.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-sm transition-colors duration-fast"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Browse Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => {
            const itemCount = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GH", {
              year: "numeric",
              month: "short",
              day: "numeric"
            });

            return (
              <div key={order.id} className="bg-card border border-border rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-border-hover transition-colors duration-fast">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-xs text-foreground truncate block max-w-[180px]">
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-extrabold uppercase tracking-wide border ${getBadgeClasses(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> {itemCount} {itemCount > 1 ? "books" : "book"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Order Total</span>
                    <p className="text-base font-black text-foreground mt-0.5">GH₵ {Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-sm border border-border bg-card hover:border-border-hover text-foreground hover:text-primary-hover font-bold text-xs px-4 py-2.5 transition-colors duration-fast"
                  >
                    <span>Track Order</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
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
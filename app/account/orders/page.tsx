// app/account/orders/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "../../../lib/auth";
import { ClipboardList, BookOpen, Calendar, ChevronRight, ShoppingBag } from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage({ searchParams }: Props): Promise<React.JSX.Element> {
  // 1. Authenticate user session strictly on the server layer
  const session = await getServerSession();
  if (!session) {
    redirect("/login?redirect=account/orders");
  }

  const params = await searchParams;
  const statusFilter = params.status;

  // 2. Compile conditional where clauses matching valid database enums
  const whereClause: any = { userId: session.id };
  if (statusFilter && ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].includes(statusFilter)) {
    whereClause.status = statusFilter;
  }

  // 3. Fetch all historical orders from your Supabase PostgreSQL database
  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      orderItems: {
        include: { book: { select: { title: true } } }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Helper formatting styles for status tags
  const getBadgeColors = (status: string) => {
    switch (status) {
      case "PAID": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "SHIPPED": return "bg-blue-50 text-blue-700 border-blue-100";
      case "DELIVERED": return "bg-purple-50 text-purple-700 border-purple-100";
      case "CANCELLED": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  const filterTabs = ["ALL", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Study Orders</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Track shipment workflows and check historical purchase logs.</p>
      </div>

      {/* HORIZONTAL TRACKING FILTERS: Desktop bar/Mobile responsive track row */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 text-xs font-bold uppercase tracking-wider">
        {filterTabs.map((tab) => {
          const isAll = tab === "ALL";
          const isActive = isAll ? !statusFilter : statusFilter === tab;
          const hrefPath = isAll ? "/account/orders" : `/account/orders?status=${tab}`;

          return (
            <Link
              key={tab}
              href={hrefPath}
              className={`px-3 py-2 rounded-lg border transition whitespace-nowrap ${
                isActive 
                  ? "bg-emerald-800 border-emerald-800 text-amber-50 shadow-xs" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {tab.toLowerCase()}
            </Link>
          );
        })}
      </div>

      {/* EMPTY DATA EMPTY STATE VIEWPORT: Prompts book discovery explicitly */}
      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ClipboardList className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            You haven't placed any orders matching this filter classification yet.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md"
          >
            <ShoppingBag className="h-4 w-4" /> Browse Islamic Catalog
          </Link>
        </div>
      ) : (
        /* RESPONSIVE ORDER STREAM CARDS TABLE LIST */
        <div className="space-y-3.5">
          {orders.map((order) => {
            const itemCount = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
            const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GH", {
              year: "numeric",
              month: "short",
              day: "numeric"
            });

            return (
              <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs text-slate-900 truncate block max-w-[180px]">
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${getBadgeColors(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> {itemCount} {itemCount > 1 ? "Books Selected" : "Single Text"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Paid</span>
                    <p className="text-base font-black text-slate-900 mt-0.5">GH₵ {Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 text-slate-700 hover:text-emerald-800 font-bold text-xs px-4 py-2.5 shadow-xs transition"
                  >
                    <span>Track Order</span>
                    <ChevronRight className="h-4 w-4" />
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

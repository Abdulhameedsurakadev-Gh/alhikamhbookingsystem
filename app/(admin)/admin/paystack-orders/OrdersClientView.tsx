"use client";

import React, { useMemo, useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "./actions";
import { OrderStatus } from "@prisma/client";
import { formatOrderNumber } from "@/lib/order-number";

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: string;
  book: {
    id: string;
    title: string;
    coverImage: string | null;
    author: {
      name: string;
    } | null;
  };
}

interface OrderData {
  id: string;
  orderNumber: string;
  totalAmount: string;
  status: OrderStatus;

  shippingAddress: string;
  phoneNumber: string;

  createdAt: string;
  updatedAt: string;

  paymentChannel: string | null;
  paymentMethod: string | null;
  paystackReference: string | null;

  deliveryDate: string | null;
  deliveryZone: string | null;
  deliveryArea: string | null;
  deliveryLandmark: string | null;
  deliveryFee: string | null;
  recipientName: string | null;
  location: string | null;

  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };

  orderItems: OrderItem[];
}

interface OrdersClientViewProps {
  initialOrders: OrderData[];
}

export default function OrdersClientView({
  initialOrders,
}: OrdersClientViewProps): React.JSX.Element {
  const [orders, setOrders] =
    useState<OrderData[]>(initialOrders);

  const [expandedOrders, setExpandedOrders] =
    useState<Set<string>>(new Set());

  const [isPending, startTransition] =
    useTransition();

  const toggleOrder = (orderId: string): void => {
    setExpandedOrders((previous) => {
      const next = new Set(previous);

      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }

      return next;
    });
  };

  const expandAll = (): void => {
    setExpandedOrders(
      new Set(orders.map((order) => order.id))
    );
  };

  const collapseAll = (): void => {
    setExpandedOrders(new Set());
  };

  const handleAdvanceStatus = (
    orderId: string,
    currentStatus: OrderStatus
  ): void => {
    startTransition(async () => {
      const result = await updateOrderStatus(
        orderId,
        currentStatus
      );

      if (!result.success) {
        alert(`Status update failed: ${result.error}`);
        return;
      }

      setOrders((previous) =>
        previous.map((order) => {
          if (order.id !== orderId) {
            return order;
          }

          let nextStatus = order.status;

          if (order.status === "PENDING") {
            nextStatus = "PAID";
          } else if (order.status === "PAID") {
            nextStatus = "SHIPPED";
          } else if (order.status === "SHIPPED") {
            nextStatus = "DELIVERED";
          }

          return {
            ...order,
            status: nextStatus,
          };
        })
      );
    });
  };

  const getStatusConfig = (status: OrderStatus) => {
    const config: Record<
      OrderStatus,
      {
        label: string;
        className: string;
        icon: React.ElementType;
      }
    > = {
      PENDING: {
        label: "Pending Payment",
        className:
          "bg-amber-500/10 border-amber-500/20 text-amber-400",
        icon: AlertCircle,
      },

      PAID: {
        label: "Paid",
        className:
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        icon: CheckCircle2,
      },

      SHIPPED: {
        label: "Shipped",
        className:
          "bg-blue-500/10 border-blue-500/20 text-blue-400",
        icon: Truck,
      },

      DELIVERED: {
        label: "Delivered",
        className:
          "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
        icon: Package,
      },

      CANCELLED: {
        label: "Cancelled",
        className:
          "bg-red-500/10 border-red-500/20 text-red-400",
        icon: AlertCircle,
      },
    };

    return config[status];
  };

  const getNextAction = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Mark Paid",
          icon: CheckCircle2,
          iconClass: "text-emerald-400",
        };

      case "PAID":
        return {
          label: "Ship Package",
          icon: Truck,
          iconClass: "text-blue-400",
        };

      case "SHIPPED":
        return {
          label: "Complete Delivery",
          icon: Package,
          iconClass: "text-indigo-400",
        };

      default:
        return null;
    }
  };

  const formatCurrency = (
    value: string | number | null
  ): string => {
    return `GH₵${Number(value ?? 0).toFixed(2)}`;
  };

  const formatDate = (value: string): string => {
    return new Intl.DateTimeFormat("en-GH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

  const getItemCount = (order: OrderData): number => {
    return order.orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const getProductsSubtotal = (
    order: OrderData
  ): number => {
    return order.orderItems.reduce(
      (total, item) =>
        total +
        Number(item.priceAtPurchase) * item.quantity,
      0
    );
  };

  const getDisplayOrderNumber = (
    order: OrderData
  ): string => {
    /*
     * The internal database ID is the authoritative source
     * for the formatted public order number.
     *
     * This also keeps the admin display consistent with the
     * customer-facing order number utility.
     */
    return formatOrderNumber(order.id);
  };

  const summary = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) => order.status === "PENDING"
      ).length,

      paid: orders.filter(
        (order) => order.status === "PAID"
      ).length,

      shipped: orders.filter(
        (order) => order.status === "SHIPPED"
      ).length,

      delivered: orders.filter(
        (order) => order.status === "DELIVERED"
      ).length,

      cancelled: orders.filter(
        (order) => order.status === "CANCELLED"
      ).length,
    };
  }, [orders]);

  return (
    <div className="space-y-4">
      {/* ================================================================
          LEDGER TOOLBAR
         ================================================================ */}

      <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 sm:px-5 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-x-6 gap-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Total Orders
              </p>

              <p className="text-lg font-bold text-slate-100 font-mono">
                {summary.total}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Pending
              </p>

              <p className="text-lg font-bold text-amber-400 font-mono">
                {summary.pending}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Paid
              </p>

              <p className="text-lg font-bold text-emerald-400 font-mono">
                {summary.paid}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Shipped
              </p>

              <p className="text-lg font-bold text-blue-400 font-mono">
                {summary.shipped}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Delivered
              </p>

              <p className="text-lg font-bold text-indigo-400 font-mono">
                {summary.delivered}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Cancelled
              </p>

              <p className="text-lg font-bold text-red-400 font-mono">
                {summary.cancelled}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={expandAll}
              className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
            >
              Expand All
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={collapseAll}
              className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
            >
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      {/* ================================================================
          ORDER LEDGER
         ================================================================ */}

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-xl py-16 text-center">
            <ShoppingBag className="w-8 h-8 text-slate-700 mx-auto mb-3" />

            <p className="text-sm font-medium text-slate-400">
              No orders have been recorded yet.
            </p>

            <p className="text-xs text-slate-600 mt-1">
              Completed customer purchases will appear here.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded =
              expandedOrders.has(order.id);

            const status = getStatusConfig(
              order.status
            );

            const StatusIcon = status.icon;

            const nextAction = getNextAction(
              order.status
            );

            const itemCount = getItemCount(order);

            const productsSubtotal =
              getProductsSubtotal(order);

            const deliveryFee = Number(
              order.deliveryFee ?? 0
            );

            const displayOrderNumber =
              getDisplayOrderNumber(order);

            return (
              <div
                key={order.id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg"
              >
                {/* ======================================================
                    ORDER SUMMARY ROW
                   ====================================================== */}

                <div className="px-4 sm:px-6 py-4">
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                    {/* Order identity */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleOrder(order.id)
                      }
                      className="flex items-start gap-3 text-left min-w-0 flex-1 cursor-pointer group"
                    >
                      <div className="mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm sm:text-base font-bold font-mono text-slate-100 tracking-wide">
                            #{displayOrderNumber}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border rounded-md ${status.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />

                            {status.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                          <span className="text-xs text-slate-300">
                            {order.user.name ||
                              "Guest Buyer"}
                          </span>

                          <span className="text-[11px] text-slate-500">
                            {order.user.email}
                          </span>

                          <span className="text-[11px] text-slate-600">
                            •
                          </span>

                          <span className="text-[11px] text-slate-500">
                            {formatDate(
                              order.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Item count */}

                    <div className="flex items-center gap-2 min-w-[100px]">
                      <div className="p-1.5 rounded-md bg-slate-900 text-slate-500">
                        <Package className="w-3.5 h-3.5" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-200">
                          {itemCount}{" "}
                          {itemCount === 1
                            ? "book"
                            : "books"}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          {order.orderItems.length} line{" "}
                          {order.orderItems.length === 1
                            ? "item"
                            : "items"}
                        </p>
                      </div>
                    </div>

                    {/* Payment */}

                    <div className="min-w-[150px]">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Payment
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        <CreditCard className="w-3 h-3 text-emerald-500" />

                        <span className="text-xs text-slate-300 uppercase">
                          {order.paymentChannel ||
                            order.paymentMethod ||
                            "Paystack"}
                        </span>
                      </div>
                    </div>

                    {/* Total */}

                    <div className="min-w-[120px] xl:text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Order Total
                      </p>

                      <p className="text-base font-bold font-mono text-emerald-400 mt-1">
                        {formatCurrency(
                          order.totalAmount
                        )}
                      </p>
                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-2 shrink-0">
                      {nextAction && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() =>
                            handleAdvanceStatus(
                              order.id,
                              order.status
                            )
                          }
                          className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 h-9 text-xs font-medium"
                        >
                          {isPending ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          ) : (
                            <nextAction.icon
                              className={`w-3.5 h-3.5 mr-1.5 ${nextAction.iconClass}`}
                            />
                          )}

                          {nextAction.label}
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          toggleOrder(order.id)
                        }
                        className="h-9 w-9 text-slate-500 hover:text-slate-100 hover:bg-slate-900"
                        aria-label={
                          isExpanded
                            ? "Collapse order"
                            : "Expand order"
                        }
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* ======================================================
                    EXPANDED ORDER DETAILS
                   ====================================================== */}

                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-900/20">
                    <div className="p-4 sm:p-6 space-y-6">
                      {/* PRODUCT MANIFEST */}

                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-bold text-slate-200">
                              Ordered Books
                            </h3>

                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Exact products and quantities
                              purchased under order #
                              {displayOrderNumber}.
                            </p>
                          </div>

                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                            {itemCount}{" "}
                            {itemCount === 1
                              ? "unit"
                              : "units"}
                          </span>
                        </div>

                        <div className="border border-slate-800 rounded-lg overflow-hidden">
                          <div className="hidden sm:grid grid-cols-[1fr_80px_120px_120px] gap-4 bg-slate-900 px-4 py-2.5 border-b border-slate-800">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                              Book
                            </span>

                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 text-center">
                              Qty
                            </span>

                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">
                              Unit Price
                            </span>

                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 text-right">
                              Line Total
                            </span>
                          </div>

                          <div className="divide-y divide-slate-800/70">
                            {order.orderItems.map(
                              (item) => {
                                const unitPrice =
                                  Number(
                                    item.priceAtPurchase
                                  );

                                const lineTotal =
                                  unitPrice *
                                  item.quantity;

                                return (
                                  <div
                                    key={item.id}
                                    className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px_120px] gap-3 sm:gap-4 px-4 py-4 items-center"
                                  >
                                    {/* Book */}

                                    <div className="flex items-center gap-3 min-w-0">
                                      {item.book
                                        .coverImage ? (
                                        <img
                                          src={
                                            item.book
                                              .coverImage
                                          }
                                          alt={
                                            item.book
                                              .title
                                          }
                                          className="w-10 h-14 object-cover rounded border border-slate-800 bg-slate-900 shrink-0"
                                        />
                                      ) : (
                                        <div className="w-10 h-14 rounded border border-slate-800 bg-slate-900 flex items-center justify-center shrink-0">
                                          <Package className="w-4 h-4 text-slate-700" />
                                        </div>
                                      )}

                                      <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-200 leading-snug">
                                          {
                                            item.book
                                              .title
                                          }
                                        </p>

                                        {item.book
                                          .author && (
                                          <p className="text-[11px] text-slate-500 mt-1">
                                            by{" "}
                                            {
                                              item.book
                                                .author
                                                .name
                                            }
                                          </p>
                                        )}

                                        <p className="sm:hidden text-[11px] text-slate-500 mt-1">
                                          {formatCurrency(
                                            unitPrice
                                          )}{" "}
                                          each
                                        </p>
                                      </div>
                                    </div>

                                    {/* Quantity */}

                                    <div className="flex sm:block items-center justify-between">
                                      <span className="sm:hidden text-[10px] uppercase tracking-wider text-slate-600">
                                        Quantity
                                      </span>

                                      <span className="text-xs font-bold font-mono text-emerald-400 text-center block">
                                        ×
                                        {
                                          item.quantity
                                        }
                                      </span>
                                    </div>

                                    {/* Unit price */}

                                    <div className="hidden sm:block text-right">
                                      <p className="text-xs font-mono text-slate-300">
                                        {formatCurrency(
                                          unitPrice
                                        )}
                                      </p>

                                      <p className="text-[9px] text-slate-600 mt-0.5">
                                        at purchase
                                      </p>
                                    </div>

                                    {/* Line total */}

                                    <div className="flex sm:block items-center justify-between text-right">
                                      <span className="sm:hidden text-[10px] uppercase tracking-wider text-slate-600">
                                        Line Total
                                      </span>

                                      <span className="text-sm font-bold font-mono text-slate-100">
                                        {formatCurrency(
                                          lineTotal
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </section>

                      {/* LOWER INFORMATION GRID */}

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Customer */}

                        <section className="border border-slate-800 rounded-lg bg-slate-950/60 p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded-md bg-slate-900 text-slate-500">
                              <User className="w-3.5 h-3.5" />
                            </div>

                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Customer
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] text-slate-600 uppercase">
                                Name
                              </p>

                              <p className="text-sm text-slate-200 mt-0.5">
                                {order.recipientName ||
                                  order.user.name ||
                                  "Guest Buyer"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-600 uppercase">
                                Email
                              </p>

                              <p className="text-xs text-slate-400 mt-0.5 break-all">
                                {order.user.email}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-600 uppercase">
                                Phone
                              </p>

                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-600" />

                                <p className="text-xs font-mono text-slate-300">
                                  {order.phoneNumber ||
                                    order.user.phone ||
                                    "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* Delivery */}

                        <section className="border border-slate-800 rounded-lg bg-slate-950/60 p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded-md bg-slate-900 text-slate-500">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>

                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Delivery
                            </h3>
                          </div>

                          <div className="space-y-3">
                            {order.deliveryZone && (
                              <div>
                                <p className="text-[10px] text-slate-600 uppercase">
                                  Zone
                                </p>

                                <p className="text-xs text-slate-300 mt-0.5">
                                  {order.deliveryZone}
                                </p>
                              </div>
                            )}

                            {order.deliveryArea && (
                              <div>
                                <p className="text-[10px] text-slate-600 uppercase">
                                  Area
                                </p>

                                <p className="text-xs text-slate-300 mt-0.5">
                                  {order.deliveryArea}
                                </p>
                              </div>
                            )}

                            {order.deliveryLandmark && (
                              <div>
                                <p className="text-[10px] text-slate-600 uppercase">
                                  Landmark / Directions
                                </p>

                                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                  {
                                    order.deliveryLandmark
                                  }
                                </p>
                              </div>
                            )}

                            <div>
                              <p className="text-[10px] text-slate-600 uppercase">
                                Address
                              </p>

                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                {order.shippingAddress}
                              </p>
                            </div>

                            {order.location && (
                              <div>
                                <p className="text-[10px] text-slate-600 uppercase">
                                  Location
                                </p>

                                <p className="text-xs text-slate-300 mt-0.5">
                                  {order.location}
                                </p>
                              </div>
                            )}
                          </div>
                        </section>

                        {/* Payment */}

                        <section className="border border-slate-800 rounded-lg bg-slate-950/60 p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 rounded-md bg-slate-900 text-slate-500">
                              <CreditCard className="w-3.5 h-3.5" />
                            </div>

                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Payment
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] text-slate-600 uppercase">
                                Method
                              </p>

                              <p className="text-xs text-slate-300 mt-0.5 uppercase">
                                {order.paymentMethod ||
                                  "PAYSTACK"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-600 uppercase">
                                Channel
                              </p>

                              <p className="text-xs text-slate-300 mt-0.5 uppercase">
                                {order.paymentChannel ||
                                  "Not recorded"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-600 uppercase">
                                Paystack Reference
                              </p>

                              <p className="text-[10px] font-mono text-slate-400 mt-0.5 break-all">
                                {order.paystackReference ||
                                  "No Paystack reference"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-slate-600 uppercase">
                                Order Created
                              </p>

                              <p className="text-xs text-slate-400 mt-0.5">
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        </section>
                      </div>

                      {/* FINANCIAL SUMMARY */}

                      <section className="flex justify-end">
                        <div className="w-full sm:w-80 border border-slate-800 rounded-lg bg-slate-950 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Books Subtotal
                            </span>

                            <span className="text-xs font-mono text-slate-300">
                              {formatCurrency(
                                productsSubtotal
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Delivery Fee
                            </span>

                            <span className="text-xs font-mono text-slate-300">
                              {formatCurrency(
                                deliveryFee
                              )}
                            </span>
                          </div>

                          <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                              Order Total
                            </span>

                            <span className="text-lg font-bold font-mono text-emerald-400">
                              {formatCurrency(
                                order.totalAmount
                              )}
                            </span>
                          </div>
                        </div>
                      </section>

                      {/* DELIVERY DATE / OPERATIONAL FOOTER */}

                      <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
                          {order.deliveryDate && (
                            <span>
                              Delivery:
                              <strong className="text-slate-300 ml-1">
                                {formatDate(
                                  order.deliveryDate
                                )}
                              </strong>
                            </span>
                          )}

                          <span>
                            Order ID:
                            <span className="font-mono text-slate-600 ml-1">
                              {order.id}
                            </span>
                          </span>

                          <span>
                            Order Number:
                            <span className="font-mono text-slate-300 ml-1">
                              #{displayOrderNumber}
                            </span>
                          </span>
                        </div>

                        {nextAction && (
                          <Button
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              handleAdvanceStatus(
                                order.id,
                                order.status
                              )
                            }
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                          >
                            {isPending ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                            ) : (
                              <nextAction.icon className="w-3.5 h-3.5 mr-1.5" />
                            )}

                            {nextAction.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


import React from "react";
import { prisma } from "@/lib/prisma";
import OrdersClientView from "./OrdersClientView";

export const dynamic = "force-dynamic";

export default async function PaystackOrdersPage() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      totalAmount: true,
      status: true,
      shippingAddress: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,

      paymentChannel: true,
      paymentMethod: true,
      paystackReference: true,

      deliveryDate: true,
      deliveryZone: true,
      deliveryArea: true,
      deliveryLandmark: true,
      deliveryFee: true,
      recipientName: true,
      location: true,

      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },

      orderItems: {
        select: {
          id: true,
          quantity: true,
          priceAtPurchase: true,

          book: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              author: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * The customer-facing order number is derived from the first
   * 8 characters of the Order UUID.
   *
   * Example:
   *
   * 690cee49-17b8-4906-b371-411fbc72333b
   * ↓
   * 690CEE49
   *
   * We keep the full UUID internally while exposing the same
   * human-readable order number already used by the customer
   * orders page.
   */
  const serializedOrders = orders.map((order) => ({
    ...order,

    orderNumber: order.id.slice(0, 8).toUpperCase(),

    totalAmount: order.totalAmount.toString(),
    deliveryFee: order.deliveryFee?.toString() ?? null,

    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),

    deliveryDate: order.deliveryDate
      ? order.deliveryDate.toISOString()
      : null,

    orderItems: order.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase.toString(),

      book: {
        id: item.book.id,
        title: item.book.title,
        coverImage: item.book.coverImage,
        author: item.book.author
          ? {
              name: item.book.author.name,
            }
          : null,
      },
    })),
  }));

  return (
    <div className="w-full space-y-6">
      {/* ================================================================
          PAGE HEADER
         ================================================================ */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Paystack Orders
            </h1>

            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Manage customer orders, payment confirmations, ordered books,
              delivery information, and dispatch status from one operational
              ledger.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              Live Order Ledger
            </span>
          </div>
        </div>

        {/* Operational summary */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-slate-500">
          <span>
            <strong className="text-slate-300">
              {orders.length}
            </strong>{" "}
            total orders
          </span>

          <span>
            <strong className="text-emerald-400">
              {
                orders.filter((order) => order.status === "PAID").length
              }
            </strong>{" "}
            paid
          </span>

          <span>
            <strong className="text-blue-400">
              {
                orders.filter((order) => order.status === "SHIPPED").length
              }
            </strong>{" "}
            shipped
          </span>

          <span>
            <strong className="text-indigo-400">
              {
                orders.filter((order) => order.status === "DELIVERED").length
              }
            </strong>{" "}
            delivered
          </span>

          <span>
            <strong className="text-rose-400">
              {
                orders.filter((order) => order.status === "CANCELLED").length
              }
            </strong>{" "}
            cancelled
          </span>
        </div>
      </div>

      {/* ================================================================
          ORDERS WORKSPACE
         ================================================================ */}
      <OrdersClientView initialOrders={serializedOrders} />
    </div>
  );
}
// app/(admin)/admin/paystack-orders/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import OrdersClientView from "./OrdersClientView";

export default async function PaystackOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      orderItems: {
        include: { book: { select: { title: true } } }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Paystack Revenue Logs</h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor transactional settlement payloads, references, shipping destinations, and dispatch items.
        </p>
      </div>

      <OrdersClientView initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}

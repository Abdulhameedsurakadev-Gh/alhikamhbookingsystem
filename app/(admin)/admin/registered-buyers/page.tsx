import React from "react";
import { prisma } from "@/lib/prisma";
import BuyersClientView from "./BuyersClientView";

export const dynamic = "force-dynamic";

export default async function RegisteredBuyersPage() {
  // Fetch customers along with their core transaction history details
  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    include: {
      orders: {
        select: {
          id: true,
          totalAmount: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Sanitize data arrays to prevent any undefined/null or Decimal parsing errors across the boundary
  const processedBuyers = customers.map((user) => {
    const totalSpent = user.orders
      .filter((o) => o.status === "PAID" || o.status === "DELIVERED" || o.status === "SHIPPED")
      .reduce((acc, order) => acc + parseFloat(order.totalAmount.toString()), 0);

    return {
      id: user.id,
      name: user.name || "Anonymous Buyer",
      email: user.email,
      joinedAt: user.createdAt.toISOString(),
      orderCount: user.orders.length,
      totalValueSpent: totalSpent.toFixed(2),
    };
  });

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Registered Store Buyers</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review authenticated client accounts, monitor customer enrollment metrics, and track lifetime purchase allocations.
        </p>
      </div>

      <BuyersClientView initialBuyers={processedBuyers} />
    </div>
  );
}

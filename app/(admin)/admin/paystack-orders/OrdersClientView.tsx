// app/(admin)/admin/paystack-orders/OrdersClientView.tsx
"use client";

import React, { useState, useTransition } from "react";
import { CreditCard, Package, Truck, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "./actions";
import { OrderStatus } from "@prisma/client";

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: string;
  book: { title: string };
}

interface OrderData {
  id: string;
  totalAmount: string;
  paystackReference: string | null;
  paymentChannel: string | null;
  status: OrderStatus;
  shippingAddress: string;
  phoneNumber: string;
  createdAt: string;
  user: { name: string | null; email: string };
  orderItems: OrderItem[];
}

export default function OrdersClientView({ initialOrders }: { initialOrders: OrderData[] }) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [isPending, startTransition] = useTransition();

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, currentStatus);
      if (res.success) {
        // Find next step locally for snappy UI update
        setOrders(prev => prev.map(o => {
          if (o.id !== orderId) return o;
          let next = o.status;
          if (o.status === "PENDING") next = "PAID";
          else if (o.status === "PAID") next = "SHIPPED";
          else if (o.status === "SHIPPED") next = "DELIVERED";
          return { ...o, status: next };
        }));
      } else {
        alert(`Status update failed: ${res.error}`);
      }
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      PENDING: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      PAID: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      SHIPPED: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      DELIVERED: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      CANCELLED: "bg-red-500/10 border-red-500/20 text-red-400",
    };
    return `px-2 py-1 text-[11px] font-bold border rounded-md ${config[status]}`;
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader className="bg-slate-900/60 border-b border-slate-800">
            <TableRow className="border-b border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 font-semibold text-xs uppercase py-4 pl-6">Buyer & Reference</TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase py-4">Items Ordered</TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase py-4">Address & Contact</TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase py-4">Total Amount</TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase py-4">Status</TableHead>
              <TableHead className="text-slate-400 font-semibold text-xs uppercase py-4 text-right pr-6">Action Pipeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-12 text-sm text-slate-500 border-none">
                  No client sales records log data populated yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="border-b border-slate-800/60 hover:bg-slate-900/10 transition-colors">
                  
                  {/* Buyer Data Column */}
                  <TableCell className="py-4 pl-6">
                    <p className="font-bold text-slate-200 text-sm">{order.user.name || "Guest Buyer"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{order.user.email}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-1">
                      <CreditCard className="w-3 h-3 text-emerald-500" />
                      <span>{order.paystackReference || "Direct Checkout"}</span>
                      {order.paymentChannel && <span className="uppercase">({order.paymentChannel})</span>}
                    </div>
                  </TableCell>

                  {/* Items Manifest List Column */}
                  <TableCell className="py-4 max-w-[240px]">
                    <div className="space-y-1">
                      {order.orderItems.map((item) => (
                        <p key={item.id} className="text-xs text-slate-300 truncate">
                          <span className="font-mono text-emerald-400 font-bold mr-1">{item.quantity}x</span> 
                          {item.book.title}
                        </p>
                      ))}
                    </div>
                  </TableCell>

                  {/* Logistics Address Column */}
                  <TableCell className="py-4 max-w-[200px]">
                    <p className="text-xs text-slate-300 truncate">{order.shippingAddress}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">{order.phoneNumber}</p>
                  </TableCell>

                  {/* Pricing Matrix Column */}
                  <TableCell className="py-4 text-sm font-semibold font-mono text-slate-200">
                    GH₵{parseFloat(order.totalAmount).toFixed(2)}
                  </TableCell>

                  {/* Status Badging Column */}
                  <TableCell className="py-4">
                    <span className={getStatusBadge(order.status)}>{order.status}</span>
                  </TableCell>

                  {/* Operational Controls Pipeline Button */}
                  <TableCell className="py-4 text-right pr-6">
                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleAdvanceStatus(order.id, order.status)}
                        className="bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-850 h-8 text-xs font-medium px-3"
                      >
                        {isPending ? (
                          <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                        ) : order.status === "PENDING" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                        ) : order.status === "PAID" ? (
                          <Truck className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                        ) : (
                          <Package className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
                        )}
                        {order.status === "PENDING" && "Mark Paid"}
                        {order.status === "PAID" && "Ship Package"}
                        {order.status === "SHIPPED" && "Complete Entry"}
                      </Button>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-600 italic select-none">Pipeline Closed</span>
                    )}
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

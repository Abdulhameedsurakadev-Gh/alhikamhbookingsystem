"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, currentStatus: OrderStatus) {
  try {
    let nextStatus: OrderStatus = currentStatus;

    // Direct, logical progression chain
    if (currentStatus === OrderStatus.PENDING) nextStatus = OrderStatus.PAID;
    else if (currentStatus === OrderStatus.PAID) nextStatus = OrderStatus.SHIPPED;
    else if (currentStatus === OrderStatus.SHIPPED) nextStatus = OrderStatus.DELIVERED;

    // FIX: Execute adjustments within an atomic transaction block if status transitions to PAID
    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: nextStatus },
        include: { orderItems: true }
      });

      // Automatically decrement inventory stock if the item has just been verified as PAID
      if (nextStatus === OrderStatus.PAID && currentStatus === OrderStatus.PENDING) {
        for (const item of updatedOrder.orderItems) {
          await tx.book.update({
            where: { id: item.bookId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
      }
    });

    // Clear application caches across the system
    revalidatePath("/admin");
    revalidatePath("/admin/paystack-orders");
    revalidatePath("/admin/manage-inventory"); // Instantly updates visual stock badges inside your Ledger view
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

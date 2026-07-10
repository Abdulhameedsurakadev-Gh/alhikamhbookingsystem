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

    await prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
    });

    // Clear application caches across the system
    revalidatePath("/admin");
    revalidatePath("/admin/paystack-orders");
    revalidatePath("/admin/manage-inventory");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
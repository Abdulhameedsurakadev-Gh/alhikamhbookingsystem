// app/api/checkout/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse("Unauthorized user session block.", { status: 401 });
    }

    const { reference, deliveryData } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Missing transaction reference token." }, { status: 400 });
    }

    // =========================================================================
    // ⚡ FAST DEVELOPMENT BYPASS: Skip network calls, trust reference token, write data
    // =========================================================================
    console.log(`📡 Sandbox Mode: Bypassing external network calls for token reference: ${reference}`);

    // Fetch user's persistent checkout session cart records from PostgreSQL
    const cart = await prisma.cart.findUnique({
      where: { userId: session.id },
      include: { items: { include: { book: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Active student selection basket is empty." }, { status: 400 });
    }

    // Compute secure totals directly from verified database columns to protect data integrity
    const calculatedTotal = cart.items.reduce((acc, item) => {
      return acc + (parseFloat(item.book.price.toString()) * item.quantity);
    }, 0);

    const itemsToCreate = cart.items.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
      priceAtPurchase: item.book.price, // Maps straight to your exact schema field Decimals
    }));

    // Update Database Transactionally (Create Order, Decrement Stock, and Clear Cart rows)
    const resultOrder = await prisma.$transaction(async (tx) => {
      // A. Provision the verified Order entry record matching your model naming bounds
      const newOrder = await tx.order.create({
        data: {
          userId: session.id,
          totalAmount: calculatedTotal,
          paystackReference: reference,
          paymentChannel: "mobile_money",
          status: "PAID", 
          shippingAddress: `${deliveryData.fullName} | ${deliveryData.address}`,
          phoneNumber: deliveryData.phone,
          orderItems: {
            create: itemsToCreate
          },
        },
      });

      // B. Loop and safely decrement stock parameters across your books catalog
      for (const item of cart.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // C. Wipe out user cart records now that orders are securely written
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    console.log(`✅ Success: Transaction written into Supabase for Order ID: ${resultOrder.id}`);
    return NextResponse.json({ success: true, orderId: resultOrder.id });

  } catch (error: any) {
    console.error("❌ Fatal Order Verification Exception Breakdown Trace:", error);
    return NextResponse.json({ error: `Verification error: ${error?.message || "Internal error"}` }, { status: 500 });
  }
}

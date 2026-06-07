// app/api/checkout/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth"; // Imports your official Better-Auth reference

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  try {
    // 🛡️ BETTER-AUTH CLIENT CALL: Fetch authenticated user safely
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return new NextResponse("Unauthorized user session block.", { status: 401 });
    }

    const { reference, deliveryData } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Missing transaction reference token." }, { status: 400 });
    }

    // Fetch user's persistent checkout session cart records from PostgreSQL
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }, // Updated to match Better-Auth user ID structure
      include: { items: { include: { book: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Active student selection basket is empty." }, { status: 400 });
    }

    // Compute secure totals directly from verified database columns
    const calculatedTotal = cart.items.reduce((acc, item) => {
      return acc + (parseFloat(item.book.price.toString()) * item.quantity);
    }, 0);

    // =========================================================================
    // 🛡️ PAYSTACK HTTPS VERIFICATION GATEWAY CALL
    // =========================================================================
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json({ error: "Server payment configuration missing." }, { status: 500 });
    }

    const paystackResponse = await fetch(`https://paystack.co{reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    const paystackData = await paystackResponse.json();
    const expectedAmountInSubunits = Math.round(calculatedTotal * 100);

    if (
      !paystackData.status || 
      paystackData.data.status !== "success" || 
      paystackData.data.amount !== expectedAmountInSubunits
    ) {
      return NextResponse.json({ error: "Payment verification failed. Invalid transaction." }, { status: 400 });
    }
    // =========================================================================

    const itemsToCreate = cart.items.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
      priceAtPurchase: item.book.price, 
    }));

    // Update Database Transactionally
    const resultOrder = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount: calculatedTotal,
          paystackReference: reference,
          paymentChannel: paystackData.data.channel || "mobile_money",
          status: "PAID", 
          shippingAddress: `${deliveryData.fullName} | ${deliveryData.address}`,
          phoneNumber: deliveryData.phone,
          orderItems: { create: itemsToCreate },
        },
      });

      for (const item of cart.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: resultOrder.id });

  } catch (error: any) {
    return NextResponse.json({ error: "Internal server processing error." }, { status: 500 });
  }
}

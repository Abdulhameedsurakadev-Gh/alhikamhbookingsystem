// app/api/checkout/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";
import { getZoneById } from "../../../../lib/shipping-zones";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { reference, deliveryData } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Missing transaction reference." }, { status: 400 });
    }

    // Idempotency check — if this reference was already processed (e.g. a
    // retry after a slow network response), return the existing order
    // instead of hitting the paystackReference unique constraint and
    // throwing a scary generic 500 at someone who already paid correctly.
    const existingOrder = await prisma.order.findUnique({
      where: { paystackReference: reference },
    });
    if (existingOrder) {
      return NextResponse.json({ success: true, orderId: existingOrder.id });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { book: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const booksTotal = cart.items.reduce((acc, item) => {
      return acc + (Number(item.book.price) * item.quantity);
    }, 0);

    // Fixed: the shipping fee is looked up server-side by zoneId against
    // the shared SHIPPING_ZONES list — not trusted directly from
    // deliveryData.shippingFee. This closes the gap where a client could
    // claim a cheap fee for an expensive zone (or vice versa) in the
    // request body while the actual Paystack charge was tampered with.
    const zone = getZoneById(deliveryData?.zoneId);
    if (!zone) {
      return NextResponse.json({ error: "Invalid delivery zone." }, { status: 400 });
    }
    const shippingFee = zone.fee;
    const calculatedTotal = booksTotal + shippingFee;

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json({ error: "Server payment configuration missing." }, { status: 500 });
    }

    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
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
      console.error("Payment verification mismatch:", {
        reference,
        expected: expectedAmountInSubunits,
        received: paystackData?.data?.amount,
        paystackStatus: paystackData?.data?.status,
      });
      return NextResponse.json({ error: "Payment verification failed. Invalid transaction." }, { status: 400 });
    }

    const itemsToCreate = cart.items.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
      priceAtPurchase: item.book.price,
    }));

    // Fixed: deliveryData.address no longer exists on the client payload
    // (CheckoutForm now sends structured fields, not one compiled
    // string) — this was silently producing "... | undefined" in every
    // order's shippingAddress. Now writes to the new structured columns
    // directly, and shippingAddress is kept as a readable summary built
    // from the same real data, not a broken concatenation.
    const resultOrder = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount: calculatedTotal,
          paystackReference: reference,
          paymentChannel: paystackData.data.channel || "mobile_money",
          status: "PAID",
          shippingAddress: `${zone.name} — ${deliveryData.specificLocation} (${deliveryData.landmark})`,
          phoneNumber: deliveryData.phone,
          recipientName: deliveryData.fullName,
          deliveryZone: zone.name,
          deliveryArea: deliveryData.specificLocation,
          deliveryLandmark: deliveryData.landmark,
          deliveryFee: shippingFee,
          orderItems: { create: itemsToCreate },
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: resultOrder.id });

  } catch (error: any) {
    console.error("Checkout verification error:", error);
    return NextResponse.json({ error: "Internal server processing error." }, { status: 500 });
  }
}
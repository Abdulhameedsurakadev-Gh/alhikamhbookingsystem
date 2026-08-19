// app/checkout/page.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import { CheckoutForm } from "./CheckoutForm";
import { ShieldCheck, ArrowLeft } from "lucide-react";

// Checkout performs server-side session and cart validation,
// so it must always be evaluated dynamically.
export const dynamic = "force-dynamic";

export default async function CheckoutPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Checkout requires an authenticated customer.
  if (!session || !session.user) {
    redirect("/login?redirect=checkout");
  }

  // Fetch the authenticated user's persistent database cart.
  const cart = await prisma.cart.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  // A customer cannot proceed to checkout with an empty cart.
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const formattedItems = cart.items.map((item) => ({
    id: item.id,
    title: item.book.title,
    price: Number(item.book.price),
    quantity: item.quantity,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-serif text-heading font-extrabold text-foreground tracking-tight">
            Checkout
          </h1>

          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <ShieldCheck
              className="h-3.5 w-3.5 text-primary"
              aria-hidden="true"
            />
            Secure payment powered by Paystack
          </p>
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary-hover transition-colors"
        >
          <ArrowLeft
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
          Return to Cart
        </Link>
      </div>

      <CheckoutForm
        userId={session.user.id}
        userEmail={session.user.email || ""}
        cartItems={formattedItems}
      />
    </div>
  );
}

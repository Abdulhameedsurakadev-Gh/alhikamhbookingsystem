// app/(store)/shipping/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  CalendarDays,
  Wallet,
  Clock,
  ShoppingBag,
  PackageCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Al-Hikmah Islamic Bookstore",
  description:
    "Where Al-Hikmah delivers, how much it costs, and when to expect your books.",
};

const atAGlance = [
  {
    icon: MapPin,
    label: "Delivery Areas",
    value: "Kasoa, Accra, Madinah & other regions",
  },
  {
    icon: CalendarDays,
    label: "Delivery Day",
    value: "Fridays",
  },
  {
    icon: Wallet,
    label: "Delivery Fee",
    value: "Depends on your location",
  },
  {
    icon: Clock,
    label: "Delivery Time",
    value: "Varies by destination",
  },
];

const servedLocations = [
  "Kasoa",
  "Accra",
  "Madinah",
  "Other regions in Ghana",
  "Other locations by arrangement",
];

const howItWorks = [
  {
    icon: ShoppingBag,
    title: "Place your order",
    description: "Choose your books and complete your order at checkout.",
  },
  {
    icon: PackageCheck,
    title: "We prepare your books",
    description:
      "Your order is confirmed and prepared for delivery based on availability and location.",
  },
  {
    icon: Truck,
    title: "Friday delivery",
    description:
      "Books are delivered according to our Friday schedule and your location.",
  },
];

const importantNotes = [
  "Delivery fees are separate from book prices where applicable.",
  "Delivery availability depends on location.",
  "Delivery times are estimates and are not guaranteed.",
  "Friday is our regular delivery day.",
  "Please provide an accurate delivery location and contact number.",
  "For unusual or unlisted destinations, contact us before ordering.",
];

export default function ShippingPolicyPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10 font-sans text-xs text-muted-foreground">
          <Link href="/" className="transition-colors duration-fast hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-foreground">Shipping &amp; Delivery</span>
        </nav>

        {/* Header */}
        <header className="max-w-2xl">
          <p className="font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Shipping &amp; Delivery
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Getting Your Books to You
          </h1>

          <p className="mt-4 font-sans text-base leading-7 text-muted-foreground">
            We deliver Islamic books to customers in Kasoa, Accra, Madinah,
            and other locations. Delivery availability and fees depend on
            your location.
          </p>
        </header>

        {/* At a glance */}
        <section className="mt-12" aria-label="Delivery at a glance">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {atAGlance.map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-border p-5"
              >
                <item.icon
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 font-sans text-sm leading-6 text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Where we deliver */}
        <section className="mt-16 max-w-2xl">
          <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
            Where We Deliver
          </h2>

          <p className="mt-4 font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
            Currently served locations:
          </p>

          <ul className="mt-4 space-y-2">
            {servedLocations.map((location) => (
              <li key={location} className="flex items-center gap-2.5">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="font-sans text-[15px] text-foreground/90 sm:text-base">
                  {location}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
            Don't see your location listed at checkout? Contact us before or
            after placing your order so we can confirm whether delivery can
            be arranged and let you know the applicable fee.
          </p>
        </section>

        {/* Delivery fees */}
        <section className="mt-16 max-w-2xl">
          <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
            Delivery Fees
          </h2>

          <p className="mt-4 font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
            Delivery fees are determined by your destination. Where your
            location is listed during checkout, the applicable fee will be
            shown to you there.
          </p>

          <p className="mt-4 font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
            If your location is not currently listed, please contact us
            before placing your order so we can confirm the delivery fee.
          </p>
        </section>

        {/* Delivery schedule */}
        <section className="mt-16 max-w-2xl">
          <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
            Delivery Schedule
          </h2>

          <p className="mt-4 font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
            Our regular delivery day is <strong className="font-medium text-foreground">Friday</strong>.
            Orders are prepared for delivery according to availability,
            location, and logistics.
          </p>

          <p className="mt-4 font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
            Delivery times are estimates and cannot be guaranteed. Factors
            such as distance, transportation, weather, and other logistical
            circumstances may affect delivery.
          </p>
        </section>

        {/* How delivery works */}
        <section className="mt-16">
          <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
            How Delivery Works
          </h2>

          <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <step.icon
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-4 font-serif text-base font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Special / unlisted locations */}
        <section className="mt-16 rounded-md border border-primary/30 bg-primary/5 p-8">
          <h2 className="font-serif text-lg font-semibold text-foreground sm:text-xl">
            Need delivery somewhere else?
          </h2>

          <p className="mt-3 max-w-xl font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
            Don't see your location at checkout? Contact Al-Hikmah and we'll
            check whether delivery can be arranged and confirm the
            applicable fee.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-colors duration-fast hover:bg-primary/90"
          >
            Contact Us
          </Link>
        </section>

        {/* Important notes */}
        <section className="mt-16 max-w-2xl">
          <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
            Important Notes
          </h2>

          <ul className="mt-4 space-y-2">
            {importantNotes.map((note) => (
              <li key={note} className="flex gap-2.5">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span className="font-sans text-[15px] leading-7 text-foreground/90 sm:text-base">
                  {note}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Final CTA */}
        <section className="mt-16 border-t border-border pt-12 text-center">
          <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
            Looking for a book?
          </h2>

          <p className="mx-auto mt-3 max-w-md font-sans text-[15px] leading-7 text-muted-foreground sm:text-base">
            Browse the Al-Hikmah catalogue and find your next book of
            knowledge.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/books"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-colors duration-fast hover:bg-primary/90"
            >
              Browse Books
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 font-sans text-sm font-medium text-foreground transition-colors duration-fast hover:border-primary/40"
            >
              Contact Us
            </Link>
          </div>
        </section>

        {/* Last updated */}
        <p className="mt-16 border-t border-border pt-6 font-sans text-xs text-muted-foreground">
          Last updated: 17 August 2026
        </p>
      </div>
    </main>
  );
}
// app/about/page.tsx
// No "use client" — this page has no state or interactivity, so it should
// render as a Server Component. The previous directive shipped unnecessary
// JS to every visitor for zero benefit.
import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Truck,
  GraduationCap,
  Layers,
  HelpCircle,
  CheckCircle,
  User,
  ShoppingBag,
  ArrowUpRight
} from "lucide-react";
import { BookRequestCTA } from "../../components/shared/BookRequestCTA";

export default function AboutPage(): React.JSX.Element {

  const stats = [
    { label: "Focused Disciplines", value: "8 Disciplines", icon: Layers },
    { label: "Nationwide Delivery", value: "Ghana-Wide", icon: Truck },
    { label: "Catalog Classification", value: "By Study Level", icon: GraduationCap }
  ];

  const offerings = [
    {
      title: "Authentic Islamic Books",
      desc: "Carefully vetted texts spanning Aqeedah, Fiqh, Hadith, Tafsir, Seerah, and Arabic.",
      icon: BookOpen
    },
    {
      title: "Structured Learning",
      desc: "Resources organized by study level to take you systematically from beginner to advanced.",
      icon: GraduationCap
    },
    {
      title: "Special Sourcing Requests",
      desc: "Can't find a title? We procure requested books directly through our wholesale networks.",
      icon: HelpCircle
    },
    {
      title: "Nationwide Delivery",
      desc: "We coordinate delivery across Ghana and offer convenient pickup options within Kasoa.",
      icon: Truck
    }
  ];

  // NOTE: hardcoded list, not fetched from the database. Slugs below are a
  // best guess — verify each one actually exists as a real Category row
  // before trusting these links in production, or a customer clicks
  // "Islamic History" and lands on an empty results page.
  const disciplines = [
    { name: "Aqeedah", slug: "aqeedah" },
    { name: "Fiqh", slug: "fiqh" },
    { name: "Hadith", slug: "hadith" },
    { name: "Tafsir", slug: "tafsir" },
    { name: "Seerah", slug: "seerah" },
    { name: "Arabic Language", slug: "arabic" },
    { name: "Usul al-Fiqh", slug: "usul-al-fiqh" },
    { name: "Islamic History", slug: "islamic-history" },
  ];

  // Trimmed to 4 real ordering steps — "Special Requests" wasn't part of
  // the ordering flow, and BookRequestCTA already covers that exact
  // service at the bottom of this page, so it isn't duplicated here.
  const orderSteps = [
    { step: "01", title: "Browse books online", desc: "Explore our catalog structured by subject and tier." },
    { step: "02", title: "Place your order securely", desc: "Checkout safely using mobile money options." },
    { step: "03", title: "We source & prepare", desc: "Your books are carefully collected and double-vetted." },
    { step: "04", title: "Delivery or pickup", desc: "Dispatched countrywide or picked up here in Kasoa." },
  ];

  return (
    <main className="w-full bg-background text-foreground min-h-screen relative overflow-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-border text-center lg:text-left">
        <div className="max-w-3xl space-y-6 mx-auto lg:mx-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-secondary text-secondary-foreground text-xs font-bold tracking-wider uppercase">
            Islamic Bookstore • Ghana
          </span>
          <h1 className="text-display font-black font-serif tracking-tight text-foreground leading-tight">
            About <span className="text-primary">Al-Hikmah</span>
          </h1>
          <p className="text-body text-muted-foreground leading-relaxed max-w-2xl font-medium">
            Al-Hikmah exists to help Muslims in Ghana and beyond access authentic Islamic books from trusted scholars and publishers. Whether you are beginning your journey or advancing your studies, we aim to make beneficial knowledge easier to find and acquire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mt-12 text-left">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-card border border-border p-5 rounded-md flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-sm text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="block font-serif text-title font-bold text-foreground leading-none mb-1">{stat.value}</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. WHY AL-HIKMAH EXISTS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-border">
        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <h2 className="text-heading font-bold font-serif text-foreground">Why We Exist</h2>
          <p className="text-body text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Many students of knowledge struggle to find authentic Islamic books locally. Important works are often unavailable, difficult to source, or scattered across different suppliers. Al-Hikmah was established to simplify that process and connect readers with trusted Islamic literature.
          </p>
          <p className="text-body text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            We systematically bundle materials together, helping you build your library with greater confidence and clarity.
          </p>
        </div>
        {/* Was a dark emerald gradient — rebuilt flat, matching the Cards
            section, same fix already applied to the Books page banner. */}
        <div className="lg:col-span-5 bg-card p-6 rounded-md border border-border text-center lg:text-left space-y-3">
          <CheckCircle className="h-7 w-7 text-primary mx-auto lg:mx-0" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Our Core Commitment</p>
          <p className="text-body font-serif text-foreground italic leading-relaxed">
            &ldquo;Our commitment is simple: connect readers with authentic Islamic books from trusted scholars, publishers, and educational traditions.&rdquo;
          </p>
        </div>
      </section>

      {/* 3. FOUNDER STORY */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 flex items-center lg:items-start justify-center lg:justify-start gap-3">
          <div className="p-3 bg-card rounded-sm border border-border text-primary">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-heading font-bold font-serif text-foreground">The Beginning</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Behind Al-Hikmah</p>
          </div>
        </div>
        <div className="lg:col-span-8 text-center lg:text-left">
          <p className="text-body text-muted-foreground leading-relaxed max-w-2xl font-medium">
            Al-Hikmah started from a simple observation: many students wanted beneficial Islamic books but struggled to find them locally. As students ourselves, we felt that gap firsthand — the frustration of knowing a book existed somewhere, without a reliable way to actually get it. The bookstore was built to close that gap, so learners across Ghana don't have to search as hard as we once did.
          </p>
        </div>
      </section>

      {/* 4. WHAT WE OFFER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border space-y-10">
        <div className="text-center lg:text-left space-y-2">
          <h2 className="text-heading font-bold font-serif text-foreground">What We Offer</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offerings.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-card border border-border p-6 rounded-md hover:border-border-hover transition-colors duration-normal ease-standard group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-10 w-10 bg-background rounded-sm flex items-center justify-center border border-border text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-label text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CORE DISCIPLINES GRID — now real navigation, not decoration */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border space-y-8">
        <div className="text-center lg:text-left space-y-2">
          <h2 className="text-heading font-bold font-serif text-foreground">Subjects We Cover</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {disciplines.map((d) => (
            <Link
              key={d.slug}
              href={`/books?category=${d.slug}`}
              className="flex items-center justify-between h-11 px-4 rounded-sm border border-border bg-card text-xs font-semibold text-foreground hover:border-border-hover hover:text-primary-hover transition-colors duration-fast"
            >
              <span>{d.name}</span>
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {/* 6. HOW ORDERING WORKS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border space-y-10">
        <div className="flex items-center justify-center lg:justify-start gap-3">
          <div className="p-3 bg-card rounded-sm border border-border text-primary">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-heading font-bold font-serif text-foreground">How Ordering Works</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {orderSteps.map((step, idx) => (
            <div key={idx} className="bg-card border border-border p-5 rounded-md space-y-3 relative overflow-hidden">
              <span className="absolute -right-2 -top-2 font-black text-4xl text-border select-none" aria-hidden="true">
                {step.step}
              </span>
              <h3 className="font-bold text-xs text-foreground relative z-10">{step.title}</h3>
              <p className="text-xs font-medium text-muted-foreground leading-normal relative z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. APPROACH & VISION SPLIT */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border border-border p-6 sm:p-8 rounded-md space-y-3">
          <div className="h-8 w-8 bg-secondary text-primary flex items-center justify-center rounded-sm">
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-title font-bold font-serif text-foreground">Our Strategic Approach</h3>
          <p className="text-label text-muted-foreground leading-relaxed font-medium">
            We carefully select books from trusted publishers and suppliers, organize them by subject and study level, and make them easier for students to discover and acquire.
          </p>
        </div>

        <div className="bg-card border border-border p-6 sm:p-8 rounded-md space-y-3">
          <div className="h-8 w-8 bg-secondary text-primary flex items-center justify-center rounded-sm">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-title font-bold font-serif text-foreground">Our Long-Term Vision</h3>
          <p className="text-label text-muted-foreground leading-relaxed font-medium">
            We envision Al-Hikmah becoming more than a bookstore. In the future, we hope to support Islamic education through publishing, curriculum development, translation projects, and educational resources that benefit Muslims across Ghana and Africa.
          </p>
        </div>
      </section>

      {/* 8. TRUST DESK CTA */}
      <section className="relative z-10 border-t border-border bg-background">
        <BookRequestCTA />
      </section>

    </main>
  );
}

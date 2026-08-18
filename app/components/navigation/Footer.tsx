"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Send, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus(null);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setEmail("");
      setStatus({ type: "success", msg: "Mubarak! You have subscribed to catalog arrival alerts." });
      setTimeout(() => setStatus(null), 4000);
    });
  };

  const studyAreas = [
    { name: "Aqeedah (Creed)", slug: "AQEEDAH" },
    { name: "Fiqh (Jurisprudence)", slug: "FIQH" },
    { name: "Hadith (Traditions)", slug: "HADITH" },
    { name: "Tafsir (Exegesis)", slug: "TAFSIR" },
    { name: "Seerah (Biography)", slug: "SEERAH" },
  ];

  const scholars = [
    { name: "Ibn Taymiyyah", query: "Ibn Taymiyyah" },
    { name: "Ibn al-Qayyim", query: "Ibn al-Qayyim" },
    { name: "An-Nawawi", query: "An-Nawawi" },
    { name: "Ibn Hajar", query: "Ibn Hajar" },
  ];

  return (
    <footer className="w-full bg-background border-t border-border font-sans mt-auto">

      {/*
        NEWSLETTER STRIP — rewritten from a near-black SaaS slab to a quiet
        announcement, per the review: "support the bookstore, don't compete
        with it." Uses bg-card, not a dark inverted panel.
      */}
      <div className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center md:text-left">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <p className="text-label text-foreground">
              <span className="font-medium">New arrivals, quietly announced.</span>{" "}
              <span className="text-muted-foreground">No noise, just new titles as they arrive.</span>
            </p>
          </div>

          <div className="w-full md:w-auto space-y-1.5">
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-80">
              <input
                required
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="flex-1 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-sm px-3 py-2 text-label focus:outline-none focus:border-primary transition-colors duration-fast ease-standard disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-label rounded-sm transition-colors duration-fast ease-standard flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isPending ? "Subscribing..." : <><Send className="w-3 h-3" /> Subscribe</>}
              </button>
            </form>
            {status && (
              <p className={`text-[11px] font-medium tracking-wide ${status.type === "success" ? "text-success" : "text-destructive"}`}>
                {status.msg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION GRID */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        <div className="text-center md:text-left space-y-1.5 max-w-xs mx-auto md:mx-0">
          <span className="text-title font-medium tracking-tight text-foreground font-serif block">
            Al-Hikmah
          </span>
          <p className="text-label text-muted-foreground leading-relaxed">
            Providing authentic Islamic books, translations, and scholarly works for students of knowledge throughout Ghana.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-border flex-1" />
          <div className="text-xs select-none text-muted-foreground font-serif">❖</div>
          <div className="h-px bg-border flex-1" />
        </div>

        {/* 3-column nav — headings shortened to plain, editorial words per Voice & Copy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start">

          <div className="space-y-3 text-center sm:text-left">
            <h5 className="text-label font-semibold text-foreground font-serif">Catalogue</h5>
            <ul className="space-y-2 text-label text-muted-foreground">
              <li><Link href="/books" className="hover:text-primary-hover transition-colors block">All Books</Link></li>
              <li><Link href="/authors" className="hover:text-primary-hover transition-colors block">Authors</Link></li>
              <li><Link href="/books?filter=new" className="hover:text-primary-hover transition-colors block">New Arrivals</Link></li>
              <li><Link href="/books?filter=best" className="hover:text-primary-hover transition-colors block">Bestsellers</Link></li>
            </ul>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <h5 className="text-label font-semibold text-foreground font-serif">Disciplines</h5>
            <ul className="space-y-2 text-label text-muted-foreground">
              {studyAreas.map((area, idx) => (
                <li key={idx}>
                  <Link href={`/books?category=${area.slug}`} className="hover:text-primary-hover transition-colors block">
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-center sm:text-left sm:col-span-2 md:col-span-1">
            <h5 className="text-label font-semibold text-foreground font-serif">Support</h5>
            <ul className="space-y-2 text-label text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary-hover transition-colors block">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary-hover transition-colors block">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-primary-hover transition-colors block">Shipping in Ghana</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-hover transition-colors block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-hover transition-colors block">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        {/* SCHOLAR STRIP — mono "Authority Filter" pill removed, plain uppercase
            label instead, matching the eyebrow-label pattern used in Hero. */}
        <div className="bg-card border border-border rounded-md p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Browse by Scholar
            </p>
            <p className="text-label font-medium text-foreground font-serif">Classical Authors & Commentators</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-label text-muted-foreground">
            {scholars.map((sch, idx) => (
              <React.Fragment key={idx}>
                <Link href={`/books?search=${encodeURIComponent(sch.query)}`} className="hover:text-primary-hover inline-flex items-center gap-0.5 transition-colors">
                  {sch.name} <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
                {idx < scholars.length - 1 && <span className="text-border hidden sm:inline select-none">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* SECURE CHECKOUT — led with the customer's actual concern, not the vendor name */}
        <div className="flex flex-col items-center justify-center space-y-1.5 pt-2 text-center border-t border-border">
          <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase pt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Secure Checkout
          </div>
          <p className="text-xs text-muted-foreground tracking-wide">
            Mobile Money (MTN, Telecel, AT) • Visa • Mastercard
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground tracking-wide pt-4 border-t border-border">
          &copy; {new Date().getFullYear()} Al-Hikmah Bookstore. Connecting students of knowledge with authentic Islamic books across Ghana.
        </div>

      </div>
    </footer>
  );
}
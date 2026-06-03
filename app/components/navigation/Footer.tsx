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
    <footer className="w-full bg-white border-t border-slate-200 font-sans mt-auto">
      
      {/* 📬 NEWSLETTER STRIP */}
      <div className="bg-slate-950 text-white border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-1 text-center md:text-left max-w-md">
            <h4 className="font-serif text-lg font-medium text-slate-100 tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-emerald-400" /> Stay Updated On New Arrivals
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Be the first to know when new books, commentaries, and featured collections are added to our catalog.
            </p>
          </div>

          <div className="w-full max-w-md space-y-2">
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
              <input
                required
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500 transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:bg-slate-800"
              >
                {isPending ? "Subscribing..." : <><Send className="w-3 h-3" /> Subscribe</>}
              </button>
            </form>
            {status && (
              <p className={`text-[11px] font-medium tracking-wide ${status.type === "success" ? "text-emerald-400" : "text-rose-400"}`}>
                {status.msg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 🏛️ MAIN NAVIGATION GRID */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-10">
        
        {/* Brand Statement Header */}
        <div className="text-center md:text-left space-y-1.5 max-w-xs mx-auto md:mx-0">
          <span className="text-xl font-medium tracking-tight text-emerald-950 font-serif block">
            Al-Hikmah
          </span>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Providing authentic Islamic books, translations, and scholarly works for students of knowledge throughout Ghana.
          </p>
        </div>

        {/* Elegant Diamond Divider */}
        <div className="flex items-center justify-center gap-4 text-slate-100">
          <div className="h-[1px] bg-slate-200 flex-1" />
          <div className="text-[10px] select-none text-slate-300 font-serif">❖</div>
          <div className="h-[1px] bg-slate-200 flex-1" />
        </div>

        {/* 3-Column Navigation Grid - Swapped to Title Case and reduced bold weights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start">
          
          {/* Column A: Explore Navigation */}
          <div className="space-y-3 text-center sm:text-left">
            <h5 className="text-xs font-semibold text-slate-800 font-serif">Explore Platform</h5>
            <ul className="space-y-2 text-xs font-normal text-slate-500">
              <li><Link href="/books" className="hover:text-emerald-700 transition block">All Catalog Books</Link></li>
              <li><Link href="/authors" className="hover:text-emerald-700 transition block">Biographies & Authors</Link></li>
              <li><Link href="/books?filter=new" className="hover:text-emerald-700 transition block">New Arrivals</Link></li>
              <li><Link href="/books?filter=best" className="hover:text-emerald-700 transition block">Bestselling Recommendations</Link></li>
            </ul>
          </div>

          {/* Column B: Study Disciplines */}
          <div className="space-y-3 text-center sm:text-left">
            <h5 className="text-xs font-semibold text-slate-800 font-serif">Study Disciplines</h5>
            <ul className="space-y-2 text-xs font-normal text-slate-500">
              {studyAreas.map((area, idx) => (
                <li key={idx}>
                  <Link href={`/books?category=${area.slug}`} className="hover:text-emerald-700 transition block">
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column C: Customer Care */}
          <div className="space-y-3 text-center sm:text-left sm:col-span-2 md:col-span-1">
            <h5 className="text-xs font-semibold text-slate-800 font-serif">Customer Support</h5>
            <ul className="space-y-2 text-xs font-normal text-slate-500">
              <li><Link href="/about" className="hover:text-emerald-700 transition block">About Our Institution</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-700 transition block">Contact / Support </Link></li>
              <li><Link href="/shipping" className="hover:text-emerald-700 transition block">Ghana Nationwide Shipping</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-700 transition block">Data Privacy & Terms</Link></li>
            </ul>
          </div>

        </div>

        {/* 📚 SCHOLARLY DETAIL STRIP */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-medium tracking-wide bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded font-mono">
              Authority Filter
            </span>
            <p className="text-xs font-medium text-slate-700 font-serif mt-1">Browse Library Collections By Classical Scholars</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-medium text-slate-500">
            {scholars.map((sch, idx) => (
              <React.Fragment key={idx}>
                <Link href={`/books?search=${encodeURIComponent(sch.query)}`} className="text-slate-500 hover:text-emerald-700 inline-flex items-center gap-0.5 transition">
                  {sch.name} <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                </Link>
                {idx < scholars.length - 1 && <span className="text-slate-200 hidden sm:inline select-none">•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 🔒 PAYSTACK FINANCIAL EMBLEM */}
        <div className="flex flex-col items-center justify-center space-y-1.5 pt-2 text-center border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium tracking-wide text-slate-400 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Settlement Powered By Paystack
          </div>
          <p className="text-[10px] text-slate-400 font-normal tracking-wide">
            Mobile Money (MTN, Telecel, AT) • Visa Card Authorization • Mastercard SecureCode
          </p>
        </div>

        {/* COPYRIGHT MATRICES */}
        <div className="text-center text-[11px] text-slate-400 font-normal tracking-wide pt-4 border-t border-slate-100">
          &copy; {new Date().getFullYear()} Al-Hikmah Bookstore. All Rights Reserved. Connecting Students of Knowledge with Authentic Islamic Books in Ghana.
        </div>

      </div>
    </footer>
  );
}

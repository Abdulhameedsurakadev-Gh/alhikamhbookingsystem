// app/components/shared/BookRequestCTA.tsx
"use client";

import React from "react";
import { MessageCircle, CheckCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export function BookRequestCTA(): React.JSX.Element {
  // Pre-filled WhatsApp link explicitly formulated for Al-Hikmah
  const whatsappBaseUrl = "https://wa.me/233202131864";
  const message = "Assalamu Alaikum. I am looking for a book that I could not find on Al-Hikmah Website.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `${whatsappBaseUrl}?text=${encodedMessage}`;

  const trustIndicators = [
    "Send title, author name, or cover photo",
    "Classical and contemporary Islamic works",
    "Sourced from trusted suppliers",
    "Nationwide delivery available",
  ];

  return (
    <section className="w-full bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Visual Geometric Grid Layer - Exact match to your Hero background structure */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Container cards styled directly to integrate between your Hero/Grid segments */}
      <div className="mx-auto max-w-5xl bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-2xl shadow-2xl overflow-hidden text-white border border-slate-800 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-12 gap-8">
          
          {/* LEFT COLUMN: Core Content & Main Conversion Actions */}
          <div className="w-full lg:max-w-xl space-y-6 text-center lg:text-left">
            
            {/* Section 1: Authority Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="text-xl" role="img" aria-label="books">📚</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono tracking-wider uppercase">
                Special Request Desk
              </span>
            </div>

            {/* Section 2 & 3: Main Headline & Supporting Text */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-serif text-slate-100 leading-tight">
                Looking For A Specific <br className="hidden sm:inline lg:hidden" />
                <span className="text-emerald-400">Islamic Book?</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
                Can&apos;t find the book you are looking for, let us know. We regularly source titles from trusted suppliers and may be able to obtain the exact work you need.
              </p>
            </div>

            {/* Section 4: Primary Framer-Motion Animated Conversion Trigger */}
            <div className="pt-2">
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-950/40 group cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 fill-current text-white group-hover:rotate-12 transition-transform" />
                <span>Request A Book On WhatsApp</span>
              </motion.a>
              <p className="text-[11px] text-emerald-400/90 mt-2 italic font-medium tracking-wide">
                ⚡ Usually responds within a few hours.
              </p>
            </div>

            {/* Section 5: Trust Indicators - Styled exactly like your Hero check row */}
            <div className="pt-5 border-t border-slate-800/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-md mx-auto lg:mx-0">
                {trustIndicators.map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Decorative Desktop Blueprint Icon Box */}
          <div className="hidden lg:flex w-64 h-64 items-center justify-center bg-slate-950/40 rounded-xl border border-slate-800/80 relative group overflow-hidden flex-shrink-0">
            {/* Subtle Gradient Shadowing overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent z-10" />
            
            {/* Pulsing Abstract Background Glow */}
            <div className="absolute h-32 w-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700" />
            
            <div className="flex flex-col items-center gap-3 relative z-20 text-center p-6">
              <HelpCircle className="h-12 w-12 text-emerald-500/60 stroke-[1.25] group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-500" />
              <div className="space-y-1">
                <p className="font-serif font-bold text-sm text-slate-200">Direct Book Sourcing</p>
                <p className="text-[11px] font-medium text-slate-500 leading-normal px-2">
                  From foundational study texts to advanced research works, we help students, teachers, and institutions obtain books beyond our published catalog.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

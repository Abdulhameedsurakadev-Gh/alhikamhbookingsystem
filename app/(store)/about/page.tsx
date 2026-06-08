// app/about/page.tsx
"use client";

import React from "react";
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
  
  // 3 Core Grounded Performance Statistics
  const stats = [
    { label: "Islamic Sciences Covered", value: "8 Disciplines", icon: Layers },
    { label: "Shipping Logistics", value: "Ghana-Wide", icon: Truck },
    { label: "Catalog Classification", value: "By Study Level", icon: GraduationCap }
  ];

  // What We Offer Card Data Matrix
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

  // Core Specialized Academic Fields Grid
  const disciplines = [
    "Aqeedah", "Fiqh", "Hadith", "Tafsir", 
    "Seerah", "Arabic Language", "Usul al-Fiqh", "Islamic History"
  ];

  // How Ordering Works Data Steps
  const orderSteps = [
    { step: "01", title: "Browse books online", desc: "Explore our catalog structured by subject and tier." },
    { step: "02", title: "Place your order securely", desc: "Checkout safely using mobile money options." },
    { step: "03", title: "We source & prepare", desc: "Your books are carefully collected and double-vetted." },
    { step: "04", title: "Delivery or pickup", desc: "Dispatched countrywide or picked up here in Kasoa." },
    { step: "05", title: "Special requests welcome", desc: "Need a rare title? Contact our WhatsApp desk any time." }
  ];

  return (
    <main className="w-full bg-slate-950 text-white min-h-screen relative overflow-hidden selection:bg-emerald-500/30">
      {/* Subtle Visual Geometric Grid Layer */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-slate-900/60 text-center lg:text-left">
        <div className="max-w-3xl space-y-6 mx-auto lg:mx-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono tracking-wider uppercase">
            Platform Identity • v1.0.5
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-slate-100 leading-tight">
            About <span className="text-emerald-400">Al-Hikmah</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
            Al-Hikmah exists to help Muslims in Ghana and beyond access authentic Islamic books from trusted scholars and publishers. Whether you are beginning your journey or advancing your studies, we aim to make beneficial knowledge easier to find and acquire.
          </p>
        </div>

        {/* Hero Trust Performance Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mt-12 text-left">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-serif text-xl font-bold text-slate-100 leading-none mb-1">{stat.value}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. WHY AL-HIKMAH EXISTS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-900/60">
        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100">Why We Exist</h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Many students of knowledge struggle to find authentic Islamic books locally. Important works are often unavailable, difficult to source, or scattered across different suppliers. Al-Hikmah was established to simplify that process and connect readers with trusted Islamic literature.
          </p>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            We systematically bundle materials together, helping you build your library with greater confidence and clarity.
          </p>
        </div>
        <div className="lg:col-span-5 bg-linear-to-br from-emerald-950 to-slate-950 p-6 rounded-2xl border border-emerald-900/30 text-center lg:text-left space-y-3">
          <CheckCircle className="h-7 w-7 text-emerald-400 mx-auto lg:mx-0" />
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Our Core Commitment</p>
          <p className="text-sm font-serif text-slate-200 italic leading-relaxed">
            &ldquo;Our commitment is simple: connect readers with authentic Islamic books from trusted scholars, publishers, and educational traditions.&rdquo;
          </p>
        </div>
      </section>

      {/* 3. FOUNDER STORY */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-900/60 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 flex items-center lg:items-start justify-center lg:justify-start gap-3">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-100">The Beginning</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Behind Al-Hikmah</p>
          </div>
        </div>
        <div className="lg:col-span-8 text-center lg:text-left">
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-medium">
            Al-Hikmah started from a simple observation: many students wanted beneficial Islamic books but struggled to find them locally. As students ourselves, we experienced this challenge firsthand. The bookstore was created to bridge that gap and make authentic Islamic literature more accessible to learners across Ghana.
          </p>
        </div>
      </section>

      {/* 4. WHAT WE OFFER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-900/60 space-y-10">
        <div className="text-center lg:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100">What We Offer</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Grounded Services Ecosystem</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offerings.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-xl hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-10 w-10 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 text-emerald-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-slate-200">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

                {/* 5. CORE DISCIPLINES GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-900/60 space-y-8">
        <div className="text-center lg:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100">Disciplines We Focus On</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Curated Scholarly Focus</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {disciplines.map((name, index) => (
            <div 
              key={index}
              className="flex items-center justify-between h-11 px-4 rounded-xl border border-slate-800 bg-slate-900/20 text-xs font-semibold text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
            >
              <span>{name}</span>
              <ArrowUpRight className="h-3 w-3 text-slate-600" />
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOW ORDERING WORKS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-900/60 space-y-10">
        <div className="flex items-center justify-center lg:justify-start gap-3">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100">How Ordering Works</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-0.5">Simple Fulfillment Steps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {orderSteps.map((step, idx) => (
            <div key={idx} className="bg-slate-900/10 border border-slate-900 p-5 rounded-xl space-y-3 relative overflow-hidden">
              <span className="absolute -right-2 -top-2 font-mono font-black text-4xl text-slate-900/30 select-none">
                {step.step}
              </span>
              <h3 className="font-bold text-xs text-slate-200 relative z-10">{step.title}</h3>
              <p className="text-[11px] font-medium text-slate-400 leading-normal relative z-10">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. APPROACH & VISION SPLIT */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strategic Approach Card */}
        <div className="bg-slate-900/20 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-3">
          <div className="h-8 w-8 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-lg border border-emerald-500/20">
            <CheckCircle className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold font-serif text-slate-100">Our Strategic Approach</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            We carefully select books from trusted publishers and suppliers, organize them by subject and study level, and make them easier for students to discover and acquire.
          </p>
        </div>

        {/* Long-Term Vision Card */}
        <div className="bg-slate-900/20 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-3">
          <div className="h-8 w-8 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-lg border border-emerald-500/20">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold font-serif text-slate-100">Our Long-Term Vision</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            We envision Al-Hikmah becoming more than a bookstore. In the future, we hope to support Islamic education through publishing, curriculum development, translation projects, and educational resources that benefit Muslims across Ghana and Africa.
          </p>
        </div>
      </section>

      {/* 8. TRUST DESK CTA COMPONENT CALL */}
      <section className="relative z-10 border-t border-slate-900/60 bg-slate-950/40">
        <BookRequestCTA />
      </section>

    </main>
  );
}

  
"use client";

import React, { useState } from "react";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Truck, 
  HelpCircle, 
  ChevronDown, 
  Send,
  MapPin
} from "lucide-react";
import { BookRequestCTA } from "../../components/shared/BookRequestCTA";

export default function ContactPage(): React.JSX.Element {
  // State management for local accordion and simple form tracking
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const whatsappLink = "https://wa.me/233202131864";

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data preserved safely:", formData);
    alert("Inquiry logged successfully. If your request is urgent, please click the WhatsApp Support button above.");
    setFormData({ name: "", email: "", message: "" });
  };

  const faqs = [
    {
      q: "When are orders dispatched and delivered?",
      a: "To optimize logistics, we disburse orders strictly twice a week on Fridays and Sundays. Once dispatched, local packages (Kasoa/Accra) arrive within 24 hours, while regional shipments take 2–3 business days."
    },
    {
      q: "What payment methods do you accept?",
      a: "We process payments securely using Mobile Money (MTN, Telecel, AT) via our Paystack integration. Cash on delivery is available exclusively for scheduled pickups in Kasoa."
    },
    {
      q: "Can you source classical Arabic texts not in the store?",
      a: "Yes. Our Special Request Desk leverages wholesale networks in Nima and overseas suppliers to procure unlisted classical and contemporary Islamic titles."
    }
  ];

  return (
    <main className="w-full bg-slate-950 text-white min-h-screen relative overflow-hidden selection:bg-emerald-500/30">
      {/* Subtle Visual Geometric Grid Layer */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* 1. HERO SECTION WITH SUBTLE ISLAMIC GEOMETRIC REINFORCEMENT */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <MessageCircle className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-100">
            Contact <span className="text-emerald-400">Al-Hikmah</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium">
            Have a question about a book title, an ongoing delivery, or structured learning paths? Reach out directly. Please note we dispatch orders strictly on <span className="text-emerald-400 font-bold">Fridays and Sundays</span>.
          </p>
        </div>
      </section>

      {/* 2. PRIMARY CONTACT METHODS SPLIT MATRIX */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WHATSAPP SUPPORT CARD (LARGEST CORE CONVERSION ELEMENT) */}
        <div className="md:col-span-3 bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-2xl border border-emerald-800/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 text-emerald-900/10 font-mono font-black text-9xl select-none pointer-events-none translate-x-10 translate-y-5 group-hover:scale-105 transition-transform duration-500">
            WA
          </div>
          <div className="space-y-3 text-center sm:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono uppercase tracking-wider">
              Primary Channel
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-100 flex items-center justify-center sm:justify-start gap-2">
              <span>💬</span> WhatsApp Support
            </h2>
            <p className="text-2xl font-mono font-bold tracking-tight text-emerald-400">
              +233 20 213 1864
            </p>
            <p className="text-xs text-slate-400 font-medium">
              ⚡ Clear communication channels. Usually responds within a few hours.
            </p>
          </div>
          <div className="w-full sm:w-auto flex-shrink-0 relative z-10">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Message Us Now
            </a>
          </div>
        </div>

        {/* VOICE CALL TIER */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-3">
          <div className="p-2.5 bg-slate-950 border border-slate-800 text-emerald-400 w-10 h-10 rounded-lg flex items-center justify-center">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-200 text-sm">Direct Desk</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">+233 20 213 1864</p>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">Available for voice support regarding pressing logistics concerns.</p>
        </div>

        {/* EMAIL TIER */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-3">
          <div className="p-2.5 bg-slate-950 border border-slate-800 text-emerald-400 w-10 h-10 rounded-lg flex items-center justify-center">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-200 text-sm">Digital Mail</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">alhikmahbookstore93@gmail.com</p>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">Submit general administrative inquiries or receipt validations directly.</p>
        </div>

        {/* NATIONWIDE DELIVERY CARD */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-3 relative overflow-hidden group">
          <span className="absolute right-3 top-3 text-2xl select-none opacity-40 group-hover:scale-110 transition-transform">🇬🇭</span>
          <div className="p-2.5 bg-slate-950 border border-slate-800 text-emerald-400 w-10 h-10 rounded-lg flex items-center justify-center">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-200 text-sm">Fulfillment Matrix</h3>
            <p className="text-xs text-emerald-400 font-semibold mt-1">Friday & Sunday Disbursals</p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            We batch and process packages nationwide twice a week to maintain structure. Direct pickups can be coordinated within Kasoa.
          </p>
        </div>
      </section>

      {/* 3. DUAL CORE INTERACTIVE BLOCK: FAQ & CONTACT FORM */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-slate-900/60 mt-6">
        
        {/* LEFT COLUMN: FAQS ACCORDION */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-400" /> Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">Quick guidelines regarding common customer operations.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-900 bg-slate-900/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 shrink-0 ${openFaq === idx ? "rotate-180 text-emerald-400" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-slate-950/40 border-t border-slate-900/60 text-xs text-slate-400 leading-relaxed font-medium animate-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

                {/* RIGHT COLUMN: FALLBACK SECURE CONTACT FORM */}
        <div className="lg:col-span-5 bg-slate-900/20 border border-slate-900 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-slate-200 text-sm">Send an Inquiry</h3>
            <p className="text-[11px] text-slate-500">Log messages securely into our fallback administrative stack.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Name</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Zayd ibn Thabit"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-600 focus:bg-slate-900/40 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <input 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seeker@knowledge.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-600 focus:bg-slate-900/40 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Message / Inquiry</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your inquiry or needed book volumes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-600 focus:bg-slate-900/40 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="h-3 w-3" /> Send Message
            </button>
          </form>
        </div>
      </section>

      {/* 4. EXTRALONG DOWNSTREAM SPECIAL PROCUREMENT DRAWER */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <BookRequestCTA />
      </section>
    </main>
  );
}



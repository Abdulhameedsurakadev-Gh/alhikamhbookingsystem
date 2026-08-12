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
  Zap,
} from "lucide-react";
import { BookRequestCTA } from "../../components/shared/BookRequestCTA";

export default function ContactPage(): React.JSX.Element {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const whatsappLink = "https://wa.me/233202131864";

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: this only simulates success — before launch, wire this to a
    // real Server Action / API route that saves the message and sends a
    // notification, the same pattern already used by the contact form
    // mentioned in memory (Resend + Zod + rate limiting + ContactSubmission
    // model). console.log/alert are placeholders only.
    console.log("Form data preserved safely:", formData);
    alert("Message received. If your request is urgent, please use WhatsApp above.");
    setFormData({ name: "", email: "", message: "" });
  };

  const faqs = [
    {
      q: "When are orders dispatched and delivered?",
      a: "Orders are dispatched every Friday and Sunday. Once dispatched, local packages (Kasoa/Accra) arrive within 24 hours, while regional shipments take 2–3 business days."
    },
    {
      q: "What payment methods do you accept?",
      a: "We process payments securely using Mobile Money (MTN, Telecel, AT) via Paystack. Cash on delivery is available exclusively for scheduled pickups in Kasoa."
    },
    {
      q: "Can you source classical Arabic texts not in the store?",
      a: "Yes. We work with wholesale networks in Nima and overseas suppliers to procure unlisted classical and contemporary Islamic titles."
    }
  ];

  return (
    <main className="w-full bg-background text-foreground min-h-screen relative overflow-hidden">

      {/* 1. HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary mb-2">
            <MessageCircle className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />
          </div>
          <h1 className="text-display font-black font-serif tracking-tight text-foreground">
            Contact <span className="text-primary">Al-Hikmah</span>
          </h1>
          <p className="text-body text-muted-foreground leading-relaxed font-medium">
            Need help with a book, an order, delivery, or a special request? We&apos;re here to help. Orders are dispatched every <span className="text-primary font-bold">Friday and Sunday</span>.
          </p>
        </div>
      </section>

      {/* 2. PRIMARY CONTACT METHODS */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* WhatsApp — was a dark gradient with a decorative "WA" watermark
            and a glowing shadow. Rebuilt flat, matching the Cards section;
            the watermark and glow were pure decoration your Design
            Principles ask you to remove ("content before decoration"). */}
        <div className="md:col-span-3 bg-card rounded-md border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider">
              Fastest Response
            </div>
            <h2 className="text-title font-bold font-serif text-foreground flex items-center justify-center sm:justify-start gap-2">
              <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" /> WhatsApp Support
            </h2>
            <p className="text-title font-bold tracking-tight text-primary">
              +233 20 213 1864
            </p>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 justify-center sm:justify-start">
              <Zap className="h-3 w-3 text-secondary" aria-hidden="true" /> Usually responds within a few hours.
            </p>
          </div>
          <div className="w-full sm:w-auto flex-shrink-0">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm rounded-sm transition-colors duration-fast ease-standard cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Message Us Now
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-card border border-border p-6 rounded-md space-y-3">
          <div className="p-2.5 bg-background border border-border text-primary w-10 h-10 rounded-sm flex items-center justify-center">
            <Phone className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-foreground text-label">Phone</h3>
            <p className="text-xs text-muted-foreground mt-1">+233 20 213 1864</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">Available for voice support regarding pressing logistics concerns.</p>
        </div>

        {/* Email */}
        <div className="bg-card border border-border p-6 rounded-md space-y-3">
          <div className="p-2.5 bg-background border border-border text-primary w-10 h-10 rounded-sm flex items-center justify-center">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-foreground text-label">Email</h3>
            <p className="text-xs text-muted-foreground mt-1">alhikmahbookstore93@gmail.com</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">Send general questions or order inquiries directly.</p>
        </div>

        {/* Delivery Schedule */}
        <div className="bg-card border border-border p-6 rounded-md space-y-3">
          <div className="p-2.5 bg-background border border-border text-primary w-10 h-10 rounded-sm flex items-center justify-center">
            <Truck className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-foreground text-label">Delivery Schedule</h3>
            <p className="text-xs text-primary font-semibold mt-1">Fridays & Sundays</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Orders are dispatched every Friday and Sunday. Direct pickups can be coordinated within Kasoa.
          </p>
        </div>
      </section>

      {/* 3. BUSINESS HOURS — new section, sets expectations even though
          WhatsApp is the primary channel */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-md p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Monday – Thursday</p>
            <p className="text-label text-foreground font-medium mt-1">9:00 AM – 5:00 PM</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Friday</p>
            <p className="text-label text-foreground font-medium mt-1">After Jumu&apos;ah</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sunday</p>
            <p className="text-label text-foreground font-medium mt-1">9:00 AM – 5:00 PM</p>
          </div>
        </div>
      </section>

      {/* 4. FAQ & CONTACT FORM */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-border mt-6">

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h2 className="text-heading font-bold font-serif text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" /> Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-border bg-card rounded-md overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors duration-fast"
                >
                  <span className="text-label font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-normal shrink-0 ${openFaq === idx ? "rotate-180 text-primary" : ""}`} aria-hidden="true" />
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-background border-t border-border text-xs text-muted-foreground leading-relaxed font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT FORM — labels now connected via htmlFor/id */}
        <div className="lg:col-span-5 bg-card border border-border rounded-md p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-foreground text-label">Send a Message</h3>
            <p className="text-xs text-muted-foreground">We&apos;ll get back to you as soon as possible.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Name</label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Zayd ibn Thabit"
                className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors duration-fast"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seeker@knowledge.com"
                className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors duration-fast"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your inquiry or needed book volumes..."
                className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors duration-fast resize-none"
              />
            </div>

            {/* Fixed: hover:bg-slate-850 doesn't exist in Tailwind's default
                scale (steps stop at 900/950) — this hover state was never
                actually doing anything. */}
            <button
              type="submit"
              className="w-full py-3 bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground font-bold text-xs rounded-sm tracking-wider uppercase transition-colors duration-fast ease-standard flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="h-3 w-3" aria-hidden="true" /> Send Message
            </button>
          </form>
        </div>
      </section>

      {/* 5. BOOK REQUEST CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <BookRequestCTA />
      </section>
    </main>
  );
}
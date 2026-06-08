"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  ChevronDown,
  Send,
  AlertCircle,
  Facebook,
  Instagram,
  Smartphone,
} from "lucide-react";
import { BookRequestCTA } from "../../components/shared/BookRequestCTA";

export default function ContactPage(): React.JSX.Element {
  // State management
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    message: "",
  });

  const whatsappLink = "https://wa.me/233202131864";

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", category: "general", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How long does delivery take within Ghana?",
      a: "Orders within Kasoa and Accra typically arrive within 24–48 hours. Regional deliveries across Ghana take between 2 to 4 business days depending on your location. Coastal and remote areas may take longer.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We process payments securely using Mobile Money (MTN, Telecel, AT) via our Paystack integration. Cash on delivery is available for scheduled pickups in Kasoa. International transfers can be arranged on request.",
    },
    {
      q: "Can you source classical Arabic texts not in the store?",
      a: "Yes! Our Special Request Desk leverages wholesale networks in Nima, Accra and overseas suppliers to procure unlisted classical and contemporary Islamic titles. Contact us with your specific requirements.",
    },
    {
      q: "How do you ensure book authenticity?",
      a: "All books are sourced from authorized Islamic publishers and verified scholars. We maintain direct relationships with publishers to guarantee authenticity and quality. Every book comes with publication verification.",
    },
    {
      q: "Do you offer group discounts or bulk orders?",
      a: "Absolutely! We offer special pricing for educational institutions, study circles, and bulk orders. Contact our sales team directly via WhatsApp or email to discuss your requirements.",
    },
    {
      q: "What is your return or refund policy?",
      a: "Books can be returned within 14 days if damaged during delivery or if there's a defect. Returns must be in original condition. Contact support to initiate the return process.",
    },
  ];

  const contactChannels = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+233 20 213 1864",
      time: "Usually responds within 1-2 hours",
      link: whatsappLink,
      isPrimary: true,
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+233 20 213 1864",
      time: "Business hours: 9am - 6pm (Ghana Time)",
      link: "tel:+233202131864",
      isPrimary: false,
    },
    {
      icon: Mail,
      label: "Email",
      value: "support@alhikmah.com",
      time: "Responds within 24 hours",
      link: "mailto:support@alhikmah.com",
      isPrimary: false,
    },
  ];

  const responseTimeInfo = [
    { channel: "WhatsApp", time: "1-2 hours", icon: "⚡" },
    { channel: "Phone", time: "Same day", icon: "📞" },
    { channel: "Email", time: "24 hours", icon: "📧" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/alhikamhbookstore", color: "hover:text-pink-500" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/alhikamhbookstore", color: "hover:text-blue-500" },
    { name: "WhatsApp", icon: Smartphone, url: "https://wa.me/233202131864", color: "hover:text-green-500" },
  ];

  return (
    <main className="w-full bg-slate-950 text-white min-h-screen relative overflow-hidden selection:bg-emerald-500/30">
      {/* Subtle Visual Geometric Grid Layer */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <MessageCircle className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-serif tracking-tight text-slate-100">
            Get in Touch with <span className="text-emerald-400">Al-Hikmah</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto">
            Whether you have questions about our books, need support with an order, or want to explore custom sourcing options, our team is here to help and ready to assist.
          </p>
        </div>
      </section>

      {/* 2. PRIMARY CONTACT METHODS */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contactChannels.map((channel, idx) => {
          const Icon = channel.icon;
          return (
            <a
              key={idx}
              href={channel.link}
              target={channel.link.startsWith("http") ? "_blank" : undefined}
              rel={channel.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`group relative p-6 rounded-2xl border transition-all cursor-pointer ${
                channel.isPrimary
                  ? "md:col-span-3 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-800/40 hover:border-emerald-600/60"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Background accent */}
              {channel.isPrimary && (
                <div className="absolute right-0 top-0 text-emerald-900/10 font-mono font-black text-7xl select-none pointer-events-none translate-x-6 translate-y-2 group-hover:scale-105 transition-transform duration-500">
                  {channel.label === "WhatsApp" ? "WA" : "📞"}
                </div>
              )}

              <div className={`relative z-10 flex items-start gap-4 ${channel.isPrimary ? "md:flex-row md:items-center md:justify-between" : ""}`}>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2.5 border rounded-lg flex items-center justify-center ${
                        channel.isPrimary
                          ? "bg-slate-950 border-emerald-600/40 text-emerald-400"
                          : "bg-slate-950 border-slate-800 text-emerald-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-slate-100">{channel.label}</h3>
                      <p className={`text-xs font-medium ${channel.isPrimary ? "text-emerald-400" : "text-slate-400"}`}>
                        {channel.value}
                      </p>
                    </div>
                  </div>
                  <p className={`text-xs font-medium ${channel.isPrimary ? "text-slate-300" : "text-slate-500"}`}>
                    {channel.time}
                  </p>
                </div>

                {channel.isPrimary && (
                  <button className="flex-shrink-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/40 whitespace-nowrap">
                    Contact Now
                  </button>
                )}
              </div>
            </a>
          );
        })}
      </section>

      {/* 3. OFFICE LOCATION & HOURS */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-900/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location Card */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600/10 border border-emerald-600/20 rounded-lg">
                <MapPin className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold font-serif text-slate-100">Office Location</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300 font-medium">Al-Hikmah Islamic Bookstore</p>
              <p className="text-slate-400">Kasoa, Central Region</p>
              <p className="text-slate-400">Ghana</p>
              <p className="text-emerald-400 font-semibold mt-3">Pickup available on request</p>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600/10 border border-emerald-600/20 rounded-lg">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold font-serif text-slate-100">Business Hours</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Monday - Friday</span>
                <span className="text-slate-200 font-semibold">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Saturday</span>
                <span className="text-slate-200 font-semibold">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sunday</span>
                <span className="text-slate-200 font-semibold">Closed</span>
              </div>
              <p className="text-emerald-400 font-semibold mt-3 text-xs">WhatsApp available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESPONSE TIME EXPECTATIONS */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-900/60">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold font-serif text-slate-100">Expected Response Times</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">We aim to get back to you quickly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {responseTimeInfo.map((info, idx) => (
              <div key={idx} className="bg-slate-900/20 border border-slate-800 rounded-xl p-5 text-center space-y-3">
                <div className="text-3xl">{info.icon}</div>
                <h4 className="font-serif font-bold text-slate-200">{info.channel}</h4>
                <p className="text-sm font-semibold text-emerald-400">{info.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DUAL CORE INTERACTIVE BLOCK: FAQ & CONTACT FORM */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-slate-900/60">
        {/* LEFT COLUMN: FAQ (7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-serif text-slate-100">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Quick Answers to Common Questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/20 border border-slate-900 rounded-xl overflow-hidden transition-colors hover:border-slate-800">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-serif font-bold text-sm text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-300 flex-shrink-0 ${
                      openFaq === idx ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed font-medium border-t border-slate-900/40 pt-3 bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM (5 COLUMNS) */}
        <div className="lg:col-span-5 bg-slate-900/20 border border-slate-800 p-6 rounded-2xl space-y-5">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif text-slate-100">Send us a Message</h3>
            <p className="text-[11px] text-slate-500 font-medium">Fill the form and we&apos;ll get back to you shortly.</p>
          </div>

          {submitStatus === "success" && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-400">Message sent successfully!</p>
                <p className="text-xs text-emerald-300/80 mt-1">We&apos;ll respond to your inquiry shortly.</p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Failed to send message</p>
                <p className="text-xs text-red-300/80 mt-1">Please try again or contact us directly.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full h-11 px-4 rounded-lg border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-xs font-medium text-slate-200 placeholder-slate-600 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full h-11 px-4 rounded-lg border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-xs font-medium text-slate-200 placeholder-slate-600 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inquiry Type</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-xs font-medium text-slate-200 transition"
              >
                <option value="general">General Inquiry</option>
                <option value="order">Order Question</option>
                <option value="delivery">Delivery Issue</option>
                <option value="sourcing">Book Sourcing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us how we can help..."
                className="w-full p-4 rounded-lg border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-xs font-medium text-slate-200 placeholder-slate-600 transition resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* 6. SOCIAL MEDIA SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-900/60">
        <div className="space-y-6 text-center">
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-100">Follow Us</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">Stay updated with our latest titles and news</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-slate-900/40 border border-slate-800 rounded-lg hover:bg-slate-900/60 transition-all ${social.color}`}
                  title={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOOK REQUEST CTA COMPONENT EMBED */}
      <div className="relative z-10 border-t border-slate-900/60 bg-slate-950/40">
        <BookRequestCTA />
      </div>
    </main>
  );
}

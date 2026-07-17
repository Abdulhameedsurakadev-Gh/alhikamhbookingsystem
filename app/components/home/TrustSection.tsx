// app/components/home/TrustSection.tsx
import React from "react";
import { BookMarked, ShieldCheck, SearchCode, Truck, CreditCard, MessageCircle } from "lucide-react";

export function TrustSection() {
  // Expanded to 6 precise promises using the scholarly bookseller vocabulary
  const promises = [
    { 
      icon: BookMarked, 
      title: "Authentic Publications", 
      desc: "Carefully sourced editions from trusted Islamic publishers and recognized scholarly authorities." 
    },
    { 
      icon: ShieldCheck, 
      title: "Thoughtfully Curated", 
      desc: "A growing library specifically chosen to support meaningful Islamic learning at every stage." 
    },
    { 
      icon: SearchCode, 
      title: "Book Sourcing Service", 
      desc: "Looking for an advanced text or specific print? We trace and source titles from international suppliers." 
    },
    { 
      icon: Truck, 
      title: "Nationwide Delivery", 
      desc: "Reliable distribution across Kasoa, Accra, and all regional destinations throughout Ghana." 
    },
    { 
      icon: CreditCard, 
      title: "Secure Payments", 
      desc: "Safe, encrypted checkout powered by Paystack, supporting Mobile Money and local bank cards." 
    },
    { 
      icon: MessageCircle, 
      title: "Friendly Support", 
      desc: "Reach our customer desk directly via WhatsApp for personal assistance and classical title recommendations." 
    },
  ];

  return (
    /* 
      System Fit: 
      - Enclosed in a clean, quiet section layout separated by our major spacing tokens.
      - Uses a very faint border top separation line matching our Design System guidelines.
    */
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-border/40">
      
      {/* 1. Section Introduction Header: Adds deliberate intent and editorial weight */}
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-2">
        <h2 className="font-serif text-heading font-bold text-foreground">
          Why Readers Trust Al-Hikmah
        </h2>
        <p className="font-sans text-label text-muted-foreground leading-relaxed">
          A dedicated Islamic bookstore committed to authentic knowledge, dependable regional service, and a calm buying experience.
        </p>
      </div>

      {/* 2. Commitments Layout Grid: Refactored into a high-density, beautifully balanced grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {promises.map((promise, index) => {
          const Icon = promise.icon;
          return (
            <div key={index} className="flex gap-4 items-start group select-none">
              
              {/* 
                Icon Framing Strategy: 
                - Dropped loud green backgrounds.
                - Replaced with thin-stroke outline icons colored in primary brand clay.
                - Very subtle, fast background color shift on box hover state.
              */}
              <div className="p-2.5 rounded-sm bg-card border border-border/60 text-primary shrink-0 transition-colors duration-fast ease-standard group-hover:bg-secondary/20">
                <Icon className="w-4 h-4 stroke-[1.5]" />
              </div>
              
              {/* Text Matrix Content stack */}
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-xs text-foreground uppercase tracking-wider">
                  {promise.title}
                </h4>
                <p className="font-sans text-label text-muted-foreground leading-relaxed">
                  {promise.desc}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}

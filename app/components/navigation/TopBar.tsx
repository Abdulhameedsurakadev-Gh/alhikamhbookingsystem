// app/components/navigation/TopBar.tsx
"use client";

import React from "react";
import { Phone, MapPin, MessageCircle } from "lucide-react"; 

export function TopBar(): React.JSX.Element {
  const whatsappUrl = "https://wa.me/233202131864";

  return (
    <div className="w-full bg-background text-muted-foreground font-sans text-label select-none border-b border-border/50">
      {/* 
        System Fit: 
        - Height restricted strictly to h-8 (32px) for an understated, low-profile UI footprint.
        - Padding handles breathing room symmetrically via our standardized grid scale.
      */}
      <div className="mx-auto max-w-7xl h-8 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* LEFT COMPONENT: Trust & Human Assistance */}
        <div className="flex items-center gap-2">
          {/* System thin-stroke outline icon set to brand primary color */}
          <Phone className="h-3.5 w-3.5 text-primary stroke-[1.5]" />
          <span className="font-medium">
            Questions? Call us:{" "}
            <a 
              href="tel:+233202131864" 
              className="text-foreground hover:text-primary transition-colors duration-fast ease-standard font-medium"
            >
              +233 20 213 1864
            </a>
          </span>
        </div>

        {/* CENTRAL COMPONENT: Practical Regional Scope (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-2 font-medium">
          <MapPin className="h-3.5 w-3.5 text-primary stroke-[1.5]" />
          <span>Serving Kasoa & Greater Accra</span>
        </div>

        {/* RIGHT COMPONENT: Elegant, Integrated Conversion Link */}
        <div className="flex items-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors duration-fast ease-standard font-semibold"
            title="Chat or place an order directly via WhatsApp"
          >
            {/* Lucide alternative to branded SVG for unified visual consistency */}
            <MessageCircle className="h-3.5 w-3.5 text-primary stroke-[1.5]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}

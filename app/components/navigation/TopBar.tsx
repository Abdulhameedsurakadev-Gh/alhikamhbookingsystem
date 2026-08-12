"use client";

import React from "react";
import { Phone, MapPin, MessageCircle } from "lucide-react"; 

export function TopBar(): React.JSX.Element {
  const whatsappUrl = "https://wa.me/233202131864";

  return (
    <div className="w-full bg-background text-muted-foreground font-sans text-label select-none border-b border-border">
      {/* 
        System Fit: 
        - Height restricted to h-8 (32px) for a low-profile aesthetic signature.
        - Uses standard responsive horizontal grid padding layout rules.
      */}
      <div className="mx-auto max-w-7xl h-8 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* LEFT PANEL: Immediate Human Reassurance */}
        <div className="flex items-center gap-1.5 min-w-0">
          <Phone className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.5} />
          <span className="font-medium truncate">
            <span className="hidden sm:inline">Questions? Call: </span>
            <a 
              href="tel:+233202131864" 
              className="text-foreground hover:text-primary transition-colors duration-fast ease-standard"
            >
              +233 20 213 1864
            </a>
          </span>
        </div>

        {/* CENTRAL PANEL: Regional Identification Scope */}
        <div className="hidden lg:flex items-center gap-1.5 font-medium">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.5} />
          <span>Serving Kasoa & Greater Accra</span>
        </div>

        {/* RIGHT PANEL: Dedicated B2B & Customer WhatsApp Entrypoint */}
        <div className="flex items-center shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors duration-fast ease-standard font-medium sm:font-semibold"
            title="Connect with our bookseller via WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.5} />
            <span>
              <span className="hidden sm:inline">Chat on </span>WhatsApp
            </span>
          </a>
        </div>

      </div>
    </div>
  );
}

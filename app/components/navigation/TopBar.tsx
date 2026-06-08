// app/components/navigation/TopBar.tsx
"use client";

import React from "react";
import { Phone, MapPin } from "lucide-react"; 

export function TopBar(): React.JSX.Element {
  const whatsappUrl = "https://wa.me/233202131864";
  const facebookUrl = "https://www.facebook.com/share/1BK7WxoQhx"; 
  const tiktokUrl = "https://www.tiktok.com/@alhikmahbookstore?_r=1&_t=ZS-9714BzUkF0y"; 

  return (
    <div className="w-full bg-emerald-950 text-amber-50 text-[11px] font-medium tracking-wide border-b border-emerald-900/60 select-none">
      {/* Increased container height to h-10 to give larger icons breathing room */}
      <div className="mx-auto max-w-7xl h-10 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LEFT COMPONENT: Voice Call Link */}
        <div className="flex items-center gap-1.5">
          {/* Increased size: h-4 w-4 on mobile, h-5 w-5 on md screens and up */}
          <Phone className="h-4 w-4 md:h-5 md:w-5 text-emerald-400" />
          <a 
            href="tel:+233202131864" 
            className="hover:text-emerald-300 hover:underline transition-all font-mono"
          >
            Help Desk
          </a>
        </div>

        {/* CENTRAL COMPONENT: Location Tracking (Hidden on Mobile Viewports) */}
        <div className="hidden md:flex items-center gap-1.5 text-slate-300 font-serif">
          {/* Increased size to h-5 w-5 since this component only shows on desktop screens anyway */}
          <MapPin className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span>Kasoa, Ghana</span>
        </div>

        {/* RIGHT COMPONENT: Official Social Network Brand Triggers */}
        <div className="flex items-center gap-x-4">
          
          {/* Official Facebook Branding Mark */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:flex items-center gap-1.5 text-slate-300 hover:text-blue-500 transition-all"
            title="Follow Al-Hikmah on Facebook"
          >
            {/* Increased size: h-4 w-4 on mobile, h-5 w-5 on md screens and up */}
            <svg className="h-4 w-4 md:h-5 md:w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            <span className="md:inline font-semibold"></span>
          </a>

          {/* Official TikTok Branding Mark */}
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:flex items-center gap-1.5 text-slate-300 hover:text-pink-500 transition-all"
            title="Watch Al-Hikmah on TikTok"
          >
            {/* Increased size: h-4 w-4 on mobile, h-5 w-5 on md screens and up */}
            <svg className="h-4 w-4 md:h-5 md:w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.05 1.62 4.2 1.22 1.39 2.97 2.21 4.82 2.44v3.94c-1.7-.06-3.37-.58-4.78-1.53-.16-.11-.3-.24-.44-.37v5.52c0 1.96-.54 3.88-1.56 5.5-1.74 2.81-4.73 4.43-8.02 4.29-3.61-.15-6.84-2.82-7.69-6.33C-.4 14.1 1.7 10.04 5.33 8.76c1.1-.4 2.28-.5 3.44-.3V12.3c-.86-.18-1.77-.07-2.56.32-.99.49-1.65 1.53-1.69 2.65-.08 1.76 1.25 3.28 3.01 3.46 1.26.13 2.53-.44 3.19-1.51.34-.55.51-1.19.49-1.84V0c1-.02 1.5.02 1.5.02z" />
            </svg>
            <span className="md:inline font-semibold"></span>
          </a>

          {/* Official WhatsApp Branding Mark Platform Conversion Engine */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-800/50 hover:bg-emerald-800 px-3 py-1 rounded-lg border border-emerald-700/40 text-emerald-300 hover:text-white font-bold transition-all"
          >
            {/* Increased size: h-4 w-4 on mobile, h-5 w-5 on md screens and up */}
            <svg className="h-4 w-4 md:h-5 md:w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M18.403 5.633A8.919 8.919 0 0 0 12.008 3c-4.941 0-8.963 4.023-8.965 8.967a8.916 8.916 0 0 0 1.208 4.49L3 21l4.643-1.218a8.928 8.928 0 0 0 4.363 1.134h.004c4.94 0 8.962-4.024 8.964-8.969a8.917 8.917 0 0 0-2.571-6.314zm-6.395 12.427h-.003a7.443 7.443 0 0 1-3.798-1.041l-.272-.162-2.824.74.753-2.753-.177-.282a7.447 7.447 0 0 1-1.139-3.974c.002-4.105 3.342-7.445 7.451-7.445 1.99 0 3.86.775 5.266 2.182a7.402 7.402 0 0 1 2.179 5.27c-.002 4.107-3.343 7.448-7.436 7.448zm4.086-5.584c-.224-.112-1.326-.655-1.53-.73-.205-.074-.354-.112-.503.112-.149.224-.577.73-.708.88-.13.15-.26.168-.484.056-.224-.112-.947-.349-1.804-1.113-.667-.595-1.117-1.33-1.248-1.555-.13-.224-.014-.346.099-.457.101-.101.224-.262.336-.393.112-.131.149-.224.224-.374.075-.15.037-.281-.019-.393-.056-.112-.503-1.213-.689-1.661-.181-.435-.365-.376-.503-.383-.13-.007-.28-.007-.43-.007-.15 0-.393.056-.599.28-.205.224-.784.767-.784 1.87 0 1.102.801 2.167.912 2.317.112.15 1.575 2.405 3.816 3.373.533.23 1.054.341 1.414.455.535.17 1.02.146 1.405.089.429-.064 1.326-.542 1.512-1.066.186-.523.186-.972.13-.102-.055-.094-.204-.15-.428-.262z" />
            </svg>
            <span className="font-bold"></span>
          </a>

        </div>

      </div>
    </div>
  );
}

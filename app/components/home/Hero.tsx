"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden border-b border-emerald-900/30">
      {/* Subtle Visual Geometric Grid Layer */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Split Engine: Stacks vertically on mobile (Image first), unlocks side-by-side split on desktop */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* LEFT COLUMN: Core Content Block (50% Width on desktop) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono tracking-wider uppercase">
              Al-Hikmah Bookstore
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-slate-100 leading-tight">
              Authentic Islamic Books <br />
              <span className="text-emerald-400">For Students of Knowledge</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explore authentic works in Aqeedah, Fiqh, Hadith, Tafsir, Arabic Language, Seerah, and other Islamic sciences. Carefully selected from trusted publishers and scholars for students of knowledge.
            </p>

            {/* Navigation Button Layout Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 max-w-sm mx-auto sm:max-w-none">
              <Link 
                href="/books" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/20 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Browse Library
              </Link>
              <Link 
                href="#study-tracks" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-xl border border-slate-800 transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" /> Explore Curriculum
              </Link>
            </div>

            {/* Quick entry subject footer indicators */}
            <div className="pt-4 border-t border-slate-900/60 hidden sm:block">
              <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">
                Core Disciplines: <span className="text-slate-300 ml-1 font-sans font-semibold normal-case tracking-normal">Aqeedah • Fiqh • Hadith • Tafsir • Seerah</span>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Authentic Book Stack Media Block (50% Width on desktop) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] rounded-2xl bg-gradient-to-tr from-emerald-950/40 to-slate-900/40 border border-slate-800/60 shadow-2xl overflow-hidden flex items-center justify-center group">
              
              {/* Background gradient blur layout design */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/15 transition-colors duration-500" />
              
              {/* Clean, scholarly mockup stack representation vector layout built purely with clean Tailwind canvas properties */}
              <div className="relative flex flex-col items-center justify-end w-44 h-56 pb-4 space-y-1 z-10 transform group-hover:scale-[1.02] transition-transform duration-500">
                {/* Thick Volume Set Base */}
                <div className="w-40 h-8 bg-amber-950 rounded-md border-b-4 border-amber-900 shadow-lg flex items-center px-3 justify-between border-t border-slate-800/40">
                  <div className="w-1 h-full bg-amber-500/30" />
                  <span className="text-[9px] font-serif tracking-widest uppercase text-amber-200/50 font-bold">FIQH</span>
                  <div className="w-1 h-full bg-amber-500/30" />
                </div>
                {/* Middle Codex Volume */}
                <div className="w-36 h-7 bg-emerald-900 rounded-md border-b-4 border-emerald-950 shadow-md flex items-center px-3 justify-between border-t border-emerald-800/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                  <span className="text-[8px] font-mono tracking-wider text-emerald-300/60 font-bold">HADITH</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                </div>
                {/* Top Text Manuscript */}
                <div className="w-28 h-6 bg-red-950 rounded border-b-2 border-red-950 shadow flex items-center justify-center border-t border-red-900/30">
                  <span className="text-[8px] font-serif text-red-200/40 tracking-widest font-black uppercase">AQEEDAH</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

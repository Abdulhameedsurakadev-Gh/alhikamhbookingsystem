import React from "react";
import Link from "next/link";
import { ArrowRight, BookMarked, Layers, Award } from "lucide-react";

export function StudyLevels() {
  const levels = [
    { title: "Beginner (Mubtadi)", slug: "MUBTADI", icon: BookMarked, desc: "Foundational, short manual editions and texts to grasp basic definitions safely.", border: "hover:border-emerald-500", iconColor: "text-emerald-500" },
    { title: "Intermediate (Mutawassit)", slug: "MUTAWASSIT", icon: Layers, desc: "Expanded explanations (Sharh), variant reasoning models, and textual drill-downs.", border: "hover:border-blue-500", iconColor: "text-blue-500" },
    { title: "Advanced (Mutaqaddim)", slug: "MUTAQADDIM", icon: Award, desc: "Comparative evaluation literature, deep critical verification text scripts, and multifold volume sets.", border: "hover:border-rose-500", iconColor: "text-rose-500" },
  ];

  return (
    <div id="study-tracks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
      <div>
        <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 tracking-tight">Structured Curriculums</h2>
        <p className="text-xs text-slate-500 mt-0.5">Filter the entire bookstore catalog directly matching your structural understanding level.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((lvl, index) => {
          const Icon = lvl.icon;
          return (
            <Link
              key={index}
              href={`/books?level=${lvl.slug}`}
              className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all group flex flex-col justify-between space-y-4 ${lvl.border}`}
            >
              <div className="space-y-2">
                <div className={`w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center ${lvl.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 font-serif">{lvl.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{lvl.desc}</p>
              </div>

              <div className="pt-2 text-xs font-bold text-slate-400 group-hover:text-slate-800 flex items-center gap-1 transition-colors">
                Inspect Syllabus <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

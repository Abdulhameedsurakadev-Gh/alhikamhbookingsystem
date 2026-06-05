import React from "react";
import Link from "next/link";
import { Quote } from "lucide-react";

interface ScholarNode {
  id: string;
  name: string;
  nameArabic: string | null;
  diedAH: string | null;
}

export function FeaturedScholars({ scholars }: { scholars: ScholarNode[] }) {
  return (
    <div className="bg-slate-950 py-12 text-white border-y border-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-100 tracking-tight">Featured Islamic Scholars</h2>
          <p className="text-xs text-slate-400 mt-0.5">Browse collections organized by renowned scholars and authors whose works have shaped Islamic scholarship.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scholars.map((sch) => (
            <div key={sch.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5 relative">
                <Quote className="w-8 h-8 text-emerald-500/10 absolute -top-2 -left-2" />
                <h4 className="font-serif font-bold text-base text-slate-200">{sch.name}</h4>
                {sch.nameArabic && (
                  <p className="text-sm font-arabic text-emerald-400 font-medium" dir="rtl">{sch.nameArabic}</p>
                )}
                {sch.diedAH && (
                  <p className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">Died: {sch.diedAH} AH</p>
                )}
              </div>

              <Link
                href={`/books?authorId=${sch.id}`}
                className="inline-flex w-full items-center justify-center py-2 bg-slate-950 hover:bg-emerald-600 border border-slate-800 text-xs font-bold rounded-lg text-slate-300 hover:text-white transition-all"
              >
                View Compiled Works
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

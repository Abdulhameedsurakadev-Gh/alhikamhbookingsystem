import React from "react";
import { ShieldCheck, Sparkles, Truck, Lock } from "lucide-react";

export function TrustSection() {
  const points = [
    { icon: Sparkles, title: "Authentic Texts", desc: "Authentic editions sourced from trusted publishers and recognized scholarly traditions." },
    { icon: ShieldCheck, title: "Curated Selection", desc: "Carefully selected works supporting structured Islamic learning and personal study." },
    { icon: Truck, title: "Nationwide Logistics", desc: "Reliable delivery across Kasoa, Accra, and selected locations throughout Ghana." },
    { icon: Lock, title: "Secure Paystack Gate", desc: "Secure payments powered by Paystack, supporting Mobile Money, Visa, and Mastercard." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map((pt, index) => {
          const Icon = pt.icon;
          return (
            <div key={index} className="flex gap-3.5 items-start">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/10 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">{pt.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{pt.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

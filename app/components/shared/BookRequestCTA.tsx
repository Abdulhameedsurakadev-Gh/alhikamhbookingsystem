// app/components/shared/BookRequestCTA.tsx
"use client";

import React from "react";
import { MessageCircle, Check, BookOpen } from "lucide-react";

export function BookRequestCTA(): React.JSX.Element {
  const whatsappBaseUrl = "https://wa.me/233202131864";
  const message = "Assalamu Alaikum. I am looking for a book that I could not find on the Al-Hikmah website.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `${whatsappBaseUrl}?text=${encodedMessage}`;

  const trustIndicators = [
    "Sourced from traditional and contemporary Islamic publishers",
    "Covers classical creed, jurisprudence, and advanced research",
    "Provide title, author, or a photograph of the book cover",
    "Reliable nationwide courier delivery across Ghana available",
  ];

  const executionSteps = [
    { num: "1", text: "Send details via WhatsApp" },
    { num: "2", text: "We verify supplier availability" },
    { num: "3", text: "Receive price & shipping quote" },
    { num: "4", text: "Confirm and finalize order" },
  ];

  return (
    <section className="w-full bg-background py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-border/40">
      <div className="mx-auto max-w-5xl bg-card border border-border rounded-md shadow-subtle relative overflow-hidden">

        <div className="flex flex-col lg:flex-row items-stretch justify-between p-6 sm:p-10 lg:p-12 gap-10">

          <div className="w-full lg:max-w-xl flex flex-col justify-between space-y-6 text-center lg:text-left">

            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
                Book Search Service
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-heading font-bold font-serif text-foreground leading-tight">
                Looking for a Specific Book We Don&apos;t Have Yet?
              </h2>
              <p className="text-muted-foreground text-body leading-relaxed max-w-lg mx-auto lg:mx-0">
                If a necessary title or scholarly research work is missing from our current catalogue, please let us know. We coordinate directly with traditional suppliers to trace and source the exact text you need.
              </p>
            </div>

            {/*
              Before: hover:bg-primary/90
              After:  hover:bg-primary-hover
              Third repeat of this exact fraction across your components
              (Hero had it twice) — now it's a named decision instead of
              a number someone has to remember and retype identically.
            */}
            <div className="pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-medium text-label rounded-sm shadow-none transition-colors duration-fast ease-standard group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <MessageCircle className="h-4 w-4 fill-none stroke-[1.75]" />
                <span>Request via WhatsApp</span>
              </a>
              <p className="text-xs text-muted-foreground mt-2 font-medium tracking-wide">
                Replies are typically sent within a few hours.
              </p>
            </div>

            <div className="pt-6 border-t border-border/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto lg:mx-0">
                {trustIndicators.map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-label text-muted-foreground font-medium">
                    <Check className="h-4 w-4 text-primary stroke-[2.5] flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="w-full lg:w-72 flex flex-col justify-between bg-background p-6 rounded-sm border border-border/80 flex-shrink-0">

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
              <div className="p-2.5 bg-card border border-border rounded-sm inline-block text-primary">
                <BookOpen className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-title text-foreground">Direct Procurement</h3>
                <p className="text-label text-muted-foreground leading-normal mt-1">
                  Supporting students, scholars, and institutions in acquiring specialized foundational learning materials.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 space-y-3">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground text-center lg:text-left">
                How It Works
              </h4>
              <ol className="space-y-2.5">
                {executionSteps.map((step) => (
                  <li key={step.num} className="flex items-center gap-3 text-label text-muted-foreground font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold">
                      {step.num}
                    </span>
                    <span className="leading-none">{step.text}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
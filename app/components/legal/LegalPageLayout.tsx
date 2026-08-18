// components/legal/LegalPageLayout.tsx

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { LegalTableOfContents, type LegalTocItem } from "./LegalTableOfContents";

interface LegalPageLayoutProps {
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  tocItems: LegalTocItem[];
  relatedHref: string;
  relatedLabel: string;
  children: ReactNode;
}

/**
 * Shared shell for /privacy and /terms.
 *
 * Two-column on desktop (sticky TOC + ~700-800px article), single column
 * with a collapsible TOC on mobile. Content is intentionally left to
 * flow as text rather than sit inside cards — see design system §4 and
 * the accompanying legal-page notes.
 */
export function LegalPageLayout({
  breadcrumbLabel,
  eyebrow,
  title,
  description,
  lastUpdated,
  tocItems,
  relatedHref,
  relatedLabel,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10 font-sans text-xs text-muted-foreground">
          <Link href="/" className="transition-colors duration-fast hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-foreground">{breadcrumbLabel}</span>
        </nav>

        {/* Header */}
        <header className="max-w-3xl border-b border-border pb-10">
          <p className="font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 font-sans text-base leading-7 text-muted-foreground">
            {description}
          </p>

          <p className="mt-6 font-sans text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </header>

        {/* Content */}
        <div className="mt-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
          <div className="mb-8 lg:mb-0">
            <div className="lg:sticky lg:top-24">
              <LegalTableOfContents items={tocItems} />
            </div>
          </div>

          <article className="max-w-3xl space-y-10">{children}</article>
        </div>

        {/* Related legal page */}
        <div className="mt-16 max-w-3xl border-t border-border pt-8 lg:ml-[236px]">
          <Link
            href={relatedHref}
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary transition-colors duration-fast hover:text-primary/80"
          >
            {relatedLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
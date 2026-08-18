// components/legal/LegalSection.tsx

import type { ReactNode } from "react";

/**
 * A single numbered-in-spirit section of a legal document.
 *
 * Deliberately not a card: legal pages read better as flowing text with
 * generous whitespace than as a stack of boxed panels (see design system,
 * §12 Cards — cards are for catalog/dashboard content, not prose).
 */
export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
        {title}
      </h2>

      <div className="mt-4 space-y-4 font-sans text-[15px] leading-7 text-foreground/90 sm:text-base [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_strong]:font-medium [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
// components/legal/LegalTableOfContents.tsx

export interface LegalTocItem {
  id: string;
  label: string;
}

/**
 * "On this page" navigation for legal documents.
 *
 * Desktop (lg+): quiet sticky list with a hairline rail, no box around it.
 * Mobile: collapses into a single <details> accordion so the article
 * starts immediately instead of pushing content below a long list.
 */
export function LegalTableOfContents({ items }: { items: LegalTocItem[] }) {
  return (
    <>
      {/* Desktop */}
      <nav aria-label="On this page" className="hidden lg:block">
        <p className="font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </p>

        <ul className="mt-4 space-y-1 border-l border-border">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 font-sans text-sm text-muted-foreground transition-colors duration-fast hover:border-primary hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile */}
      <details className="rounded-sm border border-border bg-background lg:hidden">
        <summary className="cursor-pointer select-none px-4 py-3 font-sans text-sm font-medium text-foreground">
          On this page
        </summary>

        <ul className="border-t border-border px-4 py-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block py-2 font-sans text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
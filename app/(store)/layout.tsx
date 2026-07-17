// app/(store)/layout.tsx
import React from "react";
import { headers } from "next/headers";
import { auth } from "../../lib/auth"; 
import { TopBar } from "../components/navigation/TopBar";
import { Navbar } from "../components/navigation/Navbar";
import { Footer } from "../components/navigation/Footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ Strict Server-Side Session Fetching
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    /* 
      System Fit: 
      - Swapped 'bg-slate-50' for our premium book-paper canvas background token.
      - Body naturally inherits 'text-foreground' for deep coffee-brown readability.
    */
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased">
      
      {/* 
        1. THE UNIFIED NAVIGATION DECK
        The TopBar flows naturally while the Navbar sticky envelope stays anchored.
      */}
      <div className="w-full flex flex-col z-40 bg-background">
        <TopBar />
        <div className="sticky top-0 w-full border-b border-border/40 backdrop-blur-md bg-background/95">
          {/* 
            Strict Type Mapping: 
            Instead of casting 'session as any', we pass it safely. 
            (Ensure your Navbar component file matches this strict signature next)
          */}
          <Navbar session={session} />
        </div>
      </div>

      {/* 
        2. MAIN RENDERING REGION
        Removed fixed 'max-w-7xl', 'px-4', and 'py-8' layout constraints.
        The main element is now an open container. Individual pages inside the catalog, 
        checkout, or book detail views will control their own layout density and spacing.
      */}
      <main className="flex-1 flex flex-col focus:outline-none">
        {children}
      </main>

      {/* 
        3. CLOSING CHAPTER
        The structural footer boundaries cap off the layout canvas page.
      */}
      <Footer />
    </div>
  );
}

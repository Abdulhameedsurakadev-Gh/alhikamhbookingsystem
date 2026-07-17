// app/(store)/layout.tsx
import React from "react";
import { headers } from "next/headers";
import { auth } from "../../lib/auth"; 
import { getNavigationMetadata } from "@/services/homepage"; // ✅ Imports our parallel metadata service
import { TopBar } from "../components/navigation/TopBar";
import { Navbar } from "../components/navigation/Navbar";
import { Footer } from "../components/navigation/Footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🏎️ Parallel Orchestration Layer: Fire database session and navbar details at the exact same moment
  const [sessionData, navData] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getNavigationMetadata()
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased">
      
      {/* 1. THE UNIFIED NAVIGATION DECK */}
      <div className="w-full flex flex-col z-40 bg-background">
        <TopBar />
        <div className="sticky top-0 w-full border-b border-border/40 backdrop-blur-md bg-background/95">
          {/* 
            ✅ PERFECT SIGNATURE MATCHING:
            We pass the session, categories, and featuredAuthors down cleanly.
            This completely satisfies the Navbar type checks for Turbopack.
          */}
          <Navbar 
            session={sessionData} 
            categories={navData.categories} 
            featuredAuthors={navData.featuredAuthors} 
          />
        </div>
      </div>

      {/* 2. MAIN MATERIAL READING REGION */}
      <main className="flex-1 flex flex-col focus:outline-none">
        {children}
      </main>

      {/* 3. CLOSING CHAPTER */}
      <Footer />
    </div>
  );
}

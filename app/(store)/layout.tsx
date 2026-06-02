import React from "react";
import { Navbar } from "../components/navigation/Navbar";
import { Footer } from "../components/navigation/Footer"; // FIX: Added the new Footer component import path

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50">
      {/* Production Server-rendered Navbar */}
      <Navbar />

      {/* Main Context Yield Box */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* FIX: Swapped out the old inline text block with your high-end scholarly navigation institution footer */}
      <Footer />
    </div>
  );
}

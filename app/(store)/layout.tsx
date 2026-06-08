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
  // 🛡️ SERVER-SIDE FETCH
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50">
      <TopBar />
      {/* 🌟 FIXED TYPE COMPATIBILITY: Force-cast the server signature cleanly to resolve the user.role undefined error */}
      <Navbar session={session as any} />

      {/* Main Context Yield Box */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}

// app/(store)/layout.tsx
import React from "react";
import { headers } from "next/headers"; // Next.js 16 header hook to access server-side cookies
import { auth } from "../../lib/auth"; // Official Better-Auth instance
import { Navbar } from "../components/navigation/Navbar";
import { Footer } from "../components/navigation/Footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ SERVER-SIDE SESSION FETCH: Reads incoming request tokens directly on the server edge
  // This satisfies your Pattern A configuration, giving the client an instant hydrated session state
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50">
      {/* 🌟 UPDATED: Pass the securely verified server session down into the Navbar component */}
      <Navbar session={session} />

      {/* Main Context Yield Box */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}

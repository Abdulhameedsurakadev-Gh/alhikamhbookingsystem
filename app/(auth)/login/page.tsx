// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client"; // Unified client bridge
import { useCartStore } from "../../../store/useCartStore";
import { BookOpen, ShieldAlert, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const guestItems = useCartStore((state) => state.items);
  const clearGuestCart = useCartStore((state) => state.clearCart);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Map current Zustand local state array into a tracking layout for potential server syncing
    const mappedGuestCart = guestItems.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    try {
      // 🛡️ DIRECT FRONTEND CLIENT AUTHENTICATION INVOCATION
      const { data, error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setError(authError.message || "Invalid authentication credentials.");
        setLoading(false);
        return;
      }

      // =========================================================================
      // 🛒 OPTIONAL BUSINESS LOGIC: Sync mappedGuestCart to database here via api if needed
      // =========================================================================
      
      // Clear guest client state once successfully authenticated into PostgreSQL backend
      clearGuestCart();
      
      // Forces clear session caching context across Server Components matching your original layout intent
      window.location.href = "/cart"; 
    } catch (err) {
      setError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      
      {/* LEFT ASPECT PANEL: Decorative Islamic Art / Scholarly Backdrop (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-emerald-950 text-amber-100 flex-col justify-between p-12 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Preserving Knowledge</span>
          <h2 className="font-serif text-3xl font-bold tracking-tight">Al-Hikmah Bookstore</h2>
        </div>
        <div className="relative z-10">
          <p className="font-serif italic text-lg leading-relaxed text-emerald-100/90">
            "Seeking knowledge is an obligation upon every Muslim."
          </p>
          <p className="text-xs text-emerald-400 mt-2 font-medium font-mono">— Sunan Ibn Majah</p>
        </div>
        {/* Subtle geometric pattern layer overlay backgrounds */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fcd34d_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* RIGHT ASPECT PANEL: Single-Column Responsive Authentication Core Layout Form */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 lg:hidden">
              <BookOpen className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-serif font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-400">Sign in to access your saved books, orders, and persistent study catalog charts.</p>
          </div>

          {/* Validation Failure Flash Panel Alert Container */}
          {error && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs font-medium text-rose-700 animate-in fade-in duration-200">
              <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="student@knowledge.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</label>
                <Link href="/forgot" className="text-xs font-semibold text-emerald-700 hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
              />
            </div>

            {/* 🌟 FIXED: Kept the primary action clean and moved guest button out of the element tree safely */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold py-3.5 px-6 rounded-xl shadow-md transition text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validating Identity...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <Link
              href="/books"
              className="mt-3 block w-full text-center border border-slate-200 hover:border-emerald-600 bg-white text-slate-700 hover:text-emerald-800 font-bold py-3 px-6 rounded-xl shadow-sm transition text-xs tracking-wide cursor-pointer"
            >
              Browse as Guest →
            </Link>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link href="/signup" className="font-bold text-emerald-800 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

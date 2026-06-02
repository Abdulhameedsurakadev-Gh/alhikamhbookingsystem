// app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUserAction } from "../actions";
import { useCartStore } from "../../../store/useCartStore";
import { BookOpen, ShieldAlert, Loader2, UserPlus } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const guestItems = useCartStore((state) => state.items);
  const clearGuestCart = useCartStore((state) => state.clearCart);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      setLoading(false);
      return;
    }

    const mappedGuestCart = guestItems.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    try {
      const res = await registerUserAction(formData, mappedGuestCart);

      if (!res.success) {
        setError(res.message);
        setLoading(false);
      } else {
        clearGuestCart();
        window.location.href = "/cart"; // Redirects straight to your cart after successful registration
      }
    } catch (err) {
      setError("An unexpected error occurred during profile registration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      
      {/* LEFT DESIGN CANVAS PANEL: (Hidden on Mobile viewports) */}
      <div className="hidden lg:flex lg:col-span-5 bg-emerald-950 text-amber-100 flex-col justify-between p-12 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Join the Circle</span>
          <h2 className="font-serif text-3xl font-bold tracking-tight">Al-Hikmah Bookstore</h2>
        </div>
        <div className="relative z-10">
          <p className="font-serif italic text-lg leading-relaxed text-emerald-100/90">
            "He who treads a path in search of knowledge, Allah will make that path to Paradise easy for him."
          </p>
          <p className="text-xs text-emerald-400 mt-2 font-medium font-mono">— Sahih Muslim</p>
        </div>
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fcd34d_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* RIGHT COMPONENT PANEL: Clean Responsive Onboarding Input Form */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 lg:hidden">
              <BookOpen className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-serif font-extrabold text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-xs text-slate-400">Join Al-Hikmah to synchronize and preserve your study catalog orders.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs font-medium text-rose-700 animate-in fade-in duration-200">
              <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Abdullah ibn Ali"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
              />
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-700 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-bold py-3.5 px-6 rounded-xl shadow-md transition text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Create Student Profile</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-800 hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

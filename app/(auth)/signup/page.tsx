"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { useCartStore } from "../../../store/useCartStore";
import { BookOpen, ShieldAlert, Loader2, UserPlus } from "lucide-react";
import { mergeGuestCartToDatabase } from "../../(store)/cart/actions";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const guestItems = useCartStore((state) => state.items);
  const clearGuestCart = useCartStore((state) => state.clearCart);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (name.length < 2) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    const mappedGuestCart = guestItems.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email: email.trim(),
        password: password,
        name: name,
      });

      if (authError) {
        setError(authError.message || "Failed to create account. Email may already be in use.");
        return;
      }

      // Merge BEFORE clearing — correct order, kept exactly as-is.
      if (data?.user?.id && mappedGuestCart.length > 0) {
        await mergeGuestCartToDatabase(data.user.id, mappedGuestCart);
      }

      clearGuestCart();

      // Same tradeoff as Login: router.replace() should pick up the fresh
      // session correctly, but if checkout ever briefly shows logged-out
      // right after signup, that's a cookie-timing race — reverting to
      // window.location.href is the pragmatic fix.
      router.replace("/checkout");
    } catch {
      setError("An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:col-span-5 bg-primary text-primary-foreground flex-col justify-between p-12 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Join the Circle</span>
          <h2 className="font-serif text-heading font-bold tracking-tight">Al-Hikmah Bookstore</h2>
        </div>
        <div className="relative z-10 space-y-1">
          <p className="font-serif italic text-title leading-relaxed text-primary-foreground/90">
            &ldquo;He who treads a path in search of knowledge, Allah will make that path to Paradise easy for him.&rdquo;
          </p>
          <p className="text-xs text-primary-foreground/70 font-medium">Prophet Muhammad ﷺ</p>
          <p className="text-xs text-primary-foreground/50">(Sahih Muslim)</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-card border border-border rounded-md p-6 sm:p-10">
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-secondary text-primary lg:hidden">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="text-heading font-serif font-extrabold text-foreground tracking-tight">Create Account</h1>
            <p className="text-xs text-muted-foreground">Create an account to place orders, track deliveries, and save your cart across devices.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 p-3 rounded-sm text-xs font-medium text-destructive animate-in fade-in duration-200">
              <ShieldAlert className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Full Name</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                required
                disabled={loading}
                placeholder="Abdullah ibn Ali"
                className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email Address</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                required
                disabled={loading}
                placeholder="student@knowledge.com"
                className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="signup-confirm-password" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Confirm Password</label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  name="confirmPassword"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground -mt-2">At least 8 characters.</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3.5 px-6 rounded-sm transition-colors duration-fast ease-standard text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
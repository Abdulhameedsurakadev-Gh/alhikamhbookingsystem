"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { useCartStore } from "../../../store/useCartStore";
import { BookOpen, ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import { mergeGuestCartToDatabase } from "../../(store)/cart/actions";

export default function LoginPage() {
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
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const mappedGuestCart = guestItems.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setError(authError.message || "Invalid authentication credentials.");
        return;
      }

      // Merge BEFORE clearing — correct order, keeps this intact exactly as-is.
      if (data?.user?.id && mappedGuestCart.length > 0) {
        await mergeGuestCartToDatabase(mappedGuestCart);
      }

      clearGuestCart();

      // router.replace() re-fetches checkout's Server Component data fresh
      // from the server, so it should pick up the new session correctly.
      // If checkout ever briefly shows a logged-out state right after
      // login, that's a cookie-timing race — reverting this one line to
      // window.location.href is the pragmatic fix.
      router.replace("/checkout");
    } catch {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:col-span-5 bg-primary text-primary-foreground flex-col justify-between p-12 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Preserving Knowledge</span>
          <h2 className="font-serif text-heading font-bold tracking-tight">Al-Hikmah Bookstore</h2>
        </div>
        <div className="relative z-10 space-y-1">
          <p className="font-serif italic text-title leading-relaxed text-primary-foreground/90">
            &ldquo;Seeking knowledge is an obligation upon every Muslim.&rdquo;
          </p>
          <p className="text-xs text-primary-foreground/70 font-medium">Prophet Muhammad ﷺ</p>
          <p className="text-xs text-primary-foreground/50">(Sunan Ibn Majah)</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-card border border-border rounded-md p-6 sm:p-10">
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-secondary text-primary lg:hidden">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="text-heading font-serif font-extrabold text-foreground tracking-tight">Welcome Back</h1>
            <p className="text-xs text-muted-foreground">Sign in to view your orders, saved cart, and account.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 p-3 rounded-sm text-xs font-medium text-destructive animate-in fade-in duration-200">
              <ShieldAlert className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                required
                disabled={loading}
                placeholder="student@knowledge.com"
                className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Password</label>
                <Link href="/forgot" className="text-xs font-semibold text-primary hover:underline">Forgot Password?</Link>
              </div>
              <input
                id="login-password"
                type="password"
                name="password"
                required
                disabled={loading}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors duration-fast disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold py-3.5 px-6 rounded-sm transition-colors duration-fast ease-standard text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Validating Identity...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>

            <Link
              href="/books"
              className="mt-3 block w-full text-center border border-border hover:border-border-hover bg-card text-foreground hover:text-primary-hover font-bold py-3 px-6 rounded-sm transition-colors duration-fast text-xs tracking-wide cursor-pointer"
            >
              Browse as Guest →
            </Link>
          </form>

          <div className="text-center pt-2 border-t border-border text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
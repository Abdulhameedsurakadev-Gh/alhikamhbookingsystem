// app/(admin)/admin/login/page.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../../lib/auth-client"; // 🌟 FIXED: Unified Better-Auth client instance
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen, ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      // 🛡️ DIRECT FRONTEND CLIENT ADMIN SIGN-IN INVOCATION
      const { data, error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setError(authError.message || "Authentication failure");
        return;
      }

      // 🛡️ CYBERSECURITY PRIVILEGE BOUNDARY ENFORCEMENT
      // Better-Auth instantly tracks user object attributes locally right after success
      if (data?.user?.role === "ADMIN") {
        // Pushes directly past the middleware proxy block into the main admin dashboard
        router.push("/admin");
        router.refresh();
      } else {
        setError("Access Denied: Your profile does not possess administrative privileges.");
        // Instantly wipe the local customer cookie to maintain strict security hygiene
        await authClient.signOut();
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-8 shadow-2xl">
        
        {/* Branding Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600/20 p-3 rounded-xl text-emerald-400 mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 uppercase tracking-wider">Al-Hikmah HQ</h1>
          <p className="text-xs text-slate-400 mt-1">Terminal Secure Authentication Gate</p>
        </div>

        {/* Error Banners */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2.5 text-xs text-red-400 font-medium">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[11px] text-slate-400 uppercase tracking-widest">Master Email Address</Label>
            <Input 
              required 
              type="email" 
              name="email" 
              className="bg-slate-900 border-slate-800 text-slate-100 h-11 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
              placeholder="admin@alhikmah.com" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] text-slate-400 uppercase tracking-widest">Security Password Access</Label>
            <Input 
              required 
              type="password" 
              name="password" 
              className="bg-slate-900 border-slate-800 text-slate-100 h-11 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
              placeholder="••••••••" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold tracking-wide transition-all mt-2 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Identity...
              </span>
            ) : (
              "Verify Identity"
            )}
          </Button>
        </form>
        
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "../../../store/useCartStore";
import { authClient } from "../../../lib/auth-client"; // 🌟 FIXED: Unified frontend client bridge
import { ShoppingCart, Menu, X, Search, User, LogOut, ClipboardList, Shield } from "lucide-react";

// 🛡️ UPDATED PROPS: Adapting interface type mapping bounds to Better-Auth user model objects
interface NavActionsProps {
  categories: { id: string; name: string; slug: string; parentId: string | null }[];
  session: {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: "CUSTOMER" | "ADMIN";
    };
  } | null;
}

export function NavActions({ categories, session }: NavActionsProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // =========================================================================
  // ⚡ FIX: React 19 Hydration safe state fetch for Navbar basket indicator
  // =========================================================================
  const getTotals = useCartStore((state) => state.getTotals);
  const cartItems = useCartStore((state) => state.items); 
  
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    setCartItemsCount(getTotals().totalItems);
  }, [cartItems, getTotals]); 

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/books?search=${encodeURIComponent(searchQuery)}`;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      // 🛡️ BETTER-AUTH NATIVE CLIENT LOGOUT DESTRUCTION CALL
      await authClient.signOut();
      
      setIsProfileOpen(false);
      setIsOpen(false);
      
      // Full page push guarantees cookie state sync across layout wrapper boundaries
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout execution error:", error);
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Central Integrated Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-4">
        <input
          type="text"
          placeholder="Search books, authors, ISBN (e.g., Riyad as-Salihin)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-100 text-slate-900 pl-10 pr-4 py-2 rounded-full border border-transparent focus:outline-none focus:border-emerald-600 focus:bg-white text-xs font-medium transition"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
      </form>

      {/* Right Side System Operations Icons */}
      <div className="flex items-center gap-x-4">
        {/* Shopping Cart Indicator */}
        <Link href="/cart" className="relative p-2 text-slate-700 hover:text-emerald-800 transition">
          <ShoppingCart className="h-6 w-6" />
          {/* Uses hydration protection checks to stop server/client mismatches */}
          {isMounted && cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white px-1">
              {cartItemsCount}
            </span>
          )}
        </Link>

        {/* PROFILE / AUTHENTICATION TOGGLE BLOCK */}
        {session && session.user ? (
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-800 transition cursor-pointer bg-transparent border-0"
            >
              <div className="h-7 w-7 bg-emerald-800 text-amber-100 flex items-center justify-center rounded-full font-serif text-xs uppercase shadow-sm">
                {session.user.email.substring(0, 2)}
              </div>
              <span className="max-w-[100px] truncate text-xs font-semibold text-slate-700">Account</span>
              <span className="text-[9px] text-slate-400">▼</span>
            </button>

            {/* Profile Dropdown Drawer Card */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-xs text-slate-700 animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                  <p className="font-bold text-slate-800 truncate">{session.user.email}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">{session.user.role}</p>
                </div>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700">
                    <Shield className="h-4 w-4 text-emerald-700" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link href="/account/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700">
                  <ClipboardList className="h-4 w-4 text-slate-400" />
                  <span>My Study Orders</span>
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold cursor-pointer bg-transparent border-0"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout Session</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-emerald-800 transition">
            <User className="h-5 w-5" />
            <span>Sign In</span>
          </Link>
        )}

        {/* Mobile View Toggle Switch Button Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-700 lg:hidden hover:text-emerald-800 focus:outline-none bg-transparent border-0 cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Slide-out Mobile Layout Menu Drawer Overlays */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 flex flex-col p-4 gap-y-4 lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto text-sm font-medium text-slate-800">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 pl-10 pr-4 py-2 rounded-md border border-transparent text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </form>

          <div className="flex flex-col gap-y-3 divide-y divide-slate-100">
            <Link href="/" onClick={() => setIsOpen(false)} className="pt-2">Home</Link>
            <Link href="/books" onClick={() => setIsOpen(false)} className="pt-2">All Catalog Books</Link>
            
            {session && session.user ? (
              <div className="pt-3 space-y-2.5 flex flex-col">
                <span className="text-xs text-slate-400 font-bold uppercase block">Student Session ({session.user.email})</span>
                <Link href="/account/orders" onClick={() => setIsOpen(false)} className="block pl-2 text-slate-600 pt-1">My Orders</Link>
                {session.user.role === "ADMIN" && <Link href="/admin" onClick={() => setIsOpen(false)} className="block pl-2 text-emerald-800 font-bold pt-1">Admin Dashboard</Link>}
                <button onClick={handleLogout} className="w-full text-left pl-2 text-rose-600 font-bold bg-transparent border-0 pt-2 cursor-pointer">Logout Session</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="pt-3 text-emerald-800 font-bold">Sign In to Profile</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

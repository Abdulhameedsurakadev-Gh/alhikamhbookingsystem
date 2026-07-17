// app/components/navigation/NavActions.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "../../../store/useCartStore";
import { authClient } from "../../../lib/auth-client";
import { ShoppingCart, Menu, X, Search, User, LogOut, ClipboardList, Shield } from "lucide-react";

interface NavActionsProps {
  categories: Array<{ id: string; name: string; slug: string; parentId: string | null }>;
  session: {
    user: {
      id: string;
      email: string;
      name: string | null;
      role?: string | null;
    };
  } | null;
}

export function NavActions({ categories, session }: NavActionsProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    window.location.href = `/books?search=${encodeURIComponent(searchQuery.trim())}`;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await authClient.signOut();
      setIsProfileOpen(false);
      setIsOpen(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout execution error:", error);
      window.location.href = "/";
    }
  };

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <>
      {/* Search Input Box Frame */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-4">
        <input
          type="text"
          placeholder="Search books, classical authors, or subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card text-foreground pl-10 pr-4 py-2 rounded-sm border border-border outline-none text-label placeholder:text-muted-foreground/50 transition-all duration-normal ease-standard focus:border-primary focus:bg-background focus:ring-2 focus:ring-focus-ring"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 stroke-[1.5]" />
      </form>

      <div className="flex items-center gap-x-4 select-none">
        
        {/* Shopping Cart Trigger Icon */}
        <Link 
          href="/cart" 
          className="relative p-2 text-foreground hover:text-primary-hover transition-colors duration-fast ease-standard"
          aria-label="View shopping cart"
        >
          <ShoppingCart className="h-5 w-5 stroke-[1.75]" />
          {isMounted && cartItemsCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-sm bg-primary text-[9px] font-bold text-primary-foreground px-1">
              {cartItemsCount}
            </span>
          )}
        </Link>

        {/* User Account Access Trigger Modules */}
        {session && session.user ? (
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 text-label font-medium text-foreground hover:text-primary-hover transition-colors duration-fast ease-standard cursor-pointer bg-transparent border-0 outline-none group"
            >
              <div className="h-6 w-6 bg-secondary text-secondary-foreground flex items-center justify-center rounded-sm font-serif text-[11px] font-bold uppercase border border-border/40">
                {session.user.email.substring(0, 2)}
              </div>
              <span className="text-xs font-semibold">Account</span>
              <span className="text-[9px] text-muted-foreground/70 group-hover:text-primary-hover transition-colors">▼</span>
            </button>

            {/* ✅ FIXED THE UNEXPECTED PARSING TOKEN HERE */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-sm shadow-dialog py-2 z-50 text-xs text-foreground transition-all">
                <div className="px-4 py-2 border-b border-border/40 bg-background/50">
                  <p className="font-bold text-foreground truncate">{session.user.email}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 uppercase tracking-wider">
                    {session.user.role || "Customer"}
                  </p>
                </div>
                
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsProfileOpen(false)} 
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-surface-hover text-foreground transition-colors duration-fast"
                  >
                    <Shield className="h-3.5 w-3.5 text-primary stroke-[1.5]" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <Link 
                  href="/account/orders" 
                  onClick={() => setIsProfileOpen(false)} 
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-surface-hover text-foreground transition-colors duration-fast"
                >
                  <ClipboardList className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                  <span>My Orders</span>
                </Link>
                
                <div className="border-t border-border/40 my-1" />
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-destructive/10 text-destructive font-bold cursor-pointer bg-transparent border-0 transition-colors duration-fast"
                >
                  <LogOut className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="hidden sm:flex items-center gap-2 text-label font-medium text-foreground hover:text-primary-hover transition-colors duration-fast ease-standard">
            <User className="h-5 w-5 text-primary stroke-[1.5]" />
            <span>Sign In</span>
          </Link>
        )}

        {/* Hamburger Menu Controls */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-foreground lg:hidden hover:text-primary-hover focus:outline-none bg-transparent border-0 cursor-pointer transition-colors duration-fast"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5 stroke-[1.75]" /> : <Menu className="h-5 w-5 stroke-[1.75]" />}
        </button>
      </div>

      {/* Mobile Drawer Panel Stack */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-background border-b border-border shadow-dialog z-50 flex flex-col p-5 gap-y-5 lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto text-label font-medium text-foreground">
          
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search by title, author, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card text-foreground pl-10 pr-4 py-2 rounded-sm border border-border text-label outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 stroke-[1.5]" />
          </form>

          <div className="flex flex-col gap-y-4 pt-2">
            <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Home</Link>
            <Link href="/books" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Browse Catalogue</Link>

            {session && session.user ? (
              <div className="pt-4 border-t border-border/40 space-y-4 flex flex-col">
                <div className="px-1 py-0.5 bg-card border border-border/50 rounded-sm w-fit">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">{session.user.email}</span>
                </div>
                <Link href="/account/orders" onClick={() => setIsOpen(false)} className="block text-foreground hover:text-primary transition-colors pl-1">My Orders</Link>
                {isAdmin && <Link href="/admin" onClick={() => setIsOpen(false)} className="block text-primary font-bold pl-1">Admin Dashboard</Link>}
                <button onClick={handleLogout} className="w-full text-left pl-1 text-destructive font-bold bg-transparent border-0 cursor-pointer transition-colors hover:text-destructive/80">Logout</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="pt-2 text-primary font-bold hover:text-primary-hover transition-colors">Sign In to Account</Link>
            )}
          </div>
          
        </div>
      )}
    </>
  );
}

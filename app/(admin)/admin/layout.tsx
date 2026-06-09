// app/(admin)/admin/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BookPlus, 
  Library, 
  ShoppingBag, 
  Users, 
  BookOpen,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client"; // 🌟 FIXED: Unified Better-Auth client instance

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin/login");
          router.refresh();
        }
      }
    });
  };

  const navigationItems = [
    { href: "/admin", label: "Overview Panel", icon: LayoutDashboard, disabled: false },
    { href: "/admin/add-book", label: "Add New Book", icon: BookPlus, disabled: false },
    { href: "/admin/manage-inventory", label: "Manage Inventory", icon: Library, disabled: false },
    { href: "/admin/paystack-orders", label: "Paystack Orders", icon: ShoppingBag, disabled: false },
    { href: "/admin/registered-buyers", label: "Registered Buyers", icon: Users, disabled: false },
  ];

  // Reusable Navigation Link Component Block
  const NavLinks = () => (
    <nav className="space-y-1">
      {navigationItems.map((item, index) => {
        const Icon = item.icon;
        if (item.disabled) {
          return (
            <div 
              key={index} 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-500 opacity-50 cursor-not-allowed select-none"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </div>
          );
        }
        return (
          <Link 
            key={index}
            href={item.href} 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-900 hover:text-emerald-400 transition-colors group"
          >
            <Icon className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans overflow-x-hidden">
      
      {/* 🖥️ DESKTOP SIDEBAR: Hidden on screens under 'md' (768px) breakpoint */}
      <aside className="hidden md:flex w-64 bg-slate-950 border-r border-slate-800 flex-col fixed h-full z-30">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-emerald-600/20 p-2 rounded-lg text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-200 tracking-wide uppercase">Al-Hikmah HQ</h2>
            <p className="text-[11px] text-slate-500">Store Management v1.1.0</p>
          </div>
        </div>

        <div className="flex-1 p-4">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-slate-800">
          <Button asChild variant="outline" className="w-full bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white text-xs">
            <Link href="/">Return to Live Storefront</Link>
          </Button>
        </div>
      </aside>

      {/* 📱 VIEWPORT WORKSPACE WRAPPER */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full min-w-0">
        
        {/* GLOBAL HEADER BAR */}
        <header className="h-16 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 w-full">
          <div className="flex items-center gap-3">
            
            {/* 📱 MOBILE NAVIGATION DRAWER (Uses Shadcn Sheet Native Elements) */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100 hover:bg-slate-900">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-slate-950 border-slate-800 p-0 text-slate-100">
                  <SheetHeader className="p-6 border-b border-slate-800 text-left">
                    <SheetTitle className="flex items-center gap-3 text-slate-100">
                      <div className="bg-emerald-600/20 p-2 rounded-lg text-emerald-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-bold text-sm tracking-wide uppercase">Al-Hikmah HQ</h2>
                        <p className="text-[11px] text-slate-500 font-normal">Mobile Management</p>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="p-4 flex-1">
                    <NavLinks />
                  </div>
                  
                  <div className="p-4 border-t border-slate-800 absolute bottom-0 w-full left-0 bg-slate-950">
                    <Button asChild variant="outline" className="w-full bg-slate-900 text-slate-300 border-slate-800 text-xs">
                      <Link href="/">Return to Live Storefront</Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="text-xs sm:text-sm font-medium text-slate-400 truncate max-w-[160px] sm:max-w-none">
              System Operations Workspace
            </div>
          </div>
          
          {/* Admin Profile Pill */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-right">
              <p className="text-xs font-bold text-slate-200 hidden sm:block">Main Administrator</p>
              <p className="text-xs font-bold text-slate-200 sm:hidden">Admin</p>
              <p className="text-[10px] text-emerald-400 font-mono tracking-wider">ROLE_ADMIN</p>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="p-4 sm:p-8 flex-grow w-full max-w-full box-border overflow-x-hidden">
          {children}
        </main>
        
      </div>
    </div>
  );
}

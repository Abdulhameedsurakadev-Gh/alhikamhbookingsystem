 // app/(admin)/admin/_components/MobileNav.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Menu, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled: boolean;
}

interface MobileNavProps {
  navigationItems: NavigationItem[];
}

export function MobileNav({ navigationItems }: MobileNavProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-slate-100 hover:bg-slate-900"
          >
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
          </div>
          
          <div className="p-4 border-t border-slate-800 absolute bottom-0 w-full left-0 bg-slate-950">
            <Button asChild variant="outline" className="w-full bg-slate-900 text-slate-300 border-slate-800 text-xs">
              <Link href="/">Return to Live Storefront</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
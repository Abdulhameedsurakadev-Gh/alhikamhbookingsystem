"use client";

import React, { useState } from "react";
import { Search, Users, ShoppingBag, Calendar, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BuyerItem {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  orderCount: number;
  totalValueSpent: string;
}

export default function BuyersClientView({ initialBuyers }: { initialBuyers: BuyerItem[] }) {
  const [buyers] = useState<BuyerItem[]>(initialBuyers);
  const [searchTerm, setSearchTerm] = useState("");

  // Instant local matrix search filtration
  const filteredBuyers = buyers.filter((buyer) => {
    const matchString = `${buyer.name} ${buyer.email}`.toLowerCase();
    return matchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {/* Search Header control element */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search buyers by full name or email account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 h-10 w-full"
          />
        </div>
        <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 shrink-0">
          <Users className="w-3.5 h-3.5 text-emerald-500" /> Total Base: {filteredBuyers.length} Accounts
        </div>
      </div>

      {/* 🖥️ DESKTOP MAIN BUYERS DATA TABLE */}
      <div className="hidden md:block bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-slate-900/60 border-b border-slate-800">
              <TableRow className="border-b border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4 pl-6">Buyer Identity</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4">Email Address</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4">Registration Date</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4 text-center">Orders Placed</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4 text-right pr-6">Lifetime Gross Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuyers.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-12 text-sm text-slate-500 border-none">
                    No matching customer profile logs discovered inside this node sector.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBuyers.map((buyer) => (
                  <TableRow key={buyer.id} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors">
                    <TableCell className="py-4 pl-6 font-bold text-slate-200 text-sm">
                      {buyer.name}
                    </TableCell>
                    <TableCell className="py-4 text-slate-300 font-mono text-xs">
                      {buyer.email}
                    </TableCell>
                    <TableCell className="py-4 text-slate-400 text-xs">
                      {new Date(buyer.joinedAt).toLocaleDateString("en-GH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-4 text-center font-semibold font-mono text-slate-300 text-xs">
                      {buyer.orderCount}
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6 font-bold font-mono text-emerald-400 text-sm">
                      GH₵{buyer.totalValueSpent}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 📱 MOBILE VIEW SCREEN CARD LAYOUT */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredBuyers.map((buyer) => (
          <div key={buyer.id} className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-3 shadow-md">
            <div>
              <h4 className="font-bold text-sm text-slate-200">{buyer.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{buyer.email}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-center">
              <div className="flex flex-col items-center p-1.5 bg-slate-900 border border-slate-850 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-slate-500 mb-1" />
                <span className="text-[10px] text-slate-400 truncate">
                  {new Date(buyer.joinedAt).toLocaleDateString("en-GH", { month: "short", year: "2-digit" })}
                </span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-slate-900 border border-slate-850 rounded-lg">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-400 mb-1" />
                <span className="text-xs font-bold text-slate-200 font-mono">{buyer.orderCount}</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-slate-900 border border-slate-850 rounded-lg col-span-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                <span className="text-[11px] font-bold text-emerald-400 font-mono truncate">₵{buyer.totalValueSpent}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredBuyers.length === 0 && (
          <div className="p-6 text-center text-slate-500 text-xs w-full">No profiles found matching active search string.</div>
        )}
      </div>
    </div>
  );
}

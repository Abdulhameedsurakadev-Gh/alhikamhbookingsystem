import { getDashboardMetrics } from "./data-fetcher";
import { DollarSign, BookOpen, Scale, AlertTriangle, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminDashboardPage() {
  const data = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      
      {/* Responsive Header: Stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-400">Real-time business and inventory logging operations.</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold w-full sm:w-auto transition-colors cursor-pointer">
          <Link href="/admin/add-book" className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add New Book
          </Link>
        </Button>
      </div>

      {/* 4 Cards: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Value</CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400"><DollarSign className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-400">GH₵{data.value.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Active SKUs</CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400"><BookOpen className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100 font-mono">{data.count} Titles</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Mass</CardTitle>
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400"><Scale className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100 font-mono">{data.mass.toFixed(1)} kg</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Warnings</CardTitle>
            <div className="bg-rose-500/10 p-2 rounded-lg text-rose-400"><AlertTriangle className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400 font-mono">{data.lowStock.length} Items</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Ledger Split: Stacks into 1 column on mobile, unlocks side-by-side split on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Paystack Table Column */}
        <Card className="lg:col-span-2 bg-slate-950 border-slate-800 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-slate-900 px-4 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-200">Paystack Settlements</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">Live gateway incoming status tracking.</CardDescription>
            </div>
            <span className="text-[10px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded animate-pulse">Live</span>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            {data.orders.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No recent client ledger records.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-900/40 border-b border-slate-800">
                    <TableRow className="border-b border-slate-800">
                      <TableHead className="text-slate-400 px-4 py-3">Customer</TableHead>
                      <TableHead className="text-slate-400 px-4 py-3">Amount</TableHead>
                      <TableHead className="text-slate-400 px-4 py-3">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-900">
                    {data.orders.map((o) => (
                      <TableRow key={o.id} className="hover:bg-slate-900/30 border-b border-slate-900/60">
                        <TableCell className="px-4 py-3.5 text-slate-300 truncate max-w-[120px]">{o.user?.name || o.user?.email || "Guest"}</TableCell>
                        <TableCell className="px-4 py-3.5 font-mono text-emerald-400 font-bold">GH₵{Number(o.totalAmount?.toString() || 0).toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${o.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{o.status}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Reorder List Column */}
        <Card className="bg-slate-950 border-slate-800 flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-900 p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-200">Critical Stocks</CardTitle>
              <TrendingUp className="w-4 h-4 text-rose-400" />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              {data.lowStock.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-12">All book shelves well stocked.</div>
              ) : (
                <div className="space-y-3">
                  {data.lowStock.map((b) => (
                    <div key={b.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-slate-200 truncate font-serif">{b.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate">By {b.author?.name || "Unknown"}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded border border-rose-500/20 shrink-0">{b.stock} left</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
          <div className="p-4 border-t border-slate-900">
            {/* FIX: Redirects directly to the Inventory Grid Management page */}
            <Button asChild className="w-full bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs border border-slate-800 font-medium py-2 flex items-center justify-center gap-2 group cursor-pointer">
              <Link href="/admin/manage-inventory">
                Open Inventory Grid <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}

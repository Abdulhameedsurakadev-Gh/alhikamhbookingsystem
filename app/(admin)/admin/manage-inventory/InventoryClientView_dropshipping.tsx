"use client";

import React, { useState, useTransition } from "react";
import { Search, ToggleLeft, ToggleRight, Edit, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateAvailability, deleteBook } from "./inventory_actions_dropshipping";

interface BookItem {
  id: string;
  title: string;
  isbn: string | null;
  price: string; // Serialized decimal value
  available: boolean;
  supplierName: string | null;
  supplierCost: string | null;
  publisher: string;
  textType: string;
  knowledgeLevel: string;
  author: { name: string; nameArabic: string | null };
  category: { name: string };
}

export default function InventoryClientView({ initialBooks }: { initialBooks: BookItem[] }) {
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Instant local filtering matrix
  const filteredBooks = books.filter((book) => {
    const matchString = `${book.title} ${book.isbn || ""} ${book.author.name} ${book.publisher} ${book.supplierName || ""}`.toLowerCase();
    return matchString.includes(searchTerm.toLowerCase());
  });

  // Toggle availability status
  const toggleAvailability = async (bookId: string, currentAvailable: boolean) => {
    const newAvailable = !currentAvailable;

    // Optimistic local update for zero-latency UI responsiveness
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, available: newAvailable } : b));

    startTransition(async () => {
      const res = await updateAvailability(bookId, newAvailable);
      if (!res.success) {
        // Rollback on server operational errors
        setBooks(initialBooks);
        alert(`Availability sync failure: ${res.error}`);
      }
    });
  };

  const removeEntry = async (bookId: string, title: string) => {
    if (!confirm(`Are you completely sure you want to permanently delete "${title}"?`)) return;

    setBooks(prev => prev.filter(b => b.id !== bookId));
    const res = await deleteBook(bookId);
    if (!res.success) {
      setBooks(initialBooks);
      alert(`Deletion failure: ${res.error}`);
    }
  };

  // Calculate profit margin from price and cost
  const calculateMargin = (price: number, cost: number | null) => {
    if (!cost || cost === 0) return null;
    return (((price - cost) / cost) * 100).toFixed(0);
  };

  return (
    <div className="space-y-4">
      {/* Interactive Controls Header Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search manuscripts by title, author, supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 h-10 w-full"
          />
        </div>
        {isPending && (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Ledger...
          </div>
        )}
      </div>

      {/* Main Responsive Shadcn Table Element */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-slate-900/60 border-b border-slate-800">
              <TableRow className="border-b border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4 pl-6">Manuscript Details</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4">Supplier & Pricing</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4">Classification</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4 text-center">Availability</TableHead>
                <TableHead className="text-slate-400 font-semibold text-xs uppercase tracking-wider py-4 text-right pr-6">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-12 text-sm text-slate-500 border-none">
                    No matching catalog manuscripts found in this database sector.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => {
                  const margin = calculateMargin(parseFloat(book.price), book.supplierCost ? parseFloat(book.supplierCost) : null);
                  return (
                    <TableRow key={book.id} className={`border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors ${!book.available ? "opacity-60" : ""}`}>
                      {/* Metadata Box */}
                      <TableCell className="py-4 pl-6 max-w-[240px]">
                        <p className="font-bold text-slate-200 text-sm truncate">{book.title}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {book.author.name} {book.author.nameArabic ? `(${book.author.nameArabic})` : ""}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-wider uppercase">
                          {book.publisher} {book.isbn ? `• ISBN: ${book.isbn}` : ""}
                        </p>
                      </TableCell>

                      {/* Supplier & Pricing Info */}
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          {book.supplierName && (
                            <p className="text-xs font-semibold text-slate-300">
                              {book.supplierName}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">
                              Cost: {book.supplierCost ? `GH₵${parseFloat(book.supplierCost).toFixed(2)}` : "N/A"}
                            </span>
                            <span className="text-xs font-bold text-emerald-400">
                              Price: GH₵{parseFloat(book.price).toFixed(2)}
                            </span>
                          </div>
                          {margin && (
                            <p className="text-[10px] text-amber-400 font-semibold">
                              Margin: {margin}%
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Taxonomy Tags */}
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                            {book.textType}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded">
                            {book.knowledgeLevel}
                          </span>
                        </div>
                      </TableCell>

                      {/* Availability Toggle */}
                      <TableCell className="py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAvailability(book.id, book.available)}
                          className={`w-8 h-8 rounded-lg transition-all ${
                            book.available
                              ? "text-emerald-400 hover:bg-emerald-500/10"
                              : "text-rose-400 hover:bg-rose-500/10"
                          }`}
                          title={book.available ? "Click to mark as out of stock" : "Click to mark as available"}
                        >
                          {book.available ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </Button>
                        <p className="text-[10px] text-slate-400 mt-1 text-center">
                          {book.available ? "Available" : "Out of Stock"}
                        </p>
                      </TableCell>

                      {/* Management controls row items */}
                      <TableCell className="py-4 text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-md"
                          >
                            <a href={`/admin/edit-book?id=${book.id}`}>
                              <Edit className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEntry(book.id, book.title)}
                            className="w-8 h-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
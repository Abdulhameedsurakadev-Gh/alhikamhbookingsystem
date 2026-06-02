// app/(admin)/admin/manage-inventory/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import InventoryClientView from "./InventoryClientView";

export default async function ManageInventoryPage() {
  // Fetch complete dataset array including related category and author objects
  const books = await prisma.book.findMany({
    include: {
      author: { select: { name: true, nameArabic: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Manage Book Inventory</h1>
        <p className="text-sm text-slate-400 mt-1">
          Perform live catalog indexing, search bar lookups, and immediate stock count modifications.
        </p>
      </div>
      
      <InventoryClientView initialBooks={JSON.parse(JSON.stringify(books))} />
    </div>
  );
}

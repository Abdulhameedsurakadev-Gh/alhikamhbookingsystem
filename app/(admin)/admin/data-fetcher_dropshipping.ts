// app/(admin)/admin/data-fetcher.ts
import { prisma } from "../../../lib/prisma";

export async function getDashboardMetrics() {
  const count = (await prisma.book.count()) || 0;
  
  // Fetch books with supplier info for calculations
  const books = (await prisma.book.findMany({
    select: { 
      id: true,
      price: true, 
      available: true,
      supplierCost: true,
    },
  })) || [];

  // METRIC 1: Catalog Value = sum of all available book prices
  const catalogValue = books
    .filter(b => b.available)
    .reduce((sum, book) => sum + Number(book.price?.toString() || 0), 0);

  // METRIC 2: Total Profit Potential = sum of (price - supplierCost) for available books
  const profitPotential = books
    .filter(b => b.available && b.supplierCost)
    .reduce((sum, book) => {
      const price = Number(book.price?.toString() || 0);
      const cost = Number(book.supplierCost?.toString() || 0);
      return sum + (price - cost);
    }, 0);

  // METRIC 3: Books marked as Out of Stock (unavailable)
  const outOfStock = (await prisma.book.findMany({
    where: { available: false },
    include: { author: true },
    take: 5,
  })) || [];

  // METRIC 4: Recent orders (unchanged)
  const orders = (await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { 
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
    },
  })) || [];

  // Count of available books
  const availableCount = books.filter(b => b.available).length;

  return { 
    count, 
    availableCount,
    catalogValue, 
    profitPotential,
    outOfStock, 
    orders 
  };
}
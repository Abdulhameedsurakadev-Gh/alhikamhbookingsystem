// app/(admin)/admin/data-fetcher.ts
import { prisma } from "../../../lib/prisma";

export async function getDashboardMetrics() {
  const count = (await prisma.book.count()) || 0;
  const books =
    (await prisma.book.findMany({
      select: { price: true, stock: true, weight: true },
    })) || [];

  const value = books.reduce(
    (s, i) => s + Number(i.price?.toString() || 0) * (i.stock || 0),
    0,
  );
  const mass = books.reduce(
    (s, i) => s + (i.weight ? Number(i.weight.toString()) * (i.stock || 0) : 0),
    0,
  );

  const lowStock =
    (await prisma.book.findMany({
      where: { stock: { lte: 5 } },
      include: { author: true },
      take: 5,
    })) || [];

  const orders =
    (await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    })) || [];

  return { count, value, mass, lowStock, orders };
}

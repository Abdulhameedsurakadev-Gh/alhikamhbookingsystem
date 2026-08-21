import { getDashboardMetrics } from "./data-fetcher_dropshipping";
import {
  DollarSign,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Plus,
  Activity,
  PackageCheck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getDashboardMetrics();

  const availabilityPercentage =
    data.count > 0
      ? Math.round((data.availableCount / data.count) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* =====================================================================
          HEADER
         ===================================================================== */}

      <section className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Operations
            </span>
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Monitor catalogue value, supplier availability, incoming orders,
            and the current operational state of Al-Hikmah.
          </p>
        </div>

        <Button
          asChild
          className="w-full bg-primary text-primary-foreground hover:bg-primary-hover sm:w-auto"
        >
          <Link
            href="/admin/add-book"
            className="flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Book
          </Link>
        </Button>
      </section>

      {/* =====================================================================
          KPI CARDS
         ===================================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Catalog Value */}

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Catalogue Value
              </CardTitle>

              <CardDescription className="text-[10px]">
                Available book prices
              </CardDescription>
            </div>

            <div className="rounded-md border border-border bg-secondary p-2 text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground">
              GH₵{data.catalogValue.toFixed(2)}
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Current catalogue pricing value
            </p>
          </CardContent>
        </Card>

        {/* Profit Potential */}

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Profit Potential
              </CardTitle>

              <CardDescription className="text-[10px]">
                Available book margins
              </CardDescription>
            </div>

            <div className="rounded-md border border-border bg-secondary p-2 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground">
              GH₵{data.profitPotential.toFixed(2)}
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Combined potential margin
            </p>
          </CardContent>
        </Card>

        {/* Available Books */}

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Available Books
              </CardTitle>

              <CardDescription className="text-[10px]">
                Supplier availability
              </CardDescription>
            </div>

            <div className="rounded-md border border-border bg-secondary p-2 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground">
              {data.availableCount}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {data.count}
              </span>
            </p>

            <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{availabilityPercentage}% available</span>

              <PackageCheck className="h-3.5 w-3.5 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Out of Stock */}

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Out of Stock
              </CardTitle>

              <CardDescription className="text-[10px]">
                Requires attention
              </CardDescription>
            </div>

            <div
              className={`rounded-md border p-2 ${
                data.outOfStock.length > 0
                  ? "border-destructive/20 bg-destructive/10 text-destructive"
                  : "border-border bg-secondary text-primary"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <p
              className={`font-mono text-2xl font-bold tracking-tight ${
                data.outOfStock.length > 0
                  ? "text-destructive"
                  : "text-foreground"
              }`}
            >
              {data.outOfStock.length}
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              {data.outOfStock.length === 0
                ? "Catalogue fully available"
                : "Books currently unavailable"}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* =====================================================================
          MAIN OPERATIONS
         ===================================================================== */}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ===================================================================
            ORDERS
           =================================================================== */}

        <Card className="overflow-hidden border-border bg-card shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="font-serif text-base font-bold text-foreground">
                  Paystack Settlements
                </CardTitle>

                <CardDescription className="text-[10px]">
                  Recent customer orders and payment status.
                </CardDescription>
              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Live
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {data.orders.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center px-6 text-center">
                <div className="space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <p className="text-xs font-medium text-muted-foreground">
                    No recent client ledger records.
                  </p>

                  <p className="text-[10px] text-muted-foreground/70">
                    Incoming orders will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-5">
                        Customer
                      </TableHead>

                      <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-5">
                        Amount
                      </TableHead>

                      <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-5">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.orders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-border transition-colors hover:bg-muted/30"
                      >
                        <TableCell className="max-w-[160px] px-4 py-3.5 sm:px-5">
                          <div className="truncate text-xs font-medium text-foreground">
                            {order.user?.name ||
                              order.user?.email ||
                              "Guest"}
                          </div>

                          {order.user?.name && order.user?.email && (
                            <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                              {order.user.email}
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-bold text-foreground sm:px-5">
                          GH₵
                          {Number(
                            order.totalAmount?.toString() || 0
                          ).toFixed(2)}
                        </TableCell>

                        <TableCell className="px-4 py-3.5 sm:px-5">
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                              order.status === "PAID"
                                ? "border-primary/20 bg-primary/10 text-primary"
                                : "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          {data.orders.length > 0 && (
            <div className="border-t border-border px-4 py-3 sm:px-5">
              <Link
                href="/admin/paystack-orders"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                View all orders

                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </Card>

        {/* ===================================================================
            UNAVAILABLE BOOKS
           =================================================================== */}

        <Card className="flex flex-col border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="font-serif text-base font-bold text-foreground">
                  Unavailable Books
                </CardTitle>

                <CardDescription className="text-[10px]">
                  Items requiring availability review.
                </CardDescription>
              </div>

              <AlertTriangle
                className={`h-4 w-4 ${
                  data.outOfStock.length > 0
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-4 sm:p-5">
            {data.outOfStock.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary">
                  <PackageCheck className="h-4 w-4 text-primary" />
                </div>

                <p className="text-xs font-semibold text-foreground">
                  All books available
                </p>

                <p className="mt-1 max-w-[220px] text-[10px] leading-relaxed text-muted-foreground">
                  No catalogue items currently require availability
                  intervention.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.outOfStock.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-serif text-xs font-bold text-foreground">
                        {book.title}
                      </h4>

                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        By {book.author?.name || "Unknown"}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-destructive/20 bg-destructive/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-destructive">
                      Out
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <div className="border-t border-border p-4 sm:p-5">
            <Button
              asChild
              variant="outline"
              className="w-full border-border bg-background text-xs font-semibold text-foreground hover:bg-secondary hover:text-foreground"
            >
              <Link
                href="/admin/manage-inventory"
                className="flex items-center justify-center gap-2"
              >
                Manage Availability

                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
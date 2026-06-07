import Link from "next/link";
import { NavActions } from "./NavActions";
import { prisma } from "../../../lib/prisma"; 

// 🛡️ UPDATED INTERFACE: Ensuring the custom navbar accepts the Better-Auth session signature passed down from the server layout
interface NavbarProps {
  session: {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: "CUSTOMER" | "ADMIN";
    };
  } | null;
}

export async function Navbar({ session }: NavbarProps) {
  // 1. Fetch main categories for the taxonomy dropdown
  const categories = await prisma.category.findMany({
    where: { parentId: null }, // Only top-level categories first
    take: 9,
    orderBy: { name: "asc" },
  });

  // 2. Fetch featured authors chronologically by Islamic Hijri death year
  const featuredAuthors = await prisma.author.findMany({
    take: 5,
    orderBy: { diedAH: "asc" }, 
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Desktop & Tablet Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center">
            <span className="text-xl font-bold tracking-tight text-emerald-900 font-serif">
              Al-Hikmah
            </span>
          </Link>

          {/* Desktop Central Menu Links */}
          <nav className="hidden lg:flex items-center gap-x-6 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-emerald-700 transition">Home</Link>
            
            {/* Books Dropdown Menu Trigger */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-emerald-700 cursor-pointer">
                Books <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 mt-1 z-50">
                <Link href="/books" className="block px-4 py-2 hover:bg-slate-50 text-slate-800">All Books</Link>
                <Link href="/books?filter=new" className="block px-4 py-2 hover:bg-slate-50 text-slate-800">New Arrivals</Link>
                <Link href="/books?filter=best" className="block px-4 py-2 hover:bg-slate-50 text-slate-800">Best Sellers</Link>
              </div>
            </div>

            {/* Dynamic Categories Dropdown Menu */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-emerald-700 cursor-pointer">
                Categories <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2 mt-1 z-50 max-h-[400px] overflow-y-auto">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/categories/${cat.slug}`} className="block px-4 py-2 hover:bg-slate-50 text-slate-800">
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-slate-100 my-1"></div>
                <Link href="/books" className="block px-4 py-2 text-emerald-700 hover:bg-emerald-50 font-semibold">
                  Browse All →
                </Link>
              </div>
            </div>

            {/* Dynamic Authors Dropdown Menu */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-emerald-700 cursor-pointer">
                Authors <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2 mt-1 z-50">
                <Link href="/authors" className="block px-4 py-2 font-semibold text-slate-500 text-xs uppercase tracking-wider">Browse Authors</Link>
                {featuredAuthors.map((author) => (
                  <Link key={author.id} href={`/authors/${author.id}`} className="block px-4 py-2 hover:bg-slate-50 text-slate-800">
                    {author.name} {author.diedAH ? `(d. ${author.diedAH} AH)` : ""}
                  </Link>
                ))}
                <div className="border-t border-slate-100 my-1"></div>
                <Link href="/authors" className="block px-4 py-2 text-emerald-700 hover:bg-emerald-50 font-semibold">
                  All Scholars →
                </Link>
              </div>
            </div>

            {/* Knowledge Level Schema Dropdown Menu */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-emerald-700 cursor-pointer">
                Study Level <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2 mt-1 z-50">
                <Link href="/books?level=MUBTADI" className="block px-4 py-2 hover:bg-slate-50 text-slate-800 flex flex-col">
                  <span className="font-medium">Beginner</span>
                  <span className="text-xs text-slate-500 font-mono">Mubtadi (مبتدئ)</span>
                </Link>
                <Link href="/books?level=MUTAWASSIT" className="block px-4 py-2 hover:bg-slate-50 text-slate-800 flex flex-col">
                  <span className="font-medium">Intermediate</span>
                  <span className="text-xs text-slate-500 font-mono">Mutawassit (متوسط)</span>
                </Link>
                <Link href="/books?level=MUTAQADDIM" className="block px-4 py-2 hover:bg-slate-50 text-slate-800 flex flex-col">
                  <span className="font-medium">Advanced</span>
                  <span className="text-xs text-slate-500 font-mono">Mutaqaddim (متقدم)</span>
                </Link>
              </div>
            </div>

            <Link href="/about" className="hover:text-emerald-700 transition">About</Link>
          </nav>

          {/* Search Inputs & Dynamic Actions Component Layer */}
          <NavActions categories={categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, parentId: c.parentId }))} session={session} />

        </div>
      </div>
    </header>
  );
}

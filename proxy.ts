// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "@/lib/auth";

// 🔒 CHANGED EXPORT NAME FROM middleware TO proxy
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    const sessionToken = request.cookies.get("alhikmah_session")?.value;

    // No session token -> Instant redirection out
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const session = await decryptSession(sessionToken);

    // Invalid session or role mismatch -> Kick them out to login
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

// Keep the fine-grained path selector matching unchanged
export const config = {
  matcher: ["/admin/:path*"],
};

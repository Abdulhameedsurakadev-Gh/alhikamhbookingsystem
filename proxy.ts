// proxy.ts (Root of your project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    // 1. Better-Auth helper reads cookies quickly without heavy DB calls
    const sessionCookie = getSessionCookie(request, {
      cookiePrefix: "alhikmah" // Matches your lib/auth config prefix
    });

    // No session cookie found -> Redirect out immediately
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 2. Deep Role Validation: Because admin paths handle catalog prices & cashout references,
    // we make a secure server check to confirm they are an ADMIN.
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      const sessionData = await response.json();

      if (!sessionData || sessionData.user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

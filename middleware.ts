import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Production domain ONLY
const PROD_DOMAIN = "scaaf.day";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname, hostname } = url;

  // 🔒 Only apply Coming Soon on production domain
  const isProduction = hostname === PROD_DOMAIN;

  // Allow API routes, assets, and static files
  const isApiRoute = pathname.startsWith("/api");
  const isStaticFile =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes("favicon") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg") ||
    pathname.includes(".svg");

  // ⛔ If not production → do NOTHING (dev & preview should work normally)
  if (!isProduction) {
    return NextResponse.next();
  }

  // Allow viewing /coming-soon itself
  if (pathname.startsWith("/coming-soon")) {
    return NextResponse.next();
  }

  // ⛔ Allow terms/privacy/oauth pages for Google verification
  if (
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/google-oauth-disclosure")
  ) {
    return NextResponse.next();
  }

  // Allow static/API
  if (isApiRoute || isStaticFile) {
    return NextResponse.next();
  }

  // ✅ Force coming soon page on production
  url.pathname = "/coming-soon";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

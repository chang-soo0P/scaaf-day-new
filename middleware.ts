import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // API, static files, OAuth callback 등은 rewrite 금지
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.startsWith("/google") ||
    url.pathname === "/coming-soon"
  ) {
    return NextResponse.next();
  }

  // 모든 페이지를 coming-soon 으로 리라이트
  const comingSoon = new URL("/coming-soon", req.url);
  return NextResponse.rewrite(comingSoon);
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon|google|coming-soon).*)",
  ],
};

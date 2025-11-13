import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // ✅ Edge 환경에서 동적 실행 강제

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/onboarding", // ✅ 반드시 포함
  ],
};

export function middleware(request: NextRequest) {
  try {
    const host = request.headers.get("host") || "";
    const pathname = request.nextUrl.pathname;

    console.log(
      "[Middleware] --- ACTIVE --- Host:",
      host,
      "| Path:",
      pathname
    );

    // ✅ 운영 도메인 감지
    const isProductionDomain =
      host === "scaaf.day" ||
      host === "www.scaaf.day" ||
      host.endsWith(".scaaf.day");

    // ✅ 운영 도메인 접근 시 모든 페이지를 /coming-soon 으로 리디렉션
    if (
      isProductionDomain &&
      !pathname.startsWith("/coming-soon") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next")
    ) {
      console.log("[Middleware] Redirecting to /coming-soon");
      const redirectUrl = new URL("/coming-soon", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // ✅ HTTPS 강제 (HTTP 요청일 경우 리디렉션)
    if (
      process.env.NODE_ENV === "production" &&
      request.headers.get("x-forwarded-proto") !== "https"
    ) {
      console.log("[Middleware] Enforcing HTTPS redirect");
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = "https:";
      return NextResponse.redirect(httpsUrl);
    }

    // ✅ 기본 처리
    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Runtime error:", error);
    return NextResponse.json(
      { error: "Middleware failed", details: String(error) },
      { status: 500 }
    );
  }
}

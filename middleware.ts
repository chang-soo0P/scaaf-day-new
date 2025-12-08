import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const PROD_DOMAIN = "scaaf.day";
  const hostname = req.nextUrl.hostname;
  const path = req.nextUrl.pathname;

  // 1) 운영 도메인 맞는지 체크
  if (hostname === PROD_DOMAIN) {

    // ⭐ 2) OAuth 관련 라우트는 예외 처리 (리다이렉트 금지)
    if (path.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // ⭐ 3) 이미 /coming-soon 페이지에 있으면 허용
    if (path.startsWith("/coming-soon")) {
      return NextResponse.next();
    }

    // ⭐ 4) 그 외 모든 라우트 → Coming Soon으로 강제 이동
    return NextResponse.redirect(new URL("/coming-soon", req.url));
  }

  // 개발/프리뷰 환경 → 정상 동작
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      모든 경로를 체크하지만 _next/static, _next/image, favicon 등
      정적 리소스는 자동 제외되므로 설정 필요 없음
    */
    "/:path*"
  ]
};

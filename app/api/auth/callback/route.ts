import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // 운영 / 로컬 자동 분기
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  if (error) {
    return NextResponse.redirect(`${baseUrl}/?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    // ========================================================
    // 1) Google OAuth Token 교환
    // ========================================================
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri:
          process.env.GOOGLE_REDIRECT_URI ||
          `${baseUrl}/api/auth/callback`,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Token exchange failed");
    }

    // ========================================================
    // 2) Google UserInfo 조회
    // ========================================================
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    // ========================================================
    // 3) 리디렉트 준비
    // ========================================================
    const response = NextResponse.redirect(`${baseUrl}/?authenticated=true`);

    const isProd = process.env.NODE_ENV === "production";

    // ========================================================
    // ❌ 기존 불필요 쿠키 제거
    // ========================================================
    response.cookies.set("gmail_user", "", { maxAge: 0, path: "/" });
    response.cookies.set("gmail_refresh_token", "", { maxAge: 0, path: "/" });

    // ========================================================
    // ✔ A. Access Token 저장 (서버 전용 쿠키)
    // ========================================================
    response.cookies.set("gmail_access_token", tokens.access_token, {
      httpOnly: true,          // JS 접근 불가 → 보안 강화
      secure: isProd ? true : false,   // prod=HTTPS 필수
      sameSite: isProd ? "none" : "lax", // OAuth redirect는 prod에서 none 필수
      maxAge: tokens.expires_in,       // 보통 3600초
      path: "/",                       // 전체 도메인에서 사용
    });

    // ========================================================
    // ✔ B. User Info 저장 (클라이언트에서 읽기 가능)
    // ========================================================
    response.cookies.set(
      "user_info",
      JSON.stringify({
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        expiresAt: Date.now() + tokens.expires_in * 1000,
      }),
      {
        httpOnly: false,
        secure: isProd ? true : false,
        sameSite: isProd ? "none" : "lax",
        maxAge: tokens.expires_in,
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error("Token exchange error:", error);

    return NextResponse.redirect(
      `${baseUrl}/?error=token_exchange_failed`
    );
  }
}

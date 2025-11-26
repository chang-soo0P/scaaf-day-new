import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const origin =
    request.nextUrl.origin ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const hostname = request.nextUrl.hostname;
  const isLocalhost =
    hostname === "localhost" || hostname.startsWith("127.") || hostname === "[::1]";

  if (error) {
    return NextResponse.redirect(`${origin}/?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`);
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
          process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/callback`,
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
    const response = NextResponse.redirect(`${origin}/?authenticated=true`);
    const isProd = origin.startsWith("https://");
    const cookieDomain = isLocalhost ? undefined : hostname;

    // ========================================================
    // ❌ 기존 불필요 쿠키 제거
    // ========================================================
    response.cookies.set("gmail_user", "", { maxAge: 0, path: "/" });
    response.cookies.set("gmail_refresh_token", "", { maxAge: 0, path: "/" });

    // ========================================================
    // ✔ A. Access Token 저장 (서버 전용 쿠키)
    // ========================================================
    response.cookies.set("gmail_access_token", tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: tokens.expires_in,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
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
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      }
    );

    return response;
  } catch (error) {
    console.error("Token exchange error:", error);

    return NextResponse.redirect(
      `${origin}/?error=token_exchange_failed`
    );
  }
}

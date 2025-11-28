import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // -----------------------
  // 환경별 base URL 자동 판별
  // -----------------------
  const host = request.nextUrl.hostname;
  const isLocalhost =
    host === "localhost" ||
    host.startsWith("127.") ||
    host === "[::1]";

  const origin =
    isLocalhost
      ? "http://localhost:3000"
      : `https://${request.nextUrl.host}`;

  // -----------------------
  // 오류 처리
  // -----------------------
  if (error) {
    return NextResponse.redirect(`${origin}/?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  try {
    // ======================================================
    // 1) Google OAuth Token 교환
    // ======================================================
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
          `${origin}/api/auth/callback`,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Token exchange failed");
    }

    // ======================================================
    // 2) 사용자 정보 가져오기
    // ======================================================
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    // ======================================================
    // 3) Redirect 설정
    // ======================================================
    const response = NextResponse.redirect(`${origin}/?authenticated=true`);

    const isProd = origin.startsWith("https://");

    // SameSite 설정:
    // Google OAuth redirect는 반드시 SameSite=None 이어야 쿠키가 저장됨
    const sameSite = isProd ? "none" : "lax";

    // -----------------------------
    // ❌ 잘못된 이전 쿠키 제거
    // -----------------------------
    response.cookies.set("gmail_user", "", { maxAge: 0, path: "/" });
    response.cookies.set("gmail_refresh_token", "", { maxAge: 0, path: "/" });

    // ======================================================
    // ✔ A. 서버 전용 Access Token (HttpOnly)
    // ======================================================
    response.cookies.set("gmail_access_token", tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite,
      maxAge: tokens.expires_in,
      path: "/",
    });


    // ======================================================
    // ✔ B. 클라이언트 접근 가능한 User Info
    // ======================================================
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
        secure: isProd,
        sameSite,
        maxAge: tokens.expires_in,
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.redirect(`${origin}/?error=token_exchange_failed`);
  }
}


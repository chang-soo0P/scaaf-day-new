import { type NextRequest, NextResponse } from "next/server";

function isLocalHost(host: string | null) {
  if (!host) return false;
  return (
    host === "localhost" ||
    host.startsWith("localhost:") ||
    host.startsWith("127.") ||
    host.includes("::1")
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.nextUrl.host;
  const protoHeader =
    request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol;
  const protocol =
    protoHeader && protoHeader.endsWith(":")
      ? protoHeader.slice(0, -1)
      : protoHeader ?? "https";

  const localOrigin = `${protocol}://${host}`;
  const fallbackOrigin =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : localOrigin);

  const origin = isLocalHost(host) ? localOrigin : fallbackOrigin;

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
    const response = NextResponse.redirect(
      `${origin}/?authenticated=true`,
    );

    const isHttps = origin.startsWith("https://");
    const sameSite = isHttps ? "none" : "lax";
    const cookieDomain = isLocalHost(host) ? undefined : new URL(origin).hostname;

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
      secure: isHttps,
      sameSite,
      maxAge: tokens.expires_in,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
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
        secure: isHttps,
        sameSite,
        maxAge: tokens.expires_in,
        path: "/",
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      }
    );

    return response;
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.redirect(`${origin}/?error=token_exchange_failed`);
  }
}

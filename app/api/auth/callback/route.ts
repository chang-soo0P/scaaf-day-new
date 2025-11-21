import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

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
    // ---------------------------
    // 1) OAuth Token 교환
    // ---------------------------
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Token exchange failed");
    }

    // ---------------------------
    // 2) UserInfo 가져오기
    // ---------------------------
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    // ---------------------------
    // 3) Redirect 준비
    // ---------------------------
    const response = NextResponse.redirect(`${baseUrl}/?authenticated=true`);

    // ---------------------------
    // ✔ A. Access Token 저장 (HttpOnly)
    // ---------------------------
    response.cookies.set("gmail_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expires_in, // expires_in은 초 단위
      path: "/",
    });

    // ---------------------------
    // ✔ B. User Info 저장 (client-side 접근 가능)
    // ---------------------------
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokens.expires_in,
        path: "/",
      }
    );

    // ---------------------------
    // ❌ 삭제해야 하는 쿠키들 (사용 안 함)
    // gmail_user / gmail_refresh_token
    // ---------------------------

    return response;
  } catch (error) {
    console.error("Token exchange error:", error);

    return NextResponse.redirect(
      `${baseUrl}/?error=token_exchange_failed`
    );
  }
}

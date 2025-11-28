import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";  // ★ 추가됨

function isLocalHost(host: string | null): boolean {
  if (!host) return false;
  return (
    host === "localhost" ||
    host.startsWith("localhost:") ||
    host.startsWith("127.") ||
    host === "[::1]"
  );
}

function getCanonicalOrigin(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }

  const host = request.nextUrl.hostname;
  if (isLocalHost(host)) return "http://localhost:3000";

  const origin = request.nextUrl.origin;
  if (origin) return origin;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function getCookieDomain(origin: string): string | undefined {
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    if (isLocalHost(hostname)) return undefined;
    return hostname;
  } catch {
    return undefined;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const origin = getCanonicalOrigin(request);

  if (error) {
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  try {
    // ----------------------------------------------------
    // 1) OAuth Token Exchange
    // ----------------------------------------------------
    const redirectUri = `${origin}/api/auth/callback`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri:
          process.env.GOOGLE_REDIRECT_URI || redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Token exchange failed");
    }

    // ----------------------------------------------------
    // 2) Fetch User Info
    // ----------------------------------------------------
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userData = await userResponse.json();

    // ----------------------------------------------------
    // 3) Save User to Supabase (★ 핵심 추가)
    // ----------------------------------------------------
    await supabaseAdmin
      .from("users")
      .upsert(
        {
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          provider: "google",
          google_id: userData.id,
          refresh_token: tokens.refresh_token || null,
          last_login: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    // ----------------------------------------------------
    // 4) Set Cookies
    // ----------------------------------------------------
    const response = NextResponse.redirect(`${origin}/?authenticated=true`);
    const isProd = origin.startsWith("https://");
    const cookieDomain = getCookieDomain(origin);
    const sameSite = isProd ? "none" : "lax";
    const secure = isProd;

    // A. Access Token
    response.cookies.set("gmail_access_token", tokens.access_token, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: tokens.expires_in,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    // B. Refresh Token
    if (tokens.refresh_token) {
      response.cookies.set("gmail_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      });
    }

    // C. User Info
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
        secure,
        sameSite,
        maxAge: tokens.expires_in,
        path: "/",
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      }
    );

    return response;
  } catch (error) {
    console.error("[OAuth Callback] Error:", error);
    return NextResponse.redirect(
      `${origin}/?error=token_exchange_failed`
    );
  }
}

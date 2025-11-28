import { type NextRequest, NextResponse } from "next/server";

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
  // Priority: NEXT_PUBLIC_BASE_URL > request.nextUrl.origin > VERCEL_URL > localhost
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }

  const host = request.nextUrl.hostname;
  if (isLocalHost(host)) {
    return "http://localhost:3000";
  }

  // Use request origin (includes port if present)
  const origin = request.nextUrl.origin;
  if (origin) {
    return origin;
  }

  // Fallback to VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function getCookieDomain(origin: string): string | undefined {
  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    // Never set domain for localhost
    if (isLocalHost(hostname)) {
      return undefined;
    }

    // For production domains like scaaf.day, return the hostname exactly
    // No leading dot - browsers handle this automatically
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
  console.log("[OAuth Callback] Origin detected:", origin);
  console.log("[OAuth Callback] Code received:", code ? "yes" : "no");
  console.log("[OAuth Callback] Error received:", error || "none");

  if (error) {
    console.error("[OAuth Callback] OAuth error from Google:", error);
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    console.error("[OAuth Callback] No authorization code received");
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  try {
    // ======================================================
    // 1) Google OAuth Token Exchange
    // ======================================================
    const redirectUri = `${origin}/api/auth/callback`;
    console.log("[OAuth Callback] Exchanging code for token...");
    console.log("[OAuth Callback] Redirect URI:", redirectUri);

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();
    console.log("[OAuth Callback] Token exchange result:", {
      ok: tokenResponse.ok,
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiresIn: tokens.expires_in,
    });

    if (!tokenResponse.ok) {
      console.error("[OAuth Callback] Token exchange failed:", tokens);
      throw new Error(tokens.error_description || "Token exchange failed");
    }

    // ======================================================
    // 2) Fetch User Info
    // ======================================================
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
    console.log("[OAuth Callback] User info fetched:", userData.email);

    // ======================================================
    // 3) Set Cookies and Redirect
    // ======================================================
    const response = NextResponse.redirect(`${origin}/?authenticated=true`);

    const isProd = origin.startsWith("https://");
    const cookieDomain = getCookieDomain(origin);

    // CRITICAL: SameSite=None REQUIRES Secure=true
    const sameSite = isProd ? ("none" as const) : ("lax" as const);
    const secure = isProd; // Must be true when SameSite=none

    console.log("[Cookie Write] Settings:", {
      domain: cookieDomain || "none (localhost)",
      sameSite,
      secure,
      isProd,
    });

    // -----------------------------
    // Clear old/incorrect cookies
    // -----------------------------
    const clearOptions = {
      maxAge: 0,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
    response.cookies.set("gmail_user", "", clearOptions);
    response.cookies.set("gmail_refresh_token", "", clearOptions);

    // ======================================================
    // A. Access Token (HttpOnly, Server-only)
    // ======================================================
    const accessTokenOptions = {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: tokens.expires_in || 3600,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
    response.cookies.set("gmail_access_token", tokens.access_token, accessTokenOptions);
    console.log("[Cookie Write] gmail_access_token set");

    // ======================================================
    // B. Refresh Token (HttpOnly, Server-only)
    // ======================================================
    if (tokens.refresh_token) {
      const refreshTokenOptions = {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      };
      response.cookies.set("gmail_refresh_token", tokens.refresh_token, refreshTokenOptions);
      console.log("[Cookie Write] gmail_refresh_token set");
    } else {
      console.warn("[OAuth Callback] No refresh_token received from Google");
    }

    // ======================================================
    // C. User Info (Client-readable)
    // ======================================================
    const userInfoData = {
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
    };
    const userInfoOptions = {
      httpOnly: false, // Client needs to read this
      secure,
      sameSite,
      maxAge: tokens.expires_in || 3600,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
    response.cookies.set("user_info", JSON.stringify(userInfoData), userInfoOptions);
    console.log("[Cookie Write] user_info set");

    console.log("[OAuth Callback] All cookies set successfully, redirecting to:", `${origin}/?authenticated=true`);
    return response;
  } catch (error) {
    console.error("[OAuth Callback] Token exchange error:", error);
    const errorMessage = error instanceof Error ? error.message : "token_exchange_failed";
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(errorMessage)}`);
  }
}

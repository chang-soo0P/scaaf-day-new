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
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }

  const host = request.nextUrl.hostname;
  if (isLocalHost(host)) {
    return "http://localhost:3000";
  }

  const origin = request.nextUrl.origin;
  if (origin) {
    return origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function getCookieDomain(origin: string): string | undefined {
  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    if (isLocalHost(hostname)) {
      return undefined;
    }

    return hostname;
  } catch {
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("gmail_refresh_token")?.value;

    console.log("[Auth Refresh] Refresh token check:", !!refreshToken);

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    console.log("[Auth Refresh] Exchanging refresh token...");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("[Auth Refresh] Token refresh failed:", tokens);
      return NextResponse.json({ error: "Token refresh failed" }, { status: 401 });
    }

    console.log("[Auth Refresh] Token exchange successful");

    // Get user info with new token
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      console.error("[Auth Refresh] Failed to fetch user info");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userData = await userResponse.json();

    const origin = getCanonicalOrigin(request);
    const isProd = origin.startsWith("https://");
    const cookieDomain = getCookieDomain(origin);
    const sameSite = isProd ? ("none" as const) : ("lax" as const);
    const secure = isProd;

    const response = NextResponse.json({
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      accessToken: tokens.access_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
    });

    // Update access token cookie
    const accessTokenOptions = {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: tokens.expires_in || 3600,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
    response.cookies.set("gmail_access_token", tokens.access_token, accessTokenOptions);
    console.log("[Cookie Write] gmail_access_token refreshed");

    // Update user_info cookie
    const userInfoData = {
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
    };
    const userInfoOptions = {
      httpOnly: false,
      secure,
      sameSite,
      maxAge: tokens.expires_in || 3600,
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
    response.cookies.set("user_info", JSON.stringify(userInfoData), userInfoOptions);
    console.log("[Cookie Write] user_info refreshed");

    // Update refresh token if provided
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
      console.log("[Cookie Write] gmail_refresh_token refreshed");
    }

    console.log("[Auth Refresh] All cookies updated successfully");

    return response;
  } catch (error) {
    console.error("[Auth Refresh] Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

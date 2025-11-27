import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";       // ✅ edge-runtime 방지
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

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
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost ?? request.nextUrl.host;
    const protoHeader =
      request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol;
    const protocol =
      protoHeader && protoHeader.endsWith(":")
        ? protoHeader.slice(0, -1)
        : protoHeader ?? "https";

    const normalizedBase =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `${protocol}://${host}`);

    const origin = isLocalHost(host) ? `${protocol}://${host}` : normalizedBase;
    const redirectUri = `${origin.replace(/\/$/, "")}/api/auth/callback`;

    if (!clientId) {
      return NextResponse.json({ error: "Google Client ID not configured" }, { status: 500 });
    }

    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.readonly",
    ].join(" ");

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Origin detection priority: NEXT_PUBLIC_BASE_URL > request.nextUrl.origin > VERCEL_URL > localhost
    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.nextUrl.origin ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const redirectUri = `${origin.replace(/\/$/, "")}/api/auth/callback`;

    console.log("[OAuth Google] origin =", origin);
    console.log("[OAuth Google] redirect_uri =", redirectUri);

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("[OAuth Google] GOOGLE_CLIENT_ID not configured");
      return NextResponse.json(
        { error: "Google Client ID not configured" },
        { status: 500 }
      );
    }

    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.readonly",
    ].join(" ");

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      access_type: "offline", // Required for refresh_token
      prompt: "consent", // Force consent to get refresh_token
      scope: scopes,
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log("[OAuth Google] Generated authUrl");

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("[OAuth Google Error]", error);
    return NextResponse.json({ error: "Failed to create OAuth URL" }, { status: 500 });
  }
}

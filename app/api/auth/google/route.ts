import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // ==========================================================
    // 1) Origin Detection (우선순위)
    // ==========================================================
    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.nextUrl.origin ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const redirectUri = `${origin.replace(/\/$/, "")}/api/auth/callback`;

    console.log("[OAuth Google] origin =", origin);
    console.log("[OAuth Google] redirect_uri =", redirectUri);

    // ==========================================================
    // 2) Environment Validation
    // ==========================================================
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("[OAuth Google] GOOGLE_CLIENT_ID not configured");
      return NextResponse.json(
        { error: "Google Client ID not configured" },
        { status: 500 }
      );
    }

    // ==========================================================
    // 3) REQUIRED SCOPES (Google 심사 요청과 반드시 동일)
    // ==========================================================
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.labels",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly",
    ];

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      access_type: "offline", // refresh_token을 받기 위해 필요
      prompt: "consent",      // 항상 사용자 동의 화면 표시
      scope: scopes.join(" "), // 스코프 5개 모두 통과
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log("[OAuth Google] Generated authUrl");

    // ==========================================================
    // 4) Return JSON Response (Frontend will redirect to authUrl)
    // ==========================================================
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("[OAuth Google Error]", error);
    return NextResponse.json(
      { error: "Failed to create OAuth URL" },
      { status: 500 }
    );
  }
}

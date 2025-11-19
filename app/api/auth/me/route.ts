import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 토큰과 사용자 정보 가져오기
    const accessToken = request.cookies.get("gmail_access_token")?.value;
    const userInfoCookie = request.cookies.get("user_info")?.value;

    if (!accessToken || !userInfoCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const userInfo = JSON.parse(userInfoCookie);
      
      // 토큰 만료 시간 계산 (기본 1시간)
      const expiresAt = Date.now() + 3600000; // 1 hour from now

      return NextResponse.json({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: accessToken,
        expiresAt: expiresAt,
      });
    } catch (parseError) {
      console.error("Failed to parse user info:", parseError);
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}

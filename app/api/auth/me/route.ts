import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value;
    const userCookie = request.cookies.get("gmail_user")?.value; // 수정!

    if (!accessToken || !userCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const user = JSON.parse(userCookie);

    return NextResponse.json({
      authenticated: true,
      email: user.email,
      name: user.name,
      picture: user.picture,
      accessToken: accessToken,
      expiresAt: user.expiresAt || null, // callback에서 저장한 값 사용
    });
  } catch (err) {
    console.error("Auth me error:", err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

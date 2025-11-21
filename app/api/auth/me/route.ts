import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value;
    const userCookie = request.cookies.get("user_info")?.value; // ★ 이름 통일

    if (!accessToken || !userCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const user = JSON.parse(userCookie);

    return NextResponse.json({
      authenticated: true,
      email: user.email,
      name: user.name,
      picture: user.picture,
      accessToken,
    });
  } catch (err) {
    console.error("Auth me error:", err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

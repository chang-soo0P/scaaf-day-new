import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value;
    const userCookie = request.cookies.get("user_info")?.value;

    console.log("[Auth Me] cookies received:", {
      hasAccessToken: !!accessToken,
      hasUserCookie: !!userCookie,
    });

    if (!accessToken || !userCookie) {
      console.log("[Auth Me] Missing cookies, returning authenticated: false");
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    let user;
    try {
      user = JSON.parse(userCookie);
    } catch (parseError) {
      console.error("[Auth Me] Failed to parse user_info cookie:", parseError);
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    if (!user.email || !user.name) {
      console.error("[Auth Me] Invalid user data structure");
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    console.log("[Auth Me] User authenticated:", user.email);

    return NextResponse.json({
      authenticated: true,
      email: user.email,
      name: user.name,
      picture: user.picture,
      accessToken,
      expiresAt: user.expiresAt,
    });
  } catch (err) {
    console.error("[Auth Me] Error:", err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

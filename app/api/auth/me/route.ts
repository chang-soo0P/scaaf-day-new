import { NextResponse } from "next/server";

export const runtime = "nodejs";       // ✅ edge-runtime 방지
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie");

    if (!cookies) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 실제 서비스에서는 JWT / 세션 검증 로직 추가
    return NextResponse.json({
      user: { name: "Demo User", email: "demo@example.com" },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}

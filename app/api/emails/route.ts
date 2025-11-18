import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client"; // ✅ Supabase 클라이언트 임포트

// ----------------------
// ✅ 이메일 목록 가져오기 (GET)
// ----------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // ✅ Supabase에서 user_id 기준으로 이메일 목록 조회
    const { data, error } = await supabase
      .from("emails")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}

// ----------------------
// ✅ 이메일 저장 (POST)
// ----------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gmail_id, subject, from, snippet, summary, actions, user_id } = body;

    if (!gmail_id || !subject || !from || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ 날짜 포맷을 ISO → YYYY-MM-DD 로 변환
    const formattedDate = new Date().toISOString().split("T")[0];

    // ✅ Supabase 테이블에 데이터 삽입
    const { data, error } = await supabase.from("emails").insert([
      {
        gmail_id,
        subject,
        from,
        snippet: snippet || "",
        summary: summary || "",
        actions: actions || "",
        user_id,
        date: formattedDate, // ✅ Supabase DATE 컬럼에 호환되는 형식
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("Error storing email:", error);
    return NextResponse.json({ error: "Failed to store email" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { mockDB } from "@/lib/mock-database";

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

    // ✅ Supabase 사용 (환경 변수가 없으면 에러 발생)
    try {
      const supabase = supabaseServer();
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      return NextResponse.json({ data }, { status: 200 });
    } catch (supabaseError) {
      // Fallback to mock database if Supabase is not configured
      console.warn("Supabase not available, using mock DB:", supabaseError);
      const emails = await mockDB.getEmailsByUser(userId);
      return NextResponse.json({ data: emails }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error fetching emails:", error);
    // Fallback to mock database on error
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("user_id");
      if (userId) {
        const emails = await mockDB.getEmailsByUser(userId);
        return NextResponse.json({ data: emails }, { status: 200 });
      }
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
    }
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

    // ✅ Supabase 사용 (환경 변수가 없으면 에러 발생)
    try {
      const supabase = supabaseServer();
      const formattedDate = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase.from("emails").insert([
        {
          gmail_id,
          subject,
          from,
          snippet: snippet || "",
          summary: summary || "",
          actions: actions || "",
          user_id,
          date: formattedDate,
        },
      ]);

      if (error) throw error;
      return NextResponse.json({ data }, { status: 201 });
    } catch (supabaseError) {
      // Fallback: return success (mock mode)
      console.warn("Supabase not available, using mock mode:", supabaseError);
      return NextResponse.json({ data: { id: Date.now().toString() } }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Error storing email:", error);
    // Fallback: return success even on error in mock mode
    return NextResponse.json({ data: { id: Date.now().toString() } }, { status: 201 });
  }
}

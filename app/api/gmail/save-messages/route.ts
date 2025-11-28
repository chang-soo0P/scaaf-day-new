import { NextRequest, NextResponse } from "next/server";
import { GmailClient } from "@/lib/gmail-client";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value;
    const userCookie = request.cookies.get("user_info")?.value;

    if (!accessToken || !userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userCookie);

    const gmail = new GmailClient(accessToken);

    // 1) Gmail 전체 메시지 목록 조회
    const messages = await gmail.listMessages();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ ok: true, saved: 0 });
    }

    let savedCount = 0;

    for (const msg of messages) {
      const full = await gmail.getMessage(msg.id);

      const headers = full.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value || "";
      const from = headers.find((h) => h.name === "From")?.value || "";
      const date = headers.find((h) => h.name === "Date")?.value || "";
      const snippet = full.snippet || "";

      // Supabase Insert
      const { error } = await supabaseAdmin
        .from("emails")
        .insert({
          user_id: user.email,
          gmail_id: msg.id,
          subject,
          snippet,
          sender: from,
          date,
          summary: null,
        });

      if (!error) savedCount++;
    }

    return NextResponse.json({ ok: true, saved: savedCount });

  } catch (err) {
    console.error("Save Gmail Messages Error:", err);
    return NextResponse.json({ error: "Failed to save messages" }, { status: 500 });
  }
}

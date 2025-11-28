import { NextRequest, NextResponse } from "next/server";
import { GmailClient } from "@/lib/gmail-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("gmail_access_token")?.value;

  console.log("[Messages API] access token detected:", !!accessToken);

  if (!accessToken) {
    console.log("[Messages API] No access token, returning 401");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const gmailClient = new GmailClient(accessToken);

    // Gmail 리스트 가져오기 (10개)
    const list = await gmailClient.getMessages("", 10);
    const rawMessages = list.messages || [];

    console.log("[Messages API] Fetched", rawMessages.length, "messages");

    const detailed = await Promise.all(
      rawMessages.map(async (msg) => {
        const full = await gmailClient.getMessage(msg.id);

        return {
          id: msg.id,
          threadId: msg.threadId,
          subject: full.payload.headers.find((h) => h.name === "Subject")?.value || "",
          from: full.payload.headers.find((h) => h.name === "From")?.value || "",
          date: full.payload.headers.find((h) => h.name === "Date")?.value || "",
          snippet: full.snippet,
          isUnread: full.labelIds?.includes("UNREAD") || false,
        };
      })
    );

    console.log("[Messages API] Returning", detailed.length, "detailed messages");

    return NextResponse.json({ data: detailed });
  } catch (err) {
    console.error("[Messages API] Gmail messages error:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

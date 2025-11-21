import { NextRequest, NextResponse } from "next/server";
import { GmailClient } from "@/lib/gmail-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const accessToken = request.cookies.get("gmail_access_token")?.value;

  if (!id || !accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const gmailClient = new GmailClient(accessToken);
    const full = await gmailClient.getMessage(id);

    const payload = full.payload;
    const headers = payload.headers;

    const subject = headers.find((h) => h.name === "Subject")?.value || "";
    const from = headers.find((h) => h.name === "From")?.value || "";
    const date = headers.find((h) => h.name === "Date")?.value || "";
    const snippet = full.snippet || "";

    const body = extractPlainTextFromPayload(payload);

    return NextResponse.json({
      id,
      subject,
      from,
      date,
      snippet,
      body,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

function extractPlainTextFromPayload(payload: any): string {
  try {
    if (payload.body?.data) {
      return Buffer.from(payload.body.data, "base64").toString("utf-8");
    }

    const parts = payload.parts || [];
    for (const part of parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }

    return "(No content)";
  } catch {
    return "(Failed to extract body)";
  }
}

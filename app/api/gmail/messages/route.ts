import { type NextRequest, NextResponse } from "next/server"
import { GmailClient } from "@/lib/gmail-client"

const MOCK_GMAIL_MESSAGES = [
  {
    id: "mock_1",
    threadId: "thread_1",
    subject: "Welcome to Gmail AI Agent!",
    from: "team@gmailagent.com",
    snippet: "Thank you for trying our Gmail AI Agent. This is a demo message to show how the system works...",
    body: "Thank you for trying our Gmail AI Agent. This is a demo message to show how the system works with real Gmail messages. You can see summaries, get AI-powered insights, and manage your emails more efficiently.",
    date: new Date().toISOString(),
    isUnread: true,
  },
  {
    id: "mock_2",
    threadId: "thread_2",
    subject: "Project Update - Q4 Planning",
    from: "sarah@company.com",
    snippet:
      "Hi team, I wanted to share the latest updates on our Q4 planning initiatives. Please review the attached documents...",
    body: "Hi team, I wanted to share the latest updates on our Q4 planning initiatives. Please review the attached documents and let me know your thoughts by Friday.",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isUnread: false,
  },
  {
    id: "mock_3",
    threadId: "thread_3",
    subject: "Meeting Reminder: Design Review",
    from: "calendar@company.com",
    snippet: "This is a reminder that you have a Design Review meeting scheduled for tomorrow at 2:00 PM...",
    body: "This is a reminder that you have a Design Review meeting scheduled for tomorrow at 2:00 PM. Please prepare your latest mockups and user feedback.",
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isUnread: true,
  },
  {
    id: "mock_4",
    threadId: "thread_4",
    subject: "Invoice #INV-2024-001",
    from: "billing@service.com",
    snippet: "Your monthly invoice is ready. Amount due: $99.00. Payment is due by the end of this month...",
    body: "Your monthly invoice is ready. Amount due: $99.00. Payment is due by the end of this month. You can pay online through our secure portal.",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isUnread: false,
  },
  {
    id: "mock_5",
    threadId: "thread_5",
    subject: "Weekly Newsletter - Tech Updates",
    from: "newsletter@techblog.com",
    snippet: "This week's top stories: AI breakthroughs, new framework releases, and industry insights...",
    body: "This week's top stories: AI breakthroughs, new framework releases, and industry insights. Don't miss our exclusive interview with leading tech innovators.",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    isUnread: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accessToken = searchParams.get("accessToken") || request.cookies.get("gmail_access_token")?.value

    console.log("[v0] Gmail Messages API - Access Token:", accessToken ? "Present" : "Missing")
    console.log("[v0] Gmail Messages API - Token from URL:", !!searchParams.get("accessToken"))
    console.log("[v0] Gmail Messages API - Token from Cookie:", !!request.cookies.get("gmail_access_token")?.value)

    if (!accessToken) {
      console.log("[v0] Gmail Messages API - No access token found")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Mock data disabled - use real Gmail data only
    // if (accessToken === "mock_access_token") {
    //   console.log("[v0] Using mock Gmail data for demo mode")
    //   return NextResponse.json({ data: MOCK_GMAIL_MESSAGES })
    // }

    const gmailClient = new GmailClient(accessToken)

    console.log("[v0] Making real Gmail API call with token:", accessToken.substring(0, 10) + "...")

    // 1단계: 메시지 목록 가져오기
    console.log("[v0] Fetching message list from Gmail API...")
    const messageList = await gmailClient.getMessages("", 10)
    console.log("[v0] Gmail API Message List Response:", messageList)
    
    const rawMessages = messageList.messages || []
    console.log("[v0] Raw messages count:", rawMessages.length)

    // 2단계: 개별 메시지 정보 가져오기
    const detailedMessages = await Promise.all(
      rawMessages.map(async (msg) => {
        const full = await gmailClient.getMessage(msg.id)
        const payload = full.payload
        const headers = payload.headers

        const subject = headers.find((h) => h.name === "Subject")?.value || "(No Subject)"
        const from = headers.find((h) => h.name === "From")?.value || ""
        const date = headers.find((h) => h.name === "Date")?.value || ""
        const snippet = full.snippet || ""

        const body = extractPlainTextFromPayload(payload)

        return {
          id: msg.id,
          threadId: msg.threadId,
          subject,
          from,
          snippet,
          body,
          date,
          isUnread: full.labelIds?.includes("UNREAD") || false,
        }
      }),
    )

    return NextResponse.json({ data: detailedMessages })
  } catch (error) {
    console.error("[v0] Gmail API Error:", {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      endpoint: error.config?.url,
    })
    console.error("Gmail API error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// 헬퍼 함수: plain text body 추출
function extractPlainTextFromPayload(payload: any): string {
  try {
    if (payload.body?.data) {
      return decodeBase64(payload.body.data)
    }

    const parts = payload.parts || []
    for (const part of parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data)
      }
    }

    return "(No content)"
  } catch {
    return "(Failed to extract body)"
  }
}

function decodeBase64(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf-8")
}

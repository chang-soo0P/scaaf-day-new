import { type NextRequest, NextResponse } from "next/server"
import { GmailClient } from "@/lib/gmail-client"

export async function DELETE(request: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const gmailClient = new GmailClient(accessToken)
    await gmailClient.deleteMessage(params.messageId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete message error:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}

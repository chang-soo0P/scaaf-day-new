import { type NextRequest, NextResponse } from "next/server"
import { GmailClient } from "@/lib/gmail-client"

export async function POST(request: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { addLabelIds = [], removeLabelIds = [] } = body

    const gmailClient = new GmailClient(accessToken)
    const result = await gmailClient.modifyMessage(params.messageId, addLabelIds, removeLabelIds)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Modify message error:", error)
    return NextResponse.json({ error: "Failed to modify message" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { GmailClient } from "@/lib/gmail-client"

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const gmailClient = new GmailClient(accessToken)
    const labels = await gmailClient.getLabels()

    return NextResponse.json(labels)
  } catch (error) {
    console.error("Gmail labels error:", error)
    return NextResponse.json({ error: "Failed to fetch labels" }, { status: 500 })
  }
}

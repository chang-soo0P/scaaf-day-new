import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const emails = await mockDB.getEmailsByUser(userId)
    return NextResponse.json({ data: emails })
  } catch (error) {
    console.error("Error fetching emails:", error)
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gmail_id, subject, from, snippet, summary, actions, user_id } = body

    if (!gmail_id || !subject || !from || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const email = await mockDB.insertEmail({
      gmail_id,
      subject,
      from,
      snippet: snippet || "",
      summary,
      actions,
      user_id,
    })

    return NextResponse.json({ data: email })
  } catch (error) {
    console.error("Error storing email:", error)
    return NextResponse.json({ error: "Failed to store email" }, { status: 500 })
  }
}

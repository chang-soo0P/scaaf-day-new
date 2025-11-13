import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user_id = request.nextUrl.searchParams.get("user_id")
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    }

    const email = await mockDB.getEmailById(params.id, user_id)

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    return NextResponse.json({ data: email })
  } catch (error) {
    console.error("Error fetching email:", error)
    return NextResponse.json({ error: "Failed to fetch email" }, { status: 500 })
  }
}

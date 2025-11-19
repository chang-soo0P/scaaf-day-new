import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Clear auth cookies by setting them to expire immediately
    response.cookies.set("gmail_access_token", "", {
      expires: new Date(0),
      path: "/",
    })
    response.cookies.set("gmail_refresh_token", "", {
      expires: new Date(0),
      path: "/",
    })
    
    // Also try delete method as fallback
    response.cookies.delete("gmail_access_token")
    response.cookies.delete("gmail_refresh_token")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}

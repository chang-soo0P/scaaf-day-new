import { type NextRequest, NextResponse } from "next/server"
import { GmailClient } from "@/lib/gmail-client"

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { messageIds, batchSize = 10 } = await request.json()

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json({ error: "Message IDs array is required" }, { status: 400 })
    }

    const gmail = new GmailClient(accessToken)
    const results = []

    for (let i = 0; i < messageIds.length; i += batchSize) {
      const batch = messageIds.slice(i, i + batchSize)

      const batchPromises = batch.map(async (messageId: string) => {
        try {
          const message = await gmail.getMessage(messageId)

          // Extract email content
          const subject = message.payload.headers.find((h) => h.name === "Subject")?.value || ""
          const sender = message.payload.headers.find((h) => h.name === "From")?.value || ""

          let content = ""
          if (message.payload.body?.data) {
            content = Buffer.from(message.payload.body.data, "base64").toString()
          } else if (message.payload.parts) {
            const textPart = message.payload.parts.find((part) => part.mimeType === "text/plain")
            if (textPart?.body?.data) {
              content = Buffer.from(textPart.body.data, "base64").toString()
            }
          }

          // Extract actions using AI
          const extractionResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/extract-actions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emailContent: content,
              subject,
              sender,
            }),
          })

          if (!extractionResponse.ok) {
            throw new Error("Extraction failed")
          }

          const extraction = await extractionResponse.json()

          return {
            messageId,
            subject,
            sender,
            extraction,
            processedAt: new Date().toISOString(),
          }
        } catch (error) {
          console.error(`Failed to process message ${messageId}:`, error)
          return {
            messageId,
            error: error instanceof Error ? error.message : "Processing failed",
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Add delay between batches to respect rate limits
      if (i + batchSize < messageIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Batch extraction error:", error)
    return NextResponse.json({ error: "Failed to process batch extraction" }, { status: 500 })
  }
}

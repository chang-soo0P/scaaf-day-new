import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const ActionItemSchema = z.object({
  type: z.enum(["deadline", "event", "rsvp", "location", "link"]),
  text: z.string(),
  confidence: z.number().min(0).max(1),
  dueDate: z.string().optional(),
  location: z.string().optional(),
  url: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
})

const ExtractedEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  confidence: z.number().min(0).max(1),
})

const ExtractionResultSchema = z.object({
  actionItems: z.array(ActionItemSchema),
  events: z.array(ExtractedEventSchema),
  summary: z.string(),
  keyQuotes: z.array(z.string()),
  extractionReasons: z.array(
    z.object({
      type: z.string(),
      method: z.string(),
      pattern: z.string(),
      confidence: z.number(),
    }),
  ),
})

export async function POST(request: NextRequest) {
  try {
    const { emailContent, subject, sender } = await request.json()

    if (!emailContent) {
      return NextResponse.json({ error: "Email content is required" }, { status: 400 })
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: ExtractionResultSchema,
      prompt: `
        Analyze this email and extract actionable items, events, and key information.
        
        Email Subject: ${subject || "No subject"}
        Sender: ${sender || "Unknown sender"}
        Content: ${emailContent}
        
        Extract:
        1. Action Items: deadlines, RSVPs, tasks, links that require action
        2. Events: meetings, conferences, webinars with dates/times
        3. Summary: 2-3 sentence summary of key points
        4. Key Quotes: Important sentences that convey urgency or key information
        5. Extraction Reasons: Explain how each item was identified
        
        For dates/times, convert to ISO format. Be conservative with confidence scores.
        Only extract items that clearly require action or are calendar-worthy events.
        
        Priority levels:
        - high: urgent deadlines, important events within 48 hours
        - medium: upcoming deadlines, scheduled events
        - low: optional items, distant future events
      `,
    })

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("Action extraction error:", error)
    return NextResponse.json({ error: "Failed to extract actions from email" }, { status: 500 })
  }
}

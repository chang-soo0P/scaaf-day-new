import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { emailContent, subject } = await request.json()

    if (!emailContent) {
      return NextResponse.json({ error: "Email content is required" }, { status: 400 })
    }

    // Mock mode disabled for production
    const isMockMode = false // process.env.NODE_ENV === "development" || !process.env.OPENAI_API_KEY

    if (isMockMode) {
      // Mock summary generation
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

      const mockSummaries = [
        "This email discusses project updates and upcoming deadlines. The sender is requesting feedback on the latest proposal. Action items include reviewing documents by Friday.",
        "Meeting invitation for next week's quarterly review. Agenda includes budget discussions and team performance metrics. Please confirm attendance by Wednesday.",
        "Newsletter update featuring new product launches and company announcements. Highlights include Q3 results and upcoming events. No immediate action required.",
      ]

      const randomSummary = mockSummaries[Math.floor(Math.random() * mockSummaries.length)]

      return NextResponse.json({
        summary: randomSummary,
        isMock: true,
      })
    }

    // Real OpenAI API call
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Summarize this email in exactly 3 concise bullet points. Focus on the main purpose, key information, and any action items.

Subject: ${subject}

Email Content:
${emailContent}

Format as:
• [Main purpose/topic]
• [Key information or details]
• [Action items or next steps]`,
      maxTokens: 200,
    })

    return NextResponse.json({
      summary: text,
      isMock: false,
    })
  } catch (error) {
    console.error("Email summarization error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}

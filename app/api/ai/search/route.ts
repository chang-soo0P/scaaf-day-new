import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { GmailClient } from "@/lib/gmail-client"

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value
    const { query, language = "ko" } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const gmailClient = new GmailClient(accessToken)

    // 먼저 Gmail API로 기본 검색 수행
    const messages = await gmailClient.getMessages(query, 30)
    const detailedMessages = await Promise.all(
      messages.messages?.slice(0, 15).map(async (msg) => {
        try {
          return await gmailClient.getMessage(msg.id)
        } catch (error) {
          return null
        }
      }) || [],
    )

    const validMessages = detailedMessages.filter(Boolean)

    // AI를 사용한 컨텍스트 분석 및 관련성 점수 계산
    const systemPrompt =
      language === "ko"
        ? "당신은 이메일 검색 전문가입니다. 사용자의 자연어 검색 쿼리를 분석하여 가장 관련성 높은 이메일을 찾아주세요."
        : "You are an email search expert. Analyze the user's natural language search query to find the most relevant emails."

    const emailData = validMessages.map((email) => ({
      id: email.id,
      subject: email.payload.headers.find((h) => h.name.toLowerCase() === "subject")?.value || "",
      from: email.payload.headers.find((h) => h.name.toLowerCase() === "from")?.value || "",
      snippet: email.snippet,
      date: new Date(Number.parseInt(email.internalDate)).toLocaleDateString(),
    }))

    const userPrompt =
      language === "ko"
        ? `검색 쿼리: "${query}"

다음 이메일들 중에서 검색 쿼리와 가장 관련성이 높은 순서로 정렬하고, 각각에 대해 관련성 점수(0-1)와 주요 키워드를 제공해주세요:

${emailData.map((email, idx) => `${idx + 1}. ID: ${email.id}, 제목: ${email.subject}, 발신자: ${email.from}, 내용: ${email.snippet}`).join("\n")}

각 이메일에 대해 다음 형식으로 응답해주세요:
ID: [이메일ID] | 점수: [0-1] | 키워드: [키워드1,키워드2,키워드3]`
        : `Search query: "${query}"

From the following emails, sort them by relevance to the search query and provide relevance score (0-1) and key keywords for each:

${emailData.map((email, idx) => `${idx + 1}. ID: ${email.id}, Subject: ${email.subject}, From: ${email.from}, Content: ${email.snippet}`).join("\n")}

For each email, respond in this format:
ID: [emailID] | Score: [0-1] | Keywords: [keyword1,keyword2,keyword3]`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    // AI 응답 파싱
    const results = text
      .split("\n")
      .filter((line) => line.includes("ID:"))
      .map((line) => {
        const parts = line.split("|")
        const idMatch = parts[0]?.match(/ID:\s*([^\s]+)/)
        const scoreMatch = parts[1]?.match(/점수|Score:\s*([\d.]+)/)
        const keywordsMatch = parts[2]?.match(/키워드|Keywords:\s*(.+)/)

        const emailId = idMatch?.[1]
        const score = Number.parseFloat(scoreMatch?.[1] || "0")
        const keywords = keywordsMatch?.[1]?.split(",").map((k) => k.trim()) || []

        const email = emailData.find((e) => e.id === emailId)
        if (!email) return null

        return {
          emailId: email.id,
          subject: email.subject,
          from: email.from,
          snippet: email.snippet,
          relevanceScore: score,
          keywords: keywords.slice(0, 3),
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("AI search error:", error)
    return NextResponse.json({ error: "Failed to perform AI search" }, { status: 500 })
  }
}

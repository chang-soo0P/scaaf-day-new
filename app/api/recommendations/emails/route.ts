import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { GmailClient } from "@/lib/gmail-client"

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value
    const { interests, patterns } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const gmailClient = new GmailClient(accessToken)

    // 최근 이메일들 가져오기 (추천에서 제외할 최근 읽은 이메일들)
    const messages = await gmailClient.getMessages("", 100)
    const detailedMessages = await Promise.all(
      messages.messages?.slice(20, 80).map(async (msg) => {
        // 최근 20개는 제외하고 그 다음 60개에서 추천
        try {
          return await gmailClient.getMessage(msg.id)
        } catch (error) {
          return null
        }
      }) || [],
    )

    const validMessages = detailedMessages.filter(Boolean)

    // AI를 사용하여 관련 이메일 추천
    const emailData = validMessages.map((email) => ({
      id: email.id,
      subject: email.payload.headers.find((h) => h.name.toLowerCase() === "subject")?.value || "",
      from: email.payload.headers.find((h) => h.name.toLowerCase() === "from")?.value || "",
      snippet: email.snippet,
    }))

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "당신은 이메일 추천 전문가입니다. 사용자의 관심사와 패턴을 기반으로 관련성 높은 이메일을 추천하세요.",
      prompt: `사용자 관심사: ${interests.join(", ")}
주요 키워드: ${patterns.topKeywords.map((k: any) => k.keyword).join(", ")}

다음 이메일들 중에서 사용자 관심사와 가장 관련성이 높은 5개를 선별하고 추천 이유를 설명해주세요:

${emailData.map((email, idx) => `${idx + 1}. ID: ${email.id}, 제목: ${email.subject}, 발신자: ${email.from}, 내용: ${email.snippet}`).join("\n")}

각 추천 이메일에 대해 다음 형식으로 응답해주세요:
ID: [이메일ID]
관련성점수: [0.0-1.0]
추천이유: [간단한 이유]
관련관심사: [관심사1,관심사2]

---`,
    })

    // AI 응답 파싱
    const emailBlocks = text.split("---").filter((block) => block.trim())
    const emailRecommendations = emailBlocks
      .map((block) => {
        const lines = block.trim().split("\n")
        const idLine = lines
          .find((line) => line.startsWith("ID:"))
          ?.replace("ID:", "")
          .trim()
        const scoreLine = lines
          .find((line) => line.startsWith("관련성점수:"))
          ?.replace("관련성점수:", "")
          .trim()
        const reasonLine = lines
          .find((line) => line.startsWith("추천이유:"))
          ?.replace("추천이유:", "")
          .trim()
        const interestsLine = lines
          .find((line) => line.startsWith("관련관심사:"))
          ?.replace("관련관심사:", "")
          .trim()

        const email = emailData.find((e) => e.id === idLine)
        if (!email) return null

        return {
          id: email.id,
          subject: email.subject,
          from: email.from,
          snippet: email.snippet,
          relevanceScore: scoreLine ? Number.parseFloat(scoreLine) : Math.random() * 0.5 + 0.5,
          reason: reasonLine || "관심사와 관련된 내용",
          matchingInterests: interestsLine ? interestsLine.split(",").map((i) => i.trim()) : [],
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    return NextResponse.json({ emails: emailRecommendations })
  } catch (error) {
    console.error("Email recommendation error:", error)
    return NextResponse.json({ error: "Failed to get email recommendations" }, { status: 500 })
  }
}

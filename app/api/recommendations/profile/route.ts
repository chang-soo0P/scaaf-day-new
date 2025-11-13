import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { GmailClient } from "@/lib/gmail-client"

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const gmailClient = new GmailClient(accessToken)

    // 최근 이메일들 분석
    const messages = await gmailClient.getMessages("", 100)
    const detailedMessages = await Promise.all(
      messages.messages?.slice(0, 50).map(async (msg) => {
        try {
          return await gmailClient.getMessage(msg.id)
        } catch (error) {
          return null
        }
      }) || [],
    )

    const validMessages = detailedMessages.filter(Boolean)

    // 이메일 데이터 추출
    const emailData = validMessages.map((email) => ({
      subject: email.payload.headers.find((h) => h.name.toLowerCase() === "subject")?.value || "",
      from: email.payload.headers.find((h) => h.name.toLowerCase() === "from")?.value || "",
      snippet: email.snippet,
      date: new Date(Number.parseInt(email.internalDate)),
    }))

    // AI를 사용한 사용자 프로필 분석
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "당신은 이메일 패턴 분석 전문가입니다. 사용자의 이메일을 분석하여 관심사와 패턴을 추출하세요.",
      prompt: `다음 이메일들을 분석하여 사용자의 관심사와 패턴을 추출해주세요:

${emailData.map((email) => `제목: ${email.subject}, 발신자: ${email.from}, 내용: ${email.snippet}`).join("\n")}

다음 형식으로 응답해주세요:
관심사: [관심사1, 관심사2, 관심사3, 관심사4, 관심사5]
주요키워드: [키워드1:빈도, 키워드2:빈도, 키워드3:빈도]`,
    })

    // AI 응답 파싱
    const interestsMatch = text.match(/관심사:\s*\[(.*?)\]/)
    const keywordsMatch = text.match(/주요키워드:\s*\[(.*?)\]/)

    const interests = interestsMatch
      ? interestsMatch[1]
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      : []

    const keywords = keywordsMatch
      ? keywordsMatch[1]
          .split(",")
          .map((k) => {
            const [keyword, freq] = k.split(":").map((s) => s.trim())
            return { keyword, frequency: Number.parseInt(freq) || 1 }
          })
          .filter((k) => k.keyword)
      : []

    // 발신자 분석
    const senderCounts: { [key: string]: number } = {}
    emailData.forEach((email) => {
      const sender = email.from.toLowerCase()
      senderCounts[sender] = (senderCounts[sender] || 0) + 1
    })

    const topSenders = Object.entries(senderCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([email, count]) => ({ email, count }))

    // 카테고리 분류
    const categories = {
      업무: emailData.filter(
        (email) =>
          email.subject.includes("회의") ||
          email.subject.includes("업무") ||
          email.subject.includes("프로젝트") ||
          email.subject.includes("미팅"),
      ).length,
      개인: emailData.filter(
        (email) => email.from.includes("gmail") || email.subject.includes("개인") || email.subject.includes("친구"),
      ).length,
      쇼핑: emailData.filter(
        (email) =>
          email.subject.includes("주문") ||
          email.subject.includes("배송") ||
          email.subject.includes("쇼핑") ||
          email.subject.includes("결제"),
      ).length,
      뉴스: emailData.filter(
        (email) =>
          email.subject.includes("뉴스") ||
          email.subject.includes("소식") ||
          email.from.includes("news") ||
          email.from.includes("newsletter"),
      ).length,
    }

    // 검색 이력 (실제로는 데이터베이스에서 가져와야 함)
    const searchHistory = [
      { query: "AI 기술 동향", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { query: "프로젝트 관리", timestamp: new Date(Date.now() - 172800000).toISOString() },
      { query: "마케팅 전략", timestamp: new Date(Date.now() - 259200000).toISOString() },
    ]

    const userProfile = {
      interests,
      emailPatterns: {
        topSenders,
        topKeywords: keywords,
        categories,
      },
      searchHistory,
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Profile analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze profile" }, { status: 500 })
  }
}

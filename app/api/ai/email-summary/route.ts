import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { GmailClient } from "@/lib/gmail-client"

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("gmail_access_token")?.value
    const { language = "ko" } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const gmailClient = new GmailClient(accessToken)

    // 최근 이메일들 가져오기
    const messages = await gmailClient.getMessages("", 50)
    const detailedMessages = await Promise.all(
      messages.messages?.slice(0, 20).map(async (msg) => {
        try {
          return await gmailClient.getMessage(msg.id)
        } catch (error) {
          return null
        }
      }) || [],
    )

    const validMessages = detailedMessages.filter(Boolean)

    // 이메일 데이터 준비
    const emailData = validMessages.map((email) => ({
      subject: email.payload.headers.find((h) => h.name.toLowerCase() === "subject")?.value || "",
      from: email.payload.headers.find((h) => h.name.toLowerCase() === "from")?.value || "",
      snippet: email.snippet,
      date: new Date(Number.parseInt(email.internalDate)).toLocaleDateString(),
    }))

    // AI를 사용한 이메일 요약 생성
    const systemPrompt =
      language === "ko"
        ? "당신은 이메일 분석 전문가입니다. 주어진 이메일들을 분석하여 간결하고 유용한 요약을 제공하세요."
        : "You are an email analysis expert. Analyze the given emails and provide a concise and useful summary."

    const userPrompt =
      language === "ko"
        ? `다음 이메일들을 분석하여 요약해주세요:
${emailData.map((email) => `제목: ${email.subject}, 발신자: ${email.from}, 내용: ${email.snippet}`).join("\n")}

다음 형식으로 응답해주세요:
1. 전체적인 요약 (2-3문장)
2. 주요 키워드 5개 (쉼표로 구분)
3. 카테고리별 분류 (업무, 개인, 프로모션, 기타)`
        : `Please analyze the following emails and provide a summary:
${emailData.map((email) => `Subject: ${email.subject}, From: ${email.from}, Content: ${email.snippet}`).join("\n")}

Please respond in the following format:
1. Overall summary (2-3 sentences)
2. Top 5 keywords (comma separated)
3. Category classification (work, personal, promotion, other)`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    // AI 응답 파싱
    const lines = text.split("\n").filter((line) => line.trim())
    const summary =
      lines.find((line) => line.includes("요약") || line.includes("summary"))?.replace(/^\d+\.\s*/, "") ||
      text.slice(0, 200)
    const keywordsLine = lines.find((line) => line.includes("키워드") || line.includes("keyword"))
    const keywords = keywordsLine
      ? keywordsLine
          .split(":")[1]
          ?.split(",")
          .map((k) => k.trim()) || []
      : []

    // 카테고리 분류
    const categories = {
      업무: emailData.filter(
        (email) =>
          email.subject.includes("회의") || email.subject.includes("업무") || email.subject.includes("프로젝트"),
      ).length,
      개인: emailData.filter((email) => email.from.includes("gmail") || email.subject.includes("개인")).length,
      프로모션: emailData.filter(
        (email) => email.subject.includes("할인") || email.subject.includes("이벤트") || email.subject.includes("광고"),
      ).length,
      기타: 0,
    }
    categories.기타 = emailData.length - categories.업무 - categories.개인 - categories.프로모션

    const result = {
      totalEmails: emailData.length,
      importantEmails: emailData.slice(0, 5).map((email) => email.subject),
      categories,
      summary,
      keyTopics: keywords.slice(0, 8),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Email summary error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}

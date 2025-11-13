import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const TopicSummarySchema = z.object({
  topics: z.array(z.object({
    id: z.string(),
    title: z.string().describe("주제 제목"),
    keywords: z.array(z.string()).describe("핵심 키워드 3-5개"),
    summary: z.string().describe("3줄 이내 요약"),
    emailCount: z.number().describe("해당 주제의 이메일 수"),
    emails: z.array(z.object({
      id: z.string(),
      subject: z.string(),
      sender: z.string(),
      date: z.string()
    })).describe("해당 주제의 이메일 목록"),
    category: z.string().describe("주제 카테고리"),
    importance: z.enum(["high", "medium", "low"]).describe("중요도")
  })).describe("주제별 요약 목록")
})

export async function POST(request: NextRequest) {
  try {
    const { emails, dateRange } = await request.json()

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 })
    }

    // Mock mode disabled for production
    const isMockMode = false // process.env.NODE_ENV === "development" || !process.env.OPENAI_API_KEY

    if (isMockMode) {
      // Mock topic summary generation
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate API delay

      const mockTopics = [
        {
          id: "topic-1",
          title: "AI 기술 동향",
          keywords: ["ChatGPT", "OpenAI", "AI 모델", "머신러닝", "자연어처리"],
          summary: "이번 주 AI 업계에서는 ChatGPT-4 업데이트와 새로운 AI 모델들이 주목받고 있습니다. 특히 자연어처리 기술의 발전과 실용화가 가속화되고 있으며, 다양한 산업 분야에서 AI 도입이 확산되고 있습니다.",
          emailCount: 5,
          emails: [
            { id: "email-1", subject: "ChatGPT-4 새로운 기능 발표", sender: "OpenAI", date: "2024-01-15" },
            { id: "email-2", subject: "AI 스타트업 펀딩 소식", sender: "TechCrunch", date: "2024-01-14" },
            { id: "email-3", subject: "머신러닝 트렌드 리포트", sender: "ML Weekly", date: "2024-01-13" },
            { id: "email-4", subject: "자연어처리 기술 동향", sender: "NLP News", date: "2024-01-12" },
            { id: "email-5", subject: "AI 윤리 가이드라인", sender: "AI Ethics", date: "2024-01-11" }
          ],
          category: "기술",
          importance: "high"
        },
        {
          id: "topic-2",
          title: "경제 시장 동향",
          keywords: ["금리", "주식시장", "인플레이션", "경제지표", "연준"],
          summary: "연준의 금리 정책과 주식시장 동향이 경제 전반에 영향을 미치고 있습니다. 인플레이션 지표 개선과 함께 기술주 중심의 시장 상승세가 지속되고 있으며, 투자자들의 관심이 집중되고 있습니다.",
          emailCount: 4,
          emails: [
            { id: "email-6", subject: "연준 금리 정책 발표", sender: "Federal Reserve", date: "2024-01-15" },
            { id: "email-7", subject: "주식시장 주간 리포트", sender: "Market Watch", date: "2024-01-14" },
            { id: "email-8", subject: "인플레이션 지표 분석", sender: "Economic Times", date: "2024-01-13" },
            { id: "email-9", subject: "기술주 투자 전략", sender: "Investment Weekly", date: "2024-01-12" }
          ],
          category: "경제",
          importance: "high"
        },
        {
          id: "topic-3",
          title: "스타트업 생태계",
          keywords: ["펀딩", "벤처캐피털", "스타트업", "투자", "성장"],
          summary: "스타트업 생태계에서 새로운 펀딩 라운드와 투자 소식이 잇따르고 있습니다. 특히 AI와 핀테크 분야의 스타트업들이 큰 관심을 받고 있으며, 벤처캐피털의 투자 활동이 활발해지고 있습니다.",
          emailCount: 3,
          emails: [
            { id: "email-10", subject: "스타트업 펀딩 뉴스", sender: "Startup News", date: "2024-01-15" },
            { id: "email-11", subject: "벤처캐피털 투자 동향", sender: "VC Weekly", date: "2024-01-14" },
            { id: "email-12", subject: "핀테크 스타트업 성장", sender: "Fintech Today", date: "2024-01-13" }
          ],
          category: "비즈니스",
          importance: "medium"
        }
      ]

      return NextResponse.json({
        topics: mockTopics,
        isMock: true,
      })
    }

    // Real OpenAI API call
    const emailData = emails.map((email: any) => ({
      subject: email.subject,
      sender: email.sender,
      content: email.snippet || email.body || "",
      date: email.date
    }))

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: TopicSummarySchema,
      prompt: `
        주어진 뉴스레터 이메일들을 분석하여 주제별로 그룹핑하고 요약해주세요.
        
        분석 기간: ${dateRange?.label || "선택된 기간"}
        이메일 수: ${emails.length}개
        
        이메일 데이터:
        ${emailData.map((email, index) => `
        ${index + 1}. 제목: ${email.subject}
           발신자: ${email.sender}
           날짜: ${email.date}
           내용: ${email.content}
        `).join('\n')}
        
        다음 기준으로 분석해주세요:
        1. 유사한 주제나 키워드를 가진 이메일들을 그룹핑
        2. 각 주제별로 핵심 키워드 3-5개 추출
        3. 각 주제를 3줄 이내로 요약
        4. 이메일 수가 많은 순서대로 정렬
        5. 중요도 평가 (high/medium/low)
        
        주제별로 명확하게 구분하고, 중복되는 내용은 통합하여 정리해주세요.
        각 주제는 독립적이고 구체적인 내용으로 구성해주세요.
      `,
    })

    return NextResponse.json({
      topics: result.object.topics,
      isMock: false,
    })
  } catch (error) {
    console.error("Topic summary generation error:", error)
    return NextResponse.json({ error: "Failed to generate topic summary" }, { status: 500 })
  }
}

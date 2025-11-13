import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const NewsletterDigestSchema = z.object({
  summary: z.string().describe("3줄 이내의 핵심 요약"),
  keyPoints: z.array(z.string()).describe("실제 쓸만한 핵심 정보 3-5개"),
  links: z.array(z.object({
    url: z.string(),
    title: z.string(),
    description: z.string().optional()
  })).describe("중요한 링크들"),
  dates: z.array(z.object({
    date: z.string(),
    event: z.string(),
    importance: z.enum(["high", "medium", "low"])
  })).describe("중요한 날짜/이벤트"),
  numbers: z.array(z.object({
    value: z.string(),
    context: z.string(),
    significance: z.string()
  })).describe("중요한 숫자/통계"),
  quotes: z.array(z.string()).describe("핵심 인용구 2-3개"),
  category: z.string().describe("뉴스레터 카테고리 (기술, 비즈니스, 뉴스 등)"),
  readTime: z.number().describe("예상 읽기 시간 (분)")
})

export async function POST(request: NextRequest) {
  try {
    const { emailContent, subject, sender } = await request.json()

    if (!emailContent) {
      return NextResponse.json({ error: "Email content is required" }, { status: 400 })
    }

    // Mock mode disabled for production
    const isMockMode = false // process.env.NODE_ENV === "development" || !process.env.OPENAI_API_KEY

    if (isMockMode) {
      // Mock newsletter digest generation
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay

      const mockDigests = [
        {
          summary: "이번 주 AI 업계 주요 동향과 새로운 도구들 소개. 특히 ChatGPT-4 업데이트와 새로운 AI 스타트업들의 펀딩 소식이 주목할 만합니다.",
          keyPoints: [
            "ChatGPT-4 새로운 기능: 이미지 분석 능력 대폭 향상",
            "AI 스타트업 3곳이 총 1억 달러 펀딩 확보",
            "Google Bard의 한국어 지원 정식 출시",
            "OpenAI API 가격 30% 인하 발표",
            "AI 윤리 가이드라인 국제 표준화 논의 시작"
          ],
          links: [
            {
              url: "https://openai.com/blog/chatgpt-4-update",
              title: "ChatGPT-4 업데이트 공식 발표",
              description: "새로운 기능과 개선사항 상세 설명"
            },
            {
              url: "https://example.com/ai-funding-news",
              title: "AI 스타트업 펀딩 뉴스",
              description: "주요 투자 라운드 소식"
            }
          ],
          dates: [
            {
              date: "2024-01-15",
              event: "AI 컨퍼런스 2024",
              importance: "high"
            },
            {
              date: "2024-01-20",
              event: "ChatGPT 워크샵",
              importance: "medium"
            }
          ],
          numbers: [
            {
              value: "1억 달러",
              context: "AI 스타트업 펀딩",
              significance: "역대 최대 규모"
            },
            {
              value: "30%",
              context: "OpenAI API 가격 인하",
              significance: "개발자 부담 감소"
            }
          ],
          quotes: [
            "AI는 도구가 아니라 파트너가 되어야 한다",
            "2024년은 AI의 실용화 원년이 될 것이다"
          ],
          category: "기술",
          readTime: 3
        },
        {
          summary: "주요 경제 지표와 시장 동향 분석. 금리 인하 기대감과 함께 주식시장 상승세가 이어지고 있으며, 특히 기술주와 에너지주가 강세를 보이고 있습니다.",
          keyPoints: [
            "연준 금리 인하 가능성 80%로 상승",
            "나스닥 3% 상승, 기술주 강세",
            "원유 가격 배럴당 85달러 돌파",
            "비트코인 5만 달러 재돌파",
            "실업률 3.2%로 2개월 연속 하락"
          ],
          links: [
            {
              url: "https://fed.gov/interest-rates",
              title: "연준 금리 정책 발표",
              description: "다음 FOMC 회의 일정 및 예상"
            }
          ],
          dates: [
            {
              date: "2024-01-31",
              event: "FOMC 회의",
              importance: "high"
            }
          ],
          numbers: [
            {
              value: "3%",
              context: "나스닥 상승률",
              significance: "기술주 강세 지속"
            },
            {
              value: "85달러",
              context: "원유 가격",
              significance: "에너지 인플레이션 우려"
            }
          ],
          quotes: [
            "금리 인하 기대감이 시장을 견인하고 있다",
            "기술주는 여전히 성장 동력이 충분하다"
          ],
          category: "경제",
          readTime: 4
        }
      ]

      const randomDigest = mockDigests[Math.floor(Math.random() * mockDigests.length)]

      return NextResponse.json({
        ...randomDigest,
        isMock: true,
      })
    }

    // Real OpenAI API call
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: NewsletterDigestSchema,
      prompt: `
        뉴스레터 이메일을 분석하여 실제로 쓸만한 핵심 정보만 추출해주세요.
        
        제목: ${subject || "제목 없음"}
        발신자: ${sender || "알 수 없음"}
        내용: ${emailContent}
        
        다음 기준으로 분석해주세요:
        1. CTA(행동 유도) 링크와 버튼
        2. 중요한 날짜, 시간, 이벤트
        3. 숫자, 통계, 수치 데이터
        4. 핵심 인용구나 명언
        5. 실제로 클릭하거나 행동할 만한 정보
        
        불필요한 마케팅 문구나 장황한 설명은 제외하고, 
        독자가 실제로 활용할 수 있는 실용적인 정보만 추출해주세요.
        
        요약은 3줄 이내로, 핵심만 간결하게 작성해주세요.
      `,
    })

    return NextResponse.json({
      ...result.object,
      isMock: false,
    })
  } catch (error) {
    console.error("Newsletter digest extraction error:", error)
    return NextResponse.json({ error: "Failed to extract newsletter digest" }, { status: 500 })
  }
}

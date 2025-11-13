import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { interests, keywords } = await request.json()

    // 관심사와 키워드를 기반으로 뉴스 검색 쿼리 생성
    const searchQueries = [...interests, ...keywords.slice(0, 3)].slice(0, 5)

    // 실제 구현에서는 뉴스 API (예: NewsAPI, Google News API)를 사용
    // 여기서는 AI를 사용하여 가상의 뉴스 추천을 생성
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "당신은 뉴스 큐레이터입니다. 사용자의 관심사에 맞는 최신 뉴스를 추천하세요.",
      prompt: `다음 관심사와 키워드를 기반으로 관련 뉴스 5개를 추천해주세요:
관심사: ${interests.join(", ")}
키워드: ${keywords.map((k: any) => k.keyword || k).join(", ")}

각 뉴스에 대해 다음 형식으로 응답해주세요:
제목: [뉴스 제목]
요약: [2-3문장 요약]
출처: [뉴스 출처]
관련키워드: [키워드1,키워드2,키워드3]
관련성점수: [0.0-1.0]

---`,
    })

    // AI 응답을 파싱하여 뉴스 추천 생성
    const newsBlocks = text.split("---").filter((block) => block.trim())
    const newsRecommendations = newsBlocks.map((block, index) => {
      const lines = block.trim().split("\n")
      const title =
        lines
          .find((line) => line.startsWith("제목:"))
          ?.replace("제목:", "")
          .trim() || `뉴스 ${index + 1}`
      const summary =
        lines
          .find((line) => line.startsWith("요약:"))
          ?.replace("요약:", "")
          .trim() || "요약 정보가 없습니다."
      const source =
        lines
          .find((line) => line.startsWith("출처:"))
          ?.replace("출처:", "")
          .trim() || "알 수 없음"
      const keywordsLine = lines
        .find((line) => line.startsWith("관련키워드:"))
        ?.replace("관련키워드:", "")
        .trim()
      const matchingKeywords = keywordsLine ? keywordsLine.split(",").map((k) => k.trim()) : []
      const scoreLine = lines
        .find((line) => line.startsWith("관련성점수:"))
        ?.replace("관련성점수:", "")
        .trim()
      const relevanceScore = scoreLine ? Number.parseFloat(scoreLine) : Math.random() * 0.5 + 0.5

      return {
        id: `news-${index}`,
        title,
        summary,
        url: `https://example-news.com/article-${index}`, // 실제로는 뉴스 API에서 제공
        source,
        publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // 최근 7일 내 랜덤
        relevanceScore,
        matchingKeywords,
      }
    })

    return NextResponse.json({ news: newsRecommendations })
  } catch (error) {
    console.error("News recommendation error:", error)
    return NextResponse.json({ error: "Failed to get news recommendations" }, { status: 500 })
  }
}

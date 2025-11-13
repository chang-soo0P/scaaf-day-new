import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { title, date, time, description, language = "ko" } = await request.json()

    // AI를 사용하여 스케줄 최적화 및 제안
    const systemPrompt =
      language === "ko"
        ? "당신은 일정 관리 전문가입니다. 사용자의 일정을 분석하여 최적화된 스케줄과 유용한 제안을 제공하세요."
        : "You are a schedule management expert. Analyze the user's schedule and provide optimized scheduling and useful suggestions."

    const userPrompt =
      language === "ko"
        ? `다음 일정을 분석하고 개선 제안을 해주세요:
제목: ${title}
날짜: ${date}
시간: ${time || "미정"}
설명: ${description || "없음"}

다음을 포함하여 응답해주세요:
1. 일정 분석 및 카테고리 분류
2. 시간 최적화 제안 (시간이 미정인 경우)
3. 준비사항 또는 체크리스트 제안`
        : `Please analyze the following schedule and provide improvement suggestions:
Title: ${title}
Date: ${date}
Time: ${time || "TBD"}
Description: ${description || "None"}

Please include in your response:
1. Schedule analysis and category classification
2. Time optimization suggestions (if time is TBD)
3. Preparation items or checklist suggestions`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    // AI 제안을 포함한 스케줄 반환
    const enhancedSchedule = {
      title,
      date,
      time: time || "09:00", // 기본 시간 설정
      description: description || text.slice(0, 200),
      aiSuggestions: text,
    }

    return NextResponse.json(enhancedSchedule)
  } catch (error) {
    console.error("Schedule creation error:", error)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}

"use client"

import { useState } from "react"
import { useDailyLimit } from "./use-daily-limit"

interface TopicSummary {
  id: string
  title: string
  keywords: string[]
  summary: string
  emailCount: number
  emails: Array<{
    id: string
    subject: string
    sender: string
    date: string
  }>
  category: string
  importance: "high" | "medium" | "low"
}

interface UseTopicSummaryReturn {
  topics: TopicSummary[]
  isLoading: boolean
  error: string | null
  generateTopicSummary: (emails: any[], dateRange: any) => Promise<void>
  currentCount: number
  maxCount: number
  isAtLimit: boolean
  remainingCount: number
}

export function useTopicSummary(): UseTopicSummaryReturn {
  const [topics, setTopics] = useState<TopicSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { 
    currentCount, 
    maxCount, 
    isAtLimit, 
    remainingCount, 
    canProcess, 
    incrementCount 
  } = useDailyLimit(3)

  const generateTopicSummary = async (emails: any[], dateRange: any) => {
    if (!canProcess()) {
      setError('하루 3건 제한에 도달했습니다. 내일 다시 시도하거나 Pro 플랜으로 업그레이드하세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/topic-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails,
          dateRange
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate topic summary')
      }

      const data = await response.json()
      
      // Sort topics by email count (descending)
      const sortedTopics = data.topics.sort((a: TopicSummary, b: TopicSummary) => 
        b.emailCount - a.emailCount
      )
      
      setTopics(sortedTopics)
      incrementCount()
    } catch (error) {
      console.error('Topic summary generation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate topic summary')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    topics,
    isLoading,
    error,
    generateTopicSummary,
    currentCount,
    maxCount,
    isAtLimit,
    remainingCount
  }
}

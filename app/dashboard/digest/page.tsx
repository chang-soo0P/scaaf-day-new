"use client"

import { useState, useEffect } from "react"
import { useGmailMessages } from "@/hooks/use-gmail-api"
import { useTopicSummary } from "@/hooks/use-topic-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  RefreshCw, 
  Mail, 
  AlertCircle, 
  Inbox, 
  Sparkles, 
  TrendingUp,
  FileText,
  Zap,
  Calendar,
  Clock,
  Crown
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DateRangePicker, type DateRange } from "@/components/date-range-picker"
import { TopicCard } from "@/components/topic-card"

export default function DigestPage() {
  const { data: messages, isLoading: messagesLoading, error: messagesError, refetch } = useGmailMessages()
  const { 
    topics, 
    isLoading: topicLoading, 
    error: topicError, 
    generateTopicSummary,
    currentCount,
    maxCount,
    isAtLimit,
    remainingCount
  } = useTopicSummary()
  const router = useRouter()
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null)
  const [filteredMessages, setFilteredMessages] = useState<any[]>([])

  const handleEmailClick = (emailId: string) => {
    router.push(`/dashboard/inbox/${emailId}`)
  }

  const handleDateRangeChange = (range: DateRange) => {
    setSelectedDateRange(range)
    
    // Filter messages by date range
    if (messages && Array.isArray(messages)) {
      const filtered = messages.filter((message: any) => {
        const messageDate = new Date(message.date)
        return messageDate >= range.from && messageDate <= range.to
      })
      setFilteredMessages(filtered)
    }
  }

  const handleGenerateSummary = async () => {
    if (!selectedDateRange || filteredMessages.length === 0) return
    
    await generateTopicSummary(filteredMessages, selectedDateRange)
  }

  const isNewsletter = (message: any) => {
    const subject = message.subject?.toLowerCase() || ""
    const sender = message.sender?.toLowerCase() || ""
    
    // Newsletter indicators
    const newsletterKeywords = [
      "newsletter", "digest", "weekly", "daily", "update", "roundup",
      "뉴스레터", "다이제스트", "주간", "일간", "업데이트", "라운드업"
    ]
    
    return newsletterKeywords.some(keyword => 
      subject.includes(keyword) || sender.includes(keyword)
    )
  }

  if (messagesLoading || topicLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (messagesError || topicError) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-medium mb-2">데이터 로드 실패</div>
              <div className="text-sm mb-3">
                {messagesError || topicError}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">뉴스레터 다이제스트</h1>
              <p className="text-gray-600 mt-1">뉴스레터에서 핵심 정보만 추출해드립니다</p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>

          <Card>
            <CardContent className="p-12 text-center">
              <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">뉴스레터가 없습니다</h2>
              <p className="text-gray-600 mb-4">
                뉴스레터 이메일을 찾을 수 없습니다. Gmail 계정을 확인하거나 새로고침해보세요.
              </p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const newsletterMessages = messages.filter(isNewsletter)

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">뉴스레터 다이제스트</h1>
            <p className="text-gray-600 mt-1">
              뉴스레터에서 핵심 정보만 추출해드립니다 • {topics.length}개 주제 분석됨
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
        </div>

        {/* Daily Limit Banner */}
        {isAtLimit && (
          <Alert className="border-orange-200 bg-orange-50 mb-6">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="font-medium mb-2">하루 요약 한도 도달</div>
              <div className="text-sm mb-3">
                무료 사용자는 하루 3건까지만 요약할 수 있습니다. 더 많은 요약을 원하시면 Pro 플랜으로 업그레이드하세요.
              </div>
              <Button size="sm" onClick={() => router.push('/dashboard/pricing')} className="bg-orange-600 hover:bg-orange-700">
                <Crown className="w-3 h-3 mr-1" />
                Pro로 업그레이드
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Date Range Picker */}
        <div className="mb-8">
          <DateRangePicker 
            onDateRangeChange={handleDateRangeChange}
            isLoading={topicLoading}
          />
        </div>

        {/* Summary Button */}
        {selectedDateRange && filteredMessages.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">
                        {selectedDateRange.label}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {filteredMessages.length}개 이메일
                    </Badge>
                    {!isAtLimit && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {remainingCount}회 남음
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={handleGenerateSummary}
                    disabled={topicLoading || isAtLimit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {topicLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        요약하기
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Topic Results */}
        {topics.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">주제별 요약</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {topics.length}개 주제
              </Badge>
            </div>
            <div className="space-y-4">
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onEmailClick={handleEmailClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedDateRange && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">기간을 선택해주세요</h2>
              <p className="text-gray-600 mb-4">
                분석할 기간을 선택한 후 "요약하기" 버튼을 클릭하세요.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedDateRange && filteredMessages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">해당 기간에 뉴스레터가 없습니다</h2>
              <p className="text-gray-600 mb-4">
                선택한 기간에 뉴스레터 이메일이 없습니다. 다른 기간을 선택해보세요.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

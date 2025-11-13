"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Sparkles, Mail, Calendar, Volume2, Copy, List, MessageSquare, User, Bot } from "lucide-react"
import { useAppContext } from "@/lib/app-context"
import { useToast } from "@/hooks/use-toast"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    type: "summary" | "search" | "schedule" | "general"
    data?: any
  }
}

interface SearchResult {
  emailId: string
  subject: string
  from: string
  snippet: string
  relevanceScore: number
  keywords: string[]
}

export function AIBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"chat" | "list">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addToSearchHistory, setSelectedEmailId } = useAppContext()
  const { toast } = useToast()

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "assistant",
      content:
        "안녕하세요! Gmail AI 어시스턴트입니다. 무엇을 도와드릴까요?\n\n다음과 같은 작업을 할 수 있습니다:\n• 📧 이메일 요약 및 분석\n• 🔍 자연어 기반 이메일 검색\n• 📅 일정 생성 및 관리\n• 💡 개인화된 추천",
      timestamp: new Date(),
      metadata: { type: "general" },
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    addToSearchHistory(inputValue)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const response = await processUserQuery(inputValue)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        metadata: response.metadata,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("AI 처리 오류:", error)
      toast({
        title: "오류 발생",
        description: "AI 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const processUserQuery = async (query: string): Promise<{ content: string; metadata?: any }> => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("요약") || lowerQuery.includes("summary")) {
      return {
        content:
          "📊 **오늘의 이메일 요약**\n\n• 총 5개의 새 이메일\n• 중요: 회의 일정 2건\n• 업무: 프로젝트 관련 2건\n• 기타: 시스템 알림 1건\n\n**주요 키워드**: 회의, 프로젝트, 마케팅, 시스템 업데이트\n\n가장 중요한 이메일은 김영희님의 '다음 주 회의 일정 논의'입니다.",
        metadata: { type: "summary" },
      }
    }

    if (lowerQuery.includes("검색") || lowerQuery.includes("찾") || lowerQuery.includes("search")) {
      const mockResults: SearchResult[] = [
        {
          emailId: "1",
          subject: "다음 주 회의 일정 논의",
          from: "김영희 <younghee.kim@company.com>",
          snippet: "다음 주 화요일 오후 2시에 회의실 A에서 프로젝트 회의를 진행하려고 합니다.",
          relevanceScore: 0.95,
          keywords: ["회의", "일정", "프로젝트"],
        },
        {
          emailId: "2",
          subject: "Q1 마케팅 캠페인 제안서",
          from: "박민수 <minsu.park@marketing.com>",
          snippet: "2025년 1분기 마케팅 캠페인 제안서를 보내드립니다.",
          relevanceScore: 0.87,
          keywords: ["마케팅", "캠페인", "제안서"],
        },
      ]

      return {
        content: `🔍 **검색 결과** (${mockResults.length}개 발견)\n\n${mockResults
          .map(
            (result, index) =>
              `**${index + 1}. ${result.subject}**\n발신자: ${result.from}\n내용: ${result.snippet}\n일치도: ${Math.round(result.relevanceScore * 100)}%\n키워드: ${result.keywords.join(", ")}\n`,
          )
          .join("\n")}`,
        metadata: { type: "search", data: mockResults },
      }
    }

    if (lowerQuery.includes("일정") || lowerQuery.includes("스케줄") || lowerQuery.includes("schedule")) {
      return {
        content:
          "📅 **일정 관리**\n\n이메일에서 발견된 일정:\n\n• **회의**: 12월 10일 (화) 14:00 - 회의실 A\n• **연말 파티**: 12월 20일 (금) 18:00 - 호텔 그랜드\n\n새로운 일정을 추가하시겠습니까? 자연어로 말씀해주세요.\n예: '내일 오후 3시에 팀 미팅 일정 추가해줘'",
        metadata: { type: "schedule" },
      }
    }

    return {
      content: `💭 **AI 분석 결과**\n\n"${query}"에 대해 분석했습니다.\n\n더 구체적인 도움이 필요하시면:\n• "이메일 요약해줘" - 오늘의 이메일 요약\n• "회의 관련 이메일 찾아줘" - 특정 키워드 검색\n• "일정 정리해줘" - 스케줄 관리\n\n어떤 작업을 도와드릴까요?`,
      metadata: { type: "general" },
    }
  }

  const navigateToEmail = (emailId: string) => {
    setSelectedEmailId(emailId)
    const event = new CustomEvent("selectEmail", { detail: { emailId } })
    window.dispatchEvent(event)
    toast({
      title: "이메일로 이동",
      description: "선택한 이메일을 확인하세요.",
    })
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "복사 완료",
      description: "메시지가 클립보드에 복사되었습니다.",
    })
  }

  const suggestedPrompts = [
    "오늘 받은 이메일 요약해줘",
    "회의 관련 이메일 찾아줘",
    "중요한 이메일만 보여줘",
    "일정 정리해줘",
    "마케팅 관련 이메일 검색",
  ]

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">자연어로 이메일을 관리하세요</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "chat" ? "default" : "outline"} size="sm" onClick={() => setViewMode("chat")}>
            <MessageSquare className="w-4 h-4 mr-1" />
            채팅
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4 mr-1" />
            목록
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {viewMode === "chat" ? (
          <>
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "assistant" && (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                      <Card className={`${message.type === "user" ? "bg-blue-500 text-white" : "bg-white"}`}>
                        <CardContent className="p-4">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                          {message.metadata?.type === "search" && message.metadata.data && (
                            <div className="mt-4 space-y-2">
                              {message.metadata.data.map((result: SearchResult, index: number) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-sm text-gray-900">{result.subject}</h4>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => navigateToEmail(result.emailId)}
                                      className="text-xs"
                                    >
                                      <Mail className="w-3 h-3 mr-1" />
                                      보기
                                    </Button>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-1">발신자: {result.from}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {result.keywords.map((keyword, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.content)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              {message.type === "assistant" && (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Volume2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {message.type === "user" && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <Card className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <span className="text-sm text-muted-foreground ml-2">AI가 생각하고 있습니다...</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {messages.length <= 1 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-3 text-center">💡 이런 질문을 해보세요:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue(prompt)}
                      className="text-xs"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h3 className="font-medium">이메일 요약</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">오늘 받은 이메일을 AI가 요약해드립니다.</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Search className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium">스마트 검색</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">자연어로 원하는 이메일을 찾아보세요.</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <h3 className="font-medium">일정 관리</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">이메일에서 일정을 추출하고 관리합니다.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <Card className="border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="무엇을 도와드릴까요? (예: 오늘 받은 이메일 요약해줘)"
                className="flex-1 border-0 focus-visible:ring-0 text-base"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!inputValue.trim() || isLoading} className="px-6">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

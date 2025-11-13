"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Trash2,
  Archive,
  Star,
  Reply,
  Forward,
  MoreHorizontal,
  Folder,
  RefreshCw,
  Mail,
  Filter,
  List,
  MessageSquare,
  Send,
  Sparkles,
  Clock,
  User,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppContext } from "@/lib/app-context"
import { useToast } from "@/hooks/use-toast"

interface EmailMessage {
  id: string
  threadId: string
  snippet: string
  payload: {
    headers: Array<{ name: string; value: string }>
    body?: { data?: string }
    parts?: Array<{
      mimeType: string
      body: { data?: string }
    }>
  }
  internalDate: string
}

interface SearchResult {
  emailId: string
  subject: string
  from: string
  snippet: string
  relevanceScore: number
  keywords: string[]
  context: string
  timestamp: string
}

interface SmartSearchQuery {
  query: string
  intent: "find" | "summarize" | "filter" | "analyze"
  keywords: string[]
  timeRange?: string
  sender?: string
}

const mockEmails: EmailMessage[] = [
  {
    id: "1",
    threadId: "thread1",
    snippet:
      "안녕하세요! 다음 주 회의 일정에 대해 논의하고 싶습니다. 프로젝트 진행 상황을 공유하고 다음 단계를 계획해보겠습니다.",
    payload: {
      headers: [
        { name: "from", value: "김영희 <younghee.kim@company.com>" },
        { name: "subject", value: "다음 주 회의 일정 논의" },
        { name: "date", value: "Mon, 8 Dec 2025 10:30:00 +0900" },
      ],
      body: {
        data: "안녕하세요 김철수님,\n\n다음 주 화요일 오후 2시에 회의실 A에서 프로젝트 회의를 진행하려고 합니다.\n\n주요 안건:\n1. 현재 진행 상황 점검\n2. 다음 분기 계획 수립\n3. 리소스 배분 논의\n\n참석 가능하시면 회신 부탁드립니다.\n\n감사합니다.\n김영희",
      },
    },
    internalDate: "1733623800000",
  },
  {
    id: "2",
    threadId: "thread2",
    snippet: "새로운 마케팅 캠페인 제안서를 첨부합니다. 검토 후 피드백 부탁드립니다.",
    payload: {
      headers: [
        { name: "from", value: "박민수 <minsu.park@marketing.com>" },
        { name: "subject", value: "Q1 마케팅 캠페인 제안서" },
        { name: "date", value: "Sun, 7 Dec 2025 16:45:00 +0900" },
      ],
      body: {
        data: "안녕하세요,\n\n2025년 1분기 마케팅 캠페인 제안서를 보내드립니다.\n\n이번 캠페인의 주요 목표:\n- 브랜드 인지도 20% 향상\n- 신규 고객 획득 1000명\n- 매출 증대 15%\n\n자세한 내용은 첨부 파일을 참고해주세요.\n\n검토 후 의견 부탁드립니다.\n\n박민수",
      },
    },
    internalDate: "1733560300000",
  },
  {
    id: "3",
    threadId: "thread3",
    snippet: "시스템 업데이트가 완료되었습니다. 새로운 기능들을 확인해보세요.",
    payload: {
      headers: [
        { name: "from", value: "시스템 관리자 <admin@system.com>" },
        { name: "subject", value: "시스템 업데이트 완료 알림" },
        { name: "date", value: "Sat, 6 Dec 2025 09:15:00 +0900" },
      ],
      body: {
        data: "시스템 업데이트가 성공적으로 완료되었습니다.\n\n새로운 기능:\n- 향상된 보안 시스템\n- 더 빠른 검색 기능\n- 새로운 대시보드 UI\n- 모바일 앱 성능 개선\n\n문제가 있으시면 IT 지원팀으로 연락주세요.\n\n시스템 관리자",
      },
    },
    internalDate: "1733447700000",
  },
  {
    id: "4",
    threadId: "thread4",
    snippet: "월간 보고서를 제출합니다. 이번 달 성과와 다음 달 계획을 포함했습니다.",
    payload: {
      headers: [
        { name: "from", value: "이지은 <jieun.lee@sales.com>" },
        { name: "subject", value: "12월 월간 보고서" },
        { name: "date", value: "Fri, 5 Dec 2025 17:30:00 +0900" },
      ],
      body: {
        data: "12월 월간 보고서를 제출합니다.\n\n주요 성과:\n- 매출 목표 달성률 105%\n- 신규 고객 50명 확보\n- 고객 만족도 4.8/5.0\n\n다음 달 계획:\n- 신제품 런칭 준비\n- 고객 서비스 개선\n- 팀 교육 프로그램 실시\n\n자세한 내용은 첨부 파일을 확인해주세요.\n\n이지은",
      },
    },
    internalDate: "1733390200000",
  },
  {
    id: "5",
    threadId: "thread5",
    snippet: "연말 파티 준비 위원회에서 안내드립니다. 참석 여부를 확인해주세요.",
    payload: {
      headers: [
        { name: "from", value: "HR팀 <hr@company.com>" },
        { name: "subject", value: "연말 파티 안내" },
        { name: "date", value: "Thu, 4 Dec 2025 14:20:00 +0900" },
      ],
      body: {
        data: "연말 파티 안내\n\n일시: 12월 20일 (금) 오후 6시\n장소: 호텔 그랜드 볼룸\n드레스코드: 세미 포멀\n\n프로그램:\n- 환영사 및 올해 성과 발표\n- 시상식\n- 만찬 및 네트워킹\n- 경품 추첨\n\n참석 여부를 12월 15일까지 회신해주세요.\n\nHR팀",
      },
    },
    internalDate: "1733292000000",
  },
]

export function MailManager() {
  const [emails, setEmails] = useState<EmailMessage[]>([])
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [labels, setLabels] = useState<Array<{ id: string; name: string }>>([])
  const [viewMode, setViewMode] = useState<"list" | "search">("list")
  const [smartSearchResults, setSmartSearchResults] = useState<SearchResult[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isSmartSearching, setIsSmartSearching] = useState(false)
  const { selectedEmailId, setSelectedEmailId, addToSearchHistory } = useAppContext()
  const { toast } = useToast()

  const fetchEmails = async (query = "") => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      let filteredEmails = mockEmails
      if (query.trim()) {
        filteredEmails = mockEmails.filter(
          (email) =>
            email.snippet.toLowerCase().includes(query.toLowerCase()) ||
            email.payload.headers.some((header) => header.value.toLowerCase().includes(query.toLowerCase())),
        )
        addToSearchHistory(query)
      }

      setEmails(filteredEmails)
      toast({
        title: "메일 로딩 완료",
        description: `${filteredEmails.length}개의 이메일을 불러왔습니다.`,
      })
    } catch (error) {
      console.error("Failed to fetch emails:", error)
      toast({
        title: "오류 발생",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const performSmartSearch = async (query: string) => {
    setIsSmartSearching(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const parsedQuery = parseSearchQuery(query)
      const results = await searchEmailsWithContext(parsedQuery)

      setSmartSearchResults(results)
      setSearchHistory((prev) => [query, ...prev.slice(0, 4)])
      addToSearchHistory(query)

      toast({
        title: "스마트 검색 완료",
        description: `${results.length}개의 관련 이메일을 찾았습니다.`,
      })
    } catch (error) {
      console.error("Smart search failed:", error)
      toast({
        title: "검색 오류",
        description: "스마트 검색 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSmartSearching(false)
    }
  }

  const parseSearchQuery = (query: string): SmartSearchQuery => {
    const lowerQuery = query.toLowerCase()
    let intent: SmartSearchQuery["intent"] = "find"

    if (lowerQuery.includes("요약") || lowerQuery.includes("정리")) {
      intent = "summarize"
    } else if (lowerQuery.includes("필터") || lowerQuery.includes("분류")) {
      intent = "filter"
    } else if (lowerQuery.includes("분석") || lowerQuery.includes("통계")) {
      intent = "analyze"
    }

    const keywords = extractKeywords(query)
    const timeRange = extractTimeRange(query)
    const sender = extractSender(query)

    return { query, intent, keywords, timeRange, sender }
  }

  const extractKeywords = (query: string): string[] => {
    const commonWords = ["이메일", "메일", "찾아", "검색", "보여", "알려"]
    const words = query.split(/\s+/).filter((word) => word.length > 1 && !commonWords.includes(word))
    return words.slice(0, 5)
  }

  const extractTimeRange = (query: string): string | undefined => {
    if (query.includes("오늘")) return "today"
    if (query.includes("어제")) return "yesterday"
    if (query.includes("이번 주")) return "this_week"
    if (query.includes("지난 주")) return "last_week"
    if (query.includes("이번 달")) return "this_month"
    return undefined
  }

  const extractSender = (query: string): string | undefined => {
    const senderMatch = query.match(/(\w+)님|(\w+)에서|from\s+(\w+)/i)
    return senderMatch ? senderMatch[1] || senderMatch[2] || senderMatch[3] : undefined
  }

  const searchEmailsWithContext = async (parsedQuery: SmartSearchQuery): Promise<SearchResult[]> => {
    const results: SearchResult[] = []

    mockEmails.forEach((email) => {
      let relevanceScore = 0
      const matchedKeywords: string[] = []
      let context = ""

      const emailText =
        `${getEmailHeader(email, "subject")} ${getEmailHeader(email, "from")} ${email.snippet} ${getEmailBody(email)}`.toLowerCase()

      parsedQuery.keywords.forEach((keyword) => {
        if (emailText.includes(keyword.toLowerCase())) {
          relevanceScore += 0.3
          matchedKeywords.push(keyword)
        }
      })

      if (parsedQuery.sender) {
        const from = getEmailHeader(email, "from").toLowerCase()
        if (from.includes(parsedQuery.sender.toLowerCase())) {
          relevanceScore += 0.4
          matchedKeywords.push(parsedQuery.sender)
        }
      }

      if (
        parsedQuery.query
          .toLowerCase()
          .split(" ")
          .some((word) => emailText.includes(word))
      ) {
        relevanceScore += 0.2
      }

      if (relevanceScore > 0.2) {
        context = generateContext(email, parsedQuery)
        results.push({
          emailId: email.id,
          subject: getEmailHeader(email, "subject"),
          from: getEmailHeader(email, "from"),
          snippet: email.snippet,
          relevanceScore,
          keywords: matchedKeywords,
          context,
          timestamp: formatDate(email.internalDate),
        })
      }
    })

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10)
  }

  const generateContext = (email: EmailMessage, query: SmartSearchQuery): string => {
    const subject = getEmailHeader(email, "subject")
    const from = getEmailHeader(email, "from").split("<")[0].trim()

    switch (query.intent) {
      case "summarize":
        return `${from}님이 보낸 "${subject}" 이메일의 주요 내용을 요약하면...`
      case "filter":
        return `이 이메일은 ${query.keywords.join(", ")} 관련 내용을 포함하고 있습니다.`
      case "analyze":
        return `${from}님과의 커뮤니케이션 패턴 분석 결과...`
      default:
        return `"${query.query}" 검색어와 관련된 이메일입니다.`
    }
  }

  const fetchLabels = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const mockLabels = [
        { id: "INBOX", name: "받은편지함" },
        { id: "SENT", name: "보낸편지함" },
        { id: "DRAFT", name: "임시보관함" },
        { id: "SPAM", name: "스팸" },
        { id: "TRASH", name: "휴지통" },
      ]
      setLabels(mockLabels)
    } catch (error) {
      console.error("Failed to fetch labels:", error)
    }
  }

  useEffect(() => {
    fetchEmails()
    fetchLabels()
  }, [])

  useEffect(() => {
    if (selectedEmailId && emails.length > 0) {
      const email = emails.find((e) => e.id === selectedEmailId)
      if (email) {
        setSelectedEmail(email)
      }
    }
  }, [selectedEmailId, emails])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEmails(searchQuery)
  }

  const handleSmartSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    performSmartSearch(searchQuery)
  }

  const getEmailHeader = (email: EmailMessage, headerName: string) => {
    return email.payload.headers.find((header) => header.name.toLowerCase() === headerName.toLowerCase())?.value || ""
  }

  const formatDate = (internalDate: string) => {
    const date = new Date(Number.parseInt(internalDate))
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDeleteEmail = async (emailId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setEmails(emails.filter((email) => email.id !== emailId))
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null)
        setSelectedEmailId(null)
      }
      toast({
        title: "삭제 완료",
        description: "이메일이 삭제되었습니다.",
      })
    } catch (error) {
      console.error("Failed to delete email:", error)
      toast({
        title: "삭제 실패",
        description: "이메일 삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleArchiveEmail = async (emailId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setEmails(emails.filter((email) => email.id !== emailId))
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null)
        setSelectedEmailId(null)
      }
      toast({
        title: "보관 완료",
        description: "이메일이 보관되었습니다.",
      })
    } catch (error) {
      console.error("Failed to archive email:", error)
      toast({
        title: "보관 실패",
        description: "이메일 보관에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const decodeEmailBody = (data: string) => {
    try {
      return data
    } catch {
      return "이메일 내용을 불러올 수 없습니다."
    }
  }

  const getEmailBody = (email: EmailMessage) => {
    if (email.payload.body?.data) {
      return decodeEmailBody(email.payload.body.data)
    }

    const textPart = email.payload.parts?.find((part) => part.mimeType === "text/plain")
    if (textPart?.body?.data) {
      return decodeEmailBody(textPart.body.data)
    }

    const htmlPart = email.payload.parts?.find((part) => part.mimeType === "text/html")
    if (htmlPart?.body?.data) {
      return decodeEmailBody(htmlPart.body.data)
    }

    return email.snippet
  }

  const handleEmailSelect = (email: EmailMessage) => {
    setSelectedEmail(email)
    setSelectedEmailId(email.id)
  }

  const renderListView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* 메일 목록 */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                메일함
                {emails.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">({emails.length})</span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => fetchEmails(searchQuery)} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="메일 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={loading}>
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {emails.map((email, index) => (
                <div key={email.id}>
                  <div
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedEmail?.id === email.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                    }`}
                    onClick={() => handleEmailSelect(email)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm truncate flex-1">
                        {getEmailHeader(email, "from").split("<")[0].trim() || "알 수 없는 발신자"}
                      </div>
                      <div className="text-xs text-muted-foreground ml-2">{formatDate(email.internalDate)}</div>
                    </div>
                    <div className="font-medium text-sm mb-1 truncate">
                      {getEmailHeader(email, "subject") || "제목 없음"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{email.snippet}</div>
                  </div>
                  {index < emails.length - 1 && <Separator />}
                </div>
              ))}
              {emails.length === 0 && !loading && (
                <div className="p-8 text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>메일이 없습니다.</p>
                </div>
              )}
              {loading && (
                <div className="p-8 text-center text-muted-foreground">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-4" />
                  <p>메일을 불러오는 중...</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* 메일 상세보기 */}
      <div className="lg:col-span-2">
        {selectedEmail ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {getEmailHeader(selectedEmail, "subject") || "제목 없음"}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      <strong>발신자:</strong> {getEmailHeader(selectedEmail, "from")}
                    </span>
                    <span>
                      <strong>수신일:</strong> {formatDate(selectedEmail.internalDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Reply className="w-4 h-4 mr-1" />
                    답장
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="w-4 h-4 mr-1" />
                    전달
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleArchiveEmail(selectedEmail.id)}>
                        <Archive className="w-4 h-4 mr-2" />
                        보관
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteEmail(selectedEmail.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="w-4 h-4 mr-2" />
                        중요 표시
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Folder className="w-4 h-4 mr-2" />
                        폴더 이동
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <ScrollArea className="h-[400px]">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {getEmailBody(selectedEmail)}
                  </pre>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent>
              <div className="text-center text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">메일을 선택하여 내용을 확인하세요</p>
                <p className="text-sm">
                  왼쪽 목록에서 읽고 싶은 이메일을 클릭하거나
                  <br />
                  AI 봇에서 추천받은 이메일을 확인해보세요
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )

  const renderSearchView = () => (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">스마트 이메일 검색</h2>
            <p className="text-sm text-muted-foreground">자연어로 원하는 이메일을 찾아보세요</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {smartSearchResults.map((result, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{result.subject}</h3>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(result.relevanceScore * 100)}% 일치
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {result.from.split("<")[0].trim()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{result.snippet}</p>
                      <p className="text-sm bg-blue-50 p-3 rounded-lg border-l-4 border-blue-200">{result.context}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEmailId(result.emailId)
                        setViewMode("list")
                        const email = mockEmails.find((e) => e.id === result.emailId)
                        if (email) setSelectedEmail(email)
                      }}
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      이메일 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {smartSearchResults.length === 0 && !isSmartSearching && (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">스마트 검색을 시작해보세요</h3>
                <p className="text-muted-foreground mb-6">자연어로 질문하면 AI가 관련 이메일을 찾아드립니다</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "회의 관련 이메일 찾아줘",
                    "김영희님이 보낸 메일",
                    "이번 주 중요한 이메일",
                    "프로젝트 관련 내용 정리",
                    "마케팅 캠페인 이메일",
                  ].map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(suggestion)
                        performSmartSearch(suggestion)
                      }}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {isSmartSearching && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <p className="text-muted-foreground">AI가 이메일을 분석하고 있습니다...</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {searchHistory.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">최근 검색:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(query)
                    performSmartSearch(query)
                  }}
                  className="text-xs"
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Card className="border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
          <CardContent className="p-4">
            <form onSubmit={handleSmartSearch} className="flex gap-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="자연어로 검색해보세요... (예: 회의 관련 이메일 찾아줘)"
                className="flex-1 border-0 focus-visible:ring-0 text-base"
                disabled={isSmartSearching}
              />
              <Button type="submit" disabled={!searchQuery.trim() || isSmartSearching} className="px-6">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4 mr-1" />
            목록 보기
          </Button>
          <Button
            variant={viewMode === "search" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("search")}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            스마트 검색
          </Button>
        </div>

        {viewMode === "search" && smartSearchResults.length > 0 && (
          <Badge variant="secondary">{smartSearchResults.length}개 결과</Badge>
        )}
      </div>

      {viewMode === "list" ? renderListView() : renderSearchView()}
    </div>
  )
}

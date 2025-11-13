"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Plus,
  X,
  Settings,
  Sparkles,
  Clock,
  Mail,
  TrendingUp,
  AlertCircle,
  History,
  RefreshCw,
  Calendar,
  BookOpen,
  Target,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface KeywordAlert {
  id: string
  keyword: string
  isActive: boolean
  priority: "high" | "medium" | "low"
  createdAt: Date
  matchCount: number
  lastTriggered?: Date
}

interface SmartNotification {
  id: string
  title: string
  content: string
  keywords: string[]
  emailCount: number
  priority: "high" | "medium" | "low"
  timestamp: Date
  isRead: boolean
  actionUrl?: string
}

interface ImportantEmail {
  id: string
  subject: string
  from: string
  snippet: string
  markedAt: Date
  lastReviewed?: Date
  actionRequired: boolean
  dueDate?: Date
  category: "meeting" | "project" | "decision" | "follow-up" | "other"
}

interface ReviewReminder {
  id: string
  type: "weekly_review" | "monthly_summary" | "action_reminder" | "follow_up"
  title: string
  content: string
  emailIds: string[]
  scheduledFor: Date
  isCompleted: boolean
  priority: "high" | "medium" | "low"
}

interface NotificationSettings {
  enablePush: boolean
  enableEmail: boolean
  quietHours: { start: string; end: string }
  frequency: "immediate" | "hourly" | "daily"
  aiKeywordExtraction: boolean
  enableReviewReminders: boolean
  reviewFrequency: "daily" | "weekly" | "monthly"
  reminderAdvanceDays: number
}

export function NotificationSystem() {
  const [keywordAlerts, setKeywordAlerts] = useState<KeywordAlert[]>([])
  const [notifications, setNotifications] = useState<SmartNotification[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [settings, setSettings] = useState<NotificationSettings>({
    enablePush: true,
    enableEmail: false,
    quietHours: { start: "22:00", end: "08:00" },
    frequency: "immediate",
    aiKeywordExtraction: true,
    enableReviewReminders: true,
    reviewFrequency: "weekly",
    reminderAdvanceDays: 3,
  })
  const [aiExtractedKeywords, setAiExtractedKeywords] = useState<string[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [importantEmails, setImportantEmails] = useState<ImportantEmail[]>([])
  const [reviewReminders, setReviewReminders] = useState<ReviewReminder[]>([])
  const [activeTab, setActiveTab] = useState<"notifications" | "reviews" | "reminders">("notifications")
  const { toast } = useToast()

  useEffect(() => {
    loadMockData()
    extractAIKeywords()
    generateSmartNotifications()
    loadImportantEmails()
    generateReviewReminders()
  }, [])

  const loadMockData = () => {
    // DISABLED FOR PRODUCTION - Mock data
    /*
    const mockAlerts: KeywordAlert[] = [
      {
        id: "1",
        keyword: "회의",
        isActive: true,
        priority: "high",
        createdAt: new Date("2025-12-01"),
        matchCount: 3,
        lastTriggered: new Date("2025-12-08"),
      },
      {
        id: "2",
        keyword: "프로젝트",
        isActive: true,
        priority: "medium",
        createdAt: new Date("2025-12-02"),
        matchCount: 5,
        lastTriggered: new Date("2025-12-07"),
      },
      {
        id: "3",
        keyword: "마케팅",
        isActive: false,
        priority: "low",
        createdAt: new Date("2025-12-03"),
        matchCount: 2,
      },
    ]
    setKeywordAlerts(mockAlerts)
    */
  }

  const extractAIKeywords = async () => {
    setIsExtracting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const extractedKeywords = [
        "캠페인",
        "보고서",
        "시스템",
        "업데이트",
        "파티",
        "성과",
        "계획",
        "고객",
        "매출",
        "브랜드",
      ]

      setAiExtractedKeywords(extractedKeywords)
      toast({
        title: "AI 키워드 추출 완료",
        description: `${extractedKeywords.length}개의 키워드를 발견했습니다.`,
      })
    } catch (error) {
      console.error("AI keyword extraction failed:", error)
    } finally {
      setIsExtracting(false)
    }
  }

  const generateSmartNotifications = () => {
    const mockNotifications: SmartNotification[] = [
      {
        id: "1",
        title: "중요한 회의 알림",
        content:
          "김영희님이 보낸 '다음 주 회의 일정 논의' 이메일에서 회의 키워드가 감지되었습니다. 화요일 오후 2시 회의실 A에서 진행됩니다.",
        keywords: ["회의", "일정", "프로젝트"],
        emailCount: 1,
        priority: "high",
        timestamp: new Date("2025-12-08T10:30:00"),
        isRead: false,
        actionUrl: "/mail?id=1",
      },
      {
        id: "2",
        title: "프로젝트 관련 업데이트",
        content:
          "프로젝트 키워드가 포함된 2개의 새 이메일이 도착했습니다. 마케팅 캠페인과 월간 보고서 관련 내용입니다.",
        keywords: ["프로젝트", "마케팅", "보고서"],
        emailCount: 2,
        priority: "medium",
        timestamp: new Date("2025-12-07T16:45:00"),
        isRead: true,
      },
      {
        id: "3",
        title: "일일 키워드 요약",
        content:
          "오늘 받은 이메일에서 '시스템', '업데이트', '성과' 키워드가 자주 언급되었습니다. 새로운 트렌드를 확인해보세요.",
        keywords: ["시스템", "업데이트", "성과"],
        emailCount: 3,
        priority: "low",
        timestamp: new Date("2025-12-06T18:00:00"),
        isRead: true,
      },
    ]
    setNotifications(mockNotifications)
  }

  const loadImportantEmails = () => {
    const mockImportantEmails: ImportantEmail[] = [
      {
        id: "1",
        subject: "다음 주 회의 일정 논의",
        from: "김영희",
        snippet: "화요일 오후 2시에 회의실 A에서 프로젝트 회의를 진행하려고 합니다.",
        markedAt: new Date("2025-12-08T10:30:00"),
        actionRequired: true,
        dueDate: new Date("2025-12-10T14:00:00"),
        category: "meeting",
      },
      {
        id: "2",
        subject: "Q1 마케팅 캠페인 제안서",
        from: "박민수",
        snippet: "검토 후 피드백 부탁드립니���.",
        markedAt: new Date("2025-12-07T16:45:00"),
        lastReviewed: new Date("2025-12-08T09:00:00"),
        actionRequired: true,
        dueDate: new Date("2025-12-12T17:00:00"),
        category: "project",
      },
      {
        id: "4",
        subject: "12월 월간 보고서",
        from: "이지은",
        snippet: "이번 달 성과와 다음 달 계획을 포함했습니다.",
        markedAt: new Date("2025-12-05T17:30:00"),
        actionRequired: false,
        category: "project",
      },
    ]
    setImportantEmails(mockImportantEmails)
  }

  const generateReviewReminders = () => {
    const mockReminders: ReviewReminder[] = [
      {
        id: "1",
        type: "weekly_review",
        title: "주간 이메일 회고",
        content: "이번 주 중요한 이메일 3개를 검토하고 다음 주 액션 아이템을 정리해보세요.",
        emailIds: ["1", "2", "4"],
        scheduledFor: new Date("2025-12-09T09:00:00"),
        isCompleted: false,
        priority: "medium",
      },
      {
        id: "2",
        type: "action_reminder",
        title: "회의 준비 리마인드",
        content: "내일 오후 2시 회의가 예정되어 있습니다. 준비사항을 확인해주세요.",
        emailIds: ["1"],
        scheduledFor: new Date("2025-12-09T14:00:00"),
        isCompleted: false,
        priority: "high",
      },
      {
        id: "3",
        type: "follow_up",
        title: "마케팅 캠페인 피드백 마감",
        content: "마케팅 캠페인 제안서에 대한 피드백 마감일이 3일 남았습니다.",
        emailIds: ["2"],
        scheduledFor: new Date("2025-12-09T10:00:00"),
        isCompleted: true,
        priority: "medium",
      },
    ]
    setReviewReminders(mockReminders)
  }

  const markEmailAsImportant = (emailId: string, category: ImportantEmail["category"], dueDate?: Date) => {
    const newImportantEmail: ImportantEmail = {
      id: emailId,
      subject: "새로 추가된 중요 이메일",
      from: "발신자",
      snippet: "이메일 내용 미리보기",
      markedAt: new Date(),
      actionRequired: !!dueDate,
      dueDate,
      category,
    }

    setImportantEmails([...importantEmails, newImportantEmail])
    toast({
      title: "중요 이메일 추가",
      description: "이메일이 중요 목록에 추가되었습니다.",
    })
  }

  const completeReviewReminder = (id: string) => {
    setReviewReminders(
      reviewReminders.map((reminder) => (reminder.id === id ? { ...reminder, isCompleted: true } : reminder)),
    )
    toast({
      title: "회고 완료",
      description: "회고가 완료되었습니다.",
    })
  }

  const generateNewReviewReminder = () => {
    const newReminder: ReviewReminder = {
      id: Date.now().toString(),
      type: "weekly_review",
      title: "새로운 주간 회고",
      content: "최근 중요한 이메일들을 검토하고 다음 주 계획을 세워보세요.",
      emailIds: importantEmails.slice(0, 3).map((email) => email.id),
      scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 일주일 후
      isCompleted: false,
      priority: "medium",
    }

    setReviewReminders([newReminder, ...reviewReminders])
    toast({
      title: "새 회고 생성",
      description: "새로운 주간 회고가 생성되었습니다.",
    })
  }

  const addKeywordAlert = () => {
    if (!newKeyword.trim()) return

    const newAlert: KeywordAlert = {
      id: Date.now().toString(),
      keyword: newKeyword.trim(),
      isActive: true,
      priority: "medium",
      createdAt: new Date(),
      matchCount: 0,
    }

    setKeywordAlerts([...keywordAlerts, newAlert])
    setNewKeyword("")
    toast({
      title: "키워드 알림 추가",
      description: `'${newAlert.keyword}' 키워드 알림이 활성화되었습니다.`,
    })
  }

  const removeKeywordAlert = (id: string) => {
    setKeywordAlerts(keywordAlerts.filter((alert) => alert.id !== id))
    toast({
      title: "키워드 알림 삭제",
      description: "키워드 알림이 삭제되었습니다.",
    })
  }

  const toggleKeywordAlert = (id: string) => {
    setKeywordAlerts(keywordAlerts.map((alert) => (alert.id === id ? { ...alert, isActive: !alert.isActive } : alert)))
  }

  const addAIKeyword = (keyword: string) => {
    if (keywordAlerts.some((alert) => alert.keyword === keyword)) {
      toast({
        title: "이미 존재하는 키워드",
        description: "해당 키워드는 이미 알림 목록에 있습니다.",
        variant: "destructive",
      })
      return
    }

    const newAlert: KeywordAlert = {
      id: Date.now().toString(),
      keyword,
      isActive: true,
      priority: "medium",
      createdAt: new Date(),
      matchCount: 0,
    }

    setKeywordAlerts([...keywordAlerts, newAlert])
    setAiExtractedKeywords(aiExtractedKeywords.filter((k) => k !== keyword))
    toast({
      title: "AI 키워드 추가",
      description: `'${keyword}' 키워드가 알림 목록에 추가되었습니다.`,
    })
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getPriorityIcon = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-3 h-3" />
      case "medium":
        return <Clock className="w-3 h-3" />
      case "low":
        return <TrendingUp className="w-3 h-3" />
    }
  }

  const getCategoryColor = (category: ImportantEmail["category"]) => {
    switch (category) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "project":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "decision":
        return "bg-red-100 text-red-800 border-red-200"
      case "follow-up":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: ImportantEmail["category"]) => {
    switch (category) {
      case "meeting":
        return <Calendar className="w-3 h-3" />
      case "project":
        return <Target className="w-3 h-3" />
      case "decision":
        return <AlertCircle className="w-3 h-3" />
      case "follow-up":
        return <RefreshCw className="w-3 h-3" />
      default:
        return <Mail className="w-3 h-3" />
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">스마트 알림 시스템</h2>
            <p className="text-sm text-muted-foreground">키워드 기반 개인화된 푸시 알림 및 회고 시스템</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="w-3 h-3" />
            {notifications.filter((n) => !n.isRead).length}개 새 알림
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <History className="w-3 h-3" />
            {reviewReminders.filter((r) => !r.isCompleted).length}개 회고 대기
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            알림 관리
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            이메일 회고
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            리마인드
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  키워드 알림 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="알림받을 키워드 입력..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeywordAlert()}
                    className="flex-1"
                  />
                  <Button onClick={addKeywordAlert} disabled={!newKeyword.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {keywordAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Switch checked={alert.isActive} onCheckedChange={() => toggleKeywordAlert(alert.id)} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{alert.keyword}</span>
                              <Badge variant="outline" className={getPriorityColor(alert.priority)}>
                                {getPriorityIcon(alert.priority)}
                                {alert.priority}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {alert.matchCount}회 매칭 •{" "}
                              {alert.lastTriggered ? formatTimestamp(alert.lastTriggered) : "매칭 없음"}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeKeywordAlert(alert.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI 추천 키워드
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">이메일에서 자주 언급되는 키워드를 AI가 추천합니다</p>
                  <Button variant="outline" size="sm" onClick={extractAIKeywords} disabled={isExtracting}>
                    <Sparkles className={`w-4 h-4 mr-1 ${isExtracting ? "animate-spin" : ""}`} />
                    새로고침
                  </Button>
                </div>

                {isExtracting ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">AI가 키워드를 분석하고 있습니다...</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {aiExtractedKeywords.map((keyword, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addAIKeyword(keyword)}
                        className="text-xs hover:bg-blue-50"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {keyword}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                스마트 알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          notification.isRead ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                              {getPriorityIcon(notification.priority)}
                              {notification.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{notification.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-1">
                              {notification.keywords.map((keyword, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Mail className="w-3 h-3 mr-1" />
                              {notification.emailCount}개 이메일
                            </Badge>
                          </div>

                          {notification.actionUrl && (
                            <Button variant="outline" size="sm" className="text-xs bg-transparent">
                              이메일 확인
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  중요 이메일 관리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {importantEmails.map((email) => (
                      <div key={email.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">{email.subject}</h4>
                            <p className="text-xs text-muted-foreground mb-2">발신자: {email.from}</p>
                            <p className="text-sm text-muted-foreground">{email.snippet}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getCategoryColor(email.category)}>
                              {getCategoryIcon(email.category)}
                              {email.category}
                            </Badge>
                            {email.actionRequired && (
                              <Badge variant="destructive" className="text-xs">
                                액션 필요
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {email.dueDate && `마감: ${formatTimestamp(email.dueDate)}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  회고 통계
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{importantEmails.length}</div>
                    <div className="text-sm text-muted-foreground">중요 이메일</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {importantEmails.filter((e) => e.actionRequired).length}
                    </div>
                    <div className="text-sm text-muted-foreground">액션 필요</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">카테고리별 분포</h4>
                  {["meeting", "project", "decision", "follow-up"].map((category) => {
                    const count = importantEmails.filter((e) => e.category === category).length
                    const percentage = importantEmails.length > 0 ? (count / importantEmails.length) * 100 : 0
                    return (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">회고 및 리마인드</h3>
            <Button onClick={generateNewReviewReminder} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />새 회고 생성
            </Button>
          </div>

          <div className="space-y-4">
            {reviewReminders.map((reminder) => (
              <Card key={reminder.id} className={reminder.isCompleted ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{reminder.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(reminder.priority)}>
                          {getPriorityIcon(reminder.priority)}
                          {reminder.priority}
                        </Badge>
                        {reminder.isCompleted && <Badge variant="secondary">완료</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{reminder.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimestamp(reminder.scheduledFor)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {reminder.emailIds.length}개 이메일
                        </span>
                      </div>
                    </div>
                  </div>

                  {!reminder.isCompleted && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => completeReviewReminder(reminder.id)}>
                        회고 완료
                      </Button>
                      <Button variant="outline" size="sm">
                        관련 이메일 보기
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">푸시 알림</p>
                  <p className="text-sm text-muted-foreground">브라우저 푸시 알림 활성화</p>
                </div>
                <Switch
                  checked={settings.enablePush}
                  onCheckedChange={(checked) => setSettings({ ...settings, enablePush: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI 키워드 추출</p>
                  <p className="text-sm text-muted-foreground">자동으로 키워드 추천</p>
                </div>
                <Switch
                  checked={settings.aiKeywordExtraction}
                  onCheckedChange={(checked) => setSettings({ ...settings, aiKeywordExtraction: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">회고 리마인드</p>
                  <p className="text-sm text-muted-foreground">정기적인 이메일 회고 알림</p>
                </div>
                <Switch
                  checked={settings.enableReviewReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableReviewReminders: checked })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">알림 빈도</p>
                <div className="flex gap-2">
                  {["immediate", "hourly", "daily"].map((freq) => (
                    <Button
                      key={freq}
                      variant={settings.frequency === freq ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, frequency: freq as any })}
                    >
                      {freq === "immediate" ? "즉시" : freq === "hourly" ? "시간별" : "일별"}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">회고 주기</p>
                <div className="flex gap-2">
                  {["daily", "weekly", "monthly"].map((freq) => (
                    <Button
                      key={freq}
                      variant={settings.reviewFrequency === freq ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, reviewFrequency: freq as any })}
                    >
                      {freq === "daily" ? "매일" : freq === "weekly" ? "주간" : "월간"}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">방해 금지 시간</p>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        quietHours: { ...settings.quietHours, start: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                  <span className="self-center">~</span>
                  <Input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        quietHours: { ...settings.quietHours, end: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Newspaper, Mail, Eye, ExternalLink, RefreshCw, Target, Clock, Star } from "lucide-react"

interface UserProfile {
  interests: string[]
  emailPatterns: {
    topSenders: Array<{ email: string; count: number }>
    topKeywords: Array<{ keyword: string; frequency: number }>
    categories: { [key: string]: number }
  }
  searchHistory: Array<{ query: string; timestamp: string }>
}

interface NewsRecommendation {
  id: string
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
  relevanceScore: number
  matchingKeywords: string[]
}

interface EmailRecommendation {
  id: string
  subject: string
  from: string
  snippet: string
  relevanceScore: number
  reason: string
  matchingInterests: string[]
}

export function RecommendationSystem() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [newsRecommendations, setNewsRecommendations] = useState<NewsRecommendation[]>([])
  const [emailRecommendations, setEmailRecommendations] = useState<EmailRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "news" | "emails">("profile")

  // 사용자 프로필 분석
  const analyzeUserProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/recommendations/profile", {
        method: "POST",
      })

      if (response.ok) {
        const profile = await response.json()
        setUserProfile(profile)
      }
    } catch (error) {
      console.error("Failed to analyze user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  // 뉴스 추천 가져오기
  const fetchNewsRecommendations = async () => {
    if (!userProfile) return

    setLoading(true)
    try {
      const response = await fetch("/api/recommendations/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: userProfile.interests,
          keywords: userProfile.emailPatterns.topKeywords.map((k) => k.keyword),
        }),
      })

      if (response.ok) {
        const recommendations = await response.json()
        setNewsRecommendations(recommendations.news || [])
      }
    } catch (error) {
      console.error("Failed to fetch news recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  // 이메일 추천 가져오기
  const fetchEmailRecommendations = async () => {
    if (!userProfile) return

    setLoading(true)
    try {
      const response = await fetch("/api/recommendations/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: userProfile.interests,
          patterns: userProfile.emailPatterns,
        }),
      })

      if (response.ok) {
        const recommendations = await response.json()
        setEmailRecommendations(recommendations.emails || [])
      }
    } catch (error) {
      console.error("Failed to fetch email recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  // 추천 새로고침
  const refreshRecommendations = async () => {
    await analyzeUserProfile()
    if (activeTab === "news") {
      await fetchNewsRecommendations()
    } else if (activeTab === "emails") {
      await fetchEmailRecommendations()
    }
  }

  useEffect(() => {
    analyzeUserProfile()
  }, [])

  useEffect(() => {
    if (userProfile && activeTab !== "profile") {
      if (activeTab === "news") {
        fetchNewsRecommendations()
      } else if (activeTab === "emails") {
        fetchEmailRecommendations()
      }
    }
  }, [userProfile, activeTab])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderProfileView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">개인화 프로필</h3>
        <Button variant="outline" size="sm" onClick={analyzeUserProfile} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {userProfile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Target className="w-4 h-4 mr-2" />
                관심사 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
              {userProfile.interests.length === 0 && (
                <p className="text-sm text-muted-foreground">분석할 데이터가 부족합니다.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                이메일 패턴
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">주요 발신자</h4>
                <div className="space-y-1">
                  {userProfile.emailPatterns.topSenders.slice(0, 3).map((sender, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="truncate">{sender.email.split("@")[0]}</span>
                      <Badge variant="outline" className="text-xs">
                        {sender.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">주요 키워드</h4>
                <div className="flex flex-wrap gap-1">
                  {userProfile.emailPatterns.topKeywords.slice(0, 6).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword.keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                최근 검색 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userProfile.searchHistory.slice(0, 5).map((search, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{search.query}</span>
                    <span className="text-muted-foreground text-xs ml-2">{formatDate(search.timestamp)}</span>
                  </div>
                ))}
                {userProfile.searchHistory.length === 0 && (
                  <p className="text-sm text-muted-foreground">검색 이력이 없습니다.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                카테고리 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(userProfile.emailPatterns.categories).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${(count / Math.max(...Object.values(userProfile.emailPatterns.categories))) * 100}%`,
                          }}
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  const renderNewsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">개인화된 뉴스 추천</h3>
        <Button variant="outline" size="sm" onClick={fetchNewsRecommendations} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {newsRecommendations.map((news) => (
            <Card key={news.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-2 leading-relaxed">{news.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span>{news.source}</span>
                      <span>{formatDate(news.publishedAt)}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(news.relevanceScore * 100)}% 관련성
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{news.summary}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {news.matchingKeywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={news.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      읽기
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {newsRecommendations.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>추천할 뉴스가 없습니다. 프로필을 분석한 후 다시 시도해주세요.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )

  const renderEmailsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">관련 이메일 추천</h3>
        <Button variant="outline" size="sm" onClick={fetchEmailRecommendations} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {emailRecommendations.map((email) => (
            <Card key={email.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{email.subject}</h4>
                    <p className="text-xs text-muted-foreground mb-2">발신자: {email.from}</p>
                    <p className="text-sm text-muted-foreground mb-2">{email.snippet}</p>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <Star className="w-3 h-3" />
                      <span>{email.reason}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {Math.round(email.relevanceScore * 100)}% 관련성
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {email.matchingInterests.map((interest, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {emailRecommendations.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>추천할 이메일이 없습니다. 더 많은 이메일 데이터가 필요합니다.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("profile")}
          className="flex-1"
        >
          <Target className="w-4 h-4 mr-1" />
          프로필 분석
        </Button>
        <Button
          variant={activeTab === "news" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("news")}
          className="flex-1"
        >
          <Newspaper className="w-4 h-4 mr-1" />
          뉴스 추천
        </Button>
        <Button
          variant={activeTab === "emails" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("emails")}
          className="flex-1"
        >
          <Mail className="w-4 h-4 mr-1" />
          이메일 추천
        </Button>
      </div>

      {/* 선택된 탭 내용 */}
      {activeTab === "profile" && renderProfileView()}
      {activeTab === "news" && renderNewsView()}
      {activeTab === "emails" && renderEmailsView()}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span className="text-muted-foreground">추천 시스템이 분석 중입니다...</span>
        </div>
      )}
    </div>
  )
}

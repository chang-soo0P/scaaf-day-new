"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  TrendingUp, 
  Hash,
  Calendar,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TopicCardProps {
  topic: {
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
  onEmailClick: (emailId: string) => void
  onViewAll?: () => void
}

export function TopicCard({ topic, onEmailClick, onViewAll }: TopicCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "기술":
      case "tech":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "경제":
      case "business":
        return "bg-green-100 text-green-800 border-green-200"
      case "뉴스":
      case "news":
        return "bg-red-100 text-red-800 border-red-200"
      case "스포츠":
      case "sports":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{topic.title}</h3>
              <Badge variant="outline" className={cn("text-xs", getImportanceColor(topic.importance))}>
                {topic.importance}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", getCategoryColor(topic.category))}>
                {topic.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Mail className="w-4 h-4" />
              <span>{topic.emailCount}개 이메일</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{topic.summary}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          {/* Keywords */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 flex items-center mb-2">
              <Hash className="w-4 h-4 mr-2" />
              핵심 키워드
            </h4>
            <div className="flex flex-wrap gap-1">
              {topic.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Email List */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 flex items-center mb-2">
              <Mail className="w-4 h-4 mr-2" />
              관련 이메일 ({topic.emailCount}개)
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {topic.emails.map((email) => (
                <div 
                  key={email.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => onEmailClick(email.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{email.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{email.sender}</span>
                      <span>•</span>
                      <span>{new Date(email.date).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {topic.emailCount}개 이메일에서 추출
            </div>
            {onViewAll && (
              <Button variant="outline" size="sm" onClick={onViewAll}>
                전체 보기
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

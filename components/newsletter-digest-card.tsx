"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ExternalLink, 
  Calendar, 
  Hash, 
  Quote, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Link as LinkIcon,
  TrendingUp
} from "lucide-react"
import type { NewsletterDigest } from "@/lib/types"
import { cn } from "@/lib/utils"

interface NewsletterDigestCardProps {
  digest: NewsletterDigest
  compact?: boolean
  onViewOriginal?: () => void
}

export function NewsletterDigestCard({ 
  digest, 
  compact = false, 
  onViewOriginal 
}: NewsletterDigestCardProps) {
  const [expanded, setExpanded] = useState(false)

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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{digest.subject}</h3>
              <Badge variant="outline" className={cn("text-xs", getCategoryColor(digest.category))}>
                {digest.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="font-medium">{digest.sender}</span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{digest.readTime}분</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{digest.summary}</p>
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
          <Separator className="mb-4" />

          {/* Key Points */}
          {digest.keyPoints.length > 0 && (
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                핵심 포인트
              </h4>
              <ul className="space-y-2">
                {digest.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          {digest.links.length > 0 && (
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <LinkIcon className="w-4 h-4 mr-2" />
                중요 링크
              </h4>
              <div className="space-y-2">
                {digest.links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                      {link.description && (
                        <p className="text-xs text-gray-600 truncate">{link.description}</p>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates & Events */}
          {digest.dates.length > 0 && (
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                중요 날짜
              </h4>
              <div className="space-y-2">
                {digest.dates.map((date, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{date.event}</p>
                      <p className="text-xs text-gray-600">{new Date(date.date).toLocaleDateString('ko-KR')}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", getImportanceColor(date.importance))}>
                      {date.importance}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Numbers & Statistics */}
          {digest.numbers.length > 0 && (
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Hash className="w-4 h-4 mr-2" />
                중요 숫자
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {digest.numbers.map((number, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">{number.value}</span>
                      <span className="text-xs text-gray-600">{number.context}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{number.significance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quotes */}
          {digest.quotes.length > 0 && (
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Quote className="w-4 h-4 mr-2" />
                핵심 인용구
              </h4>
              <div className="space-y-2">
                {digest.quotes.map((quote, index) => (
                  <blockquote key={index} className="p-3 bg-blue-50 border-l-4 border-blue-200 rounded-r-lg">
                    <p className="text-sm text-gray-700 italic">"{quote}"</p>
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {digest.category}
              </Badge>
              <span className="text-xs text-gray-500">
                {new Date(digest.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
            {onViewOriginal && (
              <Button variant="outline" size="sm" onClick={onViewOriginal}>
                원본 이메일 보기
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

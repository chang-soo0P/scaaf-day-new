"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, FolderOpen, TrendingUp } from "lucide-react"
import type { DigestGroup, NewsletterDigest } from "@/lib/types"
import { NewsletterDigestCard } from "./newsletter-digest-card"

interface DigestGroupProps {
  group: DigestGroup
  onViewOriginal?: (emailId: string) => void
}

export function DigestGroup({ group, onViewOriginal }: DigestGroupProps) {
  const [expanded, setExpanded] = useState(true)

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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "기술":
      case "tech":
        return "💻"
      case "경제":
      case "business":
        return "📈"
      case "뉴스":
      case "news":
        return "📰"
      case "스포츠":
      case "sports":
        return "⚽"
      default:
        return "📁"
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">{getCategoryIcon(group.category)}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{group.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {group.category}
                </Badge>
                <span className="text-sm text-gray-600">
                  {group.items.length}개 뉴스레터
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {group.items.map((digest) => (
              <NewsletterDigestCard
                key={digest.id}
                digest={digest}
                onViewOriginal={() => onViewOriginal?.(digest.emailId)}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

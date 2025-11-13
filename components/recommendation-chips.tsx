"use client"

import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Info, TrendingUp, User, Clock, Tag } from "lucide-react"
import type { Recommendation } from "@/lib/types"

interface RecommendationChipsProps {
  recommendation: Recommendation
}

export function RecommendationChips({ recommendation }: RecommendationChipsProps) {
  const getReasonIcon = (reason: string) => {
    if (reason.toLowerCase().includes("similar")) return User
    if (reason.toLowerCase().includes("trending")) return TrendingUp
    if (reason.toLowerCase().includes("recent")) return Clock
    return Tag
  }

  const getReasonColor = (reason: string) => {
    if (reason.toLowerCase().includes("similar")) return "bg-blue-100 text-blue-700 border-blue-200"
    if (reason.toLowerCase().includes("trending")) return "bg-green-100 text-green-700 border-green-200"
    if (reason.toLowerCase().includes("recent")) return "bg-purple-100 text-purple-700 border-purple-200"
    return "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="flex items-center space-x-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Info className="w-3 h-3 text-gray-400" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Why this recommendation?</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Relevance Score: {Math.round(recommendation.relevanceScore * 100)}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Recommended {new Date(recommendation.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-600">
                This recommendation is based on your reading patterns, recent newsletter topics, and trending content in
                your categories.
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className="flex flex-wrap gap-1">
        {recommendation.reasonTags.map((reason, index) => {
          const Icon = getReasonIcon(reason)
          return (
            <Badge key={index} variant="outline" className={`text-xs ${getReasonColor(reason)}`}>
              <Icon className="w-3 h-3 mr-1" />
              {reason}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

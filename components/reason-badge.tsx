"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Brain, TrendingUp, Bookmark, Clock, Tag } from "lucide-react"

interface ReasonBadgeProps {
  reason: {
    type: "topic_match" | "past_clicks" | "saved_items" | "recent_activity" | "similar_content"
    label: string
    details: string
    confidence?: number
  }
  variant?: "default" | "outline" | "secondary"
  size?: "sm" | "default"
}

export function ReasonBadge({ reason, variant = "outline", size = "sm" }: ReasonBadgeProps) {
  const getReasonIcon = (type: string) => {
    const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4"

    switch (type) {
      case "topic_match":
        return <Tag className={`${iconSize} text-blue-500`} />
      case "past_clicks":
        return <TrendingUp className={`${iconSize} text-green-500`} />
      case "saved_items":
        return <Bookmark className={`${iconSize} text-purple-500`} />
      case "recent_activity":
        return <Clock className={`${iconSize} text-orange-500`} />
      case "similar_content":
        return <Brain className={`${iconSize} text-pink-500`} />
      default:
        return <Brain className={`${iconSize} text-gray-500`} />
    }
  }

  const getReasonColor = (type: string) => {
    switch (type) {
      case "topic_match":
        return "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
      case "past_clicks":
        return "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
      case "saved_items":
        return "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
      case "recent_activity":
        return "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
      case "similar_content":
        return "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100"
      default:
        return "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
    }
  }

  const badgeSize = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className={`
              inline-flex items-center gap-1.5 cursor-help transition-colors
              ${badgeSize}
              ${variant === "outline" ? getReasonColor(reason.type) : ""}
            `}
          >
            {getReasonIcon(reason.type)}
            <span>{reason.label}</span>
            {reason.confidence && (
              <span className="opacity-75 font-medium">{Math.round(reason.confidence * 100)}%</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{reason.label}</p>
            <p className="text-xs text-muted-foreground">{reason.details}</p>
            {reason.confidence && (
              <p className="text-xs text-muted-foreground">Confidence: {Math.round(reason.confidence * 100)}%</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, ExternalLink, Calendar, MapPin } from "lucide-react"
import type { DigestItem } from "@/lib/types"

interface DigestPreviewCardProps {
  item: DigestItem
  compact?: boolean
  showActions?: boolean
  onRead?: () => void
  onSave?: () => void
}

export function DigestPreviewCard({
  item,
  compact = false,
  showActions = true,
  onRead,
  onSave,
}: DigestPreviewCardProps) {
  const senderName = item.sender.split("<")[0].trim() || item.sender
  const senderInitials = senderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
    <Card className={`transition-all hover:shadow-md ${compact ? "p-3" : ""}`}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className={compact ? "w-6 h-6" : "w-8 h-8"}>
                <AvatarImage src={item.senderAvatar || "/placeholder.svg"} alt={senderName} />
                <AvatarFallback className="text-xs font-medium">{senderInitials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className={`font-medium truncate ${compact ? "text-xs" : "text-sm"}`}>{senderName}</p>
                <p className={`text-muted-foreground truncate ${compact ? "text-xs" : "text-xs"}`}>{item.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </Badge>
              <span className={`text-muted-foreground ${compact ? "text-xs" : "text-xs"}`}>
                <Clock className="w-3 h-3 inline mr-1" />
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className={compact ? "space-y-1" : "space-y-2"}>
            <p
              className={`text-muted-foreground leading-relaxed ${
                compact ? "text-xs line-clamp-2" : "text-sm line-clamp-3"
              }`}
            >
              {item.summary}
            </p>
          </div>

          {/* Key Points */}
          {!compact && item.keyPoints && item.keyPoints.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Key Points:</p>
              <ul className="space-y-1">
                {item.keyPoints.slice(0, 2).map((point, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items Preview */}
          {item.actionItems && item.actionItems.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.actionItems.slice(0, compact ? 2 : 3).map((action, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {action.type === "event" && <Calendar className="w-3 h-3 mr-1" />}
                  {action.type === "location" && <MapPin className="w-3 h-3 mr-1" />}
                  {action.type === "link" && <ExternalLink className="w-3 h-3 mr-1" />}
                  {action.type}
                </Badge>
              ))}
              {item.actionItems.length > (compact ? 2 : 3) && (
                <Badge variant="outline" className="text-xs">
                  +{item.actionItems.length - (compact ? 2 : 3)} more
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onRead}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Read
                </Button>
                {onSave && (
                  <Button variant="ghost" size="sm" onClick={onSave}>
                    Save
                  </Button>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{item.readTime} min read</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

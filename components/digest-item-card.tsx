"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, ExternalLink, Calendar, MapPin, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import type { DigestItem, ActionItem } from "@/lib/types"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { CalendarModal } from "./calendar-modal"
import { useRouter } from "next/router"

interface DigestItemCardProps {
  item: DigestItem
}

function ActionItemComponent({
  action,
  emailId,
  actionIndex,
}: { action: ActionItem; emailId: string; actionIndex: number }) {
  const { completeAction } = useAppStore()

  const getActionIcon = (type: ActionItem["type"]) => {
    switch (type) {
      case "deadline":
        return AlertCircle
      case "event":
        return Calendar
      case "location":
        return MapPin
      case "link":
        return ExternalLink
      case "rsvp":
        return Calendar
      default:
        return AlertCircle
    }
  }

  const getActionColor = (type: ActionItem["type"]) => {
    switch (type) {
      case "deadline":
        return "text-red-600 bg-red-50 border-red-200"
      case "event":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "location":
        return "text-green-600 bg-green-50 border-green-200"
      case "link":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "rsvp":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const Icon = getActionIcon(action.type)

  return (
    <div className={cn("flex items-center justify-between p-3 rounded-lg border", getActionColor(action.type))}>
      <div className="flex items-center space-x-3">
        <Icon className="w-4 h-4" />
        <div>
          <p className="text-sm font-medium">{action.text}</p>
          {action.datetime && (
            <p className="text-xs opacity-75">
              {new Date(action.datetime).toLocaleDateString()} at {new Date(action.datetime).toLocaleTimeString()}
            </p>
          )}
          {action.place && <p className="text-xs opacity-75">{action.place}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge
          variant={action.priority === "high" ? "destructive" : action.priority === "medium" ? "default" : "secondary"}
        >
          {action.priority}
        </Badge>
        {action.completed ? (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        ) : (
          <Button size="sm" variant="outline" onClick={() => completeAction(emailId, actionIndex)}>
            Mark Done
          </Button>
        )}
        {(action.type === "event" || action.type === "deadline" || action.type === "rsvp") && (
          <CalendarModal action={action}>
            <Button size="sm" variant="ghost">
              <Calendar className="w-3 h-3" />
            </Button>
          </CalendarModal>
        )}
        {action.url && (
          <Button size="sm" variant="ghost" asChild>
            <a href={action.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

export function DigestItemCard({ item }: DigestItemCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { setSelectedEmailId, setCurrentView } = useAppStore()
  const router = useRouter()

  const handleViewEmail = () => {
    router.push(`/inbox/${item.emailId}`)
  }

  const getImportanceColor = (importance: DigestItem["importance"]) => {
    switch (importance) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  return (
    <Card className={cn("border-l-4", getImportanceColor(item.importance))}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {item.readTime} min read
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{item.summary3lines}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <Separator className="mb-4" />

          {/* Action Items */}
          {item.actions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Action Items ({item.actions.length})
              </h4>
              <div className="space-y-2">
                {item.actions.map((action, index) => (
                  <ActionItemComponent key={index} action={action} emailId={item.emailId} actionIndex={index} />
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Badge variant={item.importance === "high" ? "destructive" : "secondary"}>
                {item.importance} priority
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleViewEmail}>
              View Full Email
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

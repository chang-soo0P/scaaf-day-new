"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ExternalLink, Users, AlertTriangle, CheckCircle2 } from "lucide-react"
import { ActionItemDrawer } from "./action-item-drawer"
import type { ActionItem } from "@/lib/types"

interface ActionChipProps {
  action: ActionItem
  variant?: "default" | "outline" | "secondary"
  size?: "sm" | "default" | "lg"
}

export function ActionChip({ action, variant = "default", size = "default" }: ActionChipProps) {
  const getActionIcon = (type: ActionItem["type"]) => {
    const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4"

    switch (type) {
      case "deadline":
        return <AlertTriangle className={`${iconSize} text-red-500`} />
      case "event":
        return <Calendar className={`${iconSize} text-blue-500`} />
      case "rsvp":
        return <Users className={`${iconSize} text-green-500`} />
      case "location":
        return <MapPin className={`${iconSize} text-purple-500`} />
      case "link":
        return <ExternalLink className={`${iconSize} text-gray-500`} />
      default:
        return <CheckCircle2 className={`${iconSize} text-gray-500`} />
    }
  }

  const getActionColor = (type: ActionItem["type"]) => {
    switch (type) {
      case "deadline":
        return "border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
      case "event":
        return "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"
      case "rsvp":
        return "border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
      case "location":
        return "border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100"
      case "link":
        return "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
      default:
        return "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
    }
  }

  const chipSize = size === "sm" ? "text-xs px-2 py-1" : size === "lg" ? "text-sm px-3 py-2" : "text-xs px-2.5 py-1.5"

  return (
    <ActionItemDrawer action={action}>
      <Badge
        variant={variant}
        className={`
          cursor-pointer transition-colors inline-flex items-center gap-1.5
          ${chipSize}
          ${variant === "default" ? getActionColor(action.type) : ""}
        `}
      >
        {getActionIcon(action.type)}
        <span className="capitalize">{action.type}</span>
        {action.confidence && <span className="opacity-75">{Math.round(action.confidence * 100)}%</span>}
      </Badge>
    </ActionItemDrawer>
  )
}

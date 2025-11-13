"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeadlineHighlightProps {
  deadline: string
  className?: string
}

export function DeadlineHighlight({ deadline, className }: DeadlineHighlightProps) {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  const isImminent = hoursUntilDeadline <= 48 && hoursUntilDeadline > 0
  const isPast = hoursUntilDeadline <= 0

  if (isPast) {
    return (
      <Badge variant="destructive" className={cn("flex items-center space-x-1", className)}>
        <AlertTriangle className="w-3 h-3" />
        <span>Overdue</span>
      </Badge>
    )
  }

  if (isImminent) {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "flex items-center space-x-1 bg-amber-100 text-amber-800 border-amber-200 animate-pulse",
          className,
        )}
      >
        <Clock className="w-3 h-3" />
        <span>
          {hoursUntilDeadline < 24
            ? `${Math.round(hoursUntilDeadline)}h left`
            : `${Math.round(hoursUntilDeadline / 24)}d left`}
        </span>
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={cn("flex items-center space-x-1", className)}>
      <Clock className="w-3 h-3" />
      <span>
        {deadlineDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          ...(deadlineDate.getFullYear() !== now.getFullYear() && { year: "numeric" }),
        })}
      </span>
    </Badge>
  )
}

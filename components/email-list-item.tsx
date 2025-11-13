"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Mail, MailOpen, Archive, Trash2 } from "lucide-react"
import type { EmailSummary } from "@/lib/types"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface EmailListItemProps {
  email: EmailSummary
  onClick?: () => void
}

export function EmailListItem({ email, onClick }: EmailListItemProps) {
  const { markEmailAsRead, toggleEmailStar } = useAppStore()

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleEmailStar(email.id)
  }

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    markEmailAsRead(email.id)
  }

  return (
    <Card
      className={cn("cursor-pointer transition-all hover:shadow-md", !email.isRead && "bg-blue-50/30 border-blue-200")}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Star */}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 mt-1" onClick={handleStarClick}>
            <Star className={cn("w-4 h-4", email.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400")} />
          </Button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className={cn("font-medium truncate", !email.isRead && "font-semibold")}>{email.sender}</h3>
                <span className="text-sm text-gray-500">{email.senderEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{new Date(email.receivedAt).toLocaleDateString()}</span>
                {!email.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
            </div>

            <h4 className={cn("text-sm mb-2 truncate", !email.isRead ? "font-medium text-gray-900" : "text-gray-700")}>
              {email.subject}
            </h4>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{email.summary}</p>

            {/* Labels */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {email.labels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleMarkRead}>
                  {email.isRead ? <Mail className="w-3 h-3" /> : <MailOpen className="w-3 h-3" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Archive className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

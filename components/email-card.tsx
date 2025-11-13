"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, Star, Archive, Bookmark, MoreHorizontal, Zap } from "lucide-react"
import type { EmailSummary } from "@/lib/types"

interface EmailCardProps {
  email: EmailSummary
  selected?: boolean
  onClick?: () => void
  onSave?: () => void
  onSnooze?: () => void
  onArchive?: () => void
  onStar?: () => void
}

export function EmailCard({ email, selected = false, onClick, onSave, onSnooze, onArchive, onStar }: EmailCardProps) {
  const [isStarred, setIsStarred] = useState(email.isStarred || false)

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsStarred(!isStarred)
    onStar?.()
  }

  const getEmailType = () => {
    if (email.isNewsletter)
      return { label: "Newsletter", variant: "default" as const, color: "bg-blue-100 text-blue-800" }
    if (email.isPromo) return { label: "Promo", variant: "secondary" as const, color: "bg-green-100 text-green-800" }
    if (email.isTransaction)
      return { label: "Transaction", variant: "outline" as const, color: "bg-purple-100 text-purple-800" }
    return null
  }

  const emailType = getEmailType()
  const senderName = email.sender.split("<")[0].trim() || email.sender
  const senderInitials = senderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Sender Avatar/Favicon */}
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={email.senderAvatar || "/placeholder.svg"} alt={senderName} />
            <AvatarFallback className="text-xs font-medium">{senderInitials}</AvatarFallback>
          </Avatar>

          {/* Email Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm truncate">{senderName}</span>
                {emailType && (
                  <Badge variant={emailType.variant} className={`text-xs ${emailType.color}`}>
                    {emailType.label}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{new Date(email.receivedAt).toLocaleDateString()}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleStar}>
                  <Star className={`w-3 h-3 ${isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                </Button>
              </div>
            </div>

            {/* Subject */}
            <h3 className="font-medium text-sm mb-2 truncate">{email.subject}</h3>

            {/* AI Preview Line */}
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{email.aiSummary || email.snippet}</p>

            {/* Footer with badges and actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {email.priority === "high" && (
                  <Badge variant="destructive" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    High Priority
                  </Badge>
                )}
                {email.hasAttachments && (
                  <Badge variant="outline" className="text-xs">
                    📎 Attachment
                  </Badge>
                )}
                {!email.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onSave?.()
                    }}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save for Later
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onSnooze?.()
                    }}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Snooze
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onArchive?.()
                    }}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import type { EmailSummary } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, ExternalLink, Star, Archive, Trash2 } from "lucide-react"

interface EmailPreviewPaneProps {
  email: EmailSummary | null
}

export function EmailPreviewPane({ email }: EmailPreviewPaneProps) {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select an email</h3>
          <p className="text-gray-500">Choose an email from the list to see its summary and actions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={`https://www.google.com/s2/favicons?domain=${email.sender.split("@")[1]}`}
                alt=""
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">{email.sender}</span>
              <Badge variant="secondary" className="text-xs">
                {email.category}
              </Badge>
              {email.headerSignals?.listUnsubscribe && (
                <Badge variant="outline" className="text-xs">
                  List-Unsubscribe
                </Badge>
              )}
              {email.headerSignals?.listId && (
                <Badge variant="outline" className="text-xs">
                  List-ID
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{email.subject}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{new Date(email.receivedAt).toLocaleDateString()}</span>
              <span>{new Date(email.receivedAt).toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Summary</h3>
          <p className="text-gray-700 leading-relaxed">{email.summary}</p>
        </div>

        <Separator />

        {/* Action Items */}
        {email.actionItems && email.actionItems.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Action Items</h3>
            <div className="space-y-3">
              {email.actionItems.map((action, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {action.type === "deadline" && <Clock className="w-4 h-4 text-red-500" />}
                          {action.type === "event" && <Calendar className="w-4 h-4 text-blue-500" />}
                          {action.type === "location" && <MapPin className="w-4 h-4 text-green-500" />}
                          <Badge variant="outline" className="text-xs capitalize">
                            {action.type}
                          </Badge>
                          {action.priority === "high" && (
                            <Badge variant="destructive" className="text-xs">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-gray-900 mb-1">{action.title}</p>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        {action.dueDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Due: {new Date(action.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {action.type === "event" && (
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Add to Calendar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {email.topics && email.topics.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {email.topics.map((topic, index) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Original Email Link */}
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Want to see the full email?</span>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Original
          </Button>
        </div>
      </div>
    </div>
  )
}

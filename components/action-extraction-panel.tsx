"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Save,
  AlertTriangle,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { CalendarModal } from "./calendar-modal"
import { DeadlineHighlight } from "./deadline-highlight"
import { NoActionsState } from "./no-actions-state"
import { useActionExtraction } from "@/hooks/use-action-extraction"
import { useToast } from "@/hooks/use-toast"
import type { ActionItem, ExtractedEvent } from "@/lib/types"

interface ActionExtractionPanelProps {
  actionItems?: ActionItem[]
  extractedEvents?: ExtractedEvent[]
  emailContent?: string
  subject?: string
  sender?: string
  autoExtract?: boolean
}

export function ActionExtractionPanel({
  actionItems: initialActionItems = [],
  extractedEvents: initialExtractedEvents = [],
  emailContent,
  subject,
  sender,
  autoExtract = false,
}: ActionExtractionPanelProps) {
  const [selectedEvent, setSelectedEvent] = useState<ExtractedEvent | null>(null)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [actionItems, setActionItems] = useState<ActionItem[]>(initialActionItems)
  const [extractedEvents, setExtractedEvents] = useState<ExtractedEvent[]>(initialExtractedEvents)
  const { toast } = useToast()

  const extractionMutation = useActionExtraction()

  const handleExtractActions = async () => {
    if (!emailContent) return

    try {
      const result = await extractionMutation.mutateAsync({
        emailContent,
        subject,
        sender,
      })

      setActionItems(result.actionItems)
      setExtractedEvents(result.events)

      toast({
        title: "Actions Extracted",
        description: `Found ${result.actionItems.length} action items and ${result.events.length} events`,
      })
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Unable to extract actions from this email",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = async (url: string) => {
    await navigator.clipboard.writeText(url)
    toast({
      title: "Link Copied",
      description: "Link has been copied to clipboard",
    })
  }

  const getActionIcon = (type: ActionItem["type"]) => {
    switch (type) {
      case "deadline":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "event":
        return <Calendar className="w-4 h-4 text-blue-500" />
      case "rsvp":
        return <Users className="w-4 h-4 text-green-500" />
      case "location":
        return <MapPin className="w-4 h-4 text-purple-500" />
      case "link":
        return <ExternalLink className="w-4 h-4 text-gray-500" />
      default:
        return <CheckCircle2 className="w-4 h-4 text-gray-500" />
    }
  }

  const getActionColor = (type: ActionItem["type"], dueDate?: string) => {
    if (type === "deadline" && dueDate) {
      const deadlineDate = new Date(dueDate)
      const now = new Date()
      const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)

      if (hoursUntilDeadline <= 0) {
        return "border-l-red-600 bg-red-100 ring-1 ring-red-200"
      } else if (hoursUntilDeadline <= 48) {
        return "border-l-amber-500 bg-amber-50 ring-1 ring-amber-200"
      }
    }

    switch (type) {
      case "deadline":
        return "border-l-red-500 bg-red-50"
      case "event":
        return "border-l-blue-500 bg-blue-50"
      case "rsvp":
        return "border-l-green-500 bg-green-50"
      case "location":
        return "border-l-purple-500 bg-purple-50"
      case "link":
        return "border-l-gray-500 bg-gray-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
              Action Extraction
            </CardTitle>
            {emailContent && actionItems.length === 0 && (
              <Button size="sm" onClick={handleExtractActions} disabled={extractionMutation.isPending}>
                {extractionMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Extract
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loading State */}
          {extractionMutation.isPending && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-gray-600">Extracting actions...</p>
              </div>
            </div>
          )}

          {/* Timeline of Action Items */}
          {!extractionMutation.isPending && actionItems.length > 0 ? (
            <div className="space-y-3">
              {actionItems.map((item, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${getActionColor(item.type, item.dueDate)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getActionIcon(item.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 capitalize">{item.type}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.text}</p>
                        {item.dueDate && (
                          <div className="flex items-center mt-2">
                            <DeadlineHighlight deadline={item.dueDate} />
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {(item.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex items-center space-x-2">
                    {(item.type === "event" || item.type === "deadline") && (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (item.type === "event") {
                            // Find corresponding extracted event
                            const event = extractedEvents.find((e) =>
                              e.title.toLowerCase().includes(item.text.toLowerCase()),
                            )
                            if (event) {
                              setSelectedEvent(event)
                              setIsCalendarModalOpen(true)
                            }
                          } else if (item.type === "deadline" && item.dueDate) {
                            // Create event from deadline
                            const deadlineEvent: ExtractedEvent = {
                              id: `deadline-${index}`,
                              title: item.text,
                              startTime: new Date(item.dueDate).toISOString(),
                              endTime: new Date(new Date(item.dueDate).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
                              description: `Deadline: ${item.text}`,
                            }
                            setSelectedEvent(deadlineEvent)
                            setIsCalendarModalOpen(true)
                          }
                        }}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Add to Calendar
                      </Button>
                    )}

                    {item.type === "link" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => window.open(item.text, "_blank")}>
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCopyLink(item.text)}>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </>
                    )}

                    {item.type === "rsvp" && (
                      <Button size="sm" variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        RSVP
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : !extractionMutation.isPending ? (
            <NoActionsState />
          ) : null}

          {extractedEvents.length > 0 && (
            <>
              <Separator />
              {/* Extracted Events */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Calendar Events</h4>
                {extractedEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">{event.title}</p>
                        <div className="mt-2 space-y-1 text-sm text-blue-700">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(event.startTime).toLocaleString()}
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsCalendarModalOpen(true)
                        }}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Calendar Modal */}
      {selectedEvent && (
        <CalendarModal
          isOpen={isCalendarModalOpen}
          onClose={() => {
            setIsCalendarModalOpen(false)
            setSelectedEvent(null)
          }}
          event={selectedEvent}
        />
      )}
    </>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ExternalLink, Plus } from "lucide-react"
import { useCreateCalendarEvent } from "@/hooks/useMockApi"
import { useToast } from "@/hooks/use-toast"
import type { ActionItem, ExtractedEvent } from "@/lib/types"

interface CalendarModalProps {
  action: ActionItem
  children: React.ReactNode
}

export function CalendarModal({ action, children }: CalendarModalProps) {
  const [open, setOpen] = useState(false)
  const [event, setEvent] = useState<ExtractedEvent>({
    title: action.text,
    datetimeStart: action.datetime || new Date().toISOString(),
    datetimeEnd: action.datetime ? new Date(new Date(action.datetime).getTime() + 60 * 60 * 1000).toISOString() : "",
    location: action.place || "",
    url: action.url || "",
    description: `Extracted from newsletter: ${action.text}`,
  })

  const { mutate: createEvent, isPending } = useCreateCalendarEvent()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createEvent(event, {
      onSuccess: (data) => {
        toast({
          title: "Event created",
          description: "The event has been added to your calendar.",
        })
        setOpen(false)
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create calendar event.",
          variant: "destructive",
        })
      },
    })
  }

  const formatDateTimeLocal = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toISOString().slice(0, 16)
  }

  const handleDateTimeChange = (field: "datetimeStart" | "datetimeEnd", value: string) => {
    if (!value) return
    const isoString = new Date(value).toISOString()
    setEvent((prev) => ({ ...prev, [field]: isoString }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Add to Calendar</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={event.title}
              onChange={(e) => setEvent((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Date & Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={formatDateTimeLocal(event.datetimeStart)}
                onChange={(e) => handleDateTimeChange("datetimeStart", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Date & Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={formatDateTimeLocal(event.datetimeEnd || "")}
                onChange={(e) => handleDateTimeChange("datetimeEnd", e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="location"
                value={event.location || ""}
                onChange={(e) => setEvent((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
                className="pl-10"
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">Event URL</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="url"
                type="url"
                value={event.url || ""}
                onChange={(e) => setEvent((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={event.description || ""}
              onChange={(e) => setEvent((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Add event description..."
              rows={3}
            />
          </div>

          {/* Action Type Badge */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="capitalize">
              {action.type}
            </Badge>
            <Badge variant={action.priority === "high" ? "destructive" : "secondary"}>{action.priority} priority</Badge>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Calendar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

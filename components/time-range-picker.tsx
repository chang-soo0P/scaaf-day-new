"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle } from "lucide-react"

interface TimeRangePickerProps {
  label?: string
  description?: string
  startTime?: string
  endTime?: string
  onTimeRangeChange?: (startTime: string, endTime: string) => void
  error?: string
}

export function TimeRangePicker({
  label = "Quiet Hours",
  description = "Select the time range when you don't want to receive notifications",
  startTime = "22:00",
  endTime = "08:00",
  onTimeRangeChange,
  error,
}: TimeRangePickerProps) {
  const [start, setStart] = useState(startTime)
  const [end, setEnd] = useState(endTime)
  const [validationError, setValidationError] = useState<string>("")

  // Generate time options (24-hour format)
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        options.push({ value: timeString, label: displayTime })
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  const validateTimeRange = (startTime: string, endTime: string) => {
    const startMinutes = Number.parseInt(startTime.split(":")[0]) * 60 + Number.parseInt(startTime.split(":")[1])
    const endMinutes = Number.parseInt(endTime.split(":")[0]) * 60 + Number.parseInt(endTime.split(":")[1])

    // Allow overnight ranges (e.g., 22:00 to 08:00)
    if (startMinutes === endMinutes) {
      return "Start and end times cannot be the same"
    }

    return ""
  }

  const handleStartTimeChange = (newStart: string) => {
    setStart(newStart)
    const error = validateTimeRange(newStart, end)
    setValidationError(error)

    if (!error) {
      onTimeRangeChange?.(newStart, end)
    }
  }

  const handleEndTimeChange = (newEnd: string) => {
    setEnd(newEnd)
    const error = validateTimeRange(start, newEnd)
    setValidationError(error)

    if (!error) {
      onTimeRangeChange?.(start, newEnd)
    }
  }

  const formatTimeRange = () => {
    const startDisplay = timeOptions.find((opt) => opt.value === start)?.label
    const endDisplay = timeOptions.find((opt) => opt.value === end)?.label
    return `${startDisplay} - ${endDisplay}`
  }

  const calculateDuration = () => {
    const startMinutes = Number.parseInt(start.split(":")[0]) * 60 + Number.parseInt(start.split(":")[1])
    const endMinutes = Number.parseInt(end.split(":")[0]) * 60 + Number.parseInt(end.split(":")[1])

    let duration = endMinutes - startMinutes
    if (duration < 0) {
      duration += 24 * 60 // Handle overnight ranges
    }

    const hours = Math.floor(duration / 60)
    const minutes = duration % 60

    if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`
    } else {
      return `${hours}h ${minutes}m`
    }
  }

  const currentError = error || validationError

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {label}
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Select value={start} onValueChange={handleStartTimeChange}>
              <SelectTrigger id="start-time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Select value={end} onValueChange={handleEndTimeChange}>
              <SelectTrigger id="end-time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Quiet Hours</p>
              <p className="text-xs text-muted-foreground">{formatTimeRange()}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {calculateDuration()}
            </Badge>
          </div>
        </div>

        {/* Error Message */}
        {currentError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{currentError}</p>
          </div>
        )}

        {/* Helper Text */}
        <p className="text-xs text-muted-foreground">
          Notifications will be paused during these hours. Overnight ranges (e.g., 10 PM to 8 AM) are supported.
        </p>
      </CardContent>
    </Card>
  )
}

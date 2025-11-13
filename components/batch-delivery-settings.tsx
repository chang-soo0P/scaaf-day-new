"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Moon, Bell, Settings } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useState } from "react"

export function BatchDeliverySettings() {
  const { settings, updateSettings } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  const [tempSettings, setTempSettings] = useState({
    quietHoursStart: settings.quietHoursStart,
    quietHoursEnd: settings.quietHoursEnd,
    emailFrequency: settings.emailFrequency,
  })

  const handleSave = () => {
    updateSettings(tempSettings)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempSettings({
      quietHoursStart: settings.quietHoursStart,
      quietHoursEnd: settings.quietHoursEnd,
      emailFrequency: settings.emailFrequency,
    })
    setIsEditing(false)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Batch Delivery</CardTitle>
              <CardDescription>Schedule when you receive newsletter notifications</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={settings.batchDelivery ? "default" : "secondary"}>
              {settings.batchDelivery ? "Enabled" : "Disabled"}
            </Badge>
            <Switch
              checked={settings.batchDelivery}
              onCheckedChange={(enabled) => updateSettings({ batchDelivery: enabled })}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Settings Display */}
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Moon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Quiet Hours</p>
                  <p className="text-sm text-gray-600">
                    {formatTime(settings.quietHoursStart)} - {formatTime(settings.quietHoursEnd)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Delivery Frequency</p>
                  <p className="text-sm text-gray-600 capitalize">{settings.emailFrequency}</p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Quiet Hours Start</Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={tempSettings.quietHoursStart}
                    onChange={(e) => setTempSettings((prev) => ({ ...prev, quietHoursStart: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">Quiet Hours End</Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={tempSettings.quietHoursEnd}
                    onChange={(e) => setTempSettings((prev) => ({ ...prev, quietHoursEnd: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Email Frequency</Label>
                <Select
                  value={tempSettings.emailFrequency}
                  onValueChange={(value: any) => setTempSettings((prev) => ({ ...prev, emailFrequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            )}
          </div>

          {/* Info */}
          {settings.batchDelivery && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <Clock className="w-4 h-4 inline mr-1" />
                Notifications will be batched and delivered according to your schedule during non-quiet hours.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

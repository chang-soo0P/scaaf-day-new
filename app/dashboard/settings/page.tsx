"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Clock,
  Bell,
  Shield,
  Trash2,
  Download,
  Mail,
  AlertTriangle,
  CheckCircle,
  Settings,
  Brain,
  Crown,
  CreditCard,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useUserStore } from "@/lib/user-store"
import PlanBadge from "@/components/plan-badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore()
  const { plan } = useUserStore()
  const router = useRouter()
  const [digestTime, setDigestTime] = useState("09:00")
  const [selectedWeekdays, setSelectedWeekdays] = useState([1, 2, 3, 4, 5]) // Mon-Fri
  const [quietHoursStart, setQuietHoursStart] = useState("22:00")
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00")
  const [dataRetention, setDataRetention] = useState("30")
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState([75])
  const [maxActionsPerEmail, setMaxActionsPerEmail] = useState([5])
  const [processingMode, setProcessingMode] = useState("balanced")

  const weekdays = [
    { id: 0, label: "Sun", name: "Sunday" },
    { id: 1, label: "Mon", name: "Monday" },
    { id: 2, label: "Tue", name: "Tuesday" },
    { id: 3, label: "Wed", name: "Wednesday" },
    { id: 4, label: "Thu", name: "Thursday" },
    { id: 5, label: "Fri", name: "Friday" },
    { id: 6, label: "Sat", name: "Saturday" },
  ]

  const handleWeekdayToggle = (dayId: number) => {
    setSelectedWeekdays((prev) => (prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]))
  }

  const handleExportData = async () => {
    setIsExporting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const exportData = {
      settings,
      digestTime,
      selectedWeekdays,
      quietHours: { start: quietHoursStart, end: quietHoursEnd },
      aiSettings: {
        confidenceThreshold: aiConfidenceThreshold[0],
        maxActionsPerEmail: maxActionsPerEmail[0],
        processingMode,
      },
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-agent-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsExporting(false)
  }

  const handleDeleteAllData = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch("/api/emails", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete email data")
      }

      updateSettings({
        notifications: { email: false, push: false, desktop: false },
        categories: [],
        dataMinimization: true,
        batchDelivery: { enabled: false, quietHours: { start: "22:00", end: "08:00" } },
      })

      setDigestTime("09:00")
      setSelectedWeekdays([1, 2, 3, 4, 5])
      setQuietHoursStart("22:00")
      setQuietHoursEnd("08:00")
      setDataRetention("30")
      setAiConfidenceThreshold([75])
      setMaxActionsPerEmail([5])
      setProcessingMode("balanced")

      toast.success("All data deleted successfully", {
        description: "Your settings, summaries, and processed emails have been permanently removed.",
      })
    } catch (error) {
      console.error("Error deleting data:", error)
      toast.error("Failed to delete data", {
        description: "There was an error deleting your data. Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRevokeConnection = () => {
    console.log("Gmail connection revoked")
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your newsletter agent preferences and privacy settings</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>Current Plan</span>
              </div>
              <PlanBadge plan={plan} />
            </CardTitle>
            <CardDescription>
              {plan === "free" && "You're on the free plan with limited features"}
              {plan === "pro" && "You have access to all Pro features"}
              {plan === "team" && "You have access to all Team features"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {plan === "free" && "Free Plan - Limited Access"}
                  {plan === "pro" && "Pro Plan - $5/month"}
                  {plan === "team" && "Team Plan - $20/month"}
                </p>
                <p className="text-sm text-gray-600">
                  {plan === "free" && "3 summaries/day, 1 rule, no calendar sync"}
                  {plan === "pro" && "Unlimited summaries, rules, and calendar sync"}
                  {plan === "team" && "All Pro features + shared digest feed"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {plan === "free" && (
                  <Button onClick={() => router.push("/pricing")}>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                )}
                {(plan === "pro" || plan === "team") && (
                  <Button variant="outline" onClick={() => window.open("https://billing.example.com", "_blank")}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Processing</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Digest Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Digest Schedule</span>
                </CardTitle>
                <CardDescription>Configure when you receive your daily digest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="digest-time">Time</Label>
                    <Input
                      id="digest-time"
                      type="time"
                      value={digestTime}
                      onChange={(e) => setDigestTime(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Local timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </p>
                  </div>
                  <div>
                    <Label>Weekdays</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {weekdays.map((day) => (
                        <Button
                          key={day.id}
                          variant={selectedWeekdays.includes(day.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleWeekdayToggle(day.id)}
                          className="w-12 h-8"
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Batch Delivery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Batch Delivery</span>
                </CardTitle>
                <CardDescription>Set quiet hours to batch notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="batch-delivery">Enable Batch Delivery</Label>
                    <p className="text-sm text-gray-600">Hold notifications during quiet hours</p>
                  </div>
                  <Switch
                    id="batch-delivery"
                    checked={settings.batchDelivery?.enabled || false}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        batchDelivery: {
                          ...settings.batchDelivery,
                          enabled: checked,
                          quietHours: { start: quietHoursStart, end: quietHoursEnd },
                        },
                      })
                    }
                  />
                </div>

                {settings.batchDelivery?.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        value={quietHoursStart}
                        onChange={(e) => setQuietHoursStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet-end">Quiet Hours End</Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        value={quietHoursEnd}
                        onChange={(e) => setQuietHoursEnd(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="digest-push">Digest Push Notifications</Label>
                    <p className="text-sm text-gray-600">Daily digest summary notifications</p>
                  </div>
                  <Switch
                    id="digest-push"
                    checked={settings.notifications?.push || false}
                    onCheckedChange={(checked) =>
                      updateSettings({ notifications: { ...settings.notifications, push: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="critical-only">Critical Only Mode</Label>
                    <p className="text-sm text-gray-600">Only urgent action items and deadlines</p>
                  </div>
                  <Switch
                    id="critical-only"
                    checked={settings.notifications?.criticalOnly || false}
                    onCheckedChange={(checked) =>
                      updateSettings({ notifications: { ...settings.notifications, criticalOnly: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smart-timing">Smart Notification Timing</Label>
                    <p className="text-sm text-gray-600">AI learns your optimal notification times</p>
                  </div>
                  <Switch
                    id="smart-timing"
                    checked={settings.notifications?.smartTiming || false}
                    onCheckedChange={(checked) =>
                      updateSettings({ notifications: { ...settings.notifications, smartTiming: checked } })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Processing</span>
                </CardTitle>
                <CardDescription>Configure how AI analyzes your emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Processing Mode</Label>
                    <Select value={processingMode} onValueChange={setProcessingMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">Fast - Quick analysis, basic actions</SelectItem>
                        <SelectItem value="balanced">Balanced - Good accuracy and speed</SelectItem>
                        <SelectItem value="thorough">Thorough - Deep analysis, best accuracy</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {processingMode === "fast" && "~0.5s per email, basic action extraction"}
                      {processingMode === "balanced" && "~1.5s per email, comprehensive analysis"}
                      {processingMode === "thorough" && "~3s per email, maximum accuracy"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>AI Confidence Threshold: {aiConfidenceThreshold[0]}%</Label>
                    <Slider
                      value={aiConfidenceThreshold}
                      onValueChange={setAiConfidenceThreshold}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">Only show action items with confidence above this threshold</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Actions per Email: {maxActionsPerEmail[0]}</Label>
                    <Slider
                      value={maxActionsPerEmail}
                      onValueChange={setMaxActionsPerEmail}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">Limit the number of action items extracted from each email</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-categorization">Auto-categorization</Label>
                      <p className="text-sm text-gray-600">Automatically categorize emails by content</p>
                    </div>
                    <Switch
                      id="auto-categorization"
                      checked={settings.ai?.autoCategorization || false}
                      onCheckedChange={(checked) =>
                        updateSettings({ ai: { ...settings.ai, autoCategorization: checked } })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sentiment-analysis">Sentiment Analysis</Label>
                      <p className="text-sm text-gray-600">Analyze email tone and urgency</p>
                    </div>
                    <Switch
                      id="sentiment-analysis"
                      checked={settings.ai?.sentimentAnalysis || false}
                      onCheckedChange={(checked) =>
                        updateSettings({ ai: { ...settings.ai, sentimentAnalysis: checked } })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smart-summaries">Smart Summaries</Label>
                      <p className="text-sm text-gray-600">Generate intelligent email summaries</p>
                    </div>
                    <Switch
                      id="smart-summaries"
                      checked={settings.ai?.smartSummaries || true}
                      onCheckedChange={(checked) => updateSettings({ ai: { ...settings.ai, smartSummaries: checked } })}
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Brain className="w-4 h-4 inline mr-1" />
                    AI processing happens locally when possible to protect your privacy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            {/* Data Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Data Control</span>
                </CardTitle>
                <CardDescription>Manage your data privacy and retention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="in-memory-only">Process raw emails in-memory only</Label>
                    <p className="text-sm text-gray-600">Raw email content never stored on servers</p>
                  </div>
                  <Switch
                    id="in-memory-only"
                    checked={settings.dataMinimization || false}
                    onCheckedChange={(checked) => updateSettings({ dataMinimization: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anonymize-senders">Anonymize sender data</Label>
                    <p className="text-sm text-gray-600">Hash email addresses in stored summaries</p>
                  </div>
                  <Switch
                    id="anonymize-senders"
                    checked={settings.privacy?.anonymizeSenders || false}
                    onCheckedChange={(checked) =>
                      updateSettings({ privacy: { ...settings.privacy, anonymizeSenders: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="local-processing">Prefer local processing</Label>
                    <p className="text-sm text-gray-600">Process emails locally when possible</p>
                  </div>
                  <Switch
                    id="local-processing"
                    checked={settings.privacy?.localProcessing || true}
                    onCheckedChange={(checked) =>
                      updateSettings({ privacy: { ...settings.privacy, localProcessing: checked } })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data-retention">Store summaries for</Label>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="never">Never delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="justify-start bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? "Exporting..." : "Export Data (JSON)"}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-red-600 hover:text-red-700 bg-transparent"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {isDeleting ? "Deleting..." : "Delete All Data"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <span>Delete All Data</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your settings, summaries,
                          processed emails, and preferences from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAllData}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete Everything"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Shield className="w-4 h-4 inline mr-1" />
                    When data minimization is enabled, raw emails are processed locally and only summaries are stored.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            {/* Account */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Account</span>
                </CardTitle>
                <CardDescription>Gmail connection and account management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Gmail Connected</p>
                      <p className="text-sm text-gray-600">user@gmail.com</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-semibold text-green-600">1,247</p>
                    <p className="text-sm text-green-700">Emails Processed</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-semibold text-blue-600">2 min</p>
                    <p className="text-sm text-blue-700">Last Sync</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-semibold text-purple-600">98.5%</p>
                    <p className="text-sm text-purple-700">Uptime</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        Revoke Connection
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Gmail Connection</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will disconnect your Gmail account and stop processing newsletters. You can reconnect at
                          any time.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRevokeConnection} className="bg-red-600 hover:bg-red-700">
                          Revoke Connection
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Permissions
                  </Button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <Shield className="w-4 h-4 inline mr-1" />
                    We only access newsletter emails and metadata. Personal emails are never processed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

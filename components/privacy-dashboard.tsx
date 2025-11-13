"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
import { Shield, Download, Trash2, Database, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface PrivacySettings {
  dataMinimization: boolean
  anonymizeSenders: boolean
  localProcessing: boolean
  autoDelete: boolean
  autoDeleteDays: number
  shareAnalytics: boolean
  emailTracking: boolean
}

interface DataSummary {
  totalEmails: number
  summariesStored: number
  actionsExtracted: number
  rulesCreated: number
  storageUsed: string
  lastBackup: string
}

export function PrivacyDashboard() {
  const [settings, setSettings] = useState<PrivacySettings>({
    dataMinimization: true,
    anonymizeSenders: false,
    localProcessing: true,
    autoDelete: false,
    autoDeleteDays: 90,
    shareAnalytics: false,
    emailTracking: false,
  })

  const [dataSummary] = useState<DataSummary>({
    totalEmails: 1247,
    summariesStored: 1247,
    actionsExtracted: 342,
    rulesCreated: 8,
    storageUsed: "2.3 MB",
    lastBackup: "2024-01-15T10:30:00Z",
  })

  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const updateSetting = (key: keyof PrivacySettings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleExportData = async () => {
    setIsExporting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const exportData = {
      settings,
      dataSummary,
      exportDate: new Date().toISOString(),
      dataTypes: {
        emailSummaries: dataSummary.summariesStored,
        actionItems: dataSummary.actionsExtracted,
        automationRules: dataSummary.rulesCreated,
        userPreferences: "included",
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `action-inbox-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsExporting(false)
  }

  const handleDeleteAllData = async () => {
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsDeleting(false)
  }

  const getPrivacyScore = () => {
    const enabledSettings = Object.values(settings).filter((value) => value === true).length
    return Math.round((enabledSettings / Object.keys(settings).length) * 100)
  }

  const privacyScore = getPrivacyScore()

  return (
    <div className="space-y-6">
      {/* Privacy Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy Score</span>
          </CardTitle>
          <CardDescription>Your current privacy protection level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Privacy Protection</span>
                <span className="text-sm text-muted-foreground">{privacyScore}%</span>
              </div>
              <Progress value={privacyScore} className="h-2" />
            </div>
            <Badge
              variant={privacyScore >= 80 ? "default" : privacyScore >= 60 ? "secondary" : "destructive"}
              className={
                privacyScore >= 80
                  ? "bg-green-100 text-green-800"
                  : privacyScore >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }
            >
              {privacyScore >= 80 ? "Excellent" : privacyScore >= 60 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Controls</CardTitle>
          <CardDescription>Configure how your data is processed and stored</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="data-minimization">Data Minimization</Label>
                  <p className="text-xs text-muted-foreground">Only store essential data for functionality</p>
                </div>
                <Switch
                  id="data-minimization"
                  checked={settings.dataMinimization}
                  onCheckedChange={(checked) => updateSetting("dataMinimization", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="anonymize-senders">Anonymize Senders</Label>
                  <p className="text-xs text-muted-foreground">Hash email addresses in stored data</p>
                </div>
                <Switch
                  id="anonymize-senders"
                  checked={settings.anonymizeSenders}
                  onCheckedChange={(checked) => updateSetting("anonymizeSenders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="local-processing">Local Processing</Label>
                  <p className="text-xs text-muted-foreground">Process emails on your device when possible</p>
                </div>
                <Switch
                  id="local-processing"
                  checked={settings.localProcessing}
                  onCheckedChange={(checked) => updateSetting("localProcessing", checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-delete">Auto-delete Old Data</Label>
                  <p className="text-xs text-muted-foreground">Automatically remove data after set period</p>
                </div>
                <Switch
                  id="auto-delete"
                  checked={settings.autoDelete}
                  onCheckedChange={(checked) => updateSetting("autoDelete", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="share-analytics">Share Anonymous Analytics</Label>
                  <p className="text-xs text-muted-foreground">Help improve the product with usage data</p>
                </div>
                <Switch
                  id="share-analytics"
                  checked={settings.shareAnalytics}
                  onCheckedChange={(checked) => updateSetting("shareAnalytics", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-tracking">Block Email Tracking</Label>
                  <p className="text-xs text-muted-foreground">Prevent tracking pixels and links</p>
                </div>
                <Switch
                  id="email-tracking"
                  checked={settings.emailTracking}
                  onCheckedChange={(checked) => updateSetting("emailTracking", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Summary</span>
          </CardTitle>
          <CardDescription>Overview of your stored data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{dataSummary.totalEmails.toLocaleString()}</p>
              <p className="text-sm text-blue-700">Emails Processed</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{dataSummary.summariesStored.toLocaleString()}</p>
              <p className="text-sm text-green-700">Summaries Stored</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{dataSummary.actionsExtracted}</p>
              <p className="text-sm text-purple-700">Actions Extracted</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{dataSummary.storageUsed}</p>
              <p className="text-sm text-orange-700">Storage Used</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                Last backup: {new Date(dataSummary.lastBackup).toLocaleDateString()}
              </span>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Up to date
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={isExporting}
              className="justify-start h-auto p-4 bg-transparent"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Export All Data</p>
                  <p className="text-xs text-muted-foreground">Download your data as JSON</p>
                </div>
              </div>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start h-auto p-4 text-red-600 hover:text-red-700 bg-transparent"
                >
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">Delete All Data</p>
                      <p className="text-xs text-muted-foreground">Permanently remove all stored data</p>
                    </div>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Delete All Data</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your email summaries, action items,
                    automation rules, and preferences from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAllData}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete Everything"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Data Retention Policy</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {settings.autoDelete
                    ? `Your data is automatically deleted after ${settings.autoDeleteDays} days.`
                    : "Your data is retained indefinitely unless manually deleted."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

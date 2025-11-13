"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Trash2, Eye } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function DataMinimizationToggle() {
  const { settings, updateSettings } = useAppStore()

  const handleToggle = (enabled: boolean) => {
    updateSettings({ dataMinimization: enabled })
  }

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Data Minimization</CardTitle>
              <CardDescription>Process emails in-memory, save only summaries</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={settings.dataMinimization ? "default" : "secondary"}>
              {settings.dataMinimization ? "Enabled" : "Disabled"}
            </Badge>
            <Switch checked={settings.dataMinimization} onCheckedChange={handleToggle} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Process Locally</h4>
                <p className="text-xs text-gray-600">AI analysis happens in your browser</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Summary Only</h4>
                <p className="text-xs text-gray-600">Store summaries, not full content</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Auto Delete</h4>
                <p className="text-xs text-gray-600">Original emails deleted after processing</p>
              </div>
            </div>
          </div>

          {settings.dataMinimization && (
            <div className="p-3 bg-green-100 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <Shield className="w-4 h-4 inline mr-1" />
                Privacy mode active: Your email content is processed locally and only summaries are stored.
              </p>
            </div>
          )}

          {!settings.dataMinimization && (
            <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <Database className="w-4 h-4 inline mr-1" />
                Standard mode: Full email content is stored for better search and analysis.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

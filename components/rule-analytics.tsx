"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, TrendingUp, Activity, Clock } from "lucide-react"

interface RuleAnalytics {
  ruleId: string
  ruleName: string
  totalMatches: number
  successRate: number
  avgProcessingTime: number
  lastTriggered: string
  trend: "up" | "down" | "stable"
}

const mockAnalytics: RuleAnalytics[] = [
  {
    ruleId: "1",
    ruleName: "Auto-categorize Tech Newsletters",
    totalMatches: 156,
    successRate: 94,
    avgProcessingTime: 0.3,
    lastTriggered: "2 minutes ago",
    trend: "up",
  },
  {
    ruleId: "2",
    ruleName: "Label Design Updates",
    totalMatches: 89,
    successRate: 87,
    avgProcessingTime: 0.2,
    lastTriggered: "1 hour ago",
    trend: "stable",
  },
  {
    ruleId: "3",
    ruleName: "Batch Morning Newsletters",
    totalMatches: 234,
    successRate: 98,
    avgProcessingTime: 0.1,
    lastTriggered: "5 minutes ago",
    trend: "up",
  },
]

export function RuleAnalytics() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case "down":
        return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
      default:
        return <Activity className="w-3 h-3 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BarChart className="w-5 h-5 text-blue-600" />
          <CardTitle>Rule Performance</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {mockAnalytics.reduce((sum, rule) => sum + rule.totalMatches, 0)}
            </p>
            <p className="text-sm text-blue-700">Total Matches</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {Math.round(mockAnalytics.reduce((sum, rule) => sum + rule.successRate, 0) / mockAnalytics.length)}%
            </p>
            <p className="text-sm text-green-700">Avg Success Rate</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {(mockAnalytics.reduce((sum, rule) => sum + rule.avgProcessingTime, 0) / mockAnalytics.length).toFixed(1)}
              s
            </p>
            <p className="text-sm text-purple-700">Avg Processing</p>
          </div>
        </div>

        <div className="space-y-3">
          {mockAnalytics.map((rule) => (
            <div key={rule.ruleId} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{rule.ruleName}</h4>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(rule.trend)}
                  <Badge variant="outline" className="text-xs">
                    {rule.totalMatches} matches
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Success Rate</span>
                  <span className="font-medium">{rule.successRate}%</span>
                </div>
                <Progress value={rule.successRate} className="h-1" />

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{rule.avgProcessingTime}s avg</span>
                  </div>
                  <span>Last: {rule.lastTriggered}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

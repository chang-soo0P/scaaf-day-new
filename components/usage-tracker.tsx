"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Calendar, Zap } from "lucide-react"

interface UsageData {
  emailsProcessed: number
  emailsLimit: number
  rulesUsed: number
  rulesLimit: number
  currentPlan: "free" | "pro" | "team"
  billingPeriodEnd: string
}

interface UsageTrackerProps {
  usage: UsageData
  onUpgrade: () => void
}

export function UsageTracker({ usage, onUpgrade }: UsageTrackerProps) {
  const emailUsagePercent = (usage.emailsProcessed / usage.emailsLimit) * 100
  const rulesUsagePercent = (usage.rulesUsed / usage.rulesLimit) * 100

  const isNearEmailLimit = emailUsagePercent >= 80
  const isNearRulesLimit = rulesUsagePercent >= 80
  const isOverLimit = emailUsagePercent >= 100

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (usage.currentPlan !== "free") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Usage Overview</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {usage.currentPlan === "pro" ? "Pro Plan" : "Team Plan"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{usage.emailsProcessed.toLocaleString()}</p>
              <p className="text-sm text-blue-700">Emails Processed</p>
              <p className="text-xs text-blue-600 mt-1">This month</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{usage.rulesUsed}</p>
              <p className="text-sm text-purple-700">Active Rules</p>
              <p className="text-xs text-purple-600 mt-1">Unlimited</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">∞</p>
              <p className="text-sm text-green-700">No Limits</p>
              <p className="text-xs text-green-600 mt-1">Unlimited usage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={isOverLimit ? "border-red-200 bg-red-50" : isNearEmailLimit ? "border-yellow-200 bg-yellow-50" : ""}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Usage & Limits
            {(isNearEmailLimit || isNearRulesLimit) && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          </CardTitle>
          <Badge variant="outline">Free Plan</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Processing Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email Processing</span>
            <span className="text-sm text-muted-foreground">
              {usage.emailsProcessed.toLocaleString()} / {usage.emailsLimit.toLocaleString()}
            </span>
          </div>
          <Progress
            value={emailUsagePercent}
            className={`h-2 ${isOverLimit ? "bg-red-100" : isNearEmailLimit ? "bg-yellow-100" : ""}`}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Resets {formatDate(usage.billingPeriodEnd)}</span>
            <span>{Math.round(emailUsagePercent)}% used</span>
          </div>
        </div>

        {/* Rules Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Automation Rules</span>
            <span className="text-sm text-muted-foreground">
              {usage.rulesUsed} / {usage.rulesLimit}
            </span>
          </div>
          <Progress value={rulesUsagePercent} className={`h-2 ${isNearRulesLimit ? "bg-yellow-100" : ""}`} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active rules</span>
            <span>{Math.round(rulesUsagePercent)}% used</span>
          </div>
        </div>

        {/* Upgrade Prompt */}
        {(isNearEmailLimit || isNearRulesLimit || isOverLimit) && (
          <div
            className={`p-4 rounded-lg ${isOverLimit ? "bg-red-100 border border-red-200" : "bg-blue-50 border border-blue-200"}`}
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${isOverLimit ? "text-red-600" : "text-blue-600"}`} />
              <div className="flex-1">
                <h4 className={`font-medium ${isOverLimit ? "text-red-900" : "text-blue-900"}`}>
                  {isOverLimit ? "Usage Limit Reached" : "Approaching Usage Limits"}
                </h4>
                <p className={`text-sm mt-1 ${isOverLimit ? "text-red-700" : "text-blue-700"}`}>
                  {isOverLimit
                    ? "You've reached your monthly email processing limit. Upgrade to continue processing emails."
                    : "You're approaching your usage limits. Upgrade to Pro for unlimited processing and advanced features."}
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={onUpgrade}
                  variant={isOverLimit ? "destructive" : "default"}
                >
                  Upgrade to Pro - $5/month
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Benefits of upgrading */}
        {!isOverLimit && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-medium text-gray-900 mb-2">Unlock More with Pro</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Unlimited email processing</li>
              <li>• Unlimited automation rules</li>
              <li>• Advanced AI features</li>
              <li>• Priority support</li>
            </ul>
            <Button size="sm" variant="outline" className="mt-3 bg-transparent" onClick={onUpgrade}>
              Learn More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

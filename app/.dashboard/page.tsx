"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Trophy, Target, Zap, CheckCircle2, Star, Crown, Sparkles, Flame, Calendar } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [missionProgress, setMissionProgress] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [userLevel, setUserLevel] = useState(2)
  const [currentXP, setCurrentXP] = useState(250)
  const [maxXP, setMaxXP] = useState(500)

  const [currentStreak, setCurrentStreak] = useState(5)
  const [streakData, setStreakData] = useState(() => {
    // Generate mock streak data for last 30 days
    const today = new Date()
    const data = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const hasActivity = i < 5 || (i >= 10 && i <= 15) || i === 20 // Mock streak pattern
      data.push({
        date: date.toISOString().split("T")[0],
        completed: hasActivity,
        day: date.getDate(),
        isToday: i === 0,
      })
    }
    return data
  })

  const missionTarget = 3
  const progressPercent = (missionProgress / missionTarget) * 100
  const isCompleted = missionProgress >= missionTarget
  const xpProgressPercent = (currentXP / maxXP) * 100

  const getStreakBadge = () => {
    if (currentStreak >= 14) return { text: "🏆 Streak Legend", color: "bg-yellow-100 text-yellow-800" }
    if (currentStreak >= 7) return { text: "⭐ Week Warrior", color: "bg-purple-100 text-purple-800" }
    return null
  }

  const streakBadge = getStreakBadge()

  const levelConfig = {
    1: {
      title: "Email Rookie",
      color: "from-gray-50 to-gray-100",
      badgeColor: "bg-gray-100 text-gray-800",
      reward: "Basic Summarization",
    },
    2: {
      title: "AI Explorer",
      color: "from-blue-50 to-cyan-100",
      badgeColor: "bg-blue-100 text-blue-800",
      reward: "Calendar Sync Access",
    },
    3: {
      title: "Productivity Pro",
      color: "from-green-50 to-emerald-100",
      badgeColor: "bg-green-100 text-green-800",
      reward: "Advanced Analytics",
    },
    4: {
      title: "Email Master",
      color: "from-purple-50 to-violet-100",
      badgeColor: "bg-purple-100 text-purple-800",
      reward: "Custom AI Rules",
    },
    5: {
      title: "Automation Wizard",
      color: "from-yellow-50 to-orange-100",
      badgeColor: "bg-yellow-100 text-yellow-800",
      reward: "Premium Features",
    },
  }

  const currentLevelConfig = levelConfig[userLevel as keyof typeof levelConfig] || levelConfig[2]
  const nextLevelConfig = levelConfig[(userLevel + 1) as keyof typeof levelConfig]

  const handleStartMission = () => {
    setIsStarted(true)
    // In a real implementation, this would navigate to inbox or start the mission flow
  }

  const handleTestProgress = () => {
    if (missionProgress < missionTarget) {
      setMissionProgress((prev) => prev + 1)
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">오늘의 퀘스트</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || "User"}!</p>
        </div>

        <Card className={`border-2 border-opacity-50 bg-gradient-to-r ${currentLevelConfig.color}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {userLevel >= 4 ? (
                    <Crown className="w-6 h-6 text-yellow-600" />
                  ) : userLevel >= 3 ? (
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  ) : (
                    <Star className="w-6 h-6 text-blue-600" />
                  )}
                  <div>
                    <CardTitle className="text-xl">
                      Lv. {userLevel} – {currentLevelConfig.title}
                    </CardTitle>
                    <CardDescription className="text-sm">Summarize more emails to level up</CardDescription>
                  </div>
                </div>
              </div>
              <Badge className={`${currentLevelConfig.badgeColor} border-0`}>Level {userLevel}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Experience Points</span>
                <span className="font-bold">
                  {currentXP} XP / {maxXP} XP
                </span>
              </div>
              <Progress value={xpProgressPercent} className="h-2" />
            </div>

            {nextLevelConfig && (
              <p className="text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Next reward: {nextLevelConfig.reward}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              📌 Today's Mission
              {isCompleted && <Badge className="bg-green-100 text-green-800 border-green-200">Completed!</Badge>}
            </CardTitle>
            <CardDescription className="text-blue-700">Summarize 3 emails to boost your productivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {isCompleted ? "Mission Complete! 🎉" : `Summarize ${missionTarget} emails`}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Progress</span>
                <span className="font-medium text-blue-900">
                  {missionProgress}/{missionTarget}
                </span>
              </div>
              <Progress value={progressPercent} className="h-3 bg-blue-100" />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-600 flex items-center gap-1">
                {isCompleted ? (
                  <>
                    <Trophy className="w-4 h-4" />
                    Badge unlocked: Summary Master!
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Complete the mission to unlock a new badge!
                  </>
                )}
              </p>

              {!isCompleted ? (
                <Button onClick={handleStartMission} className="bg-blue-600 hover:bg-blue-700" disabled={isStarted}>
                  {isStarted ? "Mission Active" : "Start Mission"}
                </Button>
              ) : (
                <Button variant="outline" className="border-green-200 text-green-700 bg-transparent">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </Button>
              )}
            </div>

            {!isCompleted && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestProgress}
                className="w-full mt-2 text-xs bg-transparent"
              >
                Test Progress (+1) - Demo Only
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-500" />
                <div>
                  <CardTitle className="flex items-center gap-2 text-orange-900">
                    🔥 {currentStreak}-day streak!
                    {streakBadge && (
                      <Badge className={`${streakBadge.color} border-0 text-xs`}>{streakBadge.text}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-orange-700">Keep the momentum going!</CardDescription>
                </div>
              </div>
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {streakData.map((day, index) => (
                <Tooltip key={day.date}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer transition-all
                        ${
                          day.completed
                            ? "bg-gradient-to-br from-orange-400 to-pink-400 text-white shadow-sm"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }
                        ${day.isToday ? "ring-2 ring-orange-300 ring-offset-2" : ""}
                      `}
                    >
                      {day.completed ? <CheckCircle2 className="w-4 h-4" /> : day.day}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">
                      {day.completed
                        ? `✅ Summary completed on ${new Date(day.date).toLocaleDateString()}`
                        : "Complete a summary every day to earn bonus XP"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-700 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Daily summaries unlock bonus XP
              </span>
              <span className="font-medium text-orange-900">
                {streakData.filter((d) => d.completed).length}/30 days active
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Gmail Connected</CardTitle>
              <CardDescription>Your Gmail account is successfully connected</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Email: {user?.email || "demo@example.com"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Extracted from your recent emails</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">No items yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Status</CardTitle>
              <CardDescription>AI analysis of your inbox</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">Ready to process</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}

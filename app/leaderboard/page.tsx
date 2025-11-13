"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Star, Users, Mail, Edit, Lock } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { ProtectedRoute } from "@/components/protected-route"

// DISABLED FOR PRODUCTION - Mock data for leaderboards
/*
const mockLeaderboardData = {
  thisWeek: [
    { rank: 1, nickname: "AI_Master_2024", xp: 2450, summaries: 47, streak: 12, badge: "👑", isCurrentUser: false },
    { rank: 2, nickname: "SummaryNinja", xp: 2380, summaries: 44, streak: 8, badge: "⭐", isCurrentUser: false },
    { rank: 3, nickname: "EmailWizard", xp: 2210, summaries: 41, streak: 15, badge: "🚀", isCurrentUser: false },
    { rank: 4, nickname: "You", xp: 1890, summaries: 35, streak: 5, badge: "💎", isCurrentUser: true },
    { rank: 5, nickname: "DataDigger", xp: 1750, summaries: 32, streak: 3, badge: "🔥", isCurrentUser: false },
    { rank: 6, nickname: "QuickReader", xp: 1680, summaries: 31, streak: 7, badge: "⚡", isCurrentUser: false },
    { rank: 7, nickname: "InfoHunter", xp: 1520, summaries: 28, streak: 4, badge: "🎯", isCurrentUser: false },
    { rank: 8, nickname: "TextAnalyst", xp: 1450, summaries: 26, streak: 6, badge: "📊", isCurrentUser: false },
  ],
  allTime: [
    { rank: 1, nickname: "LegendaryUser", xp: 15420, summaries: 312, streak: 45, badge: "👑", isCurrentUser: false },
    { rank: 2, nickname: "AI_Master_2024", xp: 14890, summaries: 298, streak: 12, badge: "⭐", isCurrentUser: false },
    { rank: 3, nickname: "SummaryKing", xp: 13750, summaries: 275, streak: 23, badge: "🚀", isCurrentUser: false },
    { rank: 12, nickname: "You", xp: 8940, summaries: 178, streak: 5, badge: "💎", isCurrentUser: true },
  ],
  friends: [
    { rank: 1, nickname: "BestFriend", xp: 2100, summaries: 38, streak: 9, badge: "⭐", isCurrentUser: false },
    { rank: 2, nickname: "You", xp: 1890, summaries: 35, streak: 5, badge: "💎", isCurrentUser: true },
    { rank: 3, nickname: "WorkBuddy", xp: 1650, summaries: 30, streak: 2, badge: "🔥", isCurrentUser: false },
    { rank: 4, nickname: "StudyPartner", xp: 1420, summaries: 25, streak: 8, badge: "📚", isCurrentUser: false },
  ],
}

const mockTeamData = [
  { rank: 1, name: "Team Alpha", totalXP: 45680, avgSummaries: 28.5, members: 12, badges: 156, logo: "🚀" },
  { rank: 2, name: "Data Warriors", totalXP: 42340, avgSummaries: 26.8, members: 15, badges: 142, logo: "⚔️" },
  { rank: 3, name: "AI Pioneers", totalXP: 38920, avgSummaries: 24.2, members: 18, badges: 128, logo: "🌟" },
  {
    rank: 4,
    name: "Your Team",
    totalXP: 35670,
    avgSummaries: 22.1,
    members: 14,
    badges: 115,
    logo: "💎",
    isCurrentTeam: true,
  },
]
*/

const getRankIcon = (rank: number) => {
  if (rank === 1) return "🥇"
  if (rank === 2) return "🥈"
  if (rank === 3) return "🥉"
  return `${rank}`
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("thisWeek")
  const [showAnonymous, setShowAnonymous] = useState(false)
  const [friendsOnly, setFriendsOnly] = useState(false)
  const [nickname, setNickname] = useState("You")
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  
  // Empty data for production - DISABLED FOR PRODUCTION
  const mockLeaderboardData = {
    thisWeek: [],
    allTime: [],
    friends: [],
  }
  
  const mockTeamData = []

  const currentUserStats = {
    xp: 1890,
    level: 2,
    nickname: nickname,
    globalRank: 4,
    globalPercentile: 85,
    friendsRank: 2,
    teamRank: 4,
  }

  return (
    <AppLayout>
      <ProtectedRoute>
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">🏆 AI Summary Leaderboard</h1>
            <p className="text-muted-foreground">Track your progress, compare with others, and climb the ranks</p>
          </div>

          {/* Main Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="thisWeek">This Week</TabsTrigger>
                  <TabsTrigger value="allTime">All Time</TabsTrigger>
                  <TabsTrigger value="friends">Friends</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="myRank">My Rank</TabsTrigger>
                </TabsList>

                {/* This Week Tab */}
                <TabsContent value="thisWeek" className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Showing top performers this week • {mockLeaderboardData.thisWeek.length} of 1,247 users
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>XP Earned</TableHead>
                        <TableHead>Summaries</TableHead>
                        <TableHead>Streak</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLeaderboardData.thisWeek.map((user) => (
                        <TableRow key={user.rank} className={user.isCurrentUser ? "bg-blue-50 border-blue-200" : ""}>
                          <TableCell className="font-medium">
                            <span className="text-lg">{getRankIcon(user.rank)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                              </Avatar>
                              <span className={user.isCurrentUser ? "font-semibold" : ""}>{user.nickname}</span>
                              <span className="text-lg">{user.badge}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{user.xp.toLocaleString()} XP</TableCell>
                          <TableCell>{user.summaries}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {user.streak >= 5 && <span>🔥</span>}
                              <span>{user.streak}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* All Time Tab */}
                <TabsContent value="allTime" className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    All-time leaderboard • Showing top 4 of 1,247 users
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Total XP</TableHead>
                        <TableHead>Summaries</TableHead>
                        <TableHead>Best Streak</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLeaderboardData.allTime.map((user) => (
                        <TableRow key={user.rank} className={user.isCurrentUser ? "bg-blue-50 border-blue-200" : ""}>
                          <TableCell className="font-medium">
                            <span className="text-lg">{getRankIcon(user.rank)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                              </Avatar>
                              <span className={user.isCurrentUser ? "font-semibold" : ""}>{user.nickname}</span>
                              <span className="text-lg">{user.badge}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{user.xp.toLocaleString()} XP</TableCell>
                          <TableCell>{user.summaries}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {user.streak >= 10 && <span>🔥</span>}
                              <span>{user.streak}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Friends Tab */}
                <TabsContent value="friends" className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Invite more friends to expand your leaderboard</h3>
                        <p className="text-sm text-muted-foreground">Compete with friends and earn bonus XP</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Mail className="h-4 w-4 mr-2" />📨 Invite Friends
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invite Friends</DialogTitle>
                            <DialogDescription>
                              Share this link with your friends to join your leaderboard
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              value="https://gmail-ai-agent.vercel.app/invite/abc123"
                              readOnly
                              className="bg-gray-50"
                            />
                            <Button className="w-full">Copy Invitation Link</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Friend</TableHead>
                        <TableHead>XP Earned</TableHead>
                        <TableHead>Summaries</TableHead>
                        <TableHead>Streak</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLeaderboardData.friends.map((user) => (
                        <TableRow key={user.rank} className={user.isCurrentUser ? "bg-blue-50 border-blue-200" : ""}>
                          <TableCell className="font-medium">
                            <span className="text-lg">{getRankIcon(user.rank)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                              </Avatar>
                              <span className={user.isCurrentUser ? "font-semibold" : ""}>{user.nickname}</span>
                              <span className="text-lg">{user.badge}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{user.xp.toLocaleString()} XP</TableCell>
                          <TableCell>{user.summaries}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {user.streak >= 5 && <span>🔥</span>}
                              <span>{user.streak}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="space-y-4">
                  <div className="text-sm text-muted-foreground">Team leaderboard • Showing top 4 teams</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Total XP</TableHead>
                        <TableHead>Avg Summaries</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Badges</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTeamData.map((team) => (
                        <TableRow key={team.rank} className={team.isCurrentTeam ? "bg-blue-50 border-blue-200" : ""}>
                          <TableCell className="font-medium">
                            <span className="text-lg">{getRankIcon(team.rank)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{team.logo}</span>
                              <span className={team.isCurrentTeam ? "font-semibold" : ""}>{team.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{team.totalXP.toLocaleString()} XP</TableCell>
                          <TableCell>{team.avgSummaries}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {team.members}
                            </div>
                          </TableCell>
                          <TableCell>{team.badges}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* My Rank Tab */}
                <TabsContent value="myRank" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Current Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-lg">{nickname[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{nickname}</span>
                              <Dialog open={isEditingNickname} onOpenChange={setIsEditingNickname}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Change Nickname</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Input
                                      value={nickname}
                                      onChange={(e) => setNickname(e.target.value)}
                                      placeholder="Enter new nickname"
                                    />
                                    <Button className="w-full" onClick={() => setIsEditingNickname(false)}>
                                      Save Changes
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <Badge variant="secondary">Lv. {currentUserStats.level} - AI Explorer</Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Current XP</span>
                            <span className="font-semibold">{currentUserStats.xp.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Global Rank</span>
                            <span className="font-semibold">#{currentUserStats.globalRank}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Percentile</span>
                            <span className="font-semibold">{currentUserStats.globalPercentile}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Medal className="h-5 w-5" />
                          Rank Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Friends Leaderboard</span>
                            <Badge variant="outline">#{currentUserStats.friendsRank}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Team Ranking</span>
                            <Badge variant="outline">#{currentUserStats.teamRank}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>This Week</span>
                            <Badge variant="outline">#{currentUserStats.globalRank}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>All Time</span>
                            <Badge variant="outline">#12</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Privacy & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy & Settings
              </CardTitle>
              <CardDescription>Control how your information appears on leaderboards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous">🔒 Show me as anonymous on public leaderboard</Label>
                  <p className="text-sm text-muted-foreground">
                    Your rank will still be tracked, but your nickname won't be visible to others
                  </p>
                </div>
                <Switch id="anonymous" checked={showAnonymous} onCheckedChange={setShowAnonymous} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="friends-only">👀 Allow only friends to see my rank</Label>
                  <p className="text-sm text-muted-foreground">
                    Restrict leaderboard visibility to your invited friends only
                  </p>
                </div>
                <Switch id="friends-only" checked={friendsOnly} onCheckedChange={setFriendsOnly} />
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    </AppLayout>
  )
}

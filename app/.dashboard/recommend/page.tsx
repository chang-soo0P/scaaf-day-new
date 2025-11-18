"use client"

import { useState } from "react"
import { useRecommendations } from "@/hooks/useProductionApi"
import { useAppStore } from "@/lib/store"
import { useUserStore } from "@/lib/user-store"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LockCard } from "@/components/lock-card"
import {
  RefreshCw,
  ExternalLink,
  Bookmark,
  EyeOff,
  ThumbsDown,
  Filter,
  X,
  CheckCircle2,
  Clock,
  MousePointer,
  Lightbulb,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const TOPICS = [
  "AI",
  "Product",
  "Business",
  "Dev",
  "Design",
  "Marketing",
  "Finance",
  "Health",
  "Tech",
  "Startup",
  "Leadership",
  "Data",
]

export default function RecommendPage() {
  const { data: recommendations, isLoading, error, refetch } = useRecommendations()
  const { settings, updateSettings } = useAppStore()
  const { plan } = useUserStore()

  const [includePaid, setIncludePaid] = useState(true)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [hiddenSources, setHiddenSources] = useState<string[]>([])
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")

  const handleSave = (id: string, title: string) => {
    setSavedItems((prev) => [...prev, id])
    toast.success(`Saved "${title}"`)
  }

  const handleHideSource = (source: string) => {
    setHiddenSources((prev) => [...prev, source])
    toast.success(`Hidden all content from ${source}`)
  }

  const handleLessLikeThis = (id: string, topics: string[]) => {
    const currentDislikes = settings?.dislikedTopics || []
    const newDislikes = [...currentDislikes, ...topics]
    updateSettings({ dislikedTopics: [...new Set(newDislikes)] })
    toast.success("We'll show you less content like this")
  }

  const filteredRecommendations =
    recommendations?.filter((rec) => {
      if (!includePaid && rec.isPaid) return false
      if (hiddenSources.includes(rec.source)) return false
      if (selectedTopics.length > 0 && !selectedTopics.some((topic) => (rec.topics || []).includes(topic))) return false
      return true
    }) || []

  const displayRecommendations = plan === "free" ? filteredRecommendations.slice(0, 3) : filteredRecommendations

  const lockedRecommendations = plan === "free" ? filteredRecommendations.slice(3, 6) : []

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-red-900 mb-2">Failed to load recommendations</h2>
              <p className="text-red-700 mb-4">There was an error loading your recommendations.</p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>
            <p className="text-gray-600">{filteredRecommendations.length} personalized suggestions</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View mode toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("cards")}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>

            {/* Include paid newsletters toggle */}
            <div className="flex items-center space-x-2">
              <Switch id="include-paid" checked={includePaid} onCheckedChange={setIncludePaid} />
              <Label htmlFor="include-paid" className="text-sm">
                Include paid
              </Label>
            </div>

            {/* Topic filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Topics
                  {selectedTopics.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedTopics.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {TOPICS.map((topic) => (
                  <DropdownMenuCheckboxItem
                    key={topic}
                    checked={selectedTopics.includes(topic)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTopics((prev) => [...prev, topic])
                      } else {
                        setSelectedTopics((prev) => prev.filter((t) => t !== topic))
                      }
                    }}
                  >
                    {topic}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Active filters */}
        {selectedTopics.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-600">Filtered by:</span>
            {selectedTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="flex items-center space-x-1">
                <span>{topic}</span>
                <button
                  onClick={() => setSelectedTopics((prev) => prev.filter((t) => t !== topic))}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {filteredRecommendations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No recommendations found</h2>
              <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new suggestions.</p>
              <Button
                onClick={() => {
                  setSelectedTopics([])
                  setIncludePaid(true)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "cards" ? "space-y-6" : "space-y-3"}>
            {/* Display allowed recommendations */}
            {displayRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="hover:shadow-lg transition-all duration-200 group">
                <CardContent className={viewMode === "cards" ? "p-6" : "p-4"}>
                  <div className="flex items-start space-x-4">
                    {/* Enhanced source favicon with gradient background */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <span className="text-lg font-bold text-gray-700">
                        {recommendation.source.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title and source */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {recommendation.title}
                          </h3>
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="outline" className="font-medium">
                              {recommendation.source}
                            </Badge>
                            {recommendation.isPaid && <Badge variant="secondary">Paid</Badge>}
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">
                                {Math.round(recommendation.relevanceScore * 100)}% match
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced snippet */}
                      <p className="text-gray-600 mb-4 leading-relaxed">{recommendation.description}</p>

                      {/* Enhanced "Why this" chips with better visual design */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-sm font-medium text-gray-700">Why this:</span>
                        {(recommendation.topics || []).slice(0, 2).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs bg-blue-50 border-blue-200">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-blue-500" />
                            {topic}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                          <Clock className="w-3 h-3 mr-1 text-green-500" />
                          Recent activity
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200">
                          <MousePointer className="w-3 h-3 mr-1 text-purple-500" />
                          Similar interests
                        </Badge>
                      </div>

                      {/* Enhanced actions with better spacing and visual hierarchy */}
                      <div className="flex items-center space-x-3">
                        <Button asChild size="sm" className="font-medium">
                          <a href={recommendation.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open
                          </a>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSave(recommendation.id, recommendation.title)}
                          disabled={savedItems.includes(recommendation.id)}
                          className="font-medium"
                        >
                          <Bookmark
                            className={`w-4 h-4 mr-2 ${savedItems.includes(recommendation.id) ? "fill-current" : ""}`}
                          />
                          {savedItems.includes(recommendation.id) ? "Saved" : "Save"}
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => handleHideSource(recommendation.source)}>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide source
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLessLikeThis(recommendation.id, recommendation.topics || [])}
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Less like this
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {plan === "free" && lockedRecommendations.length > 0 && (
              <>
                {lockedRecommendations.map((recommendation) => (
                  <div key={`locked-${recommendation.id}`} className="relative">
                    <Card className="opacity-50 pointer-events-none">
                      <CardContent className="p-6 blur-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-gray-700">
                              {recommendation.source.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{recommendation.title}</h3>
                            <p className="text-gray-600 mb-4">{recommendation.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LockCard
                        title="Unlock More Recommendations"
                        message="Upgrade to Pro to see unlimited personalized recommendations."
                        feature="unlimited-recommendations"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

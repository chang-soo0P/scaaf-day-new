"use client";

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GmailConnectButton } from "@/components/gmail-connect-button"
import { useAuthStore } from "@/lib/auth-store"
import {
  Mail,
  Shield,
  Eye,
  Edit,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Info,
  Brain,
  Briefcase,
  Code,
  Palette,
  TrendingUp,
  Megaphone,
  Heart,
  Gamepad2,
  BookOpen,
  Zap,
  AlertCircle,
} from "lucide-react"

const gmailScopes = [
  {
    scope: "gmail.metadata",
    icon: Eye,
    title: "Read Email Metadata",
    purposes: ["See sender, subject, and timestamps", "Identify newsletter sources", "Track email frequency patterns"],
  },
  {
    scope: "gmail.readonly",
    icon: Mail,
    title: "Read Email Content",
    purposes: [
      "Extract key information and summaries",
      "Find action items and deadlines",
      "Generate personalized digests",
    ],
  },
  {
    scope: "gmail.modify",
    icon: Edit,
    title: "Organize Emails",
    purposes: ["Apply labels for better organization", "Mark emails as read/unread", "Archive processed newsletters"],
  },
]

const interestTopics = [
  { id: "ai", label: "AI & Machine Learning", icon: Brain },
  { id: "product", label: "Product Management", icon: Zap },
  { id: "business", label: "Business & Strategy", icon: Briefcase },
  { id: "dev", label: "Development & Tech", icon: Code },
  { id: "design", label: "Design & UX", icon: Palette },
  { id: "marketing", label: "Marketing & Growth", icon: TrendingUp },
  { id: "startup", label: "Startups & VC", icon: Megaphone },
  { id: "health", label: "Health & Wellness", icon: Heart },
  { id: "gaming", label: "Gaming & Entertainment", icon: Gamepad2 },
  { id: "education", label: "Education & Learning", icon: BookOpen },
]

const weekdays = [
  { id: "monday", label: "Mon" },
  { id: "tuesday", label: "Tue" },
  { id: "wednesday", label: "Wed" },
  { id: "thursday", label: "Thu" },
  { id: "friday", label: "Fri" },
  { id: "saturday", label: "Sat" },
  { id: "sunday", label: "Sun" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [dataMinimization, setDataMinimization] = useState(true)
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["ai", "product", "business"])
  const [digestTime, setDigestTime] = useState("09:00")
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"])
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [mockAuthenticated, setMockAuthenticated] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, checkAuthStatus, mockLogin } = useAuthStore()

  const addDebugLog = (message: string) => {
    console.log("[v0] Onboarding:", message)
    setDebugInfo((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addDebugLog("Component mounted with mock data - showing onboarding flow")

    // Debug: Check if mockLogin function exists
    console.log("[v0] Debug: mockLogin function exists:", typeof mockLogin === "function")
    console.log("[v0] Debug: useAuthStore functions:", Object.keys(useAuthStore.getState()))
    console.log("[v0] Debug: Router object:", router)
    console.log("[v0] Debug: Search params:", searchParams.toString())

    setIsLoading(false)
  }, [])

  useEffect(() => {
    addDebugLog(`Step changed to: ${currentStep}, mock authenticated: ${mockAuthenticated}`)
  }, [currentStep, mockAuthenticated])

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  const handleDayToggle = (dayId: string) => {
    setSelectedDays((prev) => (prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]))
  }

  const handleFinish = () => {
    router.push("/dashboard/digest")
  }

  const handleMockLogin = async () => {
    try {
      addDebugLog("Mock login initiated...")

      // Debug: Added extensive debugging and error handling
      console.log("[v0] Debug: About to call mockLogin function")
      console.log("[v0] Debug: mockLogin type:", typeof mockLogin)
      console.log("[v0] Debug: useAuthStore state:", useAuthStore.getState())

      if (typeof mockLogin !== "function") {
        throw new Error(`mockLogin is not a function, it is: ${typeof mockLogin}`)
      }

      const mockUserData = {
        email: "demo@example.com",
        name: "Demo User",
        picture: "https://via.placeholder.com/40",
        expiresAt: Date.now() + 3600000, // 1 hour from now
      }

      console.log("[v0] Debug: Calling mockLogin with data:", mockUserData)

      mockLogin(mockUserData)

      await new Promise((resolve) => setTimeout(resolve, 50))

      const authState = useAuthStore.getState()
      console.log("[v0] Debug: Auth state after mockLogin:", authState)

      if (!authState.isAuthenticated) {
        throw new Error("Authentication state not updated after mockLogin")
      }

      addDebugLog("Mock login completed, redirecting to dashboard...")
      setMockAuthenticated(true)

      setTimeout(() => {
        console.log("[v0] Debug: Navigating to dashboard with auth state:", useAuthStore.getState())
        router.push("/dashboard")
      }, 200)
    } catch (error) {
      console.error("[v0] Error in handleMockLogin:", error)
      addDebugLog(`Mock login error: ${error instanceof Error ? error.message : String(error)}`)

      setMockAuthenticated(true)

      const mockUserData = {
        email: "demo@example.com",
        name: "Demo User",
        picture: "https://via.placeholder.com/40",
        expiresAt: Date.now() + 3600000,
      }

      try {
        mockLogin(mockUserData)
        addDebugLog("Fallback: Mock login applied successfully")

        setTimeout(() => {
          router.push("/dashboard")
        }, 300)
      } catch (fallbackError) {
        console.error("[v0] Fallback error:", fallbackError)
        addDebugLog("Fallback failed, manual navigation required")
      }
    }
  }

  const handleSkipToDashboard = () => {
    try {
      addDebugLog("Skipping to dashboard...")
      console.log("[v0] Debug: Navigating to dashboard")
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error in handleSkipToDashboard:", error)
      addDebugLog(`Skip to dashboard error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const canContinue = () => {
    if (currentStep === 0) return mockAuthenticated
    if (currentStep === 1) return selectedTopics.length > 0
    if (currentStep === 2) return selectedDays.length > 0
    return true
  }

  const steps = ["Connect Gmail", "Pick Interests", "Digest Schedule"]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Debug Info Panel */}
      <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs max-w-xs z-50">
        <div className="font-bold mb-1">Debug Info:</div>
        {debugInfo.map((info, index) => (
          <div key={index}>{info}</div>
        ))}
        <div className="mt-2">
          <div>Current Step: {currentStep}</div>
          <div>Mock Authenticated: {String(mockAuthenticated)}</div>
          <div>Selected Topics: {selectedTopics.length}</div>
          <div>Selected Days: {selectedDays.length}</div>
          <div>Loading: {String(isLoading)}</div>
          <div>Auth State: {JSON.stringify(useAuthStore.getState())}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Setup Your Action Inbox</h1>
            <p className="text-gray-600 mt-2">Get personalized email insights in 3 simple steps</p>

            <div className="mt-4 flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={handleMockLogin}>
                Demo Login
              </Button>
              <Button variant="outline" size="sm" onClick={handleSkipToDashboard}>
                Skip to Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Hard Refresh
              </Button>
            </div>
          </div>

          {mockAuthenticated && currentStep === 0 && (
            <Alert className="mb-6" variant="default">
              <Check className="h-4 w-4" />
              <AlertDescription>
                ✅ Mock Gmail connection established! You can now proceed with the setup.
              </AlertDescription>
            </Alert>
          )}

          {searchParams.get("error") && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Authentication failed. Please try connecting your Gmail account again.
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{steps[currentStep]}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "We need these permissions to analyze your newsletters"}
                {currentStep === 1 && "Help us personalize your newsletter recommendations"}
                {currentStep === 2 && "Choose when you'd like to receive your daily digest"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Connect Gmail */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  {/* Gmail Scopes */}
                  <div className="space-y-4">
                    {gmailScopes.map((scope, index) => {
                      const Icon = scope.icon
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{scope.title}</h3>
                              <ul className="mt-2 space-y-1">
                                {scope.purposes.map((purpose, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-center">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                                    {purpose}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Separator />

                  {/* Data Minimization Toggle */}
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <Label htmlFor="data-minimization" className="text-sm font-medium text-gray-900">
                          Data Minimization (Recommended)
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Process emails locally and save only summaries + action metadata
                        </p>
                      </div>
                    </div>
                    <Switch id="data-minimization" checked={dataMinimization} onCheckedChange={setDataMinimization} />
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Mock Gmail Connected</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">Using sample newsletter data for demonstration</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">For real Gmail connection:</p>
                      <GmailConnectButton />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pick Interests */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {interestTopics.map((topic) => {
                      const Icon = topic.icon
                      const isSelected = selectedTopics.includes(topic.id)
                      return (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicToggle(topic.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                            <span className={`text-sm font-medium ${isSelected ? "text-blue-900" : "text-gray-700"}`}>
                              {topic.label}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Selected {selectedTopics.length} topics • Choose at least 1
                  </p>
                </div>
              )}

              {/* Step 3: Digest Schedule */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Time Picker */}
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Delivery Time</Label>
                    <div className="mt-2 flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <input
                          type="time"
                          value={digestTime}
                          onChange={(e) => setDigestTime(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <span className="text-xs text-gray-500">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                    </div>
                  </div>

                  {/* Weekday Selector */}
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Delivery Days</Label>
                    <div className="mt-2 flex space-x-2">
                      {weekdays.map((day) => {
                        const isSelected = selectedDays.includes(day.id)
                        return (
                          <button
                            key={day.id}
                            onClick={() => handleDayToggle(day.id)}
                            className={`w-10 h-10 rounded-lg text-xs font-medium transition-all ${
                              isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {day.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Preview Card */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Preview: Your Daily Digest</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">AI Weekly Roundup</h5>
                          <p className="text-xs text-gray-600">3 action items • 2 events • 5 min read</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">Product Hunt Daily</h5>
                          <p className="text-xs text-gray-600">1 action item • 3 min read</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canContinue()}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={!canContinue()}>
                Finish Setup
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Privacy Protection</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Data Minimization</h4>
                  <p className="text-xs text-green-700 mt-1">
                    No raw email bodies stored by default. Only summaries and action metadata are saved.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900">What we process:</h4>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Email summaries (AI-generated)</li>
                  <li>• Action items and deadlines</li>
                  <li>• Sender and subject metadata</li>
                  <li>• Your interest preferences</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">What we don't store:</h4>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Full email content</li>
                  <li>• Personal conversations</li>
                  <li>• Sensitive attachments</li>
                  <li>• Email addresses of contacts</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Your control:</h4>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Enable local-only processing</li>
                  <li>• Delete data anytime</li>
                  <li>• Revoke permissions instantly</li>
                  <li>• Export your summaries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

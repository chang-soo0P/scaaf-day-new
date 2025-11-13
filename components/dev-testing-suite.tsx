"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TestTube, Play, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface TestScenario {
  id: string
  name: string
  description: string
  emailContent: string
  expectedActions: number
  expectedEvents: number
  category: "newsletter" | "promotion" | "transaction" | "notification"
}

const testScenarios: TestScenario[] = [
  {
    id: "tech-newsletter",
    name: "Tech Newsletter",
    description: "Newsletter with conference deadlines and events",
    category: "newsletter",
    expectedActions: 3,
    expectedEvents: 2,
    emailContent: `Subject: TechCrunch Weekly - AI Conference & Startup Funding

Hi there,

This week's highlights:

1. AI Conference 2024 - Register by January 20th
   Date: January 25th, 2024 at 3:00 PM PST
   Location: San Francisco Convention Center
   Link: https://aiconf2024.com/register

2. Startup Funding Round
   Deadline: January 30th for applications
   Apply at: https://startupfund.com/apply
   
3. New Product Launch Webinar
   RSVP required by January 22nd
   Join: https://webinar.techcrunch.com/product-launch
   
Best regards,
TechCrunch Team`,
  },
  {
    id: "ecommerce-promo",
    name: "E-commerce Promotion",
    description: "Sales email with limited time offers",
    category: "promotion",
    expectedActions: 2,
    expectedEvents: 0,
    emailContent: `Subject: 🔥 Flash Sale - 50% Off Everything - Ends Tonight!

Don't miss out on our biggest sale of the year!

⏰ Sale ends: Tonight at 11:59 PM PST
🎯 Use code: FLASH50
🚚 Free shipping on orders over $50

Shop now: https://store.example.com/flash-sale

Limited quantities available. Sale ends January 15th at midnight.

Happy shopping!
Store Team`,
  },
  {
    id: "meeting-invite",
    name: "Meeting Invitation",
    description: "Calendar invitation with RSVP requirement",
    category: "notification",
    expectedActions: 1,
    expectedEvents: 1,
    emailContent: `Subject: Invitation: Quarterly Review Meeting

You're invited to our Quarterly Review Meeting.

📅 Date: January 18th, 2024
🕐 Time: 2:00 PM - 3:30 PM PST
📍 Location: Conference Room A / Zoom
🔗 Join: https://zoom.us/j/123456789

Please RSVP by January 16th.

Agenda:
- Q4 Performance Review
- Q1 Planning
- Team Updates

See you there!
Management Team`,
  },
]

interface TestResult {
  scenario: string
  success: boolean
  actionsFound: number
  eventsFound: number
  processingTime: number
  errors: string[]
}

export function DevTestingSuite() {
  const [selectedScenario, setSelectedScenario] = useState<string>("")
  const [customContent, setCustomContent] = useState("")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)

  const runSingleTest = async (scenarioId: string) => {
    const scenario = testScenarios.find((s) => s.id === scenarioId)
    if (!scenario) return

    setCurrentTest(scenarioId)
    setIsRunning(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock test results
    const result: TestResult = {
      scenario: scenario.name,
      success: Math.random() > 0.2, // 80% success rate
      actionsFound: Math.floor(Math.random() * 4) + 1,
      eventsFound: Math.floor(Math.random() * 3),
      processingTime: Math.random() * 2 + 0.5,
      errors: Math.random() > 0.7 ? ["Warning: Low confidence on event extraction"] : [],
    }

    setTestResults((prev) => [...prev.filter((r) => r.scenario !== scenario.name), result])
    setCurrentTest(null)
    setIsRunning(false)
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    for (const scenario of testScenarios) {
      setCurrentTest(scenario.id)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result: TestResult = {
        scenario: scenario.name,
        success: Math.random() > 0.15,
        actionsFound: Math.floor(Math.random() * 4) + 1,
        eventsFound: Math.floor(Math.random() * 3),
        processingTime: Math.random() * 2 + 0.5,
        errors: Math.random() > 0.8 ? ["Warning: Low confidence on action priority"] : [],
      }

      setTestResults((prev) => [...prev, result])
    }

    setCurrentTest(null)
    setIsRunning(false)
  }

  const testCustomContent = async () => {
    if (!customContent.trim()) return

    setIsRunning(true)
    setCurrentTest("custom")

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result: TestResult = {
      scenario: "Custom Content",
      success: true,
      actionsFound: Math.floor(Math.random() * 3) + 1,
      eventsFound: Math.floor(Math.random() * 2),
      processingTime: Math.random() * 2 + 0.8,
      errors: [],
    }

    setTestResults((prev) => [...prev.filter((r) => r.scenario !== "Custom Content"), result])
    setCurrentTest(null)
    setIsRunning(false)
  }

  const getResultIcon = (result: TestResult) => {
    if (result.success) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  const getResultColor = (result: TestResult) => {
    if (result.success) {
      return "bg-green-100 text-green-800"
    }
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="w-5 h-5" />
            <span>Testing Suite</span>
          </CardTitle>
          <CardDescription>Test email processing with predefined scenarios and custom content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scenarios" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
              <TabsTrigger value="custom">Custom Content</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Predefined Test Scenarios</h3>
                <Button onClick={runAllTests} disabled={isRunning}>
                  {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  Run All Tests
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testScenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all ${
                      currentTest === scenario.id ? "ring-2 ring-blue-500" : "hover:shadow-md"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{scenario.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {scenario.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>
                          Expected: {scenario.expectedActions} actions, {scenario.expectedEvents} events
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runSingleTest(scenario.id)}
                        disabled={isRunning}
                        className="w-full"
                      >
                        {currentTest === scenario.id ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        Test Scenario
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-content">Custom Email Content</Label>
                  <Textarea
                    id="custom-content"
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    placeholder="Paste your email content here to test processing..."
                    rows={12}
                    className="font-mono text-sm mt-2"
                  />
                </div>
                <Button onClick={testCustomContent} disabled={isRunning || !customContent.trim()}>
                  {currentTest === "custom" ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Test Custom Content
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {testResults.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No test results yet</p>
                  <p className="text-sm">Run some tests to see results here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Test Results</h3>
                    <Badge variant="outline">
                      {testResults.filter((r) => r.success).length} / {testResults.length} passed
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getResultIcon(result)}
                              <span className="font-medium">{result.scenario}</span>
                            </div>
                            <Badge variant="outline" className={getResultColor(result)}>
                              {result.success ? "Passed" : "Failed"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Actions Found</p>
                              <p className="font-medium">{result.actionsFound}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Events Found</p>
                              <p className="font-medium">{result.eventsFound}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Processing Time</p>
                              <p className="font-medium">{result.processingTime.toFixed(2)}s</p>
                            </div>
                          </div>

                          {result.errors.length > 0 && (
                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">Warnings</span>
                              </div>
                              <ul className="text-sm text-yellow-700 mt-1">
                                {result.errors.map((error, i) => (
                                  <li key={i}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

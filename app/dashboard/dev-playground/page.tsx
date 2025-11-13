"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { DevTestingSuite } from "@/components/dev-testing-suite"
import { Code, Play, Calendar, FileText, Zap, Clock, MapPin, LinkIcon, AlertCircle, Mail } from "lucide-react"
import type { ActionItem, ExtractedEvent } from "@/lib/types"

export default function DevPlaygroundPage() {
  const [emailContent, setEmailContent] = useState("")
  const [summary, setSummary] = useState("")
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [calendarEvents, setCalendarEvents] = useState<ExtractedEvent[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const [rawEmailContent, setRawEmailContent] = useState("")
  const [decodedContent, setDecodedContent] = useState("")
  const [isDecoding, setIsDecoding] = useState(false)
  const [decodedSummary, setDecodedSummary] = useState("")
  const [decodedActions, setDecodedActions] = useState<ActionItem[]>([])

  const mockEmailContent = `Subject: TechCrunch Weekly - AI Conference & Startup Funding

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
TechCrunch Team`

  const mockBase64Email = `U3ViamVjdDogTWVldGluZyBSZW1pbmRlciAtIFF1YXJ0ZXJseSBSZXZpZXcKRnJvbTogam9obi5kb2VAY29tcGFueS5jb20KRGF0ZTogTW9uLCAxNSBKYW4gMjAyNCA5OjAwOjAwICswMDAwCgpIaSBUZWFtLAoKVGhpcyBpcyBhIHJlbWluZGVyIGZvciBvdXIgcXVhcnRlcmx5IHJldmlldyBtZWV0aW5nOgoKRGF0ZTogSmFudWFyeSAyMHRoLCAyMDI0ClRpbWU6IDI6MDAgUE0gLSAzOjMwIFBNIFBTVApMb2NhdGlvbjogQ29uZmVyZW5jZSBSb29tIEEKCkFnZW5kYToKMS4gUTQgUGVyZm9ybWFuY2UgUmV2aWV3CjIuIFExIFBsYW5uaW5nCjMuIFRlYW0gVXBkYXRlcwo0LiBCdWRnZXQgRGlzY3Vzc2lvbgoKUGxlYXNlIFJTVlAgYnkgSmFudWFyeSAxOHRoLgoKQmVzdCByZWdhcmRzLApKb2huIERvZQ==`

  const handleDecodeEmail = () => {
    setIsDecoding(true)
    setTimeout(() => {
      try {
        const decoded = atob(rawEmailContent || mockBase64Email)
        setDecodedContent(decoded)
        setIsDecoding(false)
      } catch (error) {
        setDecodedContent("Error: Invalid base64 content. Please check your input.")
        setIsDecoding(false)
      }
    }, 800)
  }

  const handleSummarizeDecoded = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setDecodedSummary(
        "Quarterly review meeting scheduled for January 20th, 2024 at 2:00 PM in Conference Room A. RSVP required by January 18th. Agenda includes Q4 performance review, Q1 planning, team updates, and budget discussion.",
      )
      setIsProcessing(false)
    }, 1000)
  }

  const handleExtractDecodedActions = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setDecodedActions([
        {
          id: "1",
          type: "rsvp",
          text: "RSVP for Quarterly Review Meeting",
          datetime: "2024-01-18T23:59:00Z",
          priority: "high",
          url: "",
        },
        {
          id: "2",
          type: "event",
          text: "Attend Quarterly Review Meeting",
          datetime: "2024-01-20T14:00:00Z",
          priority: "high",
          url: "",
        },
      ])
      setIsProcessing(false)
    }, 1000)
  }

  const handleSummarize = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setSummary(
        "TechCrunch Weekly highlights AI Conference 2024 registration deadline (Jan 20th), startup funding applications due Jan 30th, and product launch webinar RSVP by Jan 22nd.",
      )
      setIsProcessing(false)
    }, 1000)
  }

  const handleExtractActions = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setActionItems([
        {
          id: "1",
          type: "deadline",
          text: "Register for AI Conference 2024",
          datetime: "2024-01-20T23:59:00Z",
          priority: "high",
          url: "https://aiconf2024.com/register",
        },
        {
          id: "2",
          type: "deadline",
          text: "Submit startup funding application",
          datetime: "2024-01-30T23:59:00Z",
          priority: "medium",
          url: "https://startupfund.com/apply",
        },
        {
          id: "3",
          type: "rsvp",
          text: "RSVP for Product Launch Webinar",
          datetime: "2024-01-22T23:59:00Z",
          priority: "medium",
          url: "https://webinar.techcrunch.com/product-launch",
        },
      ])
      setIsProcessing(false)
    }, 1000)
  }

  const handleSuggestCalendarEvent = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setCalendarEvents([
        {
          id: "1",
          title: "AI Conference 2024",
          startTime: "2024-01-25T15:00:00-08:00",
          endTime: "2024-01-25T18:00:00-08:00",
          location: "San Francisco Convention Center",
          description: "Annual AI Conference featuring latest developments in artificial intelligence",
          url: "https://aiconf2024.com",
          source: "TechCrunch Newsletter",
          confidence: 0.95,
        },
        {
          id: "2",
          title: "Product Launch Webinar",
          startTime: "2024-01-22T14:00:00-08:00",
          endTime: "2024-01-22T15:00:00-08:00",
          location: "Online",
          description: "TechCrunch Product Launch Webinar",
          url: "https://webinar.techcrunch.com/product-launch",
          source: "TechCrunch Newsletter",
          confidence: 0.88,
        },
      ])
      setIsProcessing(false)
    }, 1000)
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <AlertCircle className="w-4 h-4" />
      case "rsvp":
        return <Calendar className="w-4 h-4" />
      case "location":
        return <MapPin className="w-4 h-4" />
      case "link":
        return <LinkIcon className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case "deadline":
        return "text-red-600 bg-red-50"
      case "rsvp":
        return "text-blue-600 bg-blue-50"
      case "location":
        return "text-green-600 bg-green-50"
      case "link":
        return "text-purple-600 bg-purple-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Developer Playground</h1>
          <p className="text-gray-600">Test newsletter processing features with mock data and automated testing</p>
        </div>

        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Manual Testing</TabsTrigger>
            <TabsTrigger value="gmail-parsing">Gmail Parsing</TabsTrigger>
            <TabsTrigger value="automated">Automated Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Input Panel */}
              <div className="xl:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Newsletter Input</span>
                    </CardTitle>
                    <CardDescription>Paste newsletter content to test processing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-content">Newsletter Content</Label>
                      <Textarea
                        id="email-content"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        placeholder="Paste newsletter content here..."
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>

                    <Button variant="outline" onClick={() => setEmailContent(mockEmailContent)} className="w-full">
                      Load Sample Newsletter
                    </Button>

                    <Separator />

                    <div className="space-y-2">
                      <Button onClick={handleSummarize} disabled={isProcessing || !emailContent} className="w-full">
                        {isProcessing ? (
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2" />
                        )}
                        Summarize (3 lines)
                      </Button>

                      <Button
                        onClick={handleExtractActions}
                        disabled={isProcessing || !emailContent}
                        className="w-full bg-transparent"
                        variant="outline"
                      >
                        {isProcessing ? (
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        Extract Actions
                      </Button>

                      <Button
                        onClick={handleSuggestCalendarEvent}
                        disabled={isProcessing || !emailContent}
                        className="w-full bg-transparent"
                        variant="outline"
                      >
                        {isProcessing ? (
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Calendar className="w-4 h-4 mr-2" />
                        )}
                        Suggest Calendar Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Output Panels */}
              <div className="xl:col-span-2 space-y-6">
                {/* JSON Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="w-5 h-5" />
                      <span>JSON Preview</span>
                    </CardTitle>
                    <CardDescription>Raw extracted data in JSON format</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="mt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {summary ? JSON.stringify({ summary }, null, 2) : "No summary generated yet"}
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="actions" className="mt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-64">
                            {actionItems.length > 0 ? JSON.stringify(actionItems, null, 2) : "No actions extracted yet"}
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="events" className="mt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-64">
                            {calendarEvents.length > 0
                              ? JSON.stringify(calendarEvents, null, 2)
                              : "No events suggested yet"}
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* UI Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>UI Preview</span>
                    </CardTitle>
                    <CardDescription>How the extracted data appears in the actual interface</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Summary Preview */}
                      {summary && (
                        <div>
                          <h4 className="font-medium mb-3 text-gray-900">Summary</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-900">{summary}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Items Timeline */}
                      {actionItems.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 text-gray-900">Action Items Timeline</h4>
                          <div className="space-y-3">
                            {actionItems.map((action) => (
                              <div key={action.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <div className={`p-2 rounded-full ${getActionColor(action.type)}`}>
                                  {getActionIcon(action.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-900">{action.text}</p>
                                    <Badge variant={action.priority === "high" ? "destructive" : "secondary"}>
                                      {action.priority}
                                    </Badge>
                                  </div>
                                  {action.datetime && (
                                    <p className="text-xs text-gray-600">
                                      {new Date(action.datetime).toLocaleString()}
                                    </p>
                                  )}
                                  {action.url && (
                                    <div className="flex space-x-2 mt-2">
                                      <Button size="sm" variant="outline">
                                        Open
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        Copy
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        Save
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Calendar Events */}
                      {calendarEvents.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 text-gray-900">Calendar Suggestions</h4>
                          <div className="space-y-3">
                            {calendarEvents.map((event) => (
                              <div key={event.id} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900">{event.title}</h5>
                                  <Button size="sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Add to Calendar
                                  </Button>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {new Date(event.startTime).toLocaleString()}
                                  </p>
                                  <p className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {event.location}
                                  </p>
                                  {event.description && <p className="mt-2">{event.description}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty State */}
                      {!summary && actionItems.length === 0 && calendarEvents.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">No data processed yet</p>
                          <p className="text-sm">Use the buttons above to process newsletter content</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gmail-parsing">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Input Panel */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>Gmail Message Parser</span>
                    </CardTitle>
                    <CardDescription>Paste base64-encoded raw email content to decode and analyze</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="raw-email">Base64 Encoded Email Content</Label>
                      <Textarea
                        id="raw-email"
                        value={rawEmailContent}
                        onChange={(e) => setRawEmailContent(e.target.value)}
                        placeholder="Paste base64-encoded Gmail message content here..."
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>

                    <Button variant="outline" onClick={() => setRawEmailContent(mockBase64Email)} className="w-full">
                      Load Sample Base64 Email
                    </Button>

                    <Separator />

                    <Button onClick={handleDecodeEmail} disabled={isDecoding} className="w-full">
                      {isDecoding ? <Zap className="w-4 h-4 mr-2 animate-spin" /> : <Code className="w-4 h-4 mr-2" />}
                      Decode & Show Content
                    </Button>

                    {decodedContent && (
                      <div className="space-y-2">
                        <Button
                          onClick={handleSummarizeDecoded}
                          disabled={isProcessing}
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          {isProcessing ? (
                            <Zap className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4 mr-2" />
                          )}
                          Summarize
                        </Button>

                        <Button
                          onClick={handleExtractDecodedActions}
                          disabled={isProcessing}
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          {isProcessing ? (
                            <Zap className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          Extract Actions
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Output Panel */}
              <div className="space-y-6">
                {/* Decoded Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Decoded Content</span>
                    </CardTitle>
                    <CardDescription>Plain text or HTML content from the decoded email</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {decodedContent ||
                          "No content decoded yet. Paste base64 content and click 'Decode & Show Content'."}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Results */}
                {(decodedSummary || decodedActions.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Play className="w-5 h-5" />
                        <span>Analysis Results</span>
                      </CardTitle>
                      <CardDescription>AI-generated summary and extracted actions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary */}
                      {decodedSummary && (
                        <div>
                          <h4 className="font-medium mb-3 text-gray-900">Summary</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-900">{decodedSummary}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Items */}
                      {decodedActions.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 text-gray-900">Extracted Actions</h4>
                          <div className="space-y-3">
                            {decodedActions.map((action) => (
                              <div key={action.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <div className={`p-2 rounded-full ${getActionColor(action.type)}`}>
                                  {getActionIcon(action.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-900">{action.text}</p>
                                    <Badge variant={action.priority === "high" ? "destructive" : "secondary"}>
                                      {action.priority}
                                    </Badge>
                                  </div>
                                  {action.datetime && (
                                    <p className="text-xs text-gray-600">
                                      {new Date(action.datetime).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automated">
            <DevTestingSuite />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

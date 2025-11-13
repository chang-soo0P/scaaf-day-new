"use client"

import { useGmailMessageList } from "@/hooks/useGmailMessageList"
import { useSummarizeEmail } from "@/hooks/useSummarizeEmail"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Sparkles, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function InboxPage() {
  const { data: messages, isLoading, error } = useGmailMessageList()
  const { mutateAsync: summarizeEmail, isPending } = useSummarizeEmail()
  const [summaries, setSummaries] = useState<Record<string, string>>({})

  const handleSummarize = async (id: string, subject: string, emailContent: string) => {
    try {
      const result = await summarizeEmail({ subject, emailContent })
      setSummaries((prev) => ({ ...prev, [id]: result.summary }))
    } catch (e) {
      setSummaries((prev) => ({ ...prev, [id]: "❌ Failed to summarize" }))
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 flex items-center space-x-2">
        <AlertCircle className="w-5 h-5" />
        <span>Failed to load Gmail messages</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">📬 Gmail Inbox</h1>
      {messages?.map((msg) => (
        <Card key={msg.id}>
          <CardHeader className="text-sm text-gray-500">
            <div>🧵 Thread ID: {msg.threadId}</div>
            <div className="font-semibold">📩 Subject: {msg.subject || "(No Subject)"}</div>
            <div>✉️ From: {msg.from}</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700 text-sm">{msg.snippet}</p>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSummarize(msg.id, msg.subject, msg.body)}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Summarize
                </>
              )}
            </Button>

            {summaries[msg.id] && (
              <div className="mt-2 p-3 rounded bg-blue-50 border border-blue-200 text-sm text-blue-900 whitespace-pre-line">
                {summaries[msg.id]}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

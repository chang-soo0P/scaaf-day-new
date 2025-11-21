"use client"

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useGmailMessages } from "@/hooks/useGmailMessages"

export default function InboxPage() {
  const router = useRouter()
  const { messages, isLoading, error } = useGmailMessages()

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">📥 Inbox</h1>
        <Card className="p-6">
          <p className="text-red-600">Error loading messages: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📥 Inbox</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Display real Gmail messages */
        Array.isArray(messages) && messages.map((message) => (
          <Card
            key={message.id}
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => router.push(`/dashboard/inbox/${message.id}`)}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold truncate">
                    {message.subject || "No Subject"}
                  </h2>
                  <p className="text-sm text-gray-600 truncate">
                    From: {message.from || message.sender || "Unknown Sender"}
                  </p>
                  {message.snippet && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {message.snippet}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge variant="outline">Gmail</Badge>
                  {message.date && (
                    <span className="text-xs text-gray-500">
                      {new Date(message.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {message.isUnread ? "Unread" : "Read"}
                </Badge>
                {message.isUnread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {!isLoading && (!messages || !Array.isArray(messages) || messages.length === 0) && (
        <Card className="p-6 text-center">
          <p className="text-gray-600">No messages found in your inbox.</p>
          <p className="text-sm text-gray-500 mt-2">
            Make sure your Gmail account is properly connected and has recent emails.
          </p>
        </Card>
      )}
    </div>
  )
}

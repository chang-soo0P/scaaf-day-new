"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Search, MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"

export function NoActionsState() {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Thank you for your feedback! We'll use it to improve our extraction.")
    setFeedback("")
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No actions found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't extract any deadlines, events, or actionable items from this email. This might be a newsletter
          focused on general information.
        </p>

        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-2 mb-3">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Help us improve</span>
          </div>
          <Textarea
            placeholder="Did we miss something? Let us know what actions you expected to see..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mb-3"
            rows={3}
          />
          <Button onClick={handleSendFeedback} disabled={!feedback.trim() || isSubmitting} size="sm">
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

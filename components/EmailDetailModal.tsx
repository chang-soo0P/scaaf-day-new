import { useState } from "react"
import { X, ThumbsUp, ThumbsDown, Mail } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

interface GmailMessage {
  id: string
  subject: string
  from: string
  date: string
  snippet: string
  body?: string
  isUnread?: boolean
}

interface EmailDetailModalProps {
  email: GmailMessage
  onClose: () => void
}

export function EmailDetailModal({ email, onClose }: EmailDetailModalProps) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitFeedback = () => {
    console.log("Feedback submitted:", { feedback, comment })
    setSubmitted(true)
    setTimeout(() => onClose(), 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">{email.from}</h3>
                  <p className="text-indigo-100 text-sm">{new Date(email.date).toLocaleString()}</p>
                </div>
              </div>
              <div>
                {email.isUnread && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Unread</span>
                )}
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Subject */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{email.subject || "(No Subject)"}</h4>
          </div>

          {/* Snippet */}
          {email.snippet && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-700 text-sm">{email.snippet}</p>
            </div>
          )}

          {/* Body */}
          <div className="space-y-3">
            <h4 className="text-gray-900 font-medium">Email Content</h4>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
              <p className="text-gray-700 whitespace-pre-wrap text-sm">
                {email.body || "(No content available)"}
              </p>
            </div>
          </div>

          {/* Feedback Section */}
          {!submitted ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
              <h4 className="text-gray-900">Was this helpful?</h4>

              {/* Positive / Negative Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setFeedback("positive")}
                  variant={feedback === "positive" ? "default" : "outline"}
                  className={feedback === "positive" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" /> Helpful
                </Button>

                <Button
                  onClick={() => setFeedback("negative")}
                  variant={feedback === "negative" ? "default" : "outline"}
                  className={feedback === "negative" ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" /> Not Helpful
                </Button>
              </div>

              {/* Comment Box */}
              {feedback && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Textarea
                    placeholder="Leave optional feedback to help us improve"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <Button onClick={handleSubmitFeedback} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Submit Feedback
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center space-y-2">
              <p className="text-green-700">✓ Feedback submitted</p>
              <p className="text-sm text-green-600">Thank you for your feedback!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

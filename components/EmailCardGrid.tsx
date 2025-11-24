import { Mail, ChevronRight } from "lucide-react"

interface GmailMessage {
  id: string
  subject: string
  from: string
  date: string
  snippet: string
  body?: string
  isUnread?: boolean
}

interface EmailCardGridProps {
  emails: GmailMessage[]
  onEmailClick: (email: GmailMessage) => void
}

export function EmailCardGrid({ emails, onEmailClick }: EmailCardGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900">📬 Gmail Inbox</h3>
        <span className="text-sm text-gray-600">{emails.length} emails</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => onEmailClick(email)}
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-left border-2 border-transparent hover:border-indigo-200"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <Mail className="w-4 h-4 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">
                        {email.from}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(email.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {email.isUnread && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                      Unread
                    </span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <p className="text-sm text-gray-900 line-clamp-1 font-semibold">
                {email.subject || "(No subject)"}
              </p>

              {/* Snippet */}
              {email.snippet && (
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-3">
                  <p className="text-sm text-gray-700 line-clamp-2">{email.snippet}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">View Details</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

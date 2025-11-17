import { Mail, ChevronRight } from 'lucide-react';

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  count: number;
  latestSubject: string;
  summary: string;
  timestamp: string;
  category: string;
  emails: Array<{ subject: string; preview: string }>;
}

interface EmailCardGridProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  work: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  newsletter: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  entertainment: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
  social: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
};

export function EmailCardGrid({ emails, onEmailClick }: EmailCardGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900">발신자별 정리</h3>
        <span className="text-sm text-gray-600">{emails.length}개 그룹</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emails.map((email) => {
          const colors = categoryColors[email.category] || categoryColors.work;
          
          return (
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
                      <div className={`${colors.bg} ${colors.border} border rounded-lg p-2`}>
                        <Mail className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">{email.sender}</p>
                        <p className="text-xs text-gray-500 truncate">{email.senderEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                      {email.count}개
                    </span>
                    <span className="text-xs text-gray-500">{email.timestamp}</span>
                  </div>
                </div>

                {/* Latest Subject */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-900 line-clamp-1">{email.latestSubject}</p>
                </div>

                {/* AI Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-3">
                  <p className="text-sm text-gray-700 line-clamp-3">{email.summary}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">AI 요약</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Mail, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

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

interface EmailDetailModalProps {
  email: Email;
  onClose: () => void;
}

export function EmailDetailModal({ email, onClose }: EmailDetailModalProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = () => {
    // Mock submission
    console.log('Feedback:', { feedback, comment });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white">{email.sender}</h3>
                  <p className="text-sm text-indigo-100">{email.senderEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                  {email.count} emails
                </span>
                <span className="text-sm text-indigo-100">{email.timestamp}</span>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-purple-600">✨</span>
              <h4 className="text-gray-900">AI Summary</h4>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
              <p className="text-gray-700">{email.summary}</p>
            </div>
          </div>

          {/* Individual Emails */}
          <div className="space-y-3">
            <h4 className="text-gray-900">Included Emails ({email.count})</h4>
            <div className="space-y-2">
              {email.emails.map((item, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-gray-900">{item.subject}</p>
                      <p className="text-sm text-gray-600">{item.preview}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          {!submitted ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
              <h4 className="text-gray-900">Was this summary helpful?</h4>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setFeedback('positive')}
                  variant={feedback === 'positive' ? 'default' : 'outline'}
                  className={feedback === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful
                </Button>
                <Button
                  onClick={() => setFeedback('negative')}
                  variant={feedback === 'negative' ? 'default' : 'outline'}
                  className={feedback === 'negative' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Not Helpful
                </Button>
              </div>

              {feedback && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Textarea
                    placeholder="Please leave your feedback for better service (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleSubmitFeedback}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Submit Feedback
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center space-y-2">
              <p className="text-green-700">✓ Feedback has been submitted</p>
              <p className="text-sm text-green-600">Thank you for your valuable feedback!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

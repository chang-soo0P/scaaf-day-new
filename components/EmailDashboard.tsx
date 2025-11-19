import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TodaySummaryHeader } from './TodaySummaryHeader';
import { EmotionComment } from './EmotionComment';
import { EmailCardGrid } from './EmailCardGrid';
import { EmailDetailModal } from './EmailDetailModal';
import { EmotionCalendarModal } from './EmotionCalendarModal';
import { RoutineStatsCard } from './RoutineStatsCard';
import { FriendShareCard } from './FriendShareCard';
import { FriendShareModal } from './FriendShareModal';
import { Settings, LogOut, Sparkles, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useAuthStore } from '@/lib/auth-store';

// Mock data
const mockEmails = [
  {
    id: '1',
    sender: 'Netflix',
    senderEmail: 'info@netflix.com',
    count: 3,
    latestSubject: 'New Series Arrived',
    summary: 'This week\'s recommended content: Thriller drama "The Glory" Season 2 has been released. Also, new episodes of the documentary "Our Planet" are now available.',
    timestamp: '2 hours ago',
    category: 'entertainment',
    emails: [
      { subject: 'New Series Arrived', preview: 'This week\'s recommendations...' },
      { subject: 'Recommendations Based on Watch History', preview: 'You might like...' },
      { subject: 'Profile Activity Summary', preview: 'Last week\'s viewing...' }
    ]
  },
  {
    id: '2',
    sender: 'LinkedIn',
    senderEmail: 'notifications@linkedin.com',
    count: 5,
    latestSubject: 'Network Updates',
    summary: 'John Smith has been appointed to a new position. 15 comments were added to Jane Doe\'s post. 3 new product designer job postings have been added.',
    timestamp: '3 hours ago',
    category: 'work',
    emails: [
      { subject: 'Network Updates', preview: 'John Smith...' },
      { subject: 'Job Posting Alerts', preview: 'You might be interested...' },
      { subject: 'Post Insights', preview: 'Jane Doe\'s...' },
      { subject: 'Profile Views', preview: 'This week...' },
      { subject: 'Recommended Connections', preview: 'People you may know...' }
    ]
  },
  {
    id: '3',
    sender: 'Substack',
    senderEmail: 'noreply@substack.com',
    count: 2,
    latestSubject: 'Weekly Newsletter: The Future of AI',
    summary: 'An in-depth article analyzing the impact of generative AI on the creative industry. Covers new features of GPT-4 and ethical considerations.',
    timestamp: '5 hours ago',
    category: 'newsletter',
    emails: [
      { subject: 'Weekly Newsletter: The Future of AI', preview: 'Generative AI...' },
      { subject: 'Reader Q&A Collection', preview: 'Last week...' }
    ]
  },
  {
    id: '4',
    sender: 'Notion',
    senderEmail: 'team@notion.so',
    count: 1,
    latestSubject: 'Team Workspace Updates',
    summary: '3 new pages have been added to the "Project A" workspace. There are 2 @mention notifications.',
    timestamp: 'Yesterday',
    category: 'work',
    emails: [
      { subject: 'Team Workspace Updates', preview: 'New pages...' }
    ]
  },
  {
    id: '5',
    sender: 'GitHub',
    senderEmail: 'notifications@github.com',
    count: 7,
    latestSubject: '[username/repo] New PR #142',
    summary: '3 new Pull Requests are pending. A new comment was added to issue #89, and 4 commits were pushed to the main branch.',
    timestamp: 'Yesterday',
    category: 'work',
    emails: [
      { subject: '[username/repo] New PR #142', preview: 'Feature: Add...' },
      { subject: '[username/repo] Issue comment', preview: '@you mentioned...' },
      { subject: '[username/repo] Push to main', preview: '4 commits...' }
    ]
  },
  {
    id: '6',
    sender: 'Medium',
    senderEmail: 'noreply@medium.com',
    count: 4,
    latestSubject: 'Daily Digest',
    summary: 'A collection of popular articles about UX design, startup growth strategies, and remote work culture. Includes new posts from recommended authors.',
    timestamp: 'Yesterday',
    category: 'newsletter',
    emails: [
      { subject: 'Daily Digest', preview: 'Top stories...' },
      { subject: 'Recommended for you', preview: 'Based on...' }
    ]
  }
];

const highlights = [
  '3 PR review requests from GitHub',
  '5 LinkedIn network updates',
  '2 AI-related newsletters'
];

const emotionComment = {
  text: "It's been a calm day today",
  subtext: "There were many work-related emails, but overall positive news",
  emoji: "🌿"
};

export function EmailDashboard() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [selectedEmail, setSelectedEmail] = useState<typeof mockEmails[0] | null>(null);
  const [showEmotionCalendar, setShowEmotionCalendar] = useState(false);
  const [showFriendShare, setShowFriendShare] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [zenIndex, setZenIndex] = useState(0);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login page
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-2">
                <span className="text-white">📬</span>
              </div>
              <div>
                <h1 className="text-indigo-900">Scaaf.day</h1>
                <p className="text-sm text-gray-600">Today's Mail Summary</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowStats(!showStats)}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Emotion Comment - Full Width */}
        <EmotionComment 
          text={emotionComment.text}
          subtext={emotionComment.subtext}
          emoji={emotionComment.emoji}
          onClick={() => setShowEmotionCalendar(true)}
        />

        {/* Today's Summary + Friend Share Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodaySummaryHeader 
              totalEmails={22}
              highlights={highlights}
            />
          </div>
          <div className="lg:col-span-1">
            <FriendShareCard onOpenModal={() => setShowFriendShare(true)} />
          </div>
        </div>

        {/* Email Grid or Zen Mode + Routine Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Email Grid or Zen Mode */}
            {zenMode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">Inbox Zen Mode</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZenIndex(Math.max(0, zenIndex - 1))}
                      disabled={zenIndex === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      {zenIndex + 1} / {mockEmails.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZenIndex(Math.min(mockEmails.length - 1, zenIndex + 1))}
                      disabled={zenIndex === mockEmails.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <div className="max-w-2xl mx-auto">
                  <EmailCardGrid 
                    emails={[mockEmails[zenIndex]]}
                    onEmailClick={setSelectedEmail}
                  />
                </div>
              </div>
            ) : (
              <EmailCardGrid 
                emails={mockEmails}
                onEmailClick={setSelectedEmail}
              />
            )}

            {/* Stats Footer */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center">
              <p className="text-indigo-600">
                🎉 Organized 22 emails today!
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Keep up this pace and stay light
              </p>
            </div>
          </div>

   
        </div>
      </main>

      {/* Modals */}
      {selectedEmail && (
        <EmailDetailModal 
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}

      {showEmotionCalendar && (
        <EmotionCalendarModal 
          onClose={() => setShowEmotionCalendar(false)}
        />
      )}

      {showFriendShare && (
        <FriendShareModal 
          onClose={() => setShowFriendShare(false)}
        />
      )}
    </div>
  );
}

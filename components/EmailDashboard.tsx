import { useState } from 'react';
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

// Mock data
const mockEmails = [
  {
    id: '1',
    sender: 'Netflix',
    senderEmail: 'info@netflix.com',
    count: 3,
    latestSubject: '새로운 시리즈가 도착했어요',
    summary: '이번 주 추천 콘텐츠: 스릴러 드라마 "더 글로리" 시즌 2가 공개되었습니다. 또한 다큐멘터리 "우리의 지구" 새 에피소드도 시청 가능합니다.',
    timestamp: '2시간 전',
    category: 'entertainment',
    emails: [
      { subject: '새로운 시리즈가 도착했어요', preview: '이번 주 추천...' },
      { subject: '시청 기록 기반 추천', preview: '좋아하실 만한...' },
      { subject: '프로필 활동 요약', preview: '지난 주 시청...' }
    ]
  },
  {
    id: '2',
    sender: 'LinkedIn',
    senderEmail: 'notifications@linkedin.com',
    count: 5,
    latestSubject: '네트워크 업데이트',
    summary: '김철수님이 새로운 직책에 임명되었습니다. 박영희님의 게시물에 댓글 15개가 달렸습니다. 프로덕트 디자이너 채용 공고 3건이 새로 올라왔습니다.',
    timestamp: '3시간 전',
    category: 'work',
    emails: [
      { subject: '네트워크 업데이트', preview: '김철수님이...' },
      { subject: '채용 공고 알림', preview: '관심 있을 만한...' },
      { subject: '게시물 인사이트', preview: '박영희님의...' },
      { subject: '프로필 조회수', preview: '이번 주...' },
      { subject: '추천 연결', preview: '알 수도 있는...' }
    ]
  },
  {
    id: '3',
    sender: 'Substack',
    senderEmail: 'noreply@substack.com',
    count: 2,
    latestSubject: '주간 뉴스레터: AI의 미래',
    summary: '생성형 AI가 창작 산업에 미치는 영향을 분석한 심층 아티클입니다. GPT-4의 새로운 기능과 윤리적 고려사항에 대해 다룹니다.',
    timestamp: '5시간 전',
    category: 'newsletter',
    emails: [
      { subject: '주간 뉴스레터: AI의 미래', preview: '생성형 AI가...' },
      { subject: '독자 Q&A 모음', preview: '지난 주...' }
    ]
  },
  {
    id: '4',
    sender: 'Notion',
    senderEmail: 'team@notion.so',
    count: 1,
    latestSubject: '팀 워크스페이스 업데이트',
    summary: '새로운 페이지 3개가 "프로젝트 A" 워크스페이스에 추가되었습니다. @mention 알림 2건이 있습니다.',
    timestamp: '어제',
    category: 'work',
    emails: [
      { subject: '팀 워크스페이스 업데이트', preview: '새로운 페이지...' }
    ]
  },
  {
    id: '5',
    sender: 'GitHub',
    senderEmail: 'notifications@github.com',
    count: 7,
    latestSubject: '[username/repo] New PR #142',
    summary: '3개의 새로운 Pull Request가 대기 중입니다. 이슈 #89에 새로운 댓글이 달렸고, main 브랜치에 4개의 커밋이 푸시되었습니다.',
    timestamp: '어제',
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
    summary: 'UX 디자인, 스타트업 성장 전략, 그리고 리모트 워크 문화에 대한 인기 아티클 모음입니다. 추천 작가의 새 글도 포함되어 있습니다.',
    timestamp: '어제',
    category: 'newsletter',
    emails: [
      { subject: 'Daily Digest', preview: 'Top stories...' },
      { subject: 'Recommended for you', preview: 'Based on...' }
    ]
  }
];

const highlights = [
  'GitHub에서 3개의 PR 리뷰 요청',
  'LinkedIn 네트워크 업데이트 5건',
  'AI 관련 뉴스레터 2건'
];

const emotionComment = {
  text: "오늘은 차분한 하루네요",
  subtext: "업무 관련 메일이 많았지만, 전반적으로 긍정적인 소식들이에요",
  emoji: "🌿"
};

export function EmailDashboard() {
  const [selectedEmail, setSelectedEmail] = useState<typeof mockEmails[0] | null>(null);
  const [showEmotionCalendar, setShowEmotionCalendar] = useState(false);
  const [showFriendShare, setShowFriendShare] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [zenIndex, setZenIndex] = useState(0);

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
                <p className="text-sm text-gray-600">오늘의 메일 정리</p>
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
              <Button variant="ghost" size="sm">
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
                  <h3 className="text-gray-900">Inbox Zen 모드</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZenIndex(Math.max(0, zenIndex - 1))}
                      disabled={zenIndex === 0}
                    >
                      이전
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
                      다음
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
                🎉 오늘 22개의 메일을 정리했어요!
              </p>
              <p className="text-sm text-gray-600 mt-1">
                계속 이런 페이스로 가볍게 유지해봐요
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

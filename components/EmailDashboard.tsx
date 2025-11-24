"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TodaySummaryHeader } from "./TodaySummaryHeader";
import { EmotionComment } from "./EmotionComment";
import { EmailCardGrid } from "./EmailCardGrid";
import { EmailDetailModal } from "./EmailDetailModal";
import { EmotionCalendarModal } from "./EmotionCalendarModal";
import { RoutineStatsCard } from "./RoutineStatsCard";
import { FriendShareCard } from "./FriendShareCard";
import { FriendShareModal } from "./FriendShareModal";

import { Settings, LogOut, Sparkles, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

import { useAuthStore } from "@/lib/auth-store";
import { useGmailMessageList } from "@/hooks/useGmailMessageList";
import { useSummarizeEmail } from "@/hooks/useSummarizeEmail";

export function EmailDashboard() {
  const router = useRouter();
  const { logout } = useAuthStore();

  // Gmail API 데이터 가져오기
  const { data: messages, isLoading, error } = useGmailMessageList();
  const { mutateAsync: summarizeEmail } = useSummarizeEmail();

  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [showEmotionCalendar, setShowEmotionCalendar] = useState(false);
  const [showFriendShare, setShowFriendShare] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [zenIndex, setZenIndex] = useState(0);

  const [summaries, setSummaries] = useState<Record<string, string>>({});

  const handleSummarize = async (email: any) => {
    try {
      const res = await summarizeEmail({
        subject: email.subject,
        emailContent: email.body,
      });
      setSummaries((prev) => ({ ...prev, [email.id]: res.summary }));
    } catch (e) {
      setSummaries((prev) => ({ ...prev, [email.id]: "❌ Summary failed" }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      router.push("/login");
    }
  };

  // -------------------------
  // 🔥 Gmail 불러오기 실패/로딩 처리
  // -------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading Gmail...
      </div>
    );
  }

  if (error || !messages) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p>⚠️ Failed to load Gmail messages</p>
        <p className="text-sm text-gray-500 mt-1">Please reconnect Gmail.</p>
        <Button onClick={() => router.push("/")}>Reconnect</Button>
      </div>
    );
  }

  // Zen mode data source
  const zenSource = messages.length ? messages : [];

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Emotion */}
        <EmotionComment
          text="It's been a calm day today"
          subtext="Your inbox looks manageable today"
          emoji="🌿"
          onClick={() => setShowEmotionCalendar(true)}
        />

        {/* Today Summary + Friend Share */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodaySummaryHeader
              totalEmails={messages.length}
              highlights={["Auto AI summary", "Gmail connected"]}
            />
          </div>
          <div className="lg:col-span-1">
            <FriendShareCard onOpenModal={() => setShowFriendShare(true)} />
          </div>
        </div>

        {/* Email Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {zenMode ? (
              // ZEN MODE VIEW
              <div className="space-y-4">
                <h3 className="text-gray-900">Inbox Zen Mode</h3>

                <div className="max-w-2xl mx-auto">
                  <EmailCardGrid
                    emails={[zenSource[zenIndex]]}
                    onEmailClick={setSelectedEmail}
                    summaries={summaries}
                    onSummarize={handleSummarize}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZenIndex((i) => Math.max(0, i - 1))}
                    disabled={zenIndex === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    {zenIndex + 1} / {zenSource.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setZenIndex((i) => Math.min(zenSource.length - 1, i + 1))
                    }
                    disabled={zenIndex === zenSource.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              // NORMAL GRID VIEW
              <EmailCardGrid
                emails={messages}
                onEmailClick={setSelectedEmail}
                summaries={summaries}
                onSummarize={handleSummarize}
              />
            )}

            {/* Stats Footer */}
            <RoutineStatsCard totalEmails={messages.length} />
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedEmail && (
        <EmailDetailModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          summary={summaries[selectedEmail.id]}
        />
      )}

      {showEmotionCalendar && (
        <EmotionCalendarModal
          onClose={() => setShowEmotionCalendar(false)}
        />
      )}

      {showFriendShare && (
        <FriendShareModal onClose={() => setShowFriendShare(false)} />
      )}
    </div>
  );
}

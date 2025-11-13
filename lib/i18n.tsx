"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ko" | "en"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Language dictionaries
const dictionaries = {
  ko: {
    // Navigation
    "nav.digest": "다이제스트",
    "nav.inbox": "받은편지함",
    "nav.recommend": "추천",
    "nav.rules": "규칙",
    "nav.settings": "설정",
    "nav.privacy": "개인정보",

    // Common actions
    "action.save": "저장",
    "action.cancel": "취소",
    "action.confirm": "확인",
    "action.delete": "삭제",
    "action.edit": "편집",
    "action.open": "열기",
    "action.close": "닫기",
    "action.back": "뒤로",
    "action.continue": "계속",
    "action.finish": "완료",

    // Gmail connection
    "gmail.connect": "Gmail 연결",
    "gmail.connected": "Gmail 연결됨",
    "gmail.disconnect": "연결 해제",
    "gmail.permissions": "권한",

    // Data & Privacy
    "data.minimization": "데이터 최소화",
    "data.minimization.desc": "원본 이메일 본문을 메모리에서만 처리하고 요약만 저장합니다",
    "data.export": "데이터 내보내기",
    "data.delete": "모든 데이터 삭제",
    "privacy.first": "개인정보 보호 우선",

    // Calendar
    "calendar.add": "캘린더에 추가",
    "calendar.event": "이벤트",
    "calendar.title": "제목",
    "calendar.date": "날짜",
    "calendar.time": "시간",
    "calendar.location": "위치",
    "calendar.notes": "메모",

    // Search & Filter
    "search.placeholder": "뉴스레터, 액션 또는 내용 검색...",
    "filter.all": "전체",
    "filter.unread": "읽지 않음",
    "filter.starred": "별표",
    "filter.newsletters": "뉴스레터",
    "filter.promotions": "프로모션",
    "filter.transactions": "거래",
    "filter.saved": "저장됨",

    // Time & Date
    "time.today": "오늘",
    "time.yesterday": "어제",
    "time.thisWeek": "이번 주",
    "time.dateRange": "날짜 범위",
    "time.quietHours": "조용한 시간",

    // Actions & Items
    "actions.extracted": "추출된 액션",
    "actions.none": "추출된 액션이 없습니다",
    "actions.deadline": "마감일",
    "actions.rsvp": "참석 여부",
    "actions.location": "위치",
    "actions.link": "링크",

    // Profile & Account
    "profile.settings": "설정",
    "profile.signOut": "로그아웃",
    "profile.language": "언어",
    "account.connected": "연결된 계정",

    // Empty states
    "empty.inbox": "받은편지함이 비어있습니다",
    "empty.tryRecommend": "추천 확인하기",
    "empty.noActions": "추출된 액션이 없습니다",
    "empty.sendFeedback": "피드백 보내기",

    // Notifications
    "notifications.digest": "다이제스트 알림",
    "notifications.critical": "중요 알림만",
    "notifications.batch": "배치 전송",

    // Rules
    "rules.new": "새 규칙",
    "rules.if": "조건",
    "rules.then": "실행",
    "rules.test": "규칙 테스트",

    // Onboarding
    "onboarding.step1": "Gmail 연결",
    "onboarding.step2": "관심사 선택",
    "onboarding.step3": "다이제스트 일정",
    "onboarding.interests": "관심사",
    "onboarding.schedule": "일정",

    // Digest page
    "digest.title": "일일 다이제스트",
    "digest.subtitle": "개인화된 뉴스레터 요약",
    "digest.regenerate": "다시 생성",
    "digest.topHighlights": "주요 하이라이트",
    "digest.calendarSuggestions": "캘린더 제안",
    "digest.actionItems": "액션 아이템",
    "digest.empty.title": "지난 24시간 동안 ���스레터가 없습니다",
    "digest.empty.subtitle": "뉴스레터를 처리하면 일일 다이제스트가 여기에 표시됩니다.",
    "digest.empty.checkUpdates": "업데이트 확인",
    "digest.error.title": "다이제스트 로드 실패",
    "digest.error.subtitle": "일일 다이제스트를 로드하는 중 오류가 발생했습니다.",
    "digest.error.tryAgain": "다시 시도",
    "digest.importance.high": "높음",

    // Date options
    "date.today": "오늘",
    "date.yesterday": "어제",
    "date.custom": "사용자 지정",
  },

  en: {
    // Navigation
    "nav.digest": "Digest",
    "nav.inbox": "Inbox",
    "nav.recommend": "Recommend",
    "nav.rules": "Rules",
    "nav.settings": "Settings",
    "nav.privacy": "Privacy",

    // Common actions
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.confirm": "Confirm",
    "action.delete": "Delete",
    "action.edit": "Edit",
    "action.open": "Open",
    "action.close": "Close",
    "action.back": "Back",
    "action.continue": "Continue",
    "action.finish": "Finish",

    // Gmail connection
    "gmail.connect": "Connect Gmail",
    "gmail.connected": "Gmail Connected",
    "gmail.disconnect": "Disconnect",
    "gmail.permissions": "Permissions",

    // Data & Privacy
    "data.minimization": "Data Minimization",
    "data.minimization.desc": "Process raw email bodies in-memory only and store summaries",
    "data.export": "Export Data",
    "data.delete": "Delete All Data",
    "privacy.first": "Privacy-first by design",

    // Calendar
    "calendar.add": "Add to Calendar",
    "calendar.event": "Event",
    "calendar.title": "Title",
    "calendar.date": "Date",
    "calendar.time": "Time",
    "calendar.location": "Location",
    "calendar.notes": "Notes",

    // Search & Filter
    "search.placeholder": "Search newsletters, actions, or content...",
    "filter.all": "All",
    "filter.unread": "Unread",
    "filter.starred": "Starred",
    "filter.newsletters": "Newsletters",
    "filter.promotions": "Promotions",
    "filter.transactions": "Transactions",
    "filter.saved": "Saved",

    // Time & Date
    "time.today": "Today",
    "time.yesterday": "Yesterday",
    "time.thisWeek": "This Week",
    "time.dateRange": "Date Range",
    "time.quietHours": "Quiet Hours",

    // Actions & Items
    "actions.extracted": "Extracted Actions",
    "actions.none": "No actions extracted",
    "actions.deadline": "Deadline",
    "actions.rsvp": "RSVP",
    "actions.location": "Location",
    "actions.link": "Link",

    // Profile & Account
    "profile.settings": "Settings",
    "profile.signOut": "Sign out",
    "profile.language": "Language",
    "account.connected": "Connected Account",

    // Empty states
    "empty.inbox": "Your inbox is empty",
    "empty.tryRecommend": "Try Recommend",
    "empty.noActions": "No actions extracted",
    "empty.sendFeedback": "Send Feedback",

    // Notifications
    "notifications.digest": "Digest Notifications",
    "notifications.critical": "Critical Only",
    "notifications.batch": "Batch Delivery",

    // Rules
    "rules.new": "New Rule",
    "rules.if": "IF",
    "rules.then": "THEN",
    "rules.test": "Test Rule",

    // Onboarding
    "onboarding.step1": "Connect Gmail",
    "onboarding.step2": "Pick Interests",
    "onboarding.step3": "Digest Schedule",
    "onboarding.interests": "Interests",
    "onboarding.schedule": "Schedule",

    // Digest page
    "digest.title": "Daily Digest",
    "digest.subtitle": "Your personalized newsletter summary",
    "digest.regenerate": "Regenerate",
    "digest.topHighlights": "Top Highlights",
    "digest.calendarSuggestions": "Calendar Suggestions",
    "digest.actionItems": "Action Items",
    "digest.empty.title": "No newsletters in last 24h",
    "digest.empty.subtitle": "Your daily digest will appear here once we process your newsletters.",
    "digest.empty.checkUpdates": "Check for Updates",
    "digest.error.title": "Failed to load digest",
    "digest.error.subtitle": "There was an error loading your daily digest.",
    "digest.error.tryAgain": "Try Again",
    "digest.importance.high": "High",

    // Date options
    "date.today": "Today",
    "date.yesterday": "Yesterday",
    "date.custom": "Custom",
  },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko") // Default to Korean

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "ko" || saved === "en")) {
      setLanguage(saved)
    }
  }, [])

  // Save language preference
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return dictionaries[language][key as keyof (typeof dictionaries)[typeof language]] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

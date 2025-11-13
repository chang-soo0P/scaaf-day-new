import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { EmailSummary, DigestItem, Recommendation, UserSettings } from "./types"

interface EmailSummaryState {
  summary: string
  isLoading: boolean
  error: string | null
  isMock?: boolean
}

interface AppState {
  // Email data
  emails: EmailSummary[]
  digestItems: DigestItem[]
  recommendations: Recommendation[]

  emailSummaries: Record<string, EmailSummaryState>

  // UI state
  selectedEmailId: string | null
  sidebarCollapsed: boolean
  currentView: "digest" | "inbox" | "recommend" | "rules" | "settings"

  // User settings
  settings: UserSettings

  // Actions
  setEmails: (emails: EmailSummary[]) => void
  setDigestItems: (items: DigestItem[]) => void
  setRecommendations: (recommendations: Recommendation[]) => void
  setSelectedEmailId: (id: string | null) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setCurrentView: (view: AppState["currentView"]) => void
  updateSettings: (settings: Partial<UserSettings>) => void

  // Email actions
  markEmailAsRead: (emailId: string) => void
  toggleEmailStar: (emailId: string) => void
  completeAction: (emailId: string, actionIndex: number) => void

  generateEmailSummary: (emailId: string, content: string, subject: string) => Promise<void>
  clearSummaryError: (emailId: string) => void
}

const defaultSettings: UserSettings = {
  dataMinimization: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  batchDelivery: true,
  emailFrequency: "daily",
  categories: ["newsletters", "updates", "promotions", "events"],
  dislikedTopics: [],
  notifications: {
    email: true,
    push: false,
    desktop: true,
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      emails: [],
      digestItems: [],
      recommendations: [],
      emailSummaries: {},
      selectedEmailId: null,
      sidebarCollapsed: false,
      currentView: "digest",
      settings: defaultSettings,

      // Actions
      setEmails: (emails) => set({ emails }),
      setDigestItems: (digestItems) => set({ digestItems }),
      setRecommendations: (recommendations) => set({ recommendations }),
      setSelectedEmailId: (selectedEmailId) => set({ selectedEmailId }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setCurrentView: (currentView) => set({ currentView }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Email actions
      markEmailAsRead: (emailId) =>
        set((state) => ({
          emails: state.emails.map((email) => (email.id === emailId ? { ...email, isRead: true } : email)),
        })),

      toggleEmailStar: (emailId) =>
        set((state) => ({
          emails: state.emails.map((email) =>
            email.id === emailId ? { ...email, isStarred: !email.isStarred } : email,
          ),
        })),

      completeAction: (emailId, actionIndex) =>
        set((state) => ({
          digestItems: state.digestItems.map((item) =>
            item.emailId === emailId
              ? {
                  ...item,
                  actions: item.actions.map((action, index) =>
                    index === actionIndex ? { ...action, completed: true } : action,
                  ),
                }
              : item,
          ),
        })),

      generateEmailSummary: async (emailId, content, subject) => {
        // Set loading state
        set((state) => ({
          emailSummaries: {
            ...state.emailSummaries,
            [emailId]: {
              summary: "",
              isLoading: true,
              error: null,
            },
          },
        }))

        try {
          const response = await fetch("/api/ai/summarize-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emailContent: content,
              subject: subject,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to generate summary")
          }

          const data = await response.json()

          // Update with successful result
          set((state) => ({
            emailSummaries: {
              ...state.emailSummaries,
              [emailId]: {
                summary: data.summary,
                isLoading: false,
                error: null,
                isMock: data.isMock,
              },
            },
          }))
        } catch (error) {
          // Update with error state
          set((state) => ({
            emailSummaries: {
              ...state.emailSummaries,
              [emailId]: {
                ...state.emailSummaries[emailId],
                error: error instanceof Error ? error.message : "Unknown error",
              },
            },
          }))
        }
      },

      clearSummaryError: (emailId) =>
        set((state) => ({
          emailSummaries: {
            ...state.emailSummaries,
            [emailId]: {
              ...state.emailSummaries[emailId],
              error: null,
            },
          },
        })),
    }),
    {
      name: "gmail-newsletter-agent-storage",
      partialize: (state) => ({
        settings: state.settings,
        sidebarCollapsed: state.sidebarCollapsed,
        currentView: state.currentView,
        emailSummaries: state.emailSummaries,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

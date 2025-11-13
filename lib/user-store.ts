import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type UserPlan = "free" | "pro" | "team"

interface UserState {
  plan: UserPlan
  summaryCount: number
  ruleCount: number
  lastSummaryReset: string

  // Actions
  incrementSummaryCount: () => void
  incrementRuleCount: () => void
  decrementRuleCount: () => void
  resetDailyCounts: () => void
  upgradePlan: (plan: UserPlan) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      plan: "free",
      summaryCount: 0,
      ruleCount: 0,
      lastSummaryReset: new Date().toDateString(),

      incrementSummaryCount: () => {
        const today = new Date().toDateString()
        const { lastSummaryReset } = get()

        // Reset count if it's a new day
        if (lastSummaryReset !== today) {
          set({ summaryCount: 1, lastSummaryReset: today })
        } else {
          set((state) => ({ summaryCount: state.summaryCount + 1 }))
        }
      },

      incrementRuleCount: () => set((state) => ({ ruleCount: state.ruleCount + 1 })),
      decrementRuleCount: () => set((state) => ({ ruleCount: Math.max(0, state.ruleCount - 1) })),

      resetDailyCounts: () => {
        const today = new Date().toDateString()
        set({ summaryCount: 0, lastSummaryReset: today })
      },

      upgradePlan: (plan: UserPlan) => set({ plan }),
    }),
    {
      name: "user-plan-storage",
      storage: createJSONStorage(() => localStorage), // Optional: specify storage if needed
    },
  ),
)

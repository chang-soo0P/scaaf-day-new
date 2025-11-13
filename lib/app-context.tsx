"use client"

import { createContext, useContext } from "react"

interface AppContextType {
  selectedEmailId: string | null
  setSelectedEmailId: (id: string | null) => void
  searchHistory: Array<{ query: string; timestamp: string }>
  addToSearchHistory: (query: string) => void
  userProfile: any
  setUserProfile: (profile: any) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}

export { AppContext }
export type { AppContextType }

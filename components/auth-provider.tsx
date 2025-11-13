"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuthStatus } = useAuthStore()

  useEffect(() => {
    // Initialize auth state on app load
    checkAuthStatus()
  }, [checkAuthStatus])

  return <>{children}</>
}

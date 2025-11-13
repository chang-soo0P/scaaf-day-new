"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

interface GmailMessage {
  id: string
  threadId: string
}

export const useGmailMessages = () => {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  return useQuery({
    queryKey: ["gmail-messages"],
    queryFn: async (): Promise<GmailMessage[]> => {
      if (!isAuthenticated || !user?.accessToken) {
        router.push("/login")
        return []
      }

      console.log("[v0] Fetching Gmail messages with token:", user.accessToken?.substring(0, 10) + "...")
      
      const response = await fetch(`/api/gmail/messages?accessToken=${user.accessToken}`)

      console.log("[v0] Gmail API Response Status:", response.status, response.statusText)

      if (!response.ok) {
        if (response.status === 401) {
          console.log("[v0] Authentication failed, redirecting to login")
          router.push("/login")
          return []
        }
        const errorText = await response.text()
        console.error("[v0] Gmail API Error Response:", errorText)
        throw new Error(`Failed to fetch Gmail messages: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Gmail Messages API Response:", data)
      
      // API 응답에서 실제 메시지 데이터 추출
      const messages = data.data || data.messages || []
      
      if (!Array.isArray(messages)) {
        console.error("[v0] Messages is not an array:", messages)
        return []
      }
      
      return messages
    },
    enabled: isAuthenticated && !!user?.accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes("401") || error?.message?.includes("authentication")) {
        return false
      }
      return failureCount < 1
    },
  })
}

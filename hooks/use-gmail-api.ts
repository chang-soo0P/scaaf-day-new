"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { useEmails } from "./useProductionApi"

interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  payload: {
    headers: Array<{ name: string; value: string }>
  }
  internalDate: string
}

interface EmailListItem {
  id: string
  subject: string
  sender: string
  senderEmail: string
  date: string
  snippet: string
  isRead: boolean
}

export const useGmailMessages = () => {
  const { isAuthenticated, isMockMode, user } = useAuthStore()
  const router = useRouter()

  const mockEmailsQuery = useEmails()

  return useQuery({
    queryKey: ["gmail-messages"],
    queryFn: async (): Promise<EmailListItem[]> => {
      if (!isAuthenticated) {
        router.push("/login")
        return []
      }

      // Mock mode disabled - use real Gmail data only
      // if (isMockMode) {
      //   if (mockEmailsQuery.isLoading) {
      //     throw new Error("Loading mock data...")
      //   }

      //   if (mockEmailsQuery.error) {
      //     throw mockEmailsQuery.error
      //   }

      //   // Transform mock data to match expected format
      //   const mockData = mockEmailsQuery.data || []
      //   return mockData.map((email) => ({
      //     id: email.id,
      //     subject: email.subject,
      //     sender: email.sender,
      //     senderEmail: email.senderEmail,
      //     date: email.receivedAt,
      //     snippet: email.summary,
      //     isRead: email.isRead,
      //   }))
      // }

      if (!user?.accessToken) {
        throw new Error("No access token available")
      }

      const response = await fetch(
        "/api/gmail/messages?" +
          new URLSearchParams({
            accessToken: user.accessToken,
            q: "category:primary newer_than:3d",
            maxResults: "10",
          }),
      )

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return []
        }
        throw new Error("Failed to fetch emails")
      }

      const data = await response.json()
      console.log("[v0] Gmail API Response:", data)

      // API 응답 구조에 따라 데이터 추출
      const messages = data.data || data.messages || []
      
      if (!Array.isArray(messages)) {
        console.error("[v0] Messages is not an array:", messages)
        return []
      }

      return messages.map((message: any) => {
        // 이미 변환된 데이터인 경우 (API에서 직접 반환)
        if (message.subject && message.from) {
          return {
            id: message.id,
            subject: message.subject,
            sender: message.sender || message.from,
            senderEmail: message.senderEmail || message.from,
            date: message.date,
            snippet: message.snippet || "",
            isRead: message.isRead || false,
          }
        }

        // Gmail API 원시 데이터인 경우 변환
        const headers = message.payload?.headers || []
        const subject = headers.find((h: any) => h.name === "Subject")?.value || "No Subject"
        const from = headers.find((h: any) => h.name === "From")?.value || "Unknown Sender"
        const date = headers.find((h: any) => h.name === "Date")?.value || message.internalDate

        // Parse sender name and email
        const senderMatch = from.match(/^(.+?)\s*<(.+?)>$/)
        const senderName = senderMatch ? senderMatch[1].replace(/"/g, "") : from
        const senderEmail = senderMatch ? senderMatch[2] : from

        return {
          id: message.id,
          subject,
          sender: senderName,
          senderEmail,
          date: new Date(date).toISOString(),
          snippet: message.snippet || "",
          isRead: false, // Gmail API doesn't provide read status in list view
        }
      })
    },
    enabled: isAuthenticated && (isMockMode ? !mockEmailsQuery.isLoading : !!user?.accessToken),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.message?.includes("401") || error?.message?.includes("authentication")) {
        return false
      }
      return failureCount < 1
    },
  })
}

export const useRefreshGmailMessages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ["gmail-messages"] })
    },
  })
}

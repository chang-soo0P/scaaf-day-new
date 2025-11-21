"use client"

import { useQuery } from "@tanstack/react-query"

export const useGmailMessages = () => {
  return useQuery({
    queryKey: ["gmail-messages"],
    queryFn: async () => {
      // Access Token은 쿠키로 전달되므로 여기서 신경 쓸 필요 없음
      const response = await fetch("/api/gmail/messages", {
        credentials: "include", // Cookie 전달 필수
      })

      if (!response.ok) {
        throw new Error("Failed to load Gmail messages")
      }

      const data = await response.json()

      // API 응답 구조 맞추기
      return data.data || []
    },
    staleTime: 2 * 60 * 1000,
  })
}

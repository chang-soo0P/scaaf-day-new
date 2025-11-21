import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/auth-store"

export function useGmailMessageList() {
  const { isAuthenticated } = useAuthStore()

  const fetchMessages = async () => {
    const res = await fetch("/api/gmail/messages", {
      credentials: "include",   // ★ httpOnly 쿠키 포함 필수
    })

    const json = await res.json()

    if (!res.ok) throw new Error(json.error || "Failed to load messages")

    return json.data
  }

  return useQuery({
    queryKey: ["gmail-messages"],
    queryFn: fetchMessages,
    enabled: isAuthenticated, // accessToken 없어도 쿠키로 가능
    staleTime: 1000 * 60 * 2,
  })
}

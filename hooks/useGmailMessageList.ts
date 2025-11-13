import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/auth-store"

export function useGmailMessageList() {
  const { user } = useAuthStore()
  const accessToken = user?.accessToken

  const fetchMessages = async () => {
    if (!accessToken) throw new Error("No access token")

    const res = await fetch(`/api/gmail/messages?accessToken=${accessToken}`)
    const json = await res.json()

    if (!res.ok) throw new Error(json.error || "Failed to load messages")

    return json.data
  }

  return useQuery({
    queryKey: ["gmail-messages", accessToken],
    queryFn: fetchMessages,
    enabled: !!accessToken,
  })
}

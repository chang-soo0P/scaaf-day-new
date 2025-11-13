import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/auth-store"

export function useGmailEmails() {
  const { user } = useAuthStore()
  const accessToken = user?.accessToken

  const fetchGmailMessages = async () => {
    if (!accessToken) throw new Error("User not authenticated")

    const res = await fetch(`/api/gmail/messages?accessToken=${accessToken}`)
    if (!res.ok) throw new Error("Failed to fetch Gmail messages")

    const json = await res.json()
    return json.data || []
  }

  const query = useQuery({
    queryKey: ["gmail-emails", accessToken],
    queryFn: fetchGmailMessages,
    enabled: !!accessToken,
  })

  return query
}

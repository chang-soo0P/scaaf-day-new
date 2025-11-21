import { useQuery } from "@tanstack/react-query"

export function useGmailMessageList() {

  const fetchMessages = async () => {
    const res = await fetch("/api/gmail/messages", {
      credentials: "include"
    })
    const json = await res.json()

    if (!res.ok) throw new Error(json.error || "Failed to load messages")

    return json.data
  }

  return useQuery({
    queryKey: ["gmail-messages"],
    queryFn: fetchMessages,
    staleTime: 1000 * 60 * 2,
  })
}

import { useMutation } from "@tanstack/react-query"

export function useSummarizeEmail() {
  return useMutation({
    mutationFn: async ({ subject, emailContent }: { subject: string; emailContent: string }) => {
      const res = await fetch("/api/ai/summarize-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, emailContent }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to summarize email")
      return json
    },
  })
}

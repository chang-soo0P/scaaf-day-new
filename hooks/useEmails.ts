import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/auth-store"
import type { EmailRecord } from "@/lib/mock-database"

interface StoreEmailData {
  gmail_id: string
  subject: string
  from: string
  snippet: string
  summary?: string
  actions?: any[]
}

export function useEmails() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const {
    data: emails = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["emails", user?.id],
    queryFn: async (): Promise<EmailRecord[]> => {
      if (!user?.id) return []

      const response = await fetch(`/api/emails?user_id=${user.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch emails")
      }
      const result = await response.json()
      return result.data || []
    },
    enabled: !!user?.id,
  })

  const storeEmailMutation = useMutation({
    mutationFn: async (emailData: StoreEmailData): Promise<EmailRecord> => {
      if (!user?.id) throw new Error("User not authenticated")

      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emailData,
          user_id: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to store email")
      }

      const result = await response.json()
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", user?.id] })
    },
  })

  const updateEmailMutation = useMutation({
    mutationFn: async ({
      id,
      summary,
      actions,
    }: {
      id: string
      summary?: string
      actions?: any[]
    }): Promise<EmailRecord> => {
      const response = await fetch(`/api/emails/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary, actions }),
      })

      if (!response.ok) {
        throw new Error("Failed to update email")
      }

      const result = await response.json()
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", user?.id] })
    },
  })

  return {
    emails,
    isLoading,
    error,
    refetch,
    storeEmail: storeEmailMutation.mutateAsync,
    updateEmail: updateEmailMutation.mutateAsync,
    isStoring: storeEmailMutation.isPending,
    isUpdating: updateEmailMutation.isPending,
  }
}

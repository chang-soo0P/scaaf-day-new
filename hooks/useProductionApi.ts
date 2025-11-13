import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmailSummary, DigestItem, Recommendation, ActionItem, ExtractedEvent } from "@/lib/types"

// Production API hooks - Empty implementations for production
export const useEmails = () => {
  return useQuery({
    queryKey: ["emails"],
    queryFn: async (): Promise<EmailSummary[]> => {
      // Return empty array for production
      return []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useEmail = (emailId: string) => {
  return useQuery({
    queryKey: ["email", emailId],
    queryFn: async (): Promise<EmailSummary | null> => {
      return null
    },
    enabled: !!emailId,
    staleTime: 2 * 60 * 1000,
  })
}

export const useDigestItems = () => {
  return useQuery({
    queryKey: ["digestItems"],
    queryFn: async (): Promise<DigestItem[]> => {
      return []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: async (): Promise<Recommendation[]> => {
      return []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useActionItems = () => {
  return useQuery({
    queryKey: ["actionItems"],
    queryFn: async (): Promise<ActionItem[]> => {
      return []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useExtractedEvents = () => {
  return useQuery({
    queryKey: ["extractedEvents"],
    queryFn: async (): Promise<ExtractedEvent[]> => {
      return []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateCalendarEvent = () => {
  return useMutation({
    mutationFn: async (event: ExtractedEvent): Promise<{ success: boolean; eventId?: string }> => {
      // Mock calendar creation
      return {
        success: true,
        eventId: `cal_${Date.now()}`,
      }
    },
  })
}

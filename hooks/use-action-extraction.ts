import { useMutation, useQuery } from "@tanstack/react-query"
import { actionExtractor } from "@/lib/action-extraction"
import type { ExtractionResult } from "@/lib/action-extraction"

export function useActionExtraction() {
  return useMutation({
    mutationFn: async ({
      emailContent,
      subject,
      sender,
    }: {
      emailContent: string
      subject?: string
      sender?: string
    }): Promise<ExtractionResult> => {
      return actionExtractor.extractFromEmail(emailContent, subject, sender)
    },
  })
}

export function useBatchExtraction() {
  return useMutation({
    mutationFn: async (messageIds: string[]) => {
      return actionExtractor.batchExtract(messageIds)
    },
  })
}

export function usePatternExtraction(emailContent: string, enabled = false) {
  return useQuery({
    queryKey: ["pattern-extraction", emailContent],
    queryFn: () => actionExtractor.extractWithPatterns(emailContent),
    enabled: enabled && !!emailContent,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

import type { ActionItem, ExtractedEvent } from "./types"

export interface ExtractionResult {
  actionItems: ActionItem[]
  events: ExtractedEvent[]
  summary: string
  keyQuotes: string[]
  extractionReasons: ExtractionReason[]
}

export interface ExtractionReason {
  type: string
  method: string
  pattern: string
  confidence: number
}

export class ActionExtractor {
  private static instance: ActionExtractor

  static getInstance(): ActionExtractor {
    if (!ActionExtractor.instance) {
      ActionExtractor.instance = new ActionExtractor()
    }
    return ActionExtractor.instance
  }

  async extractFromEmail(emailContent: string, subject?: string, sender?: string): Promise<ExtractionResult> {
    try {
      const response = await fetch("/api/ai/extract-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent,
          subject,
          sender,
        }),
      })

      if (!response.ok) {
        throw new Error("Extraction API failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Action extraction failed:", error)
      return this.getFallbackExtraction()
    }
  }

  async batchExtract(messageIds: string[]): Promise<any> {
    try {
      const response = await fetch("/api/ai/batch-extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageIds,
          batchSize: 10,
        }),
      })

      if (!response.ok) {
        throw new Error("Batch extraction API failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Batch extraction failed:", error)
      throw error
    }
  }

  private getFallbackExtraction(): ExtractionResult {
    return {
      actionItems: [],
      events: [],
      summary: "Unable to process email content at this time.",
      keyQuotes: [],
      extractionReasons: [],
    }
  }

  extractWithPatterns(emailContent: string): Partial<ExtractionResult> {
    const actionItems: ActionItem[] = []
    const events: ExtractedEvent[] = []
    const extractionReasons: ExtractionReason[] = []

    // Deadline patterns
    const deadlinePatterns = [
      /(?:by|before|due|deadline|submit.*by)\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/gi,
      /(?:expires?|ends?)\s+(?:on\s+)?([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/gi,
    ]

    deadlinePatterns.forEach((pattern, index) => {
      const matches = emailContent.matchAll(pattern)
      for (const match of matches) {
        actionItems.push({
          type: "deadline",
          text: match[0],
          confidence: 0.8,
          priority: "medium",
          completed: false,
        })

        extractionReasons.push({
          type: "Deadline",
          method: "Regex Pattern",
          pattern: pattern.source,
          confidence: 0.8,
        })
      }
    })

    // Event patterns
    const eventPatterns = [
      /(?:meeting|conference|webinar|event).*?(?:on\s+)?([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)\s+(?:at\s+)?(\d{1,2}:\d{2}\s*(?:AM|PM)?)/gi,
      /(?:scheduled|planned)\s+(?:for\s+)?([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/gi,
    ]

    eventPatterns.forEach((pattern, index) => {
      const matches = emailContent.matchAll(pattern)
      for (const match of matches) {
        events.push({
          id: `event-${Date.now()}-${index}`,
          title: match[0],
          startTime: new Date().toISOString(), // Would need proper date parsing
          confidence: 0.7,
        })

        extractionReasons.push({
          type: "Event",
          method: "Regex Pattern",
          pattern: pattern.source,
          confidence: 0.7,
        })
      }
    })

    // URL patterns
    const urlPattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi
    const urls = emailContent.match(urlPattern) || []

    urls.forEach((url) => {
      actionItems.push({
        type: "link",
        text: url,
        url,
        confidence: 0.95,
        priority: "low",
        completed: false,
      })
    })

    if (urls.length > 0) {
      extractionReasons.push({
        type: "Link",
        method: "URL Pattern",
        pattern: urlPattern.source,
        confidence: 0.95,
      })
    }

    return {
      actionItems,
      events,
      extractionReasons,
    }
  }
}

export const actionExtractor = ActionExtractor.getInstance()

export interface EmailSummary {
  id: string
  subject: string
  sender: string
  senderEmail: string
  receivedAt: string
  summary: string
  originalContent: string
  isRead: boolean
  isStarred: boolean
  labels: string[]
}

export interface ActionItem {
  id?: string
  type: "deadline" | "event" | "rsvp" | "location" | "link"
  text: string
  confidence: number
  url?: string
  dueDate?: string
  location?: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

export interface ExtractedEvent {
  id: string
  title: string
  startTime: string
  endTime?: string
  location?: string
  description?: string
  url?: string
  confidence?: number
}

export interface DigestItem {
  emailId: string
  title: string
  summary3lines: string
  actions: ActionItem[]
  importance: "high" | "medium" | "low"
  category: string
  readTime: number
}

export interface Recommendation {
  id: string
  title: string
  source: string
  reasonTags: string[]
  url: string
  description: string
  relevanceScore: number
  createdAt: string
}

export interface UserSettings {
  dataMinimization: boolean
  quietHoursStart: string
  quietHoursEnd: string
  batchDelivery: boolean
  emailFrequency: "realtime" | "hourly" | "daily" | "weekly"
  categories: string[]
  dislikedTopics: string[]
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
}

export interface CalendarEvent {
  title: string
  start: string
  end?: string
  location?: string
  description?: string
  url?: string
}

export interface NewsletterDigest {
  id: string
  emailId: string
  subject: string
  sender: string
  summary: string
  keyPoints: string[]
  links: Array<{
    url: string
    title: string
    description?: string
  }>
  dates: Array<{
    date: string
    event: string
    importance: "high" | "medium" | "low"
  }>
  numbers: Array<{
    value: string
    context: string
    significance: string
  }>
  quotes: string[]
  category: string
  readTime: number
  createdAt: string
  isProcessed: boolean
}

export interface DigestGroup {
  id: string
  category: string
  title: string
  items: NewsletterDigest[]
  createdAt: string
}

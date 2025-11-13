// DISABLED FOR PRODUCTION - Mock database
/*
export interface EmailRecord {
  id?: string
  gmail_id: string
  subject: string
  from: string
  snippet: string
  summary?: string
  actions?: any[]
  user_id: string
  created_at?: string
}

class MockDatabase {
  private storageKey = "mock_emails"

  private getEmails(): EmailRecord[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  private saveEmails(emails: EmailRecord[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.storageKey, JSON.stringify(emails))
  }

  async insertEmail(email: EmailRecord): Promise<EmailRecord> {
    const emails = this.getEmails()
    const existingIndex = emails.findIndex((e) => e.gmail_id === email.gmail_id && e.user_id === email.user_id)

    const emailWithDefaults = {
      ...email,
      id: email.id || email.gmail_id,
      created_at: email.created_at || new Date().toISOString(),
      summary: email.summary || "",
      actions: email.actions || [],
    }

    if (existingIndex >= 0) {
      emails[existingIndex] = emailWithDefaults
    } else {
      emails.push(emailWithDefaults)
    }

    this.saveEmails(emails)
    return emailWithDefaults
  }

  async getEmailsByUser(userId: string): Promise<EmailRecord[]> {
    const emails = this.getEmails()
    return emails.filter((email) => email.user_id === userId)
  }

  async getEmailById(id: string): Promise<EmailRecord | null> {
    const emails = this.getEmails()
    return emails.find((email) => email.id === id || email.gmail_id === id) || null
  }

  async updateEmail(id: string, updates: Partial<EmailRecord>): Promise<EmailRecord | null> {
    const emails = this.getEmails()
    const index = emails.findIndex((email) => email.id === id || email.gmail_id === id)

    if (index >= 0) {
      emails[index] = { ...emails[index], ...updates }
      this.saveEmails(emails)
      return emails[index]
    }

    return null
  }

  async deleteEmail(id: string): Promise<boolean> {
    const emails = this.getEmails()
    const filteredEmails = emails.filter((email) => email.id !== id && email.gmail_id !== id)

    if (filteredEmails.length < emails.length) {
      this.saveEmails(filteredEmails)
      return true
    }

    return false
  }

  async deleteAllEmailsByUser(userId: string): Promise<number> {
    const emails = this.getEmails()
    const filteredEmails = emails.filter((email) => email.user_id !== userId)
    const deletedCount = emails.length - filteredEmails.length

    this.saveEmails(filteredEmails)
    return deletedCount
  }
}

export const mockDB = new MockDatabase()
*/

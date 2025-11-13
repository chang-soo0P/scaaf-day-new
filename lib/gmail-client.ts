interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  payload: {
    headers: Array<{ name: string; value: string }>
    body?: { data?: string }
    parts?: Array<{
      mimeType: string
      body: { data?: string }
    }>
  }
  internalDate: string
}

interface GmailListResponse {
  messages: Array<{ id: string; threadId: string }>
  nextPageToken?: string
  resultSizeEstimate: number
}

export class GmailClient {
  constructor(private accessToken: string) {}

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gmail API error:", response.status, "-", errorText)
      throw new Error(`Gmail API error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  async getMessages(query = "", maxResults = 10): Promise<GmailListResponse> {
    const params = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString(),
    })

    return this.makeRequest(`/users/me/messages?${params}`)
  }

  async getMessage(messageId: string): Promise<GmailMessage> {
    return this.makeRequest(`/users/me/messages/${messageId}`)
  }

  async getProfile() {
    return this.makeRequest("/users/me/profile")
  }

  async deleteMessage(messageId: string) {
    return this.makeRequest(`/users/me/messages/${messageId}`, {
      method: "DELETE",
    })
  }

  async modifyMessage(messageId: string, addLabelIds: string[] = [], removeLabelIds: string[] = []) {
    return this.makeRequest(`/users/me/messages/${messageId}/modify`, {
      method: "POST",
      body: JSON.stringify({
        addLabelIds,
        removeLabelIds,
      }),
    })
  }

  async getLabels() {
    return this.makeRequest("/users/me/labels")
  }
}

interface GmailMessage {
  id: string
  threadId: string
}

interface GmailMessageDetail {
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
  messages: GmailMessage[]
  nextPageToken?: string
  resultSizeEstimate: number
}

/**
 * Fetches the latest 20 Gmail messages using the Gmail API
 * @param accessToken - Gmail API access token
 * @returns Promise<string[]> - Array of message IDs
 */
export async function fetchGmailMessages(accessToken: string): Promise<string[]> {
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status} ${response.statusText}`)
  }

  const data: GmailListResponse = await response.json()
  return data.messages?.map((msg) => msg.id) || []
}

/**
 * Fetches detailed information for a specific Gmail message
 * @param accessToken - Gmail API access token
 * @param messageId - The ID of the message to fetch
 * @returns Promise<object> - Message details including headers, subject, body snippet, sender
 */
export async function fetchGmailMessageDetail(accessToken: string, messageId: string) {
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status} ${response.statusText}`)
  }

  const message: GmailMessageDetail = await response.json()

  // Extract headers for easier access
  const headers = message.payload.headers
  const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject"
  const from = headers.find((h) => h.name === "From")?.value || "Unknown Sender"

  // Parse sender name and email
  const senderMatch = from.match(/^(.+?)\s*<(.+?)>$/)
  const senderName = senderMatch ? senderMatch[1].replace(/"/g, "") : from
  const senderEmail = senderMatch ? senderMatch[2] : from

  return {
    id: message.id,
    threadId: message.threadId,
    headers: message.payload.headers,
    subject,
    bodySnippet: message.snippet,
    sender: senderName,
    senderEmail,
    internalDate: message.internalDate,
    payload: message.payload,
  }
}

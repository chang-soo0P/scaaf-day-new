"use client"

import { useState, useEffect } from "react"
import { useGmailMessages } from "./use-gmail-api"
import type { NewsletterDigest, DigestGroup } from "@/lib/types"

interface UseNewsletterDigestReturn {
  digests: NewsletterDigest[]
  groups: DigestGroup[]
  isLoading: boolean
  error: string | null
  processNewsletter: (emailId: string, content: string, subject: string, sender: string) => Promise<void>
  currentCount: number
  maxFreeCount: number
  isAtLimit: boolean
}

export function useNewsletterDigest(): UseNewsletterDigestReturn {
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useGmailMessages()
  const [digests, setDigests] = useState<NewsletterDigest[]>([])
  const [groups, setGroups] = useState<DigestGroup[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxFreeCount = 3
  const currentCount = digests.length
  const isAtLimit = currentCount >= maxFreeCount

  // Load saved digests from localStorage
  useEffect(() => {
    const savedDigests = localStorage.getItem('newsletter-digests')
    if (savedDigests) {
      try {
        const parsedDigests = JSON.parse(savedDigests)
        setDigests(parsedDigests)
        groupDigests(parsedDigests)
      } catch (error) {
        console.error('Failed to load saved digests:', error)
      }
    }
  }, [])

  // Group digests by category
  const groupDigests = (digestList: NewsletterDigest[]) => {
    const grouped = digestList.reduce((acc, digest) => {
      const category = digest.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(digest)
      return acc
    }, {} as Record<string, NewsletterDigest[]>)

    const groupList: DigestGroup[] = Object.entries(grouped).map(([category, items]) => ({
      id: category,
      category,
      title: `${category} 뉴스레터`,
      items: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      createdAt: items[0]?.createdAt || new Date().toISOString()
    }))

    setGroups(groupList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const processNewsletter = async (emailId: string, content: string, subject: string, sender: string) => {
    if (isAtLimit) {
      setError('무료 요약 한도에 도달했습니다. Pro 플랜으로 업그레이드하세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/newsletter-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContent: content,
          subject,
          sender
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process newsletter')
      }

      const data = await response.json()
      
      const newDigest: NewsletterDigest = {
        id: `digest-${Date.now()}`,
        emailId,
        subject,
        sender,
        summary: data.summary,
        keyPoints: data.keyPoints,
        links: data.links,
        dates: data.dates,
        numbers: data.numbers,
        quotes: data.quotes,
        category: data.category,
        readTime: data.readTime,
        createdAt: new Date().toISOString(),
        isProcessed: true
      }

      const updatedDigests = [...digests, newDigest]
      setDigests(updatedDigests)
      groupDigests(updatedDigests)
      
      // Save to localStorage
      localStorage.setItem('newsletter-digests', JSON.stringify(updatedDigests))
    } catch (error) {
      console.error('Newsletter processing error:', error)
      setError(error instanceof Error ? error.message : 'Failed to process newsletter')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    digests,
    groups,
    isLoading,
    error,
    processNewsletter,
    currentCount,
    maxFreeCount,
    isAtLimit
  }
}

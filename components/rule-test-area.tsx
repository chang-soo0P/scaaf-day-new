"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TestTube, CheckCircle, XCircle, Mail } from "lucide-react"

interface TestEmail {
  id: string
  sender: string
  subject: string
  domain: string
  hasListUnsubscribe: boolean
  preview: string
}

const mockTestEmails: TestEmail[] = [
  {
    id: "1",
    sender: "newsletter@techcrunch.com",
    subject: "Latest AI developments in 2024",
    domain: "techcrunch.com",
    hasListUnsubscribe: true,
    preview: "Discover the most exciting AI breakthroughs...",
  },
  {
    id: "2",
    sender: "updates@stripe.com",
    subject: "Your monthly invoice is ready",
    domain: "stripe.com",
    hasListUnsubscribe: false,
    preview: "Your Stripe invoice for December 2024...",
  },
  {
    id: "3",
    sender: "hello@designernews.co",
    subject: "Weekly design inspiration",
    domain: "designernews.co",
    hasListUnsubscribe: true,
    preview: "Check out these amazing design trends...",
  },
]

interface RuleTestAreaProps {
  selectedRule?: any
}

export function RuleTestArea({ selectedRule }: RuleTestAreaProps) {
  const [testResults, setTestResults] = useState<{ [key: string]: boolean } | null>(null)

  const testRule = () => {
    if (!selectedRule) return

    const results: { [key: string]: boolean } = {}

    mockTestEmails.forEach((email) => {
      let matches = false

      switch (selectedRule.condition.field) {
        case "sender":
          matches = email.sender.toLowerCase().includes(selectedRule.condition.value.toLowerCase())
          break
        case "domain":
          matches = email.domain === selectedRule.condition.value
          break
        case "subject":
          matches = email.subject.toLowerCase().includes(selectedRule.condition.value.toLowerCase())
          break
        case "header":
          matches = selectedRule.condition.value === "List-Unsubscribe" ? email.hasListUnsubscribe : false
          break
        default:
          matches = false
      }

      results[email.id] = matches
    })

    setTestResults(results)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-purple-600" />
            <CardTitle>Test Rule with Sample Emails</CardTitle>
          </div>
          <Button onClick={testRule} disabled={!selectedRule} variant="outline" size="sm">
            Run Test
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedRule ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Select a rule from the list above to test it with sample emails
          </p>
        ) : (
          <>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Testing Rule:</p>
              <p className="text-sm text-gray-600">{selectedRule.name}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              {mockTestEmails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{email.subject}</p>
                      <p className="text-xs text-gray-500">{email.sender}</p>
                    </div>
                  </div>

                  {testResults && (
                    <div className="flex items-center space-x-2">
                      {testResults[email.id] ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            Match
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-gray-400" />
                          <Badge variant="secondary">No Match</Badge>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {testResults && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>{Object.values(testResults).filter(Boolean).length}</strong> out of{" "}
                  <strong>{mockTestEmails.length}</strong> sample emails would be affected by this rule.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

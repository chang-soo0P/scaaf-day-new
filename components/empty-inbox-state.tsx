"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Lightbulb, RefreshCw } from "lucide-react"

interface EmptyInboxStateProps {
  onRefresh?: () => void
}

export function EmptyInboxState({ onRefresh }: EmptyInboxStateProps) {
  const router = useRouter()

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your inbox is empty</h2>
        <p className="text-gray-600 mb-6">
          No newsletters found. Your processed emails will appear here once they arrive.
        </p>
        <div className="flex items-center justify-center space-x-3">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Check for Updates
            </Button>
          )}
          <Button onClick={() => router.push("/recommend")}>
            <Lightbulb className="w-4 h-4 mr-2" />
            Try Recommend
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

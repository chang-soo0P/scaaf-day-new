"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Copy, RefreshCw, X } from "lucide-react"
import { toast } from "sonner"

interface ErrorToastProps {
  title: string
  message: string
  errorId?: string
  onRetry?: () => void
  onDismiss?: () => void
}

export function ErrorToast({ title, message, errorId, onRetry, onDismiss }: ErrorToastProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyErrorId = async () => {
    if (errorId) {
      await navigator.clipboard.writeText(errorId)
      setCopied(true)
      toast.success("Error ID copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-red-900">{title}</h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
            {errorId && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-red-600">Error ID: {errorId}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyErrorId} className="h-6 px-2 text-xs">
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            )}
            <div className="flex items-center space-x-2 mt-3">
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss} className="p-1">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

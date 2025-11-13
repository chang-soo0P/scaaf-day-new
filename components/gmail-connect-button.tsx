"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function GmailConnectButton() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    console.log("[v0] Gmail connect button clicked")
    setIsConnecting(true)
    try {
      console.log("[v0] Fetching auth URL from /api/auth/google")
      const response = await fetch("/api/auth/google")
      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 500 && errorData.error?.includes("Google Client ID not configured")) {
          throw new Error("Google OAuth 설정이 필요합니다. 환경 변수를 확인해주세요.")
        }
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Response data:", data)

      if (data.authUrl) {
        console.log("[v0] Redirecting to OAuth URL in top window:", data.authUrl)
        if (window.top) {
          window.top.location.href = data.authUrl
        } else {
          window.location.href = data.authUrl
        }
      } else {
        throw new Error("No authUrl in response")
      }
    } catch (error) {
      console.error("[v0] Connection error:", error)
      
      let errorMessage = error.message
      if (error.message.includes("Google OAuth 설정")) {
        errorMessage = "환경 변수 GOOGLE_CLIENT_ID가 설정되지 않았습니다."
      } else if (error.message.includes("fetch")) {
        errorMessage = "네트워크 연결을 확인해주세요."
      }
      
      toast({
        title: "Gmail 연결 실패",
        description: errorMessage,
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>OAuth 인증 방식:</strong>
          <br />• Google 로그인 페이지로 리다이렉트됩니다
          <br />• 인증 완료 후 자동으로 대시보드로 돌아옵니다
          <br />• v0 환경에서 최적화된 인증 방식입니다
        </AlertDescription>
      </Alert>

      <Button onClick={handleConnect} disabled={isConnecting} className="w-full" size="lg">
        {isConnecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
        {isConnecting ? "Redirecting to Google..." : "Connect Gmail"}
      </Button>
    </div>
  )
}

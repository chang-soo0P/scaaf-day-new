"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Lock, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface DigestLimitBannerProps {
  currentCount: number
  maxFreeCount: number
  onUpgrade?: () => void
}

export function DigestLimitBanner({ 
  currentCount, 
  maxFreeCount, 
  onUpgrade 
}: DigestLimitBannerProps) {
  const router = useRouter()
  const remainingCount = maxFreeCount - currentCount
  const isAtLimit = remainingCount <= 0

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      router.push("/dashboard/pricing")
    }
  }

  if (!isAtLimit) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  무료 요약 {remainingCount}건 남음
                </p>
                <p className="text-xs text-blue-700">
                  더 많은 뉴스레터를 요약하려면 Pro 플랜으로 업그레이드하세요
                </p>
              </div>
            </div>
            <Button size="sm" onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
              <Crown className="w-3 h-3 mr-1" />
              업그레이드
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Lock className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-900">
                무료 요약 한도 도달
              </p>
              <p className="text-xs text-orange-700">
                3건까지만 요약이 제공됩니다. 더 많은 뉴스레터를 요약하려면 Pro 플랜을 활성화하세요.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-orange-800 border-orange-300">
              제한됨
            </Badge>
            <Button size="sm" onClick={handleUpgrade} className="bg-orange-600 hover:bg-orange-700">
              <Crown className="w-3 h-3 mr-1" />
              Pro로 업그레이드
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface LockCardProps {
  message?: string
}

export default function LockCard({ message = "이 기능은 Pro 플랜 이상에서 사용할 수 있어요." }: LockCardProps) {
  const router = useRouter()

  return (
    <Card className="border-dashed border-2 border-gray-300 text-center text-gray-600">
      <CardHeader>
        <Lock className="mx-auto h-6 w-6 text-gray-400" />
        <CardTitle className="text-base font-medium mt-2">기능 잠김</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{message}</p>
        <Button onClick={() => router.push("/pricing")}>플랜 업그레이드</Button>
      </CardContent>
    </Card>
  )
}

export { LockCard }

"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter, useSearchParams } from "next/navigation"

export function AuthSync() {
  const { login, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const syncAuth = async () => {
      // URL에서 authenticated=true 파라미터 확인
      const isAuthenticated = searchParams.get("authenticated") === "true"
      
      if (isAuthenticated) {
        try {
          // 서버에서 사용자 정보 가져오기
          const response = await fetch("/api/auth/me")
          
          if (response.ok) {
            const userData = await response.json()
            
            // auth-store에 실제 사용자 정보 저장
            login({
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
              accessToken: userData.accessToken,
              expiresAt: userData.expiresAt,
            })
            
            console.log("[v0] Auth sync completed:", userData.email)
            
            // URL에서 authenticated 파라미터 제거
            const url = new URL(window.location.href)
            url.searchParams.delete("authenticated")
            router.replace(url.pathname + url.search)
          } else {
            console.error("[v0] Auth sync failed:", response.status)
          }
        } catch (error) {
          console.error("[v0] Auth sync error:", error)
        }
      }
    }

    syncAuth()
  }, [searchParams, login, router])

  return null
}

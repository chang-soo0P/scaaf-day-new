"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, isMockMode, checkAuthStatus } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const host = typeof window !== "undefined" ? window.location.hostname : "";

    // ✅ 운영 도메인(scaaf.day)에서는 auth redirect 완전 비활성화
    const isProductionDomain =
      host === "scaaf.day" ||
      host === "www.scaaf.day" ||
      host.includes("scaaf.day");

    if (isProductionDomain) {
      console.log("[AuthGuard] Production domain detected — skipping redirect logic");
      return; // ✅ 이게 가장 중요 — 아래 router.push("/onboarding") 실행 방지
    }

    // ✅ 모의 로그인(Mock Mode)에서는 인증 검사 스킵
    if (isMockMode) {
      return;
    }

    // ✅ 로딩이 끝났고, 인증되지 않았다면 체크 후 리디렉션
    if (!isLoading && !isAuthenticated) {
      checkAuthStatus().then((authenticated) => {
        if (!authenticated) {
          console.log("[AuthGuard] Not authenticated — redirecting to /onboarding");
          router.push("/onboarding");
        }
      });
    }
  }, [isAuthenticated, isLoading, isMockMode, checkAuthStatus, router]);

  // ✅ 로딩 중인 경우 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ✅ 인증 안 된 경우 fallback 또는 기본 안내 표시
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please connect your Gmail account to continue.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

export const ProtectedRoute = AuthGuard;

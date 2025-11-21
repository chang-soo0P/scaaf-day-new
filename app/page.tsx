"use client";

export const dynamic = "force-dynamic"

import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EmailDashboard } from "@/components/EmailDashboard";
import { GmailConnect } from "@/components/GmailConnect";
import { useAuthStore } from "@/lib/auth-store";

// 동적 렌더링 강제 (useSearchParams 사용)
export const dynamic = "force-dynamic";

function HomeContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user, checkAuthStatus, login } = useAuthStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    // URL 파라미터에서 인증 성공 여부 확인
    const authenticated = searchParams.get("authenticated");
    const error = searchParams.get("error");

    const initializeAuth = async () => {
      try {
        // OAuth 콜백 후 쿠키에서 사용자 정보 동기화
        if (authenticated === "true") {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const userData = await response.json();
            login({
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
              accessToken: userData.accessToken,
              expiresAt: userData.expiresAt,
            });
          }
        } else if (error) {
          console.error("Authentication error:", error);
        } else {
          // 일반적인 인증 상태 확인
          await checkAuthStatus();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [searchParams, checkAuthStatus, login]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // ✅ 개발 페이지와 운영 페이지 모두에서 동일한 UI 표시
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      {isAuthenticated && user ? (
        <EmailDashboard />
      ) : (
        <GmailConnect />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

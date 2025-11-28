"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmailDashboard } from "@/components/EmailDashboard";
import { GmailConnect } from "@/components/GmailConnect";
import { useAuthStore } from "@/lib/auth-store";

function HomeContent() {
  const { isAuthenticated, user, login, checkAuthStatus } = useAuthStore();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  // -------------------------------------------------
  // ① 초기 쿠키 기반 로그인 상태 확인
  // -------------------------------------------------
  useEffect(() => {
    const error = searchParams.get("error");

    const initialize = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.authenticated) {
          login({
            email: data.email,
            name: data.name,
            picture: data.picture,
            accessToken: data.accessToken,
            expiresAt: data.expiresAt,
          });
        } else {
          await checkAuthStatus();
        }

        if (error) {
          console.error("Authentication error:", error);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [searchParams, login, checkAuthStatus]);

  // -------------------------------------------------
  // ② 로그인 후 Gmail → Supabase 백업 자동 트리거
  // -------------------------------------------------
  useEffect(() => {
    if (isAuthenticated) {
      console.log("[Home] User authenticated → Triggering Gmail save messages");

      fetch("/api/gmail/save-messages", {
        method: "GET",
        credentials: "include",
      }).catch((err) => {
        console.error("[Home] Failed to save messages:", err);
      });
    }
  }, [isAuthenticated]);

  // -------------------------------------------------
  // Loading 화면
  // -------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // -------------------------------------------------
  // UI 표시 (로그인 여부에 따라)
  // -------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      {isAuthenticated && user ? <EmailDashboard /> : <GmailConnect />}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

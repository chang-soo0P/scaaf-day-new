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

  useEffect(() => {
    const error = searchParams.get("error");

    const initialize = async () => {
      try {
        // 쿠키 기반 사용자 정보 확인
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

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

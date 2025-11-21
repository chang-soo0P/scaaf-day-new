"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmailDashboard } from "@/components/EmailDashboard";
import { GmailConnect } from "@/components/GmailConnect";
import { useAuthStore } from "@/lib/auth-store";

function HomeContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user, checkAuthStatus, login } = useAuthStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");

    const initialize = async () => {
      try {
        // Google OAuth callback 후 쿠키 기반으로 사용자 정보 동기화
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          login({
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            accessToken: userData.accessToken, // cookie 기반 token 동기화
            expiresAt: userData.expiresAt,
          });
        } else {
          await checkAuthStatus();
        }

        if (error) {
          console.error("Authentication error:", error);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [searchParams, checkAuthStatus, login]);

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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

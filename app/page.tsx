"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Figma Make 컴포넌트 import 경로 (이미 ~/Desktop/scaaf-day/components 안에 복사되어 있어야 함) (상대경로('./') 대신 절대경로('@/') 사용)
import { EmailDashboard } from "@/components/EmailDashboard";
import { GmailConnect } from "@/components/GmailConnect";

export default function Home() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  // ✅ 도메인별 리디렉션 로직 유지
  useEffect(() => {
    const host = window.location.hostname;

    if (host === "scaaf.day" || host === "www.scaaf.day") {
      console.log("[HomePage] Production domain detected — redirecting to /login");
      router.replace("/login");
      return;
    }

    console.log("[HomePage] Development environment — redirecting to /onboarding");
    router.replace("/onboarding");
  }, [router]);

  // ✅ Figma Make UI 본문 통합
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      {!isConnected ? (
        <GmailConnect onConnect={() => setIsConnected(true)} />
      ) : (
        <EmailDashboard />
      )}
    </div>
  );
}

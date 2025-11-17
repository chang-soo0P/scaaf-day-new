"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmailDashboard } from "@/components/EmailDashboard";
import { GmailConnect } from "@/components/GmailConnect";

export default function Home() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;

    // 운영 도메인만 /login 리디렉션
    if (host === "scaaf.day" || host === "www.scaaf.day") {
      console.log("[HomePage] Production domain detected — redirecting to /login");
      router.replace("/login");
      return;
    }

    // 개발 환경에서는 현재 페이지 유지
    console.log("[HomePage] Development environment — staying on current page");
  }, [router]);

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

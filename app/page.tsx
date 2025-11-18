"use client";

import { useState } from "react";
import { EmailDashboard } from "@/components/EmailDashboard";
import { GmailConnect } from "@/components/GmailConnect";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  // ✅ 개발 페이지와 운영 페이지 모두에서 동일한 UI 표시
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

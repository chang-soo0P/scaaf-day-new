"use client";

import { GmailConnect } from "@/components/GmailConnect";

export default function LoginPage() {
  async function handleConnect() {
    try {
      // 1) Google 인증 URL 요청
      const res = await fetch("/api/auth/google");
      const data = await res.json();

      if (!data.authUrl) {
        alert("Google 인증 URL을 불러올 수 없습니다.");
        return;
      }

      // 2) Google OAuth 화면으로 이동
      window.location.href = data.authUrl;

    } catch (error) {
      console.error("Google connect error:", error);
      alert("Google 인증을 시작할 수 없습니다.");
    }
  }

  return <GmailConnect onConnect={handleConnect} />;
}

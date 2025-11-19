"use client";

import { GmailConnect } from "@/components/GmailConnect";

export default function LoginPage() {
  async function handleConnect() {
    try {
      // 1) Request Google authentication URL
      const res = await fetch("/api/auth/google");
      const data = await res.json();

      if (!data.authUrl) {
        alert("Could not load Google authentication URL.");
        return;
      }

      // 2) Redirect to Google OAuth screen
      window.location.href = data.authUrl;

    } catch (error) {
      console.error("Google connect error:", error);
      alert("Could not start Google authentication.");
    }
  }

  return <GmailConnect onConnect={handleConnect} />;
}

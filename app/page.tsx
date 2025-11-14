"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const host = window.location.hostname;

    if (host === "scaaf.day" || host === "www.scaaf.day") {
      // ✅ 운영 도메인 → 로그인 페이지로 이동
      console.log("[HomePage] Production domain detected — redirecting to /login");
      router.replace("/login");
      return;
    }

    // ✅ 로컬/프리뷰 환경 → 온보딩으로 이동
    console.log("[HomePage] Development environment — redirecting to /onboarding");
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
      <div className="animate-spin h-8 w-8 border-b-2 border-gray-400 rounded-full mb-3"></div>
      <p>Loading...</p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const host = window.location.hostname;

    // ✅ 운영 도메인에서는 리디렉션 비활성화
    if (host === "scaaf.day" || host === "www.scaaf.day") {
      console.log("[HomePage] Production domain detected — staying on /coming-soon");
      return;
    }

    // ✅ 로컬/프리뷰 환경에서는 온보딩으로 이동 (인증 상태 확인 후)
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

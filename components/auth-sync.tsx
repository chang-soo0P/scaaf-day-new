"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthSync() {
  const { syncAuth } = useAuthStore();

  useEffect(() => {
    // 쿠키에서 인증 정보 동기화
    syncAuth();
  }, [syncAuth]);

  return null;
}


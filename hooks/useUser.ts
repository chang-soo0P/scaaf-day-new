"use client"

import { useUserStore } from "@/lib/user-store"

export function useUser() {
  return useUserStore()
}

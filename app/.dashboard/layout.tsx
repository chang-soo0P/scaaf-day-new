"use client"

import type React from "react"

import { AppLayout } from "@/components/app-layout"
import { ProtectedRoute } from "@/components/auth-guard"
import { AuthSync } from "@/components/auth-sync"
import "../globals.css"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <AuthSync />
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { BottomTabBar } from "./bottom-tab-bar"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed } = useAppStore()

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <TopBar />

          {/* Page content */}
          <main className={cn("flex-1 overflow-auto", "transition-all duration-300")}>
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen bg-gray-50">
        {/* Top bar - simplified for mobile */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Newsletter Agent</h1>
            </div>
          </div>
        </div>

        {/* Page content - with bottom padding for tab bar */}
        <main className="flex-1 overflow-auto pb-16">
          <div className="h-full">{children}</div>
        </main>

        {/* Bottom Tab Bar */}
        <BottomTabBar />
      </div>
    </>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n" // Added i18n hook
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Inbox,
  TrendingUp,
  Settings,
  Filter,
  ChevronLeft,
  Mail,
  Star,
  Archive,
  Trophy,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function Sidebar() {
  const { t } = useI18n() // Added translation function
  const router = useRouter()
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()

  const navigationItems = [
    {
      id: "dashboard" as const,
      label: "오늘의 퀘스트",
      icon: LayoutDashboard,
      description: "Daily missions and overview",
      href: "/dashboard",
    },
    {
      id: "digest" as const,
      label: t("nav.digest"),
      icon: LayoutDashboard,
      badge: "3",
      description: "Daily email summary",
      href: "/dashboard/digest",
    },
    {
      id: "inbox" as const,
      label: t("nav.inbox"),
      icon: Inbox,
      badge: "12",
      description: "All newsletters",
      href: "/dashboard/inbox",
    },
    {
      id: "recommend" as const,
      label: t("nav.recommend"),
      icon: TrendingUp,
      badge: "5",
      description: "Personalized suggestions",
      href: "/dashboard/recommend",
    },
    {
      id: "leaderboard" as const,
      label: "리더보드",
      icon: Trophy,
      description: "Rankings and competitions",
      href: "/leaderboard",
    },
    {
      id: "rules" as const,
      label: t("nav.rules"),
      icon: Filter,
      description: "Automation settings",
      href: "/dashboard/rules",
    },
    {
      id: "settings" as const,
      label: t("nav.settings"),
      icon: Settings,
      description: "App preferences",
      href: "/dashboard/settings",
    },
  ]

  const quickActions = [
    { label: t("filter.starred"), icon: Star, count: 8 },
    { label: "Archived", icon: Archive, count: 24 },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div
      className={cn(
        "hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Newsletter Agent</h1>
              <p className="text-xs text-gray-500">{t("privacy.first")}</p> {/* Added translation */}
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                sidebarCollapsed ? "px-2" : "px-3",
                isActive && "bg-blue-50 text-blue-700 border-blue-200",
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <Icon className={cn("w-4 h-4", sidebarCollapsed ? "" : "mr-3")} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Quick Actions */}
      {!sidebarCollapsed && (
        <div className="p-2 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 px-3">Quick Actions</p>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button key={action.label} variant="ghost" className="w-full justify-start h-8 px-3">
                  <Icon className="w-3 h-3 mr-3" />
                  <span className="flex-1 text-left text-sm">{action.label}</span>
                  <span className="text-xs text-gray-400">{action.count}</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={cn("p-2 border-t border-gray-100", sidebarCollapsed && "px-1")}>
        {!sidebarCollapsed ? (
          <div className="text-xs text-gray-400 px-3">
            <p>Last sync: 2 min ago</p>
            <p className="mt-1">12 newsletters processed</p>
          </div>
        ) : (
          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto"></div>
        )}
      </div>
    </div>
  )
}

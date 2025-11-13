"use client"

import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n" // Added i18n hook
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Inbox, TrendingUp, Settings, Filter } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function BottomTabBar() {
  const { t } = useI18n() // Added translation function
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    {
      id: "dashboard" as const,
      label: "대시보드",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "digest" as const,
      label: t("nav.digest"),
      icon: LayoutDashboard,
      badge: "3",
      href: "/dashboard/digest",
    },
    {
      id: "inbox" as const,
      label: t("nav.inbox"),
      icon: Inbox,
      badge: "12",
      href: "/dashboard/inbox",
    },
    {
      id: "recommend" as const,
      label: t("nav.recommend"),
      icon: TrendingUp,
      badge: "5",
      href: "/dashboard/recommend",
    },
    {
      id: "rules" as const,
      label: t("nav.rules"),
      icon: Filter,
      href: "/dashboard/rules",
    },
    {
      id: "settings" as const,
      label: t("nav.settings"),
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center justify-center h-12 w-16 p-1 relative",
                isActive && "text-blue-600",
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 leading-none">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

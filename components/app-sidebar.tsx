"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart3, Inbox, Lightbulb, Settings, Zap, CreditCard, Shield, Code } from "lucide-react"

const navigation = [
  {
    name: "Digest",
    href: "/digest",
    icon: BarChart3,
    badge: null,
  },
  {
    name: "Inbox",
    href: "/inbox",
    icon: Inbox,
    badge: "12",
  },
  {
    name: "Recommend",
    href: "/recommend",
    icon: Lightbulb,
    badge: null,
  },
  {
    name: "Rules",
    href: "/rules",
    icon: Zap,
    badge: null,
  },
  {
    name: "Pricing",
    href: "/pricing",
    icon: CreditCard,
    badge: null,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    badge: null,
  },
]

const bottomNavigation = [
  {
    name: "Privacy",
    href: "/privacy",
    icon: Shield,
  },
  {
    name: "Dev Playground",
    href: "/dev-playground",
    icon: Code,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Inbox className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Action Inbox</span>
            <span className="text-xs text-muted-foreground">Gmail Agent</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href} className="w-full justify-start">
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-auto">
          <SidebarMenu>
            {bottomNavigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={pathname === item.href} className="w-full justify-start">
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

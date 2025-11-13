// components/PlanBadge.tsx
import { Badge } from "@/components/ui/badge"

interface PlanBadgeProps {
  plan: "free" | "pro" | "team"
}

const planColors = {
  free: "bg-green-100 text-green-800",
  pro: "bg-yellow-100 text-yellow-800",
  team: "bg-blue-100 text-blue-800",
}

const planLabel = {
  free: "Free",
  pro: "Pro",
  team: "Team",
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
  return <Badge className={`rounded-full px-2 py-1 text-xs ${planColors[plan]}`}>{planLabel[plan]}</Badge>
}

export { PlanBadge }

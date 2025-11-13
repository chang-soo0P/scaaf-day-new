"use client"

import type { ReactNode } from "react"
import { useUser } from "@/hooks/useUser"
import LockCard from "./lock-card"

type PlanType = "free" | "pro" | "team"

interface FeatureGateProps {
  requiredPlan: Exclude<PlanType, "free">
  children: ReactNode
  lockMessage?: string
}

const FeatureGate = ({
  requiredPlan,
  children,
  lockMessage = "이 기능은 Pro 플랜에서 사용할 수 있어요.",
}: FeatureGateProps) => {
  const { plan } = useUser()

  const planRank = { free: 0, pro: 1, team: 2 }

  if (planRank[plan] >= planRank[requiredPlan]) {
    return <>{children}</>
  }

  return <LockCard message={lockMessage} />
}

export default FeatureGate
export { FeatureGate }

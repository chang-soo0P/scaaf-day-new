"use client"

import { useState } from "react"
import { BillingManagement } from "@/components/billing-management"
import { UsageTracker } from "@/components/usage-tracker"
import { useRouter } from "next/navigation"

// Mock data - in real app this would come from API/store
const mockBillingInfo = {
  currentPlan: "pro" as const,
  billingCycle: "monthly" as const,
  nextBillingDate: "2024-02-15",
  amount: 5,
  paymentMethod: {
    type: "card" as const,
    last4: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2025,
  },
  invoices: [
    {
      id: "inv_001",
      date: "2024-01-15",
      amount: 5,
      status: "paid" as const,
      downloadUrl: "/api/invoices/inv_001/download",
    },
    {
      id: "inv_002",
      date: "2023-12-15",
      amount: 5,
      status: "paid" as const,
      downloadUrl: "/api/invoices/inv_002/download",
    },
  ],
}

const mockUsageData = {
  emailsProcessed: 1247,
  emailsLimit: 100, // Only relevant for free plan
  rulesUsed: 8,
  rulesLimit: 3, // Only relevant for free plan
  currentPlan: "pro" as const,
  billingPeriodEnd: "2024-02-15",
}

export default function BillingPage() {
  const router = useRouter()
  const [billing] = useState(mockBillingInfo)
  const [usage] = useState(mockUsageData)

  const handleChangePlan = () => {
    router.push("/pricing")
  }

  const handleUpdatePayment = () => {
    // Integrate with payment processor to update payment method
    console.log("Opening payment method update flow")
  }

  const handleCancelSubscription = async () => {
    // API call to cancel subscription
    console.log("Canceling subscription...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Usage</h1>
          <p className="text-gray-600">Manage your subscription and monitor usage</p>
        </div>

        {/* Usage Tracker */}
        <UsageTracker usage={usage} onUpgrade={handleUpgrade} />

        {/* Billing Management */}
        <BillingManagement
          billing={billing}
          onChangePlan={handleChangePlan}
          onUpdatePayment={handleUpdatePayment}
          onCancelSubscription={handleCancelSubscription}
        />
      </div>
    </div>
  )
}

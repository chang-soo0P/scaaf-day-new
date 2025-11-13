"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CreditCard, Calendar, Download, AlertTriangle, CheckCircle } from "lucide-react"

interface BillingInfo {
  currentPlan: "free" | "pro" | "team"
  billingCycle: "monthly" | "yearly"
  nextBillingDate: string
  amount: number
  paymentMethod: {
    type: "card"
    last4: string
    brand: string
    expiryMonth: number
    expiryYear: number
  } | null
  invoices: Array<{
    id: string
    date: string
    amount: number
    status: "paid" | "pending" | "failed"
    downloadUrl: string
  }>
}

interface BillingManagementProps {
  billing: BillingInfo
  onChangePlan: () => void
  onUpdatePayment: () => void
  onCancelSubscription: () => void
}

export function BillingManagement({
  billing,
  onChangePlan,
  onUpdatePayment,
  onCancelSubscription,
}: BillingManagementProps) {
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "pro":
        return "Pro"
      case "team":
        return "Team"
      default:
        return "Free"
    }
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true)
    try {
      await onCancelSubscription()
    } finally {
      setIsLoading(false)
    }
  }

  if (billing.currentPlan === "free") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Billing</span>
          </CardTitle>
          <CardDescription>You're currently on the free plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to Pro or Team to unlock advanced features and unlimited usage.
            </p>
            <Button onClick={onChangePlan}>View Pricing Plans</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Current Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">{getPlanName(billing.currentPlan)} Plan</p>
                <p className="text-sm text-green-700">
                  {formatAmount(billing.amount)} {billing.billingCycle}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next billing date</p>
              <p className="text-lg font-semibold">{formatDate(billing.nextBillingDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Billing cycle</p>
              <p className="text-lg font-semibold capitalize">{billing.billingCycle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onChangePlan}>
              Change Plan
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Cancel Subscription</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your subscription? You'll lose access to Pro features at the end of
                    your current billing period ({formatDate(billing.nextBillingDate)}).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelSubscription}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? "Canceling..." : "Cancel Subscription"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      {billing.paymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {billing.paymentMethod.brand.toUpperCase()} •••• {billing.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {billing.paymentMethod.expiryMonth}/{billing.paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onUpdatePayment}>
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download your invoices and view payment history</CardDescription>
        </CardHeader>
        <CardContent>
          {billing.invoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {billing.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{formatDate(invoice.date)}</p>
                      <p className="text-sm text-muted-foreground">{formatAmount(invoice.amount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "secondary"
                          : invoice.status === "pending"
                            ? "default"
                            : "destructive"
                      }
                      className={
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={invoice.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

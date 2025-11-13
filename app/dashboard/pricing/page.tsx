"use client"

import { useState } from "react"
import { PricingCards } from "@/components/pricing-cards"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Zap, Users } from "lucide-react"

export default function PricingPage() {
  const [currentPlan] = useState("free") // This would come from user context/store

  const handleSelectPlan = (planId: string, isYearly: boolean) => {
    console.log(`Selected plan: ${planId}, yearly: ${isYearly}`)

    if (planId === "free") {
      // Already on free plan or downgrading
      return
    }

    if (planId === "team") {
      // Contact sales flow
      window.open("mailto:sales@actioninbox.com?subject=Team Plan Inquiry", "_blank")
      return
    }

    // For Pro plan, redirect to payment processor
    const amount = isYearly ? 50 : 5
    const interval = isYearly ? "year" : "month"

    // This would integrate with Lemon Squeezy or Stripe
    console.log(`Redirecting to payment for $${amount}/${interval}`)

    // Example Lemon Squeezy integration:
    // window.open(`https://actioninbox.lemonsqueezy.com/checkout/buy/pro-${interval}`, "_blank")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core email automation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <PricingCards currentPlan={currentPlan} onSelectPlan={handleSelectPlan} />

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                Your emails are processed securely and never stored permanently on our servers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">14-Day Free Trial</h3>
              <p className="text-sm text-muted-foreground">
                Try Pro features risk-free. No credit card required to start.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Cancel Anytime</h3>
              <p className="text-sm text-muted-foreground">
                No long-term contracts. Cancel or change your plan anytime.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How does the free trial work?</h3>
              <p className="text-muted-foreground">
                Start with a 14-day free trial of Pro features. No credit card required. After the trial, you can choose
                to upgrade or continue with the free plan.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What happens to my data if I cancel?</h3>
              <p className="text-muted-foreground">
                You can export all your data anytime. After cancellation, your data is retained for 30 days in case you
                want to reactivate, then permanently deleted.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the
                next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied with
                your purchase.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who have automated their email workflow with Action Inbox.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              No setup fees
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Cancel anytime
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              30-day guarantee
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

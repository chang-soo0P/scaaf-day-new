"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Zap, Users, Crown, Sparkles } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  limitations?: string[]
  popular?: boolean
  icon: React.ComponentType<{ className?: string }>
  buttonText: string
  buttonVariant: "default" | "outline" | "secondary"
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started with email automation",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Process up to 100 emails/month",
      "Basic action extraction",
      "3 automation rules",
      "Daily digest",
      "Email support",
    ],
    limitations: ["Limited to 100 emails/month", "Basic AI processing only", "No advanced analytics"],
    icon: Sparkles,
    buttonText: "Get Started Free",
    buttonVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For power users who want advanced automation",
    price: { monthly: 5, yearly: 50 },
    features: [
      "Process unlimited emails",
      "Advanced AI action extraction",
      "Unlimited automation rules",
      "Smart batching & scheduling",
      "Calendar integration",
      "Advanced analytics",
      "Priority support",
      "Custom rule templates",
    ],
    popular: true,
    icon: Zap,
    buttonText: "Start Free Trial",
    buttonVariant: "default",
  },
  {
    id: "team",
    name: "Team",
    description: "For teams that need collaboration and advanced features",
    price: { monthly: 20, yearly: 200 },
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared rule templates",
      "Team analytics dashboard",
      "Advanced integrations",
      "Custom AI training",
      "Dedicated support",
      "SSO integration",
      "API access",
    ],
    icon: Users,
    buttonText: "Contact Sales",
    buttonVariant: "secondary",
  },
]

interface PricingCardsProps {
  currentPlan?: string
  onSelectPlan: (planId: string, isYearly: boolean) => void
}

export function PricingCards({ currentPlan = "free", onSelectPlan }: PricingCardsProps) {
  const [isYearly, setIsYearly] = useState(false)

  const formatPrice = (price: number) => {
    if (price === 0) return "Free"
    return `$${price}${isYearly ? "/year" : "/month"}`
  }

  const getSavings = (plan: PricingPlan) => {
    if (plan.price.monthly === 0) return null
    const monthlyCost = plan.price.monthly * 12
    const yearlyCost = plan.price.yearly
    const savings = Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100)
    return savings > 0 ? `Save ${savings}%` : null
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-toggle" className={!isYearly ? "font-medium" : "text-muted-foreground"}>
          Monthly
        </Label>
        <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
        <Label htmlFor="billing-toggle" className={isYearly ? "font-medium" : "text-muted-foreground"}>
          Yearly
        </Label>
        {isYearly && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Save up to 17%
          </Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const IconComponent = plan.icon
          const isCurrentPlan = currentPlan === plan.id
          const savings = getSavings(plan)

          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 ${
                plan.popular
                  ? "ring-2 ring-blue-500 shadow-lg scale-105"
                  : isCurrentPlan
                    ? "ring-2 ring-green-500"
                    : "hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.popular
                        ? "bg-blue-100 text-blue-600"
                        : plan.id === "team"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">
                      {isYearly ? formatPrice(plan.price.yearly) : formatPrice(plan.price.monthly)}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-muted-foreground ml-1">{isYearly ? "/year" : "/month"}</span>
                    )}
                  </div>
                  {isYearly && savings && (
                    <Badge variant="outline" className="mt-2 text-green-600 border-green-200">
                      {savings}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations for free plan */}
                {plan.limitations && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto mt-1.5"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={plan.buttonVariant}
                  onClick={() => onSelectPlan(plan.id, isYearly)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : plan.buttonText}
                </Button>

                {plan.id === "pro" && (
                  <p className="text-xs text-center text-muted-foreground">
                    14-day free trial • No credit card required
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Feature Comparison */}
      <div className="mt-16">
        <h3 className="text-xl font-semibold text-center mb-8">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4">Features</th>
                <th className="text-center py-4 px-4">Free</th>
                <th className="text-center py-4 px-4">Pro</th>
                <th className="text-center py-4 px-4">Team</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-3 px-4">Monthly email processing</td>
                <td className="text-center py-3 px-4">100</td>
                <td className="text-center py-3 px-4">Unlimited</td>
                <td className="text-center py-3 px-4">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Automation rules</td>
                <td className="text-center py-3 px-4">3</td>
                <td className="text-center py-3 px-4">Unlimited</td>
                <td className="text-center py-3 px-4">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">AI processing</td>
                <td className="text-center py-3 px-4">Basic</td>
                <td className="text-center py-3 px-4">Advanced</td>
                <td className="text-center py-3 px-4">Custom</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Team collaboration</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">API access</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">-</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

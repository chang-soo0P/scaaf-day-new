"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrivacyDashboard } from "@/components/privacy-dashboard"
import { Shield, Database, UserCheck, Trash2, Check, X, ArrowRight } from "lucide-react"
import Link from "next/link"

const privacyFeatures = [
  {
    icon: Database,
    title: "Minimal data",
    description:
      "We only collect what's absolutely necessary to provide our service. No unnecessary tracking or profiling.",
    color: "text-blue-600",
  },
  {
    icon: Shield,
    title: "No raw bodies by default",
    description: "Your original email content stays on your device. We process locally and store only summaries.",
    color: "text-green-600",
  },
  {
    icon: UserCheck,
    title: "Clear consent",
    description: "Every data collection is transparent with clear explanations of why we need it and how it's used.",
    color: "text-purple-600",
  },
  {
    icon: Trash2,
    title: "Delete anytime",
    description: "Complete control over your data. Export or permanently delete everything with a single click.",
    color: "text-red-600",
  },
]

const dataTable = [
  { item: "Email summaries (AI-generated)", stored: true, description: "3-line summaries for quick overview" },
  { item: "Action items (deadlines, events)", stored: true, description: "Extracted tasks and calendar events" },
  { item: "Your preferences & settings", stored: true, description: "Digest schedule, topics, notifications" },
  { item: "Usage analytics (anonymized)", stored: true, description: "Feature usage to improve the product" },
  { item: "Raw email content", stored: false, description: "Original email bodies never leave your device" },
  { item: "Email attachments", stored: false, description: "Files and images are not processed or stored" },
  {
    item: "Personal identifiers in content",
    stored: false,
    description: "Names, addresses, phone numbers filtered out",
  },
  { item: "Email metadata (headers)", stored: false, description: "Routing info processed locally only" },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Privacy-first by design
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your data stays <span className="text-blue-600">yours</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We built Gmail Newsletter Agent with privacy as the foundation, not an afterthought. Here's exactly how we
            protect your information.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Privacy Overview</TabsTrigger>
            <TabsTrigger value="dashboard">Privacy Dashboard</TabsTrigger>
            <TabsTrigger value="data-table">Data Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-16">
            {/* Privacy Features Cards */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Privacy principles that guide everything we build
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {privacyFeatures.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 ${feature.color}`}
                      >
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
              <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="py-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Take control of your data</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Review your privacy settings, export your data, or delete everything. You have complete control over
                    your information.
                  </p>
                  <Link href="/settings#data">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Manage your data
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="dashboard">
            <PrivacyDashboard />
          </TabsContent>

          <TabsContent value="data-table" className="space-y-8">
            {/* Data Storage Table */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What we store vs. what we don't</h2>
                <p className="text-gray-600">
                  Complete transparency about data handling with our privacy-first approach
                </p>
              </div>

              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Data Type</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-900 w-24">Stored</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dataTable.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50/50">
                          <td className="py-4 px-6 font-medium text-gray-900">{row.item}</td>
                          <td className="py-4 px-6 text-center">
                            {row.stored ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                <Check className="w-3 h-3 mr-1" />
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                                <X className="w-3 h-3 mr-1" />
                                No
                              </Badge>
                            )}
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Additional Info */}
        <section className="text-center text-sm text-gray-500 border-t pt-8 mt-16">
          <p>
            Questions about our privacy practices? Contact us at{" "}
            <a href="mailto:privacy@example.com" className="text-blue-600 hover:underline">
              privacy@example.com
            </a>
          </p>
          <p className="mt-2">Last updated: January 15, 2024</p>
        </section>
      </div>
    </div>
  )
}

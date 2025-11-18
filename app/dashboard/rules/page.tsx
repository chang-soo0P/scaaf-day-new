"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Filter, Zap, Clock, Edit, Trash2, Tag, FolderOpen, Eye, Star } from "lucide-react"
import { RuleBuilderModal } from "@/components/rule-builder-modal"
import { RuleTestArea } from "@/components/rule-test-area"
import { RuleTemplates } from "@/components/rule-templates"
import { RuleAnalytics } from "@/components/rule-analytics"
import { useUserStore } from "@/lib/user-store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Rule {
  id: string
  name: string
  condition: {
    field: "sender" | "domain" | "subject" | "body" | "header"
    operator: "contains" | "equals" | "includes" | "has"
    value: string
  }
  action: {
    type: "label" | "move_to_newsletters" | "snooze_batch" | "mark_read" | "star"
    value?: string
    time?: string
  }
  enabled: boolean
  created: string
  matchCount: number
}

const mockRules: Rule[] = [
  {
    id: "1",
    name: "Auto-categorize Tech Newsletters",
    condition: { field: "header", operator: "has", value: "List-Unsubscribe" },
    action: { type: "move_to_newsletters" },
    enabled: true,
    created: "2024-01-15",
    matchCount: 23,
  },
  {
    id: "2",
    name: "Label Design Updates",
    condition: { field: "subject", operator: "contains", value: "design" },
    action: { type: "label", value: "design" },
    enabled: true,
    created: "2024-01-14",
    matchCount: 12,
  },
  {
    id: "3",
    name: "Batch Morning Newsletters",
    condition: { field: "domain", operator: "equals", value: "morning-brew.com" },
    action: { type: "snooze_batch", time: "09:00" },
    enabled: false,
    created: "2024-01-13",
    matchCount: 7,
  },
]

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(mockRules)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | undefined>()
  const [selectedRuleForTest, setSelectedRuleForTest] = useState<Rule | undefined>()
  const { plan, ruleCount, incrementRuleCount, decrementRuleCount } = useUserStore()
  const router = useRouter()

  const handleSaveRule = (ruleData: any) => {
    if (!ruleData.id && plan === "free" && ruleCount >= 1) {
      toast.error("Free plan is limited to 1 rule. Upgrade to Pro for unlimited rules.")
      return
    }

    if (ruleData.id) {
      // Edit existing rule
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === ruleData.id ? { ...rule, ...ruleData, matchCount: Math.floor(Math.random() * 30) + 1 } : rule,
        ),
      )
    } else {
      // Create new rule
      const newRule: Rule = {
        ...ruleData,
        id: Date.now().toString(),
        created: new Date().toISOString().split("T")[0],
        matchCount: Math.floor(Math.random() * 30) + 1,
      }
      setRules((prev) => [...prev, newRule])
      incrementRuleCount()
    }
    setEditingRule(undefined)
  }

  const handleApplyTemplate = (template: any) => {
    const newRule: Rule = {
      id: Date.now().toString(),
      name: template.name,
      condition: template.condition,
      action: template.action,
      enabled: true,
      created: new Date().toISOString().split("T")[0],
      matchCount: Math.floor(Math.random() * 30) + 1,
    }
    setRules((prev) => [...prev, newRule])
    incrementRuleCount()
  }

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id))
    decrementRuleCount()
    if (selectedRuleForTest?.id === id) {
      setSelectedRuleForTest(undefined)
    }
  }

  const editRule = (rule: Rule) => {
    setEditingRule(rule)
    setIsModalOpen(true)
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "label":
        return Tag
      case "move_to_newsletters":
        return FolderOpen
      case "snooze_batch":
        return Clock
      case "mark_read":
        return Eye
      case "star":
        return Star
      default:
        return Filter
    }
  }

  const getActionDescription = (action: Rule["action"]) => {
    switch (action.type) {
      case "label":
        return `Apply label "${action.value}"`
      case "move_to_newsletters":
        return "Move to Newsletters tab"
      case "snooze_batch":
        return `Batch delivery at ${action.time}`
      case "mark_read":
        return "Mark as read"
      case "star":
        return "Add star"
      default:
        return action.type
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Automation Rules</h1>
            <p className="text-gray-600">Create IF-THEN rules to automatically organize your newsletters</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} disabled={plan === "free" && ruleCount >= 1}>
            <Plus className="w-4 h-4 mr-2" />
            New Rule
          </Button>
        </div>

        {plan === "free" && ruleCount >= 1 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Crown className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Free plan is limited to 1 rule.
              <Button
                variant="link"
                className="p-0 ml-1 text-yellow-800 underline"
                onClick={() => router.push("/pricing")}
              >
                Upgrade to Pro for unlimited rules.
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Rules</p>
                  <p className="text-xl font-semibold">{rules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Rules</p>
                  <p className="text-xl font-semibold">{rules.filter((r) => r.enabled).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Processed Today</p>
                  <p className="text-xl font-semibold">42</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Emails Affected</p>
                  <p className="text-xl font-semibold">{rules.reduce((sum, rule) => sum + rule.matchCount, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rules">My Rules</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="test">Test Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rules ({rules.length})</CardTitle>
                <CardDescription>Manage your automation rules</CardDescription>
              </CardHeader>
              <CardContent>
                {rules.length === 0 ? (
                  <div className="text-center py-8">
                    <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No rules created yet</h3>
                    <p className="text-gray-600 mb-4">Create your first automation rule to get started.</p>
                    <Button onClick={() => setIsModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Rule
                    </Button>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {rules.map((rule) => {
                      const ActionIcon = getActionIcon(rule.action.type)
                      return (
                        <AccordionItem key={rule.id} value={rule.id} className="border rounded-lg">
                          <AccordionTrigger
                            className="px-4 py-3 hover:no-underline"
                            onClick={() => setSelectedRuleForTest(rule)}
                          >
                            <div className="flex items-center justify-between w-full mr-4">
                              <div className="flex items-center space-x-3">
                                <Switch
                                  checked={rule.enabled}
                                  onCheckedChange={() => toggleRule(rule.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="text-left">
                                  <p className="font-medium">{rule.name}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Badge variant="outline" className="text-xs">
                                      {rule.condition.field} {rule.condition.operator} "{rule.condition.value}"
                                    </Badge>
                                    <span>→</span>
                                    <Badge variant="secondary" className="text-xs">
                                      <ActionIcon className="w-3 h-3 mr-1" />
                                      {getActionDescription(rule.action)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={rule.enabled ? "default" : "secondary"} className="text-xs">
                                  {rule.matchCount} matches
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3">
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="text-sm text-gray-600">
                                <p>Created: {new Date(rule.created).toLocaleDateString()}</p>
                                <p>Would affect {rule.matchCount} emails from last 30 days</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => editRule(rule)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <RuleTemplates onApplyTemplate={handleApplyTemplate} />
          </TabsContent>

          <TabsContent value="analytics">
            <RuleAnalytics />
          </TabsContent>

          <TabsContent value="test">
            <RuleTestArea selectedRule={selectedRuleForTest} />
          </TabsContent>
        </Tabs>

        {/* Rule Builder Modal */}
        <RuleBuilderModal open={isModalOpen} onOpenChange={setIsModalOpen} onSave={handleSaveRule} rule={editingRule} />
      </div>
    </div>
  )
}

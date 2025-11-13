"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Clock, Tag, FolderOpen, Star, Eye, Filter } from "lucide-react"

interface RuleTemplate {
  id: string
  name: string
  description: string
  category: "organization" | "productivity" | "privacy"
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
  popularity: number
}

const ruleTemplates: RuleTemplate[] = [
  {
    id: "newsletter-auto",
    name: "Auto-categorize Newsletters",
    description: "Automatically move emails with unsubscribe headers to newsletters tab",
    category: "organization",
    condition: { field: "header", operator: "has", value: "List-Unsubscribe" },
    action: { type: "move_to_newsletters" },
    popularity: 95,
  },
  {
    id: "morning-batch",
    name: "Morning Newsletter Batch",
    description: "Batch all newsletter deliveries for 9 AM reading",
    category: "productivity",
    condition: { field: "header", operator: "has", value: "List-Unsubscribe" },
    action: { type: "snooze_batch", time: "09:00" },
    popularity: 87,
  },
  {
    id: "tech-label",
    name: "Label Tech Content",
    description: "Automatically label emails containing tech keywords",
    category: "organization",
    condition: { field: "subject", operator: "contains", value: "tech" },
    action: { type: "label", value: "tech" },
    popularity: 73,
  },
  {
    id: "promo-read",
    name: "Auto-read Promotions",
    description: "Mark promotional emails as read to reduce clutter",
    category: "productivity",
    condition: { field: "subject", operator: "contains", value: "sale" },
    action: { type: "mark_read" },
    popularity: 68,
  },
  {
    id: "important-star",
    name: "Star Important Senders",
    description: "Automatically star emails from important domains",
    category: "productivity",
    condition: { field: "domain", operator: "equals", value: "company.com" },
    action: { type: "star" },
    popularity: 82,
  },
  {
    id: "design-label",
    name: "Label Design Content",
    description: "Organize design-related newsletters and updates",
    category: "organization",
    condition: { field: "subject", operator: "contains", value: "design" },
    action: { type: "label", value: "design" },
    popularity: 61,
  },
]

interface RuleTemplatesProps {
  onApplyTemplate: (template: RuleTemplate) => void
}

export function RuleTemplates({ onApplyTemplate }: RuleTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredTemplates = ruleTemplates.filter(
    (template) => selectedCategory === "all" || template.category === selectedCategory,
  )

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "organization":
        return "bg-blue-100 text-blue-800"
      case "productivity":
        return "bg-green-100 text-green-800"
      case "privacy":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <CardTitle>Rule Templates</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "organization" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("organization")}
            >
              Organization
            </Button>
            <Button
              variant={selectedCategory === "productivity" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("productivity")}
            >
              Productivity
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {filteredTemplates.map((template) => {
            const ActionIcon = getActionIcon(template.action.type)
            return (
              <div key={template.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {template.popularity}% use this
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>
                        IF {template.condition.field} {template.condition.operator} "{template.condition.value}"
                      </span>
                      <span>→</span>
                      <div className="flex items-center space-x-1">
                        <ActionIcon className="w-3 h-3" />
                        <span>
                          {template.action.type === "label" && `Label: ${template.action.value}`}
                          {template.action.type === "move_to_newsletters" && "Move to newsletters"}
                          {template.action.type === "snooze_batch" && `Batch at ${template.action.time}`}
                          {template.action.type === "mark_read" && "Mark as read"}
                          {template.action.type === "star" && "Add star"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onApplyTemplate(template)}>
                    Use Template
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

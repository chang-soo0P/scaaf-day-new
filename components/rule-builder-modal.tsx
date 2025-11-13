"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Star, Tag, FolderOpen, Eye } from "lucide-react"

interface RuleCondition {
  field: "sender" | "domain" | "subject" | "body" | "header"
  operator: "contains" | "equals" | "includes" | "has"
  value: string
}

interface RuleAction {
  type: "label" | "move_to_newsletters" | "snooze_batch" | "mark_read" | "star"
  value?: string
  time?: string
}

interface Rule {
  id?: string
  name: string
  condition: RuleCondition
  action: RuleAction
  enabled: boolean
}

interface RuleBuilderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (rule: Rule) => void
  rule?: Rule
}

export function RuleBuilderModal({ open, onOpenChange, onSave, rule }: RuleBuilderModalProps) {
  const [formData, setFormData] = useState<Rule>({
    name: rule?.name || "",
    condition: rule?.condition || { field: "sender", operator: "contains", value: "" },
    action: rule?.action || { type: "label", value: "" },
    enabled: rule?.enabled ?? true,
  })

  const [previewCount, setPreviewCount] = useState<number | null>(null)

  const handleConditionChange = (field: keyof RuleCondition, value: string) => {
    setFormData((prev) => ({
      ...prev,
      condition: { ...prev.condition, [field]: value },
    }))
    // Simulate preview count calculation
    if (field === "value" && value) {
      setTimeout(() => setPreviewCount(Math.floor(Math.random() * 50) + 1), 500)
    }
  }

  const handleActionChange = (field: keyof RuleAction, value: string) => {
    setFormData((prev) => ({
      ...prev,
      action: { ...prev.action, [field]: value },
    }))
  }

  const handleSave = () => {
    if (formData.name && formData.condition.value) {
      onSave({ ...formData, id: rule?.id })
      onOpenChange(false)
      // Reset form
      setFormData({
        name: "",
        condition: { field: "sender", operator: "contains", value: "" },
        action: { type: "label", value: "" },
        enabled: true,
      })
      setPreviewCount(null)
    }
  }

  const getOperatorOptions = (field: string) => {
    switch (field) {
      case "domain":
        return [{ value: "equals", label: "equals" }]
      case "header":
        return [{ value: "has", label: "has" }]
      default:
        return [
          { value: "contains", label: "contains" },
          { value: "includes", label: "includes" },
        ]
    }
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
        return Tag
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Rule" : "Create New Rule"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rule Name */}
          <div className="space-y-2">
            <Label htmlFor="ruleName">Rule Name</Label>
            <Input
              id="ruleName"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Auto-label tech newsletters"
            />
          </div>

          {/* IF Condition */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                IF
              </Badge>
              <span className="text-sm text-gray-600">When email matches this condition:</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Field</Label>
                <Select
                  value={formData.condition.field}
                  onValueChange={(value) => handleConditionChange("field", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sender">Sender</SelectItem>
                    <SelectItem value="domain">Domain</SelectItem>
                    <SelectItem value="subject">Subject</SelectItem>
                    <SelectItem value="body">Body</SelectItem>
                    <SelectItem value="header">Header</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Operator</Label>
                <Select
                  value={formData.condition.operator}
                  onValueChange={(value) => handleConditionChange("operator", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperatorOptions(formData.condition.field).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={formData.condition.value}
                  onChange={(e) => handleConditionChange("value", e.target.value)}
                  placeholder={
                    formData.condition.field === "header"
                      ? "List-Unsubscribe"
                      : formData.condition.field === "domain"
                        ? "example.com"
                        : "Enter value"
                  }
                />
              </div>
            </div>

            {/* Preview Count */}
            {previewCount !== null && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <p className="text-sm text-blue-700">
                    📊 This rule would affect <strong>{previewCount} emails</strong> from the last 30 days
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* THEN Action */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                THEN
              </Badge>
              <span className="text-sm text-gray-600">Perform this action:</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={formData.action.type} onValueChange={(value) => handleActionChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="label">Apply label</SelectItem>
                    <SelectItem value="move_to_newsletters">Move to Newsletters tab</SelectItem>
                    <SelectItem value="snooze_batch">Snooze to batch delivery</SelectItem>
                    <SelectItem value="mark_read">Mark as read</SelectItem>
                    <SelectItem value="star">Add star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.action.type === "label" && (
                <div className="space-y-2">
                  <Label>Label Name</Label>
                  <Input
                    value={formData.action.value || ""}
                    onChange={(e) => handleActionChange("value", e.target.value)}
                    placeholder="e.g., newsletters"
                  />
                </div>
              )}

              {formData.action.type === "snooze_batch" && (
                <div className="space-y-2">
                  <Label>Delivery Time</Label>
                  <Input
                    type="time"
                    value={formData.action.time || "09:00"}
                    onChange={(e) => handleActionChange("time", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Action Preview */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  {(() => {
                    const ActionIcon = getActionIcon(formData.action.type)
                    return <ActionIcon className="w-4 h-4 text-green-600" />
                  })()}
                  <span className="text-sm text-green-700">
                    {formData.action.type === "label" &&
                      formData.action.value &&
                      `Will apply label "${formData.action.value}"`}
                    {formData.action.type === "move_to_newsletters" && "Will move emails to Newsletters tab"}
                    {formData.action.type === "snooze_batch" &&
                      `Will deliver in batch at ${formData.action.time || "09:00"}`}
                    {formData.action.type === "mark_read" && "Will mark emails as read"}
                    {formData.action.type === "star" && "Will add star to emails"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name || !formData.condition.value}>
            {rule ? "Update Rule" : "Create Rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

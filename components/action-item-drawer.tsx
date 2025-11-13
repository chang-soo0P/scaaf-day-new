"use client"

import type React from "react"

import { useState } from "react"
import type { ActionItem } from "@/lib/types"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ExternalLink, Copy } from "lucide-react"

interface ActionItemDrawerProps {
  action: ActionItem
  children: React.ReactNode
}

export function ActionItemDrawer({ action, children }: ActionItemDrawerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getActionIcon = (type: ActionItem["type"]) => {
    switch (type) {
      case "deadline":
        return <Clock className="w-4 h-4" />
      case "rsvp":
        return <Calendar className="w-4 h-4" />
      case "location":
        return <MapPin className="w-4 h-4" />
      case "link":
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const getActionColor = (type: ActionItem["type"]) => {
    switch (type) {
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200"
      case "rsvp":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "location":
        return "bg-green-100 text-green-800 border-green-200"
      case "link":
        return "bg-purple-100 text-purple-800 border-purple-200"
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              {getActionIcon(action.type)}
              {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
            </DrawerTitle>
            <DrawerDescription>Action item details</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            <div className="space-y-4">
              <div>
                <Badge className={getActionColor(action.type)}>{action.type}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600">{action.text}</p>
              </div>

              {action.deadline && (
                <div>
                  <h4 className="font-medium mb-2">Deadline</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(action.deadline).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {action.location && (
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-sm text-gray-600">{action.location}</p>
                </div>
              )}

              {action.url && (
                <div>
                  <h4 className="font-medium mb-2">Link</h4>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(action.url, "_blank")}>
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(action.url!)}>
                      <Copy className="w-3 h-3 mr-1" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

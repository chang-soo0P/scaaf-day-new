"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, Tag, Bookmark, X, ChevronDown } from "lucide-react"

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onSnooze: () => void
  onAddLabel: () => void
  onSaveForLater: () => void
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onSnooze,
  onAddLabel,
  onSaveForLater,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} selected
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSnooze}>
            <Clock className="w-4 h-4 mr-2" />
            Snooze to batch delivery
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="w-4 h-4 mr-2" />
                Add label
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onAddLabel}>
                <Tag className="w-4 h-4 mr-2" />
                Work
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddLabel}>
                <Tag className="w-4 h-4 mr-2" />
                Personal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddLabel}>
                <Tag className="w-4 h-4 mr-2" />
                Important
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddLabel}>
                <Tag className="w-4 h-4 mr-2" />
                Follow up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={onSaveForLater}>
            <Bookmark className="w-4 h-4 mr-2" />
            Save for later
          </Button>
        </div>
      </div>
    </div>
  )
}

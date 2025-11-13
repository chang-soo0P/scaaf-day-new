"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ActionExtractionPanel } from "./action-extraction-panel"
import { Zap } from "lucide-react"

interface MobileActionSheetProps {
  actionItems: any[]
  extractedEvents: any[]
}

export function MobileActionSheet({ actionItems, extractedEvents }: MobileActionSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-20 right-4 z-50 shadow-lg bg-white border-2 border-blue-200"
          >
            <Zap className="w-4 h-4 mr-2" />
            Actions
            {actionItems.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {actionItems.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Action Extraction</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <ActionExtractionPanel actionItems={actionItems} extractedEvents={extractedEvents} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

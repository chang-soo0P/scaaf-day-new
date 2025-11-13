"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react"

interface ExtractionFeedbackBarProps {
  extractionReasons: {
    type: string
    method: string
    pattern: string
    confidence: number
  }[]
}

export function ExtractionFeedbackBar({ extractionReasons }: ExtractionFeedbackBarProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type)
    // Here you would typically send feedback to your analytics/ML pipeline
    console.log(`Feedback: ${type} for extraction`)
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <HelpCircle className="w-4 h-4 mr-2" />
                Why this was extracted
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm">
              <div className="space-y-2">
                <p className="font-medium">Extraction Methods:</p>
                {extractionReasons.map((reason, index) => (
                  <div key={index} className="text-xs">
                    <span className="font-medium">{reason.type}:</span>{" "}
                    <span className="text-gray-600">{reason.method}</span>
                    <br />
                    <span className="text-gray-500">Pattern: {reason.pattern}</span>
                    <br />
                    <span className="text-gray-500">Confidence: {(reason.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Improve extraction:</span>
        <Button
          variant={feedback === "up" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFeedback("up")}
          className="text-green-600 hover:text-green-700"
        >
          <ThumbsUp className="w-4 h-4" />
        </Button>
        <Button
          variant={feedback === "down" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFeedback("down")}
          className="text-red-600 hover:text-red-700"
        >
          <ThumbsDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Calendar as CalendarIconLucide } from "lucide-react"
import { format, subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"

export type DateRange = {
  from: Date
  to: Date
  label: string
}

interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange) => void
  isLoading?: boolean
}

const predefinedRanges = [
  {
    label: "오늘",
    getRange: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
      label: "오늘"
    })
  },
  {
    label: "일주일",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date()),
      label: "최근 일주일"
    })
  },
  {
    label: "한달",
    getRange: () => ({
      from: startOfDay(subMonths(new Date(), 1)),
      to: endOfDay(new Date()),
      label: "최근 한달"
    })
  },
  {
    label: "일년",
    getRange: () => ({
      from: startOfDay(subYears(new Date(), 1)),
      to: endOfDay(new Date()),
      label: "최근 일년"
    })
  }
]

export function DateRangePicker({ onDateRangeChange, isLoading = false }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null)
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({})

  const handlePredefinedRange = (range: DateRange) => {
    setSelectedRange(range)
    onDateRangeChange(range)
  }

  const handleCustomRange = () => {
    if (customRange.from && customRange.to) {
      const range: DateRange = {
        from: startOfDay(customRange.from),
        to: endOfDay(customRange.to),
        label: `${format(customRange.from, 'MM/dd', { locale: ko })} - ${format(customRange.to, 'MM/dd', { locale: ko })}`
      }
      setSelectedRange(range)
      onDateRangeChange(range)
      setIsCustomOpen(false)
    }
  }

  const formatDateRange = (range: DateRange) => {
    return `${format(range.from, 'MM/dd', { locale: ko })} - ${format(range.to, 'MM/dd', { locale: ko })}`
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIconLucide className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">기간 선택</h3>
            {selectedRange && (
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {selectedRange.label}
              </Badge>
            )}
          </div>

          {/* Predefined Ranges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {predefinedRanges.map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => handlePredefinedRange(range.getRange())}
                disabled={isLoading}
                className={cn(
                  "justify-start",
                  selectedRange?.label === range.label && "bg-blue-50 border-blue-200 text-blue-700"
                )}
              >
                <Clock className="w-3 h-3 mr-2" />
                {range.label}
              </Button>
            ))}
          </div>

          {/* Custom Range */}
          <div className="flex items-center gap-2">
            <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="justify-start"
                >
                  <CalendarIcon className="w-3 h-3 mr-2" />
                  기간 설정
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">시작일</h4>
                    <Calendar
                      mode="single"
                      selected={customRange.from}
                      onSelect={(date) => setCustomRange(prev => ({ ...prev, from: date }))}
                      disabled={(date) => date > new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">종료일</h4>
                    <Calendar
                      mode="single"
                      selected={customRange.to}
                      onSelect={(date) => setCustomRange(prev => ({ ...prev, to: date }))}
                      disabled={(date) => date > new Date() || (customRange.from && date < customRange.from)}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCustomRange}
                      disabled={!customRange.from || !customRange.to}
                      className="flex-1"
                    >
                      적용
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsCustomOpen(false)}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {selectedRange && (
              <div className="text-sm text-gray-600">
                {formatDateRange(selectedRange)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

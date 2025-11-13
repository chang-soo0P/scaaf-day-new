"use client"

import { useState, useEffect } from "react"

interface DailyLimitReturn {
  currentCount: number
  maxCount: number
  isAtLimit: boolean
  remainingCount: number
  canProcess: () => boolean
  incrementCount: () => void
  resetDailyCount: () => void
}

export function useDailyLimit(maxCount: number = 3): DailyLimitReturn {
  const [currentCount, setCurrentCount] = useState(0)

  // Load daily count from localStorage
  useEffect(() => {
    const today = new Date().toDateString()
    const savedData = localStorage.getItem('daily-digest-count')
    
    if (savedData) {
      try {
        const { date, count } = JSON.parse(savedData)
        if (date === today) {
          setCurrentCount(count)
        } else {
          // Reset if it's a new day
          setCurrentCount(0)
          localStorage.setItem('daily-digest-count', JSON.stringify({ date: today, count: 0 }))
        }
      } catch (error) {
        console.error('Failed to load daily count:', error)
        setCurrentCount(0)
      }
    }
  }, [])

  const canProcess = () => {
    return currentCount < maxCount
  }

  const incrementCount = () => {
    const newCount = currentCount + 1
    setCurrentCount(newCount)
    
    const today = new Date().toDateString()
    localStorage.setItem('daily-digest-count', JSON.stringify({ 
      date: today, 
      count: newCount 
    }))
  }

  const resetDailyCount = () => {
    setCurrentCount(0)
    const today = new Date().toDateString()
    localStorage.setItem('daily-digest-count', JSON.stringify({ 
      date: today, 
      count: 0 
    }))
  }

  return {
    currentCount,
    maxCount,
    isAtLimit: currentCount >= maxCount,
    remainingCount: maxCount - currentCount,
    canProcess,
    incrementCount,
    resetDailyCount
  }
}

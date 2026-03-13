'use client'

import { useState, useCallback } from 'react'

export function useSlotSelection() {
  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<string>>(new Set())

  const toggleSlot = useCallback((slotId: string) => {
    setSelectedSlotIds((prev) => {
      const next = new Set(prev)
      if (next.has(slotId)) {
        next.delete(slotId)
      } else {
        next.add(slotId)
      }
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedSlotIds(new Set())
  }, [])

  return { selectedSlotIds, toggleSlot, clearSelection }
}

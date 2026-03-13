'use client'

import { useSchedule } from '@/hooks/useSchedule'
import { useSlotSelection } from '@/hooks/useSlotSelection'
import { WeekNavigator } from './WeekNavigator'
import { TimeSlotGrid } from './TimeSlotGrid'
import { SlotLegend } from './SlotLegend'
import { BulkBlockButton } from './BulkBlockButton'

interface ScheduleCalendarProps {
  doctorId: string
}

export function ScheduleCalendar({ doctorId }: ScheduleCalendarProps) {
  const { schedule, currentMonthLabel, goToPrevWeek, goToNextWeek } = useSchedule(doctorId)
  const { selectedSlotIds, toggleSlot } = useSlotSelection()

  return (
    <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300 overflow-hidden rounded-lg border border-stroke bg-bg">
      <WeekNavigator
        schedule={schedule}
        currentMonthLabel={currentMonthLabel}
        onPrevWeek={goToPrevWeek}
        onNextWeek={goToNextWeek}
      />

      <TimeSlotGrid
        schedule={schedule}
        selectedSlotIds={selectedSlotIds}
        onToggleSlot={toggleSlot}
      />

      <div className="flex items-center justify-between border-t border-stroke px-4 py-3">
        <SlotLegend />
        <BulkBlockButton />
      </div>
    </div>
  )
}

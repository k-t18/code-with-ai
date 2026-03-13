import { Cloud, Sun, Sunset } from 'lucide-react'
import { TimeSlot } from './TimeSlot'
import type { DaySchedule, Shift, TimeSlot as TimeSlotType } from '@/types/appointments'

interface TimeSlotGridProps {
  schedule: DaySchedule[]
  selectedSlotIds: Set<string>
  onToggleSlot: (slotId: string) => void
}

const SHIFTS: {
  key: Shift
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
}[] = [
  { key: 'morning', Icon: Sun },
  { key: 'afternoon', Icon: Cloud },
  { key: 'evening', Icon: Sunset },
]

export function TimeSlotGrid({ schedule, selectedSlotIds, onToggleSlot }: TimeSlotGridProps) {
  const slotsByShift = SHIFTS.map(({ key }) => {
    const slots: TimeSlotType[] = []
    schedule.forEach((day) => {
      day.slots.filter((s) => s.shift === key).forEach((s) => slots.push(s))
    })
    return { key, slots }
  })

  return (
    <div className="flex flex-col divide-y divide-stroke">
      {SHIFTS.map(({ key, Icon }, rowIdx) => (
        <div key={key} className="flex items-start gap-3 px-4 py-3">
          <div className="mt-1.5 shrink-0 text-text-muted">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap gap-2">
            {slotsByShift[rowIdx].slots.length === 0 ? (
              <span className="text-body-sm text-text-muted">No slots available</span>
            ) : (
              slotsByShift[rowIdx].slots.map((slot) => (
                <TimeSlot
                  key={slot.id}
                  slot={slot}
                  isSelected={selectedSlotIds.has(slot.id)}
                  onToggle={onToggleSlot}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

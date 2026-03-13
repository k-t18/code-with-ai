import { cn } from '@/lib/utils'
import type { TimeSlot as TimeSlotType } from '@/types/appointments'

interface TimeSlotProps {
  slot: TimeSlotType
  isSelected: boolean
  onToggle: (slotId: string) => void
}

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-bg border-stroke text-heading hover:border-brand-400 cursor-pointer',
  selected: 'bg-brand-600 border-brand-600 text-white cursor-pointer',
  blocked: 'bg-danger-100 border-danger-200 text-danger-600 cursor-not-allowed',
  leave: 'bg-other-100 border-other-200 text-other-600 cursor-not-allowed',
  holiday: 'bg-warning-100 border-warning-200 text-warning-600 cursor-not-allowed',
  booked: 'bg-grays-200 border-grays-300 text-text-muted cursor-not-allowed',
}

export function TimeSlot({ slot, isSelected, onToggle }: TimeSlotProps) {
  const isClickable = slot.status === 'available'
  const effectiveStatus = isSelected && slot.status === 'available' ? 'selected' : slot.status

  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={() => onToggle(slot.id)}
      className={cn(
        'rounded-md border px-3 py-1.5 text-body-md-medium transition-colors',
        STATUS_STYLES[effectiveStatus],
        !isClickable && 'pointer-events-none',
      )}
    >
      {slot.time}
    </button>
  )
}

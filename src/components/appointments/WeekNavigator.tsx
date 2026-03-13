import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DayHeader } from './DayHeader'
import type { DaySchedule } from '@/types/appointments'

interface WeekNavigatorProps {
  schedule: DaySchedule[]
  currentMonthLabel: string
  onPrevWeek: () => void
  onNextWeek: () => void
}

export function WeekNavigator({
  schedule,
  currentMonthLabel,
  onPrevWeek,
  onNextWeek,
}: WeekNavigatorProps) {
  const navBtnClass = cn(
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-stroke text-text-muted transition-colors',
    'hover:border-brand-400 hover:text-brand-500',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
  )

  return (
    <div className="flex items-center gap-2 border-b border-stroke px-4 py-3">
      <button type="button" onClick={onPrevWeek} className={navBtnClass} aria-label="Previous week">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex flex-1 justify-around">
        {schedule.map((day) => (
          <DayHeader
            key={day.date}
            dayLabel={day.dayLabel}
            dayNumber={day.dayNumber}
            date={day.date}
            isToday={day.isToday}
            isPast={day.isPast}
            isWeekend={day.isWeekend}
          />
        ))}
      </div>

      <button type="button" onClick={onNextWeek} className={navBtnClass} aria-label="Next week">
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="ml-2 flex min-w-36 shrink-0 items-center gap-1 rounded-md border border-stroke px-3 py-1.5">
        <span className="text-body-md-medium text-heading">{currentMonthLabel}</span>
        <ChevronDown className="ml-auto h-4 w-4 text-text-muted" aria-hidden="true" />
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils'

interface DayHeaderProps {
  dayLabel: string
  dayNumber: number
  date: string // ISO "2025-01-20"
  isToday: boolean
  isPast: boolean
  isWeekend: boolean
}

export function DayHeader({ dayLabel, dayNumber, date, isToday, isPast, isWeekend }: DayHeaderProps) {
  // Use noon time to avoid DST-related timezone shifts
  const dayOfWeek = new Date(date + 'T12:00:00').getDay() // 0 = Sun, 4 = Thu, 6 = Sat
  const isThursday = dayOfWeek === 4
  const isSaturday = dayOfWeek === 6

  const numberClass = cn(
    'flex h-8 w-8 items-center justify-center rounded-full text-h5 transition-colors',
    isToday && 'bg-brand-600 text-white',
    !isToday && isThursday && 'bg-other-500 text-white',
    !isToday && isSaturday && 'bg-warning-500 text-white',
    !isToday && !isThursday && !isSaturday && isPast && 'text-text-muted',
    !isToday && !isThursday && !isSaturday && !isPast && 'text-heading',
    isWeekend && !isToday && !isSaturday && 'text-text-muted',
  )

  return (
    <div className={cn('flex flex-col items-center gap-1', isPast && !isToday && 'opacity-50')}>
      <span
        className={cn(
          'text-body-sm-medium uppercase',
          isToday ? 'text-brand-600' : 'text-text-muted',
        )}
      >
        {dayLabel}
      </span>
      <span className={numberClass}>{dayNumber}</span>
    </div>
  )
}

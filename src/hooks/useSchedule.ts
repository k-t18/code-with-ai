'use client'

import { useState, useMemo } from 'react'
import type { DaySchedule, TimeSlot, SlotStatus, Shift } from '@/types/appointments'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type SlotTemplate = { time: string; status: SlotStatus; shift: Shift }

// Fixed slot patterns per day-of-week (0 = Mon … 6 = Sun)
const SLOT_PATTERNS: SlotTemplate[][] = [
  // Monday
  [
    { time: '08:30', status: 'available', shift: 'morning' },
    { time: '09:00', status: 'available', shift: 'morning' },
    { time: '12:00', status: 'booked', shift: 'afternoon' },
    { time: '12:30', status: 'available', shift: 'afternoon' },
    { time: '16:00', status: 'available', shift: 'evening' },
    { time: '16:30', status: 'available', shift: 'evening' },
  ],
  // Tuesday
  [
    { time: '09:30', status: 'available', shift: 'morning' },
    { time: '09:45', status: 'available', shift: 'morning' },
    { time: '13:20', status: 'blocked', shift: 'afternoon' },
    { time: '13:45', status: 'available', shift: 'afternoon' },
    { time: '17:00', status: 'leave', shift: 'evening' },
    { time: '17:30', status: 'available', shift: 'evening' },
  ],
  // Wednesday
  [
    { time: '09:00', status: 'available', shift: 'morning' },
    { time: '09:30', status: 'available', shift: 'morning' },
    { time: '13:00', status: 'available', shift: 'afternoon' },
    { time: '14:00', status: 'available', shift: 'afternoon' },
    { time: '17:00', status: 'available', shift: 'evening' },
    { time: '18:30', status: 'available', shift: 'evening' },
  ],
  // Thursday
  [
    { time: '09:45', status: 'available', shift: 'morning' },
    { time: '10:00', status: 'available', shift: 'morning' },
    { time: '13:45', status: 'available', shift: 'afternoon' },
    { time: '14:30', status: 'available', shift: 'afternoon' },
    { time: '17:45', status: 'blocked', shift: 'evening' },
    { time: '18:00', status: 'available', shift: 'evening' },
  ],
  // Friday
  [
    { time: '10:00', status: 'available', shift: 'morning' },
    { time: '10:30', status: 'available', shift: 'morning' },
    { time: '14:00', status: 'available', shift: 'afternoon' },
    { time: '14:30', status: 'booked', shift: 'afternoon' },
    { time: '17:00', status: 'available', shift: 'evening' },
    { time: '20:00', status: 'available', shift: 'evening' },
  ],
  // Saturday
  [
    { time: '11:00', status: 'holiday', shift: 'morning' },
    { time: '11:30', status: 'holiday', shift: 'morning' },
    { time: '15:00', status: 'holiday', shift: 'afternoon' },
    { time: '15:30', status: 'holiday', shift: 'afternoon' },
    { time: '21:00', status: 'holiday', shift: 'evening' },
    { time: '21:30', status: 'holiday', shift: 'evening' },
  ],
  // Sunday
  [
    { time: '11:00', status: 'available', shift: 'morning' },
    { time: '11:45', status: 'available', shift: 'morning' },
    { time: '15:00', status: 'booked', shift: 'afternoon' },
    { time: '15:45', status: 'available', shift: 'afternoon' },
    { time: '21:30', status: 'available', shift: 'evening' },
    { time: '22:00', status: 'available', shift: 'evening' },
  ],
]

function getMondayOfWeek(offset: number): Date {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sun, 1 = Mon, …
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + daysToMonday + offset * 7)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function generateWeekSchedule(doctorId: string, weekOffset: number): DaySchedule[] {
  const monday = getMondayOfWeek(weekOffset)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)

    const isSaturday = i === 5
    const isSunday = i === 6
    const isWeekend = isSaturday || isSunday
    const isPast = date < today
    const isToday = date.getTime() === today.getTime()

    const templates = SLOT_PATTERNS[i] ?? []
    const slots: TimeSlot[] = templates.map((t, idx) => ({
      id: `${doctorId}-${formatISODate(date)}-${idx}`,
      time: t.time,
      status: isPast ? 'booked' : t.status,
      shift: t.shift,
    }))

    return {
      date: formatISODate(date),
      dayLabel: DAY_LABELS[i],
      dayNumber: date.getDate(),
      slots,
      isToday,
      isHoliday: isSaturday,
      isWeekend,
      isPast,
    }
  })
}

export function useSchedule(doctorId: string | null) {
  const [weekOffset, setWeekOffset] = useState(0)

  const schedule = useMemo(() => {
    if (!doctorId) return []
    return generateWeekSchedule(doctorId, weekOffset)
  }, [doctorId, weekOffset])

  const currentMonthLabel = useMemo(() => {
    const monday = getMondayOfWeek(weekOffset)
    return monday.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [weekOffset])

  return {
    schedule,
    currentMonthLabel,
    goToPrevWeek: () => setWeekOffset((o) => o - 1),
    goToNextWeek: () => setWeekOffset((o) => o + 1),
  }
}

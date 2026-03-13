export interface Speciality {
  id: string
  name: string
  icon: string // lucide icon name
}

export interface Doctor {
  id: string
  name: string
  speciality: string
  experienceYears: number
  photo: string
  email: string
  phone: string
  whatsapp: string
}

export type SlotStatus = 'available' | 'selected' | 'blocked' | 'leave' | 'holiday' | 'booked'

export type Shift = 'morning' | 'afternoon' | 'evening'

export interface TimeSlot {
  id: string
  time: string // "09:00" 24hr format
  status: SlotStatus
  shift: Shift
}

export interface DaySchedule {
  date: string // ISO: "2025-01-20"
  dayLabel: string // "Mon"
  dayNumber: number // 20
  slots: TimeSlot[]
  isToday: boolean
  isHoliday: boolean
  isWeekend: boolean
  isPast: boolean
}

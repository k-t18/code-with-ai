import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Heart,
  HeartPulse,
  Microscope,
  Stethoscope,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Speciality } from '@/types/appointments'

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Bone,
  Heart,
  Brain,
  Activity,
  HeartPulse,
  Microscope,
  Stethoscope,
  Baby,
  Eye,
}

export interface SpecialityItemProps {
  speciality: Speciality
  isSelected: boolean
  onClick: (id: string) => void
}

export function SpecialityItem({ speciality, isSelected, onClick }: SpecialityItemProps) {
  const Icon = iconMap[speciality.icon] ?? Stethoscope

  return (
    <button
      type="button"
      onClick={() => onClick(speciality.id)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        isSelected
          ? 'border-brand-500 bg-brand-50 text-brand-500'
          : 'border-stroke bg-bg text-heading hover:border-brand-300 hover:bg-brand-50',
      )}
      aria-pressed={isSelected}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="text-body-lg-medium">{speciality.name}</span>
    </button>
  )
}
